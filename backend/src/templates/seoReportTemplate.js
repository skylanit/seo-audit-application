const seoReportTemplate = (report, url) => {

    const score = Math.round(
        (
            (report.pageSpeed?.performance || 0) +
            (report.pageSpeed?.seo || 0) +
            (report.pageSpeed?.accessibility || 0) +
            (report.pageSpeed?.bestPractices || 0) +
            (report.onPageSEO?.score || 0)
        ) / 5
    );

    const recommendations = [];

    if ((report.pageSpeed?.performance || 0) < 90) {
        recommendations.push("Improve website loading speed and Core Web Vitals.");
    }

    if ((report.onPageSEO?.images?.missingAltTags || 0) > 0) {
        recommendations.push("Add ALT tags to all images.");
    }

    if (!report.onPageSEO?.structuredData?.found) {
        recommendations.push("Add structured data (Schema Markup).");
    }

    if (!report.onPageSEO?.sitemap) {
        recommendations.push("Create and submit sitemap.xml.");
    }

    if (!report.onPageSEO?.robotsTxt) {
        recommendations.push("Create robots.txt file.");
    }

    if (report.onPageSEO?.multipleH1) {
        recommendations.push("Use only one H1 tag per page.");
    }

    if ((report.onPageSEO?.brokenLinks || 0) > 0) {
        recommendations.push("Fix broken links found on the page.");
    }

    return `
<!DOCTYPE html>
<html>
<head>

<meta charset="utf-8">

<style>

body{
    font-family:Arial,sans-serif;
    background:#f5f7fb;
    margin:0;
    padding:0;
    color:#333;
}

.header{
    background:#0f172a;
    color:white;
    padding:40px;
    text-align:center;
}

.header h1{
    margin:0;
    font-size:34px;
}

.url{
    margin-top:10px;
    color:#cbd5e1;
    font-size:14px;
}

.section{
    padding:30px;
    page-break-inside:avoid;
}

.score-box{
    background:white;
    padding:25px;
    border-radius:10px;
    margin-bottom:25px;
    box-shadow:0 2px 10px rgba(0,0,0,.08);
    text-align:center;
}

.score-box h1{
    font-size:60px;
    margin:10px 0;
}

.cards{
    display:flex;
    gap:15px;
}

.card{
    flex:1;
    background:white;
    padding:20px;
    border-radius:10px;
    text-align:center;
    box-shadow:0 2px 10px rgba(0,0,0,.08);
}

.card h3{
    margin:0;
    font-size:16px;
}

.card p{
    font-size:32px;
    margin-top:10px;
    font-weight:bold;
}

table{
    width:100%;
    border-collapse:collapse;
    background:white;
    margin-top:15px;
}

table th{
    background:#0f172a;
    color:white;
    padding:12px;
    text-align:left;
}

table td{
    padding:12px;
    border:1px solid #ddd;
}

h2{
    margin-bottom:15px;
}

ul{
    background:white;
    padding:20px 40px;
    border-radius:10px;
}

li{
    margin-bottom:10px;
}

.footer{
    text-align:center;
    padding:30px;
    color:#888;
    font-size:13px;
}

.og-image{
    max-width:180px;
    border-radius:8px;
}

</style>

</head>

<body>

<div class="header">
    <h1>SEO Audit Report</h1>
    <div class="url">${url}</div>
</div>

<div class="section">

    <div class="score-box">
        <h2>Overall SEO Score</h2>
        <h1>${score}/100</h1>
    </div>

    <div class="cards">

        <div class="card">
            <h3>Performance</h3>
            <p>${report.pageSpeed?.performance || 0}</p>
        </div>

        <div class="card">
            <h3>SEO</h3>
            <p>${report.pageSpeed?.seo || 0}</p>
        </div>

        <div class="card">
            <h3>Accessibility</h3>
            <p>${report.pageSpeed?.accessibility || 0}</p>
        </div>

        <div class="card">
            <h3>Best Practices</h3>
            <p>${report.pageSpeed?.bestPractices || 0}</p>
        </div>

    </div>

</div>

<div class="section">

    <h2>Core Web Vitals</h2>

    <table>

        <tr>
            <th>Metric</th>
            <th>Value</th>
        </tr>

        <tr>
            <td>LCP</td>
            <td>${report.pageSpeed?.coreWebVitals?.lcp || "N/A"}</td>
        </tr>

        <tr>
            <td>CLS</td>
            <td>${report.pageSpeed?.coreWebVitals?.cls || "N/A"}</td>
        </tr>

        <tr>
            <td>INP</td>
            <td>${report.pageSpeed?.coreWebVitals?.inp || "N/A"}</td>
        </tr>

        <tr>
            <td>FCP</td>
            <td>${report.pageSpeed?.coreWebVitals?.fcp || "N/A"}</td>
        </tr>

        <tr>
            <td>Speed Index</td>
            <td>${report.pageSpeed?.coreWebVitals?.speedIndex || "N/A"}</td>
        </tr>

        <tr>
            <td>TBT</td>
            <td>${report.pageSpeed?.coreWebVitals?.tbt || "N/A"}</td>
        </tr>

    </table>

</div>

<div class="section">

    <h2>On-Page SEO Analysis</h2>

    <table>

        <tr>
            <th>Item</th>
            <th>Status</th>
        </tr>

        <tr>
            <td>Title Tag</td>
            <td>${report.onPageSEO?.title ? "✅ Present" : "❌ Missing"}</td>
        </tr>

        <tr>
            <td>Meta Description</td>
            <td>${report.onPageSEO?.metaDescription ? "✅ Present" : "❌ Missing"}</td>
        </tr>

        <tr>
            <td>Canonical URL</td>
            <td>${report.onPageSEO?.canonical ? "✅ Present" : "❌ Missing"}</td>
        </tr>

        <tr>
            <td>H1 Tags</td>
            <td>${report.onPageSEO?.h1Tags?.length || 0}</td>
        </tr>

        <tr>
            <td>Missing ALT Tags</td>
            <td>${report.onPageSEO?.images?.missingAltTags || 0}</td>
        </tr>

        <tr>
            <td>Broken Links</td>
            <td>${report.onPageSEO?.brokenLinks || 0}</td>
        </tr>

        <tr>
            <td>Sitemap.xml</td>
            <td>${report.onPageSEO?.sitemap ? "✅ Found" : "❌ Missing"}</td>
        </tr>

        <tr>
            <td>Robots.txt</td>
            <td>${report.onPageSEO?.robotsTxt ? "✅ Found" : "❌ Missing"}</td>
        </tr>

        <tr>
            <td>Structured Data</td>
            <td>${report.onPageSEO?.structuredData?.found ? "✅ Found" : "❌ Missing"}</td>
        </tr>

    </table>

</div>

<div class="section">

    <h2>Open Graph Analysis</h2>

    <table>

        <tr>
            <th>Property</th>
            <th>Value</th>
        </tr>

        <tr>
            <td>Title</td>
            <td>${report.openGraph?.title || "Missing"}</td>
        </tr>

        <tr>
            <td>Description</td>
            <td>${report.openGraph?.description || "Missing"}</td>
        </tr>

        <tr>
            <td>Image</td>
            <td>
                ${
                    report.openGraph?.image
                        ? `<img class="og-image" src="${report.openGraph.image}" />`
                        : "Missing"
                }
            </td>
        </tr>

        <tr>
            <td>URL</td>
            <td>${report.openGraph?.url || "Missing"}</td>
        </tr>

    </table>

</div>

<div class="section">

    <h2>SEO Recommendations</h2>

    <ul>
        ${
            recommendations.length
                ? recommendations.map(item => `<li>${item}</li>`).join("")
                : "<li>No major SEO issues detected.</li>"
        }
    </ul>

</div>

<div class="footer">
    Generated by SEO Audit Tool
</div>

</body>
</html>
`;
};

module.exports = seoReportTemplate;