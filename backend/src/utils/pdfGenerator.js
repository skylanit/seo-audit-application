const puppeteer = require("puppeteer");
const seoReportTemplate = require("../templates/seoReportTemplate");

const generatePDF = async (report, url) => {
    let browser;

    try {

        browser = await puppeteer.launch({
            headless: true,
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-dev-shm-usage",
                "--disable-gpu"
            ]
        });

        const page = await browser.newPage();

        const html =
            seoReportTemplate(
                report,
                url
            );

        await page.setContent(html, {
            waitUntil: "networkidle0"
        });

        const pdfBuffer =
            await page.pdf({
                format: "A4",
                printBackground: true,
                margin: {
                    top: "20px",
                    right: "20px",
                    bottom: "20px",
                    left: "20px"
                }
            });

        return pdfBuffer;

    } catch (error) {

        console.error("PDF GENERATION ERROR:");
        console.error(error);

        throw error;

    } finally {

        if (browser) {
            await browser.close();
        }

    }
};

module.exports = generatePDF;