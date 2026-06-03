import { useState } from "react";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import AuditForm from "../components/AuditForm";
import ScoreCard from "../components/ScoreCard";

import {
  runAudit,
  downloadReport
} from "../services/auditService";

import "../styles/dashboard.css";

function Dashboard() {

  const [url, setUrl] = useState("");

  const [loading, setLoading] =
    useState(false);

  const [report, setReport] =
    useState(null);

  const handleAudit = async () => {

    if (!url) {

      alert("Enter Website URL");

      return;

    }

    try {

      setLoading(true);

      const data =
        await runAudit(url);

      setReport(data.report);

    } catch (error) {

      console.error(error);

      alert("Audit Failed");

    } finally {

      setLoading(false);

    }

  };

  const handleDownload = async () => {

    try {

      const pdf =
        await downloadReport(url);

      const fileUrl =
        window.URL.createObjectURL(
          new Blob([pdf])
        );

      const link =
        document.createElement("a");

      link.href = fileUrl;

      link.download =
        "seo-audit-report.pdf";

      document.body.appendChild(link);

      link.click();

    } catch (error) {

      console.error(error);

      alert("PDF Download Failed");

    }

  };

  return (

    <div className="app-layout">

      <Sidebar />

      <div className="main">

        <Topbar />

        <div className="content">

          <AuditForm
            url={url}
            setUrl={setUrl}
            onSubmit={handleAudit}
            loading={loading}
          />

          {report && (

            <>

              <div className="score-grid">

                <ScoreCard
                  title="Performance"
                  score={report.pageSpeed?.performance}
                />

                <ScoreCard
                  title="SEO"
                  score={report.pageSpeed?.seo}
                />

                <ScoreCard
                  title="Accessibility"
                  score={report.pageSpeed?.accessibility}
                />

                <ScoreCard
                  title="Best Practices"
                  score={report.pageSpeed?.bestPractices}
                />

              </div>

              <div className="report-section">

                <h2>
                  Core Web Vitals
                </h2>

                <table>

                  <tbody>

                    <tr>
                      <td>LCP</td>
                      <td>
                        {report.pageSpeed?.coreWebVitals?.lcp}
                      </td>
                    </tr>

                    <tr>
                      <td>CLS</td>
                      <td>
                        {report.pageSpeed?.coreWebVitals?.cls}
                      </td>
                    </tr>

                    <tr>
                      <td>INP</td>
                      <td>
                        {report.pageSpeed?.coreWebVitals?.inp}
                      </td>
                    </tr>

                    <tr>
                      <td>FCP</td>
                      <td>
                        {report.pageSpeed?.coreWebVitals?.fcp}
                      </td>
                    </tr>

                    <tr>
                      <td>Speed Index</td>
                      <td>
                        {report.pageSpeed?.coreWebVitals?.speedIndex}
                      </td>
                    </tr>

                    <tr>
                      <td>TBT</td>
                      <td>
                        {report.pageSpeed?.coreWebVitals?.tbt}
                      </td>
                    </tr>

                  </tbody>

                </table>

              </div>

              <div className="report-section">

                <h2>
                  On Page SEO
                </h2>

                <table>

                  <tbody>

                    <tr>
                      <td>SEO Score</td>
                      <td>
                        {report.onPageSEO?.score}
                      </td>
                    </tr>

                    <tr>
                      <td>Title Tag</td>
                      <td>
                        {report.onPageSEO?.title
                          ? "Present"
                          : "Missing"}
                      </td>
                    </tr>

                    <tr>
                      <td>Meta Description</td>
                      <td>
                        {report.onPageSEO?.metaDescription
                          ? "Present"
                          : "Missing"}
                      </td>
                    </tr>

                    <tr>
                      <td>Canonical URL</td>
                      <td>
                        {report.onPageSEO?.canonical
                          ? "Present"
                          : "Missing"}
                      </td>
                    </tr>

                    <tr>
                      <td>Missing ALT Tags</td>
                      <td>
                        {report.onPageSEO?.images?.missingAltTags}
                      </td>
                    </tr>

                    <tr>
                      <td>Broken Links</td>
                      <td>
                        {report.onPageSEO?.brokenLinks}
                      </td>
                    </tr>

                  </tbody>

                </table>

              </div>

              <div className="report-section">

                <h2>
                  Open Graph Analysis
                </h2>

                <table>

                  <tbody>

                    <tr>
                      <td>Title</td>
                      <td>
                        {report.openGraph?.title}
                      </td>
                    </tr>

                    <tr>
                      <td>Description</td>
                      <td>
                        {report.openGraph?.description}
                      </td>
                    </tr>

                    <tr>
                      <td>URL</td>
                      <td>
                        {report.openGraph?.url}
                      </td>
                    </tr>

                  </tbody>

                </table>

              </div>

              <button
                className="download-btn"
                onClick={handleDownload}
              >
                Download PDF Report
              </button>

            </>

          )}

        </div>

      </div>

    </div>

  );

}

export default Dashboard;