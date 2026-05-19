const Product = require('../models/Product');
const Category = require('../models/Category');
const Seller = require('../models/Seller');
const Admin = require('../models/Admin');
const TaxAuditLog = require('../models/TaxAuditLog');

class TaxService {
  /**
   * Secure backend calculation of item taxes based on shipping address and seller state
   * Handles dynamic falling back to Product-Category default tax rules
   */
  async calculateTaxes(enrichedItems, shippingAddress) {
    let totalTax = 0;
    let totalCgst = 0;
    let totalSgst = 0;
    let totalIgst = 0;
    let totalTaxableAmount = 0;

    const shippingState = (shippingAddress && shippingAddress.state) 
      ? shippingAddress.state.trim() 
      : 'Delhi'; // System shipping state fallback

    const itemsTaxDetails = [];

    for (const item of enrichedItems) {
      // 1. Resolve GST Rate (fallback: Product -> Category -> Default 18)
      let gstRate = item.gstRate;
      if (gstRate === undefined || gstRate === null) {
        const product = await Product.findById(item.product);
        if (product && product.category) {
          const category = await Category.findOne({ name: product.category });
          gstRate = category ? category.defaultGstRate : 18;
        } else {
          gstRate = 18;
        }
      }

      // 2. Resolve Seller State
      let sellerState = 'Delhi'; // default
      if (item.sellerType === 'Admin') {
        const admin = await Admin.findById(item.seller);
        if (admin && admin.phone) { // check if admin has phone / address state configured
          // Or if admin has specific state, let's use it
          sellerState = 'Delhi';
        }
      } else {
        const seller = await Seller.findById(item.seller);
        if (seller && seller.shopAddress) {
          const addr = typeof seller.shopAddress === 'string' 
            ? seller.shopAddress.toLowerCase() 
            : JSON.stringify(seller.shopAddress).toLowerCase();
          
          if (addr.includes('delhi')) sellerState = 'Delhi';
          else if (addr.includes('gujarat')) sellerState = 'Gujarat';
          else if (addr.includes('maharashtra')) sellerState = 'Maharashtra';
          else if (addr.includes('karnataka')) sellerState = 'Karnataka';
          else if (addr.includes('telangana')) sellerState = 'Telangana';
          else {
            sellerState = 'Delhi';
          }
        }
      }

      // 3. Selling price and calculations
      const qty = item.quantity || 1;
      const lineSellingTotal = item.price * qty;

      const gstFactor = 1 + (gstRate / 100);
      const lineTax = lineSellingTotal - (lineSellingTotal / gstFactor);
      const lineTaxable = lineSellingTotal / gstFactor;

      // 4. Intra-State (CGST + SGST) vs Inter-State (IGST) split
      const isIntraState = sellerState.toLowerCase() === shippingState.toLowerCase();

      let cgst = 0;
      let sgst = 0;
      let igst = 0;

      if (isIntraState) {
        cgst = lineTax / 2;
        sgst = lineTax / 2;
      } else {
        igst = lineTax;
      }

      totalTax += lineTax;
      totalCgst += cgst;
      totalSgst += sgst;
      totalIgst += igst;
      totalTaxableAmount += lineTaxable;

      itemsTaxDetails.push({
        product: item.product,
        name: item.name,
        gstRate,
        taxAmount: Number(lineTax.toFixed(2)),
        cgst: Number(cgst.toFixed(2)),
        sgst: Number(sgst.toFixed(2)),
        igst: Number(igst.toFixed(2)),
        sellerState,
        shippingState,
        taxType: isIntraState ? 'intra-state' : 'inter-state'
      });
    }

    return {
      totalTax: Number(totalTax.toFixed(2)),
      cgst: Number(totalCgst.toFixed(2)),
      sgst: Number(totalSgst.toFixed(2)),
      igst: Number(totalIgst.toFixed(2)),
      taxableAmount: Number(totalTaxableAmount.toFixed(2)),
      items: itemsTaxDetails
    };
  }

  /**
   * Commits an immutable audit log of the calculated tax
   */
  async createAuditLog(order, user, seller, taxCalculation, transactionType = 'sale') {
    try {
      const shippingState = (order.shippingAddress && order.shippingAddress.state) 
        ? order.shippingAddress.state.trim() 
        : 'Delhi';

      // Pick first item's seller state as transaction seller state
      const sellerState = taxCalculation.items[0] ? taxCalculation.items[0].sellerState : 'Delhi';
      const taxType = taxCalculation.items[0] ? taxCalculation.items[0].taxType : 'intra-state';

      await TaxAuditLog.create({
        order: order._id,
        user,
        seller,
        transactionType,
        shippingState,
        sellerState,
        taxType,
        totalAmount: order.totalPrice,
        taxableAmount: taxCalculation.taxableAmount,
        cgst: taxCalculation.cgst,
        sgst: taxCalculation.sgst,
        igst: taxCalculation.igst,
        totalTax: taxCalculation.totalTax,
        items: taxCalculation.items
      });
    } catch (err) {
      console.error('Failed to write tax audit log:', err.message);
    }
  }

  /**
   * Handles tax audits for refunds on returned order items
   */
  async processRefundTax(order, refundItems) {
    try {
      const itemsToRecalculate = [];
      
      for (const refundItem of refundItems) {
        const originalItem = order.orderItems.find(i => i.product.toString() === refundItem.product.toString());
        if (originalItem) {
          itemsToRecalculate.push({
            product: originalItem.product,
            name: originalItem.name,
            quantity: refundItem.quantity,
            price: originalItem.price,
            seller: order.seller,
            sellerType: order.sellerType
          });
        }
      }

      if (itemsToRecalculate.length === 0) return;

      const taxCalculation = await this.calculateTaxes(itemsToRecalculate, order.shippingAddress);
      
      await TaxAuditLog.create({
        order: order._id,
        user: order.user,
        seller: order.seller,
        transactionType: 'refund',
        shippingState: order.shippingAddress.state || 'Delhi',
        sellerState: taxCalculation.items[0] ? taxCalculation.items[0].sellerState : 'Delhi',
        taxType: taxCalculation.items[0] ? taxCalculation.items[0].taxType : 'intra-state',
        totalAmount: itemsToRecalculate.reduce((sum, i) => sum + (i.price * i.quantity), 0),
        taxableAmount: taxCalculation.taxableAmount,
        cgst: taxCalculation.cgst,
        sgst: taxCalculation.sgst,
        igst: taxCalculation.igst,
        totalTax: taxCalculation.totalTax,
        items: taxCalculation.items
      });
    } catch (err) {
      console.error('Failed to log refund tax audit:', err.message);
    }
  }
}

module.exports = new TaxService();
