'use client';

import { Locale } from "@/i18n-config";
import { useAnalysisStore } from '@/store/analysisStore'; // Add this import
import { useProcessingResultStore } from "@/store/processingResultStore";
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import useAuthStore from '../store/authStore'; // Import the auth store
import { useOcrEditorStore } from '../store/ocrEditorStore';
import { convertHtmlTablesToMarkdown, convertHtmlToMarkdown, hasHtmlTables } from '../utils/htmlToMarkdown';
import FileUpload from './FileUpload';

interface FileAnalysisProps {
  lang: Locale;
  dictionary: Record<string, any>;
}

interface UploadedFile {
  id: string;
  file: File;
  progress: number;
}

const FileAnalysis: React.FC<FileAnalysisProps> = ({ lang, dictionary }) => {
  // Typing animation for analysis display
  const typeContent = (html: string) => {
    // Clear any existing typing interval first
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
      typingIntervalRef.current = null;
    }

    setTypedContent('');
    let i = 0;

    typingIntervalRef.current = setInterval(() => {
      if (i < html.length) {
        setTypedContent(prev => prev + html.charAt(i));
        i++;
      } else {
        clearInterval(typingIntervalRef.current!);
        typingIntervalRef.current = null;
      }
    }, 0);
  };

  // Show analysis with typing animation
  const handleShowAnalysis = (content: string) => {
    // Clear any existing typing animation first
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
      typingIntervalRef.current = null;
    }

    setTypedContent('');
    setIsVisible(true);

    setTimeout(() => {
      const analysisSection = document.getElementById('analysis-section');
      if (analysisSection) {
        const y = analysisSection.getBoundingClientRect().top + window.pageYOffset - 30;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
      setTimeout(() => {
        typeContent(content);
      }, 100);
    }, 100);
  };
  // File Upload States
  // Export to Excel handler
  const handleExportToExcel = async () => {
    if (!isLoggedIn) {
      alert('Please log in to export to Excel.');
      return;
    }

    let documentsData = processingResult;

    // If documents haven't been processed yet, process them now
    if (!documentsData) {
      console.log("No existing processing result, calling handleProcessDocuments...");
      const newlyProcessedData = await handleProcessDocuments();
      if (!newlyProcessedData) {
        console.error('Document processing failed. Cannot export to Excel.');
        return;
      }
      documentsData = newlyProcessedData;
    }

    try {
      // Use the current processingResult state which may contain edited OCR data
      const finalData = processingResult || documentsData;

      const response = await fetch('/api/export_excel', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          processed_result: finalData
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Excel export failed');
      }

      // Handle the file download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'employee_data.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      console.log('Excel export successful');
    } catch (error: unknown) {
      console.error('Excel export error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred during Excel export.';
      alert(`Export failed: ${errorMessage}`);
    }
  };

  const [payslipFiles, setPayslipFiles] = useState<UploadedFile[]>([]);
  const [contractFiles, setContractFiles] = useState<UploadedFile[]>([]);
  const [attendanceFiles, setAttendanceFiles] = useState<UploadedFile[]>([]); // New state for attendance reports
  const [context, setContext] = useState<string>(''); // State for additional context input
  const router = useRouter();
  const { isLoggedIn } = useAuthStore(); // Use the auth store
  const { setLegalAnalysis } = useAnalysisStore(); // Add this line

  // Analysis States
  const [isVisible, setIsVisible] = useState(false);
  const [typedContent, setTypedContent] = useState('');
  const typingIntervalRef = React.useRef<NodeJS.Timeout | null>(null); // Track typing interval
  const [isProcessingDocuments, setIsProcessingDocuments] = useState(false); // Document processing state
  const [isProcessingReport, setIsProcessingReport] = useState(false); // Report creation state
  // Use global Zustand store for processingResult
  const { processingResult, setProcessingResult } = useProcessingResultStore();
  const [processingError, setProcessingError] = useState<string | null>(null); // State to hold API error
  const [ocrSaveSuccess, setOcrSaveSuccess] = useState(false); // State for OCR save success message
  const { setShowOcrEditor, setEditableOcrData, setOnSaveCallback, resetOcrData } = useOcrEditorStore();

  // Track file changes to reset processing result when files change
  const [lastProcessedFiles, setLastProcessedFiles] = useState<{
    payslip: string[];
    contract: string[];
    attendance: string[];
  }>({
    payslip: [],
    contract: [],
    attendance: []
  });

  // Combined processing state for UI
  const isProcessing = isProcessingDocuments || isProcessingReport;

  // Set up OCR editor save callback
  React.useEffect(() => {
    console.log('Setting up OCR save callback in FileAnalysis');
    setOnSaveCallback((editedData) => {
      console.log('OCR save callback triggered with data:', editedData);
      // Update the processing result with edited OCR data
      if (!processingResult) {
        setProcessingResult(null);
      } else {
        setProcessingResult({
          ...processingResult,
          payslip_text: editedData.payslip_text || '',
          contract_text: editedData.contract_text || '',
          attendance_text: editedData.attendance_text || ''
        });
      }
      // Show success message
      setOcrSaveSuccess(true);
      setTimeout(() => setOcrSaveSuccess(false), 3000); // Hide after 3 seconds
    });
  }, [setOnSaveCallback]);

  // Effect to detect file changes and reset processing result
  React.useEffect(() => {
    const currentFiles = {
      payslip: payslipFiles.map(f => f.file.name + f.file.size + f.file.lastModified),
      contract: contractFiles.map(f => f.file.name + f.file.size + f.file.lastModified),
      attendance: attendanceFiles.map(f => f.file.name + f.file.size + f.file.lastModified)
    };

    // Check if files have changed
    const filesChanged =
      JSON.stringify(currentFiles.payslip) !== JSON.stringify(lastProcessedFiles.payslip) ||
      JSON.stringify(currentFiles.contract) !== JSON.stringify(lastProcessedFiles.contract) ||
      JSON.stringify(currentFiles.attendance) !== JSON.stringify(lastProcessedFiles.attendance); if (filesChanged && processingResult !== null) {
        console.log("Files changed, resetting processing result");
        setProcessingResult(null);
        setProcessingError(null);
        setIsVisible(false); // Hide any previous analysis
        setShowOcrEditor(false); // Hide OCR editor
        resetOcrData(); // Reset OCR editor data
        setOcrSaveSuccess(false); // Hide success message
      }
  }, [payslipFiles, contractFiles, attendanceFiles, processingResult, lastProcessedFiles, setShowOcrEditor, resetOcrData]);

  // Cleanup typing interval on unmount
  React.useEffect(() => {
    return () => {
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
      }
    };
  }, []);

  // Analysis Handlers
  const handleProcessDocuments = async () => {
    if (!isLoggedIn) {
      alert('Please log in to process documents.');
      return null; // Return null to indicate failure/early exit
    }
    if (payslipFiles.length === 0 && contractFiles.length === 0 && attendanceFiles.length === 0) {
      alert('Please upload at least one payslip, contract, or attendance file.');
      return null; // Return null
    }

    setIsProcessingDocuments(true); // Indicate processing of documents has started
    setProcessingResult(null); // Reset previous results
    setProcessingError(null); // Reset previous errors

    const formData = new FormData();

    payslipFiles.forEach(uploadedFile => {
      formData.append('files', uploadedFile.file);
      formData.append('doc_types', 'payslip');
    });

    contractFiles.forEach(uploadedFile => {
      formData.append('files', uploadedFile.file);
      formData.append('doc_types', 'contract');
    });

    attendanceFiles.forEach(uploadedFile => {
      formData.append('files', uploadedFile.file);
      formData.append('doc_types', 'attendance');
    });

    try {
      const response = await fetch('/api/process', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      }); if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log(result)
      setProcessingResult(result); // Store the successful result

      // Update the last processed files tracker
      setLastProcessedFiles({
        payslip: payslipFiles.map(f => f.file.name + f.file.size + f.file.lastModified),
        contract: contractFiles.map(f => f.file.name + f.file.size + f.file.lastModified),
        attendance: attendanceFiles.map(f => f.file.name + f.file.size + f.file.lastModified)
      });

      console.log("Documents processed successfully:", result);
      return result; // Return the result for immediate use if needed

    } catch (error: unknown) {
      console.error('Error processing documents:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
      setProcessingError(errorMessage);
      return null; // Return null on error
    } finally {
      setIsProcessingDocuments(false); // Indicate processing of documents has finished
    }
  };

  // OCR Editor functions
  const handleShowOcrEditor = () => {
    if (processingResult) {
      // Automatically convert any HTML content when opening the editor
      const payslipText = processingResult.payslip_text || '';
      const contractText = processingResult.contract_text || '';
      const attendanceText = processingResult.attendance_text || '';

      setEditableOcrData({
        payslip_text: hasHtmlTables(payslipText) || /<[^>]+>/g.test(payslipText)
          ? (hasHtmlTables(payslipText) ? convertHtmlTablesToMarkdown(payslipText) : convertHtmlToMarkdown(payslipText))
          : payslipText,
        contract_text: hasHtmlTables(contractText) || /<[^>]+>/g.test(contractText)
          ? (hasHtmlTables(contractText) ? convertHtmlTablesToMarkdown(contractText) : convertHtmlToMarkdown(contractText))
          : contractText,
        attendance_text: hasHtmlTables(attendanceText) || /<[^>]+>/g.test(attendanceText)
          ? (hasHtmlTables(attendanceText) ? convertHtmlTablesToMarkdown(attendanceText) : convertHtmlToMarkdown(attendanceText))
          : attendanceText
      });
      setShowOcrEditor(true);
    }
  };

  const handleCreateReport = async (type: string) => {
    if (!isLoggedIn) {
      alert('Please log in to create a report.');
      return;
    }

    let documentsData = processingResult; // Try to use existing processed data

    // If documents haven't been processed yet (processingResult is null), process them now.
    if (!documentsData) {
      console.log("No existing processing result, calling handleProcessDocuments...");
      // handleProcessDocuments will set its own isProcessing and processingError states.
      // It will also update processingResult state upon success.
      const newlyProcessedData = await handleProcessDocuments();
      if (!newlyProcessedData) {
        // If handleProcessDocuments failed or returned no data,
        // an error message should have been set by it.
        // We don't need to set isProcessing to false here for handleCreateReport's
        // own processing, as we are returning early.
        console.error('Document processing failed or returned no data. Aborting report creation.');
        return; // Abort report creation if document processing failed
      }
      documentsData = newlyProcessedData; // Use the freshly processed data
    }    // At this point, documentsData should contain the necessary information.
    // Now, proceed with the report creation specific logic.
    setIsVisible(false); // Hide any previous analysis
    setIsProcessingReport(true); // Set loading state for report creation
    setProcessingError(null); // Clear previous errors before report creation    console.log("Data being used for report API:", documentsData);

    try {
      // Safeguard: ensure documentsData is not null/undefined
      if (!documentsData) {
        throw new Error("No document data available to create report even after attempting processing.");
      }

      // Use the current processingResult state which may contain edited OCR data
      // processingResult takes precedence as it may contain user edits from OCR editor
      const finalData = processingResult || documentsData;
      console.log("Final data being sent to report API (may include OCR edits):", finalData);
      console.log("Current processingResult state:", processingResult);

      const response = await fetch('/api/report', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payslip_text: finalData.payslip_text,
          contract_text: finalData.contract_text,
          attendance_text: finalData.attendance_text,
          type: type,
          context: context
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Report creation failed');
      }

      const reportResult = await response.json();
      console.log("Report creation successful:", reportResult);
      setLegalAnalysis(reportResult.legal_analysis);
      handleShowAnalysis(reportResult.legal_analysis);
    } catch (error: unknown) {
      console.error('Report creation error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred during report creation.';
      setProcessingError(errorMessage);
    } finally {
      setIsProcessingReport(false); // Clear loading state for report creation
    }
  };

  return (
    <div>
      {/* File Upload Section */}
      <div className="row">
        {/* Payslip Upload */}
        <div className="col-lg-4" data-aos="fade-up" data-aos-duration="1500">
          <FileUpload
            id="payslip"
            title={dictionary.hero.payslipUploadTitle}
            text={dictionary.hero.payslipUploadText}
            buttonText={dictionary.hero.uploadButton}
            lang={lang}
            files={payslipFiles}
            onFilesChange={setPayslipFiles}
          />
        </div>

        {/* Contract Upload */}
        <div className="col-lg-4 mt-4 mt-lg-0" data-aos="fade-up" data-aos-duration="1500">
          <FileUpload
            id="contract"
            title={dictionary.hero.contractUploadTitle}
            text={dictionary.hero.contractUploadText}
            buttonText={dictionary.hero.uploadButton}
            lang={lang}
            files={contractFiles}
            onFilesChange={setContractFiles}
          />
        </div>

        {/* Attendance Report Upload */}
        <div className="col-lg-4 mt-4 mt-lg-0" data-aos="fade-up" data-aos-duration="1500">
          <FileUpload
            id="attendance"
            title={dictionary.hero.attendanceUploadTitle}
            text={dictionary.hero.attendanceUploadText}
            buttonText={dictionary.hero.uploadButton}
            lang={lang}
            files={attendanceFiles}
            onFilesChange={setAttendanceFiles}
          />
        </div>
      </div>

      {/* Process Documents Button */}
      <div className="row mt-4" data-aos="fade-up" data-aos-duration="1500">
        <div className="col-9">
          <input
            type="text"
            className="form-control"
            placeholder="Enter additional context for document analysis..."
            value={context}
            onChange={(e) => setContext(e.target.value)}
          />
        </div>        <div className="col-3">
          <button
            type="button"
            className="btn btn-success w-100 p-4"
            onClick={handleProcessDocuments}
            disabled={isProcessing || (payslipFiles.length === 0 && contractFiles.length === 0 && attendanceFiles.length === 0)}
          >
            <>
              {isProcessing && !processingResult ? 'Processing Docs...' :
                processingResult ? 'Docs Processed' :
                  (dictionary.hero.processButton || 'Process Documents')}
            </>
            {!isProcessing && <span><i className="bi bi-arrow-right-short"></i></span>}
          </button>
        </div>      </div>      {/* View/Edit OCR Results Button */}
      {processingResult && (
        <div className="row mt-3" data-aos="fade-up" data-aos-duration="1500">
          <div className="col-12">            <div className="alert alert-info d-flex align-items-center" role="alert">
            <i className="bi bi-info-circle me-2"></i>
            <small>Documents processed successfully! You can now review and edit the extracted text with live markdown preview before creating reports.</small>
          </div>
            <button
              type="button"
              className="btn btn-outline-info w-100 py-3"
              onClick={handleShowOcrEditor}
              disabled={isProcessing}
            >
              <i className="bi bi-pencil-square me-2"></i>
              <strong>Edit OCR Results with Live Preview</strong>
              <br />
              <small className="text-muted">Professional markdown editor with tables, formatting, and real-time preview</small>
            </button>
          </div>
        </div>)}

      {/* OCR Save Success Message */}
      {ocrSaveSuccess && (
        <div className="row mt-3" data-aos="fade-up" data-aos-duration="1500">
          <div className="col-12">
            <div className="alert alert-success d-flex align-items-center" role="alert">
              <i className="bi bi-check-circle me-2"></i>
              <span>OCR text changes saved successfully! Updated data will be used for report generation.</span>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons - Rendered individually for unique functionality */}
      <div className="row">
        {/* Example: Button 1 - Create a report */}
        {dictionary.hero.actionButtons.createReport && (
          <div className="col-6 col-md-3 mt-4" data-aos="fade-up" data-aos-duration="1500">
            <button
              type="button"
              className="btn btn-outline-dark thumbnail-btn show-btn"
              onClick={() => handleCreateReport('combined')}
              disabled={isProcessing} // General disable if any processing is happening
            >
              <div dangerouslySetInnerHTML={{ __html: dictionary.hero.actionButtons.createReport.replace(' ', '<br>') }} />
              <span><i className="bi bi-arrow-right-short"></i></span>
            </button>
          </div>
        )}

        {/* Example: Button 2 - Create a company page */}
        {/* {dictionary.hero.actionButtons.createCompanyPage && (
          <div className="col-6 col-md-3 mt-4" data-aos="fade-up" data-aos-duration="1500">
            <button
              type="button"
              className="btn btn-outline-dark thumbnail-btn show-btn"
              disabled // Kept disabled as per original
            >
              <div dangerouslySetInnerHTML={{ __html: dictionary.hero.actionButtons.createCompanyPage.replace(' ', '<br>') }} />
              <span><i className="bi bi-arrow-right-short"></i></span>
            </button>
          </div>
        )} */}

        {/* Add other buttons similarly, accessing them by index from dictionary.hero.actionButtons */}
        {/* Example: Button 3 - Document history */}
        {dictionary.hero.actionButtons.documentHistory && (
          <div className="col-6 col-md-3 mt-4" data-aos="fade-up" data-aos-duration="1500">
            <button
              type="button"
              className="btn btn-outline-dark thumbnail-btn show-btn"
              onClick={() => router.push('/reports')}
              disabled={isProcessing}
            >
              <div dangerouslySetInnerHTML={{ __html: dictionary.hero.actionButtons.documentHistory.replace(' ', '<br>') }} />
              <span><i className="bi bi-arrow-right-short"></i></span>
            </button>
          </div>
        )}

        {/* Button 5 - Check profitability */}
        {dictionary.hero.actionButtons.checkProfitability && (
          <div className="col-6 col-md-3 mt-4" data-aos="fade-up" data-aos-duration="1500">
            <button
              type="button"
              className="btn btn-outline-dark thumbnail-btn show-btn"
              onClick={() => handleCreateReport('profitability')}
              disabled={isProcessing}
            >
              <div dangerouslySetInnerHTML={{ __html: dictionary.hero.actionButtons.checkProfitability.replace(' ', '<br>') }} />
              <span><i className="bi bi-arrow-right-short"></i></span>
            </button>
          </div>
        )}

        {/* Button 6 - Create warning letter */}
        {dictionary.hero.actionButtons.createWarningLetter && (
          <div className="col-6 col-md-3 mt-4" data-aos="fade-up" data-aos-duration="1500">
            <button
              type="button"
              className="btn btn-outline-dark thumbnail-btn show-btn"
              onClick={() => handleCreateReport('warning_letter')}
              disabled={isProcessing}
            >
              <div dangerouslySetInnerHTML={{ __html: dictionary.hero.actionButtons.createWarningLetter.replace(' ', '<br>') }} />
              <span><i className="bi bi-arrow-right-short"></i></span>
            </button>
          </div>
        )}

        {/* Button 7 - Professional Opinion & Calculations */}
        {dictionary.hero.actionButtons.professionalOpinion && (
          <div className="col-6 col-md-3 mt-4" data-aos="fade-up" data-aos-duration="1500">
            <button
              type="button"
              className="btn btn-outline-dark thumbnail-btn show-btn"
              onClick={() => handleCreateReport('professional')}
              disabled={isProcessing}
            >
              <div dangerouslySetInnerHTML={{ __html: dictionary.hero.actionButtons.professionalOpinion.replace(' ', '<br>') }} />
              <span><i className="bi bi-arrow-right-short"></i></span>
            </button>
          </div>
        )}

        {/* Easy Explanation Button */}
        {dictionary.hero.actionButtons.easyExplanation && (
          <div className="col-6 col-md-3 mt-4" data-aos="fade-up" data-aos-duration="1500" dir={lang === 'he' ? 'rtl' : 'ltr'}>
            <button
              type="button"
              className="btn btn-outline-dark thumbnail-btn show-btn"
              onClick={() => handleCreateReport('easy')}
              disabled={isProcessing}
            >
              <div dangerouslySetInnerHTML={{ __html: dictionary.hero.actionButtons.easyExplanation.replace(' ', '<br>') }} />
              <span><i className="bi bi-arrow-right-short"></i></span>
            </button>
          </div>
        )}

        {/* Example: Button 4 - Preparing a claim */}
        {dictionary.hero.actionButtons.prepareClaim && (
          <div className="col-6 col-md-3 mt-4" data-aos="fade-up" data-aos-duration="1500">
            <button
              type="button"
              className="btn btn-outline-dark thumbnail-btn show-btn"
              onClick={() => handleCreateReport('claim')}
              disabled={isProcessing}
            >
              <div dangerouslySetInnerHTML={{ __html: dictionary.hero.actionButtons.prepareClaim.replace(' ', '<br>') }} />
              <span><i className="bi bi-arrow-right-short"></i></span>
            </button>
          </div>
        )}

        {/* Button 10 - Final Claim Report */}
        {dictionary.hero.actionButtons.finalClaimReport && (
          <div className="col-6 col-md-3 mt-4" data-aos="fade-up" data-aos-duration="1500">
            <button
              type="button"
              className="btn btn-outline-dark thumbnail-btn show-btn"
              onClick={() => handleCreateReport('table')}
              disabled={isProcessing}
            >
              <div dangerouslySetInnerHTML={{ __html: dictionary.hero.actionButtons.finalClaimReport.replace(' ', '<br>') }} />
              <span><i className="bi bi-arrow-right-short"></i></span>
            </button>
          </div>
        )}

        {/* Employer Report Button */}
        {dictionary.hero.actionButtons.employerReport && (
          <div className="col-6 col-md-3 mt-4" data-aos="fade-up" data-aos-duration="1500">
            <button
              type="button"
              className="btn btn-outline-dark thumbnail-btn show-btn"
              onClick={() => handleCreateReport('report')}
              disabled={isProcessing}
            >
              <div dangerouslySetInnerHTML={{ __html: dictionary.hero.actionButtons.employerReport.replace(' ', '<br>') }} />
              <span><i className="bi bi-arrow-right-short"></i></span>
            </button>
          </div>
        )}

        {/* List of Violations Button */}
        {dictionary.hero.actionButtons.violationsList && (
          <div className="col-6 col-md-3 mt-4" data-aos="fade-up" data-aos-duration="1500">
            <button
              type="button"
              className="btn btn-outline-dark thumbnail-btn show-btn"
              onClick={() => handleCreateReport('violations_list')}
              disabled={isProcessing}
            >
              <div dangerouslySetInnerHTML={{ __html: dictionary.hero.actionButtons.violationsList.replace(' ', '<br>') }} />
              <span><i className="bi bi-arrow-right-short"></i></span>
            </button>
          </div>
        )}

        {/* Table of Violations Button */}
        {dictionary.hero.actionButtons.violationsTable && (
          <div className="col-6 col-md-3 mt-4" data-aos="fade-up" data-aos-duration="1500">
            <button
              type="button"
              className="btn btn-outline-dark thumbnail-btn show-btn"
              onClick={() => handleCreateReport('violation_count_table')}
              disabled={isProcessing}
            >
              <div dangerouslySetInnerHTML={{ __html: dictionary.hero.actionButtons.violationsTable.replace(' ', '<br>') }} />
              <span><i className="bi bi-arrow-right-short"></i></span>
            </button>
          </div>
        )}

        {/* Export to Excel Button */}
        {dictionary.hero.actionButtons.exportToExcel && (
          <div className="col-6 col-md-3 mt-4" data-aos="fade-up" data-aos-duration="1500">
            <button
              type="button"
              className="btn btn-outline-success thumbnail-btn show-btn"
              onClick={handleExportToExcel}
              disabled={isProcessing}
            >
              <div dangerouslySetInnerHTML={{ __html: dictionary.hero.actionButtons.exportToExcel.replace(' ', '<br>') }} />
              <span className="text-success"><i className="bi bi-file-earmark-excel"></i></span>
            </button>
          </div>
        )}

        {/* Button 11 - Serial employer */}
        {/* {dictionary.hero.actionButtons.identifySerialEmployer && (
          <div className="col-6 col-md-3 mt-4" data-aos="fade-up" data-aos-duration="1500">
            <button
              type="button"
              className="btn btn-outline-dark thumbnail-btn show-btn"
              disabled // Kept disabled as per original
            >
              <div dangerouslySetInnerHTML={{ __html: dictionary.hero.actionButtons.identifySerialEmployer.replace(' ', '<br>') }} />
              <span><i className="bi bi-arrow-right-short"></i></span>
            </button>
          </div>
        )} */}
      </div>

      {/* Processing Status Messages */}
      {processingError && (
        <div className="alert alert-danger mt-3" role="alert">
          Error: {processingError}
        </div>
      )}

      {/* Analysis Section */}
      {isVisible && <div className="result-card mt-4" id="analysis-section" style={{ display: isVisible ? 'block' : 'none' }}>
        <div id="typing-output" dir={"rtl"}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              table: ({node, ...props}) => (
                <table className="markdown-table" {...props} />
              )
            }}
          >
            {typedContent}
          </ReactMarkdown>
          <div className="d-sm-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center mt-4">
              <p className="mb-0 text-muted">{dictionary.hero.sharing.title} </p>
              <button
                type="button"
                className="btn btn-dark btn-icon btn-sm ms-2" onClick={() => {
                  const text = typedContent;
                  const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
                  window.open(url, '_blank');
                }}
                title={dictionary.hero.sharing.whatsapp}
              >
                <i className="bi bi-whatsapp"></i>
              </button>
              <button
                type="button"
                className="btn btn-dark btn-icon btn-sm ms-2" onClick={() => {
                  const subject = 'Legal Analysis Report';
                  const body = typedContent;
                  const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                  window.location.href = mailtoLink;
                }}
                title={dictionary.hero.sharing.email}
              >
                <i className="bi bi-envelope"></i>
              </button>
            </div>

            <button type="submit" className="btn btn-primary mt-4" data-bs-toggle="modal" data-bs-target="#summaryModal">
              <i className="bi bi-eye"></i>
              {dictionary.fileAnalysis.showAiSummary}
            </button>

            <button type="submit" className="btn btn-primary mt-4" data-bs-toggle="modal" data-bs-target="#questionModal">
              <i className="bi bi-question-circle"></i>
              {dictionary.fileAnalysis.askQuestion}
            </button>

            <button type="submit" className="btn btn-primary mt-4" data-bs-toggle="modal" data-bs-target="#exampleModal">
              {dictionary.hero.sharing.findLawyer}
              <span><i className="bi bi-arrow-right-short"></i></span>
            </button>
          </div>        </div>
      </div>}

    </div>
  );
};

export default FileAnalysis;