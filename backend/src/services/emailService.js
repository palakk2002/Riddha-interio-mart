const nodemailer = require('nodemailer');
const EmailQueue = require('../models/EmailQueue');
const templates = require('../utils/emailTemplates');

class EmailService {
  constructor() {
    this.primaryTransporter = null;
    this.fallbackTransporter = null;
    this.isProcessing = false;
    this.initializeTransporters();
  }

  initializeTransporters() {
    // Configure Primary Transporter (e.g. SMTP from ENV or Mailtrap)
    const host = process.env.SMTP_HOST || 'sandbox.smtp.mailtrap.io';
    const port = parseInt(process.env.SMTP_PORT || '2525');
    const user = process.env.SMTP_USER || '';
    const pass = process.env.SMTP_PASS || '';

    this.primaryTransporter = nodemailer.createTransport({
      host,
      port,
      auth: user ? { user, pass } : null,
      pool: true,
      maxConnections: 5,
      rateLimit: 10 // max 10 messages per second
    });

    // Configure Fallback Transporter (local fallback or mock backup SMTP)
    this.fallbackTransporter = nodemailer.createTransport({
      host: 'smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: 'backup-mock-user',
        pass: 'backup-mock-pass'
      }
    });

    console.log('[EmailService] Transporter Pools initialized.');
  }

  /**
   * Directly sends mail with primary and fallback transporters
   */
  async sendMailDirect(to, subject, htmlContent) {
    const from = process.env.FROM_EMAIL || 'noreply@riddhamart.com';
    
    try {
      // Try primary
      await this.primaryTransporter.sendMail({
        from,
        to,
        subject,
        html: htmlContent
      });
      return { success: true, provider: 'primary' };
    } catch (primaryErr) {
      console.warn('[EmailService] Primary transporter failed. Retrying fallback...', primaryErr.message);
      
      try {
        // Try fallback
        await this.fallbackTransporter.sendMail({
          from: 'fallback@riddhamart.com',
          to,
          subject,
          html: htmlContent
        });
        return { success: true, provider: 'fallback' };
      } catch (fallbackErr) {
        console.error('[EmailService] All email transporters failed.');
        throw new Error(`SMTP Outbound Error: ${fallbackErr.message}`);
      }
    }
  }

  /**
   * Enqueues a new transactional email job
   */
  async queueEmail(to, subject, templateName, templateData) {
    const job = await EmailQueue.create({
      to,
      subject,
      templateName,
      templateData,
      status: 'pending'
    });
    
    // Proactively kick off queue processing in background thread
    this.processEmailQueue().catch(err => console.error('[EmailQueue] Processing failed:', err.message));
    return job;
  }

  /**
   * Cron-style/interval daemon that processes pending email jobs in queue
   */
  async processEmailQueue() {
    if (this.isProcessing) return;
    this.isProcessing = true;

    try {
      // Find all pending/failed jobs due for retry
      const jobs = await EmailQueue.find({
        status: { $in: ['pending', 'failed'] },
        attempts: { $lt: 3 },
        nextAttemptAt: { $lte: new Date() }
      }).limit(10);

      for (const job of jobs) {
        job.status = 'processing';
        job.attempts += 1;
        await job.save();

        try {
          // Resolve template HTML content dynamically
          let html = '';
          switch (job.templateName) {
            case 'otp':
              html = templates.getOtpTemplate(job.templateData.otp);
              break;
            case 'welcome':
              html = templates.getWelcomeTemplate(job.templateData.fullName);
              break;
            case 'reset_password':
              html = templates.getPasswordResetTemplate(job.templateData.resetUrl);
              break;
            case 'seller_approval':
              html = templates.getSellerApprovalTemplate(job.templateData.shopName, job.templateData.status);
              break;
            case 'order_confirmation':
              html = templates.getOrderConfirmationTemplate(job.templateData.order);
              break;
            case 'refund':
              html = templates.getRefundTemplate(job.templateData.order, job.templateData.refundAmount);
              break;
            default:
              html = `<p>${job.subject}</p><pre>${JSON.stringify(job.templateData, null, 2)}</pre>`;
          }

          // Trigger direct SMTP call
          await this.sendMailDirect(job.to, job.subject, html);

          job.status = 'sent';
          await job.save();
          console.log(`[EmailQueue] Successfully sent job #${job._id} to ${job.to}`);

        } catch (jobErr) {
          console.error(`[EmailQueue] Failed attempt #${job.attempts} for job #${job._id}:`, jobErr.message);
          
          job.lastError = jobErr.message;
          
          if (job.attempts >= job.maxAttempts) {
            // Move to dead letter status
            job.status = 'failed';
          } else {
            // Exponential backoff retry lock
            const minutesBackoff = Math.pow(2, job.attempts);
            job.nextAttemptAt = new Date(Date.now() + minutesBackoff * 60 * 1000);
            job.status = 'failed';
          }
          await job.save();
        }
      }
    } catch (err) {
      console.error('[EmailQueue] Error processing queue:', err.message);
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Starts the background daemon interval loops
   */
  startDaemon() {
    setInterval(() => {
      this.processEmailQueue().catch(err => console.error('[EmailDaemon] loop failed:', err.message));
    }, 15000); // scan queue every 15 seconds
    console.log('[EmailDaemon] Background queue scanner daemon active.');
  }
}

module.exports = new EmailService();
