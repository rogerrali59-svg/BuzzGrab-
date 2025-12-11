/**
 * @copyright : ToXSL Technologies Pvt. Pvt. Ltd. < www.toxsl.com >
 * @author     : Shiv Charan Panjeta
 *
 * All Rights Reserved.
 * Proprietary and confidential :  All information contained herein is, and remains
 * the property of ToXSL Technologies Pvt. Pvt. Ltd. and its partners.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 */
const puppeteer = require("puppeteer");
const fs = require('fs')

const generateHtmlToPdf = async (htmlContent, pdfPath) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
    ],
  });

  const page = await browser.newPage();
  // await page.setContent(htmlContent, {waitUntil: 'domcontentloaded'});
  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

  const pdf = await page.pdf({
    path: pdfPath,
    format: "A4",
    preferCSSPageSize: false,
    displayHeaderFooter: false,
    padding: { top: 50, left: 50, right: 50, bottom: 50 },
    margin: { top: 50, left: 50, right: 50, bottom: 50 },
  });

  await browser.close();

  const base64String = Buffer.from(pdf).toString('base64')
  const dataUrl = `data:application/pdf;base64,${base64String}`;
  fs.writeFileSync('watermarked_output.pdf', dataUrl);

  return base64String;
}

module.exports = {
  generateHtmlToPdf
}