const analyzeOnPageSEO = require("../services/onPageSeoService");
const getPageSpeedReport = require("../services/pageSpeedService");
const getOpenGraphReport = require("../services/openGraphService");
const generateSEORecommendations = require("../services/geminiSeoAnalysis");
const generatePDF = require("../utils/pdfGenerator");



const downloadReport = async (req, res) => {

    try {

        const { url } = req.body;

        if (!url) {

            return res.status(400).json({
                success: false,
                message: "URL Required"
            });

        }

        const onPageSEO =
            await analyzeOnPageSEO(url);

        const pageSpeed =
            await getPageSpeedReport(url);

        const openGraph =
            await getOpenGraphReport(url);

        const report = {
            onPageSEO,
            pageSpeed,
            openGraph
        };

        const pdfBuffer =
            await generatePDF(
                report,
                url
            );

        res.setHeader(
            "Content-Type",
            "application/pdf"
        );

        res.setHeader(
            "Content-Disposition",
            "attachment; filename=seo-report.pdf"
        );

        res.send(pdfBuffer);

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};



const runAudit = async (req, res) => {
    try {

        const { url } = req.body;

        if (!url) {
            return res.status(400).json({
                success: false,
                message: "URL Required"
            });
        }

        const onPageSEO =
            await analyzeOnPageSEO(url);

        const pageSpeed =
            await getPageSpeedReport(url);

        const openGraph =
            await getOpenGraphReport(url);

        // Create report object
        const report = {
            onPageSEO,
            pageSpeed,
            openGraph
        };

        // Generate AI recommendations
        const aiRecommendations =
            await generateSEORecommendations(report);

        // Attach AI analysis
        report.aiRecommendations =
            aiRecommendations;

        // Final response
        return res.json({
            success: true,
            report
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

module.exports = {
    runAudit,
    downloadReport
};