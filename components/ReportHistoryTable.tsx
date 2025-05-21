"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from 'react-markdown';

interface ReportHistoryItem {
  id: string;
  analysis_type: string;
  analysis_result: string; // Assuming this will be "compliant" or "nonCompliant"
  created_at: string;
}

interface ReportHistoryTableProps {
  reportsDict: any; // Using any for now, consider a more specific type
}

export default function ReportHistoryTable({ reportsDict }: ReportHistoryTableProps) {
  const [reports, setReports] = useState<ReportHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<ReportHistoryItem | null>(null);
  const [triggerRowDownloadFor, setTriggerRowDownloadFor] = useState<ReportHistoryItem | null>(null); // New state for triggering download from row
  const [html2pdf, setHtml2Pdf] = useState<any>(null); // State to hold the dynamically imported library

  useEffect(() => {
    // Dynamically import html2pdf.js on the client side
    // @ts-ignore
    import('html2pdf.js').then(module => {
      setHtml2Pdf(() => module.default);
    });

    async function fetchReportHistory() {
      try {
        const response = await fetch("/api/history"); // Adjust if your API route is different
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setReports(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    fetchReportHistory();
  }, []);

  const handleViewReport = (report: ReportHistoryItem) => {
    setSelectedReport(report);
  };

  const handleDownloadPdf = () => {
    if (selectedReport && html2pdf) { // Check if html2pdf is loaded
      const element = document.getElementById('reportContentToDownload');
      if (element) {
        const opt = {
          margin: 1,
          filename: `${selectedReport.analysis_type}_${selectedReport.id}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
        };
        html2pdf().from(element).set(opt).save();
      } else {
        console.error("Element with ID 'reportContentToDownload' not found.");
        // Optionally, display a message to the user
      }
    }
  };

  // New handler for the row's download button click
  const handleRowDownloadClick = (report: ReportHistoryItem) => {
    setSelectedReport(report); // Update selectedReport to this report
    setTriggerRowDownloadFor(report); // Set trigger for useEffect to perform download
  };

  // New useEffect to handle the download after state updates from row click
  useEffect(() => {
    if (triggerRowDownloadFor && selectedReport && selectedReport.id === triggerRowDownloadFor.id) {
      // selectedReport is now the one we intend to download, and the modal's content
      // (specifically #reportContentToDownload) should have been updated in the previous render cycle.
      handleDownloadPdf(); // Call the existing download function
      setTriggerRowDownloadFor(null); // Reset the trigger
    }
  }, [triggerRowDownloadFor, selectedReport]); // Dependencies

  if (loading) {
    return <p>{reportsDict.loading}</p>; // Add a "loading" key to your dictionary
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div>
      <div className="reports-card" data-aos="fade-up" data-aos-duration="1500">
        <div className="reports-filter">
          {/* <div className="row">
                <div className="col-md-4">
                  <div className="form-floating mb-4">
                    <select className="form-select" id="floatingSelectDate" aria-label="Floating label select example">
                      <option defaultValue="Last 30 Days">{reportsDict.filter.dateOptions.last30Days}</option>
                      <option value="1">{reportsDict.filter.dateOptions.last7Days}</option>
                      <option value="2">{reportsDict.filter.dateOptions.today}</option>
                    </select>
                    <label htmlFor="floatingSelectDate">{reportsDict.filter.byDate}</label>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-floating mb-4">
                    <select className="form-select" id="floatingSelectType" aria-label="Floating label select example">
                      <option defaultValue="All">{reportsDict.filter.typeOptions.all}</option>
                      <option value="1">{reportsDict.filter.typeOptions.payslip}</option>
                      <option value="2">{reportsDict.filter.typeOptions.contract}</option>
                      <option value="3">{reportsDict.filter.typeOptions.legalScenario}</option>
                    </select>
                    <label htmlFor="floatingSelectType">{reportsDict.filter.byType}</label>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-floating mb-4">
                    <select className="form-select" id="floatingSelectResult" aria-label="Floating label select example">
                      <option defaultValue="All">{reportsDict.filter.resultOptions.all}</option>
                      <option value="1">{reportsDict.filter.resultOptions.compliant}</option>
                      <option value="2">{reportsDict.filter.resultOptions.nonCompliant}</option>
                    </select>
                    <label htmlFor="floatingSelectResult">{reportsDict.filter.byResult}</label>
                  </div>
                </div>
              </div> */}
        </div>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">{reportsDict.table.date}</th>
                <th scope="col">{reportsDict.table.type}</th>
                <th scope="col">{reportsDict.table.actions}</th>
              </tr>
            </thead>
            <tbody>
                {reports.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center">
                  {reportsDict.table.noReports || 'No reports available'}
                  </td>
                </tr>
                ) : (
                reports.map((report) => (
                  <tr key={report.id}>
                  <td>{formatDate(report.created_at)}</td>
                  <td>{report.analysis_type}</td>
                  <td>
                    <div className="d-flex align-items-center justify-content-end">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-dark without-icon ms-2 me-2"
                      data-bs-toggle="modal"
                      data-bs-target="#reportModal"
                      onClick={() => handleViewReport(report)}
                    >
                      <i className="bi bi-eye"></i> {reportsDict.table.viewButton}
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-dark without-icon"
                      onClick={() => handleRowDownloadClick(report)}
                    >
                      <i className="bi bi-download"></i> {reportsDict.table.downloadButton}
                    </button>
                    </div>
                  </td>
                  </tr>
                ))
                )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="modal fade" id="reportModal" tabIndex={-1} aria-labelledby="reportModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                {selectedReport ? selectedReport.analysis_type : 'Report Details'}
              </h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"><i className="bi bi-x"></i></button>
            </div>
            <div className="modal-body">
              {selectedReport ? (
                <div id="reportContentToDownload">
                  <ReactMarkdown>{selectedReport.analysis_result}</ReactMarkdown>
                </div>
              ) : (
                <p>No report selected.</p>
              )}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-outline-dark without-icon btn-sm ms-auto me-auto"
                onClick={handleDownloadPdf}
                disabled={!selectedReport}
              >
                <i className="bi bi-download"></i> {reportsDict.table.downloadButton}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
