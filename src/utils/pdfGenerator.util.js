import puppeteer from 'puppeteer-core';
import fs from 'fs/promises';
import os from 'os';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import logger from './logger.util.js';

export const generatePDFFileObject = async htmlContent => {
  let browser = null;
  try {
    // Try to launch with Chrome first
    const chromePaths = [
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', // macOS
      '/usr/bin/google-chrome', // Linux
      'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', // Windows
      'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
    ];

    // Find the first available Chrome path
    let executablePath = null;
    for (const path of chromePaths) {
      try {
        await fs.access(path);
        executablePath = path;
        break;
      } catch (e) {
        // Path not available, try next
      }
    }

    // Launch options
    const launchOptions = {
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    };

    // Add executable path if found
    if (executablePath) {
      launchOptions.executablePath = executablePath;
    }

    // Launch browser
    logger.log('Launching browser with options:', launchOptions);
    browser = await puppeteer.launch(launchOptions);

    // Create page and set content
    const page = await browser.newPage();

    // Set viewport for consistent rendering
    await page.setViewport({
      width: 1200,
      height: 1600,
      deviceScaleFactor: 1
    });

    // Set content with timeout handling
    await page.setContent(htmlContent, {
      waitUntil: 'networkidle0',
      timeout: 30000 // 30 second timeout
    });

    // Generate PDF with consistent settings
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' },
      preferCSSPageSize: true
    });

    await browser.close();
    browser = null;

    // Create a unique filename
    const filename = `invoice-${uuidv4()}.pdf`;
    const tempPath = path.join(os.tmpdir(), filename);

    // Write to file
    logger.log(`Writing PDF to temp file: ${tempPath}`);
    await fs.writeFile(tempPath, pdfBuffer);

    // Return file object compatible with Cloudinary upload
    return {
      path: tempPath,
      mimetype: 'application/pdf',
      originalname: filename
    };
  } catch (error) {
    logger.error('PDF generation error:', error);

    // Always ensure browser is closed
    if (browser) {
      try {
        await browser.close();
      } catch (e) {
        logger.error('Error closing browser:', e);
      }
    }

    throw new Error(`Failed to generate PDF: ${error.message}`);
  }
};
