const Product = require('../models/Product');
const InventoryReservation = require('../models/InventoryReservation');
const InventoryHistoryLog = require('../models/InventoryHistoryLog');
const mongoose = require('mongoose');

class InventoryService {
  /**
   * Atomically reserve stock for a customer during checkout.
   */
  async reserveStock(userId, productId, quantity, durationMinutes = 15, session = null) {
    const expiresAt = new Date(Date.now() + durationMinutes * 60 * 1000);

    // Atomically increment reservedStock only if available stock is sufficient
    const product = await Product.findOneAndUpdate(
      {
        _id: productId,
        $expr: {
          $gte: [{ $subtract: ['$countInStock', '$reservedStock'] }, quantity]
        }
      },
      { $inc: { reservedStock: quantity } },
      { new: true, session }
    );

    if (!product) {
      throw new Error(`Insufficient available stock for product: ${productId}`);
    }

    // Record the reservation hold in DB
    const [reservation] = await InventoryReservation.create(
      [
        {
          product: productId,
          user: userId,
          quantity,
          expiresAt,
          status: 'reserved'
        }
      ],
      { session }
    );

    // Log the reservation movement
    await InventoryHistoryLog.create(
      [
        {
          product: productId,
          action: 'reservation',
          quantity,
          stockBefore: product.countInStock - (product.reservedStock - quantity),
          stockAfter: product.countInStock - product.reservedStock,
          details: `Reserved ${quantity} units for User ${userId}. Reservation ID: ${reservation._id}`
        }
      ],
      { session }
    );

    return reservation;
  }

  /**
   * Atomically commit a reservation upon successful checkout payment.
   * Decrements countInStock and reservedStock simultaneously.
   */
  async commitReservation(reservationId, session = null) {
    const reservation = await InventoryReservation.findOne({ _id: reservationId, status: 'reserved' }).session(session);
    if (!reservation) {
      throw new Error(`Active stock reservation not found: ${reservationId}`);
    }

    // Atomic update to subtract actual countInStock and reservedStock
    const product = await Product.findOneAndUpdate(
      { _id: reservation.product },
      {
        $inc: {
          countInStock: -reservation.quantity,
          reservedStock: -reservation.quantity
        }
      },
      { new: true, session }
    );

    if (!product) {
      throw new Error(`Product not found during reservation commit: ${reservation.product}`);
    }

    reservation.status = 'completed';
    await reservation.save({ session });

    // Log the final sale
    await InventoryHistoryLog.create(
      [
        {
          product: reservation.product,
          action: 'sale',
          quantity: reservation.quantity,
          stockBefore: product.countInStock + reservation.quantity,
          stockAfter: product.countInStock,
          details: `Committed reservation ${reservation._id}. Units permanently sold.`
        }
      ],
      { session }
    );

    return reservation;
  }

  /**
   * Atomically release a reservation if checkout fails, payment is cancelled, or order is deleted.
   */
  async releaseReservation(reservationId, session = null) {
    const reservation = await InventoryReservation.findOne({ _id: reservationId, status: 'reserved' }).session(session);
    if (!reservation) return null;

    const product = await Product.findOneAndUpdate(
      { _id: reservation.product },
      { $inc: { reservedStock: -reservation.quantity } },
      { new: true, session }
    );

    reservation.status = 'released';
    await reservation.save({ session });

    if (product) {
      // Log the release
      await InventoryHistoryLog.create(
        [
          {
            product: reservation.product,
            action: 'release',
            quantity: reservation.quantity,
            stockBefore: product.countInStock - (product.reservedStock + reservation.quantity),
            stockAfter: product.countInStock - product.reservedStock,
            details: `Released stock hold for reservation ${reservation._id}.`
          }
        ],
        { session }
      );
    }

    return reservation;
  }

  /**
   * Release stock atomically upon cancellations or returns
   */
  async returnStock(productId, quantity, session = null) {
    const product = await Product.findOneAndUpdate(
      { _id: productId },
      { $inc: { countInStock: quantity } },
      { new: true, session }
    );

    if (!product) {
      throw new Error(`Product not found for returning stock: ${productId}`);
    }

    // Log the return
    await InventoryHistoryLog.create(
      [
        {
          product: productId,
          action: 'return',
          quantity,
          stockBefore: product.countInStock - quantity,
          stockAfter: product.countInStock,
          details: `Returned ${quantity} units to inventory due to order cancellation or return approval.`
        }
      ],
      { session }
    );

    return product;
  }

  /**
   * Background scan process to release all expired stock reservations.
   */
  async releaseExpiredReservations() {
    const expiredReservations = await InventoryReservation.find({
      status: 'reserved',
      expiresAt: { $lt: new Date() }
    });

    if (expiredReservations.length === 0) return;

    console.log(`[Inventory Daemon] Found ${expiredReservations.length} expired reservations to release.`);

    for (const reservation of expiredReservations) {
      const session = await mongoose.startSession();
      try {
        session.startTransaction();
        await this.releaseReservation(reservation._id, session);
        await session.commitTransaction();
      } catch (err) {
        console.error(`[Inventory Daemon] Failed to release expired reservation ${reservation._id}:`, err.message);
      } finally {
        session.endSession();
      }
    }
  }

  /**
   * Starts the background interval daemon that sweeps expired holds periodically.
   */
  startReservationDaemon() {
    console.log('[Inventory Daemon] Starting background Stock Reservation Daemon...');
    setInterval(async () => {
      try {
        await this.releaseExpiredReservations();
      } catch (err) {
        console.error('[Inventory Daemon] Scanner error:', err.message);
      }
    }, 30000); // Scans every 30 seconds
  }
}

module.exports = new InventoryService();
