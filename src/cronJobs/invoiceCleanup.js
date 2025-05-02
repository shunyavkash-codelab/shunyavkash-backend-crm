import cron from 'node-cron';
import Invoice from '../lib/invoice/Invoice.js';
import { safeDeleteFile } from '../utils/cloudinaryHelpers.js';
import logger from '../utils/loggerUtils.js';

// Schedule: Runs every day at midnight (server time)
cron.schedule('0 0 * * *', async () => {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  try {
    const expiredInvoices = await Invoice.find({
      createdAt: { $lt: thirtyDaysAgo },
      cloudinaryPublicId: { $ne: null }
    });
    if (!expiredInvoices.length) {
      logger.log('[Cron] No expired invoices found for cleanup.');
      return;
    }
    const results = await Promise.allSettled(
      expiredInvoices.map(async invoice => {
        try {
          await safeDeleteFile(invoice.cloudinaryPublicId, 'raw');

          invoice.cloudinaryPublicId = null;
          invoice.pdfUrl = null;
          await invoice.save();

          return { status: 'fulfilled', id: invoice._id };
        } catch (err) {
          return { status: 'rejected', id: invoice._id, reason: err.message };
        }
      })
    );

    // Log results
    const success = results.filter(r => r.status === 'fulfilled');
    const failed = results.filter(r => r.status === 'rejected');

    logger.log(
      `[Cron] Invoice cleanup complete. Success: ${success.length}, Failed: ${failed.length}`
    );
  } catch (err) {
    logger.error('[Cron] Invoice cleanup error:', err.message);
  }
});
