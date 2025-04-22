import cron from "node-cron";
import Invoice from "../lib/invoice/Invoice.js";
import { safeDeleteFile } from "../utils/cloudinaryHelpers.js";

// Schedule: Runs every day at midnight (server time)
cron.schedule("0 0 * * *", async () => {
  const thirtyDaysAgo = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000);

  try {
    const expiredInvoices = await Invoice.find({
      createdAt: { $lt: thirtyDaysAgo },
      cloudinaryPublicId: { $ne: null },
    });

    for (const invoice of expiredInvoices) {
      await safeDeleteFile(invoice.cloudinaryPublicId, "raw");

      invoice.cloudinaryPublicId = null;
      invoice.pdfUrl = null;
      await invoice.save();
    }

    console.log(
      `[Cron] Cleaned up ${expiredInvoices.length} expired invoice PDFs`
    );
  } catch (err) {
    console.error("[Cron] Invoice cleanup error:", err.message);
  }
});
