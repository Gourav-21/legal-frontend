'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Locale } from "@/i18n-config";
import FileUpload from './FileUpload';
import ReactMarkdown from 'react-markdown';
import useAuthStore from '../store/authStore'; // Import the auth store

interface FileAnalysisProps {
  lang: Locale;
  dictionary: any;
}

interface UploadedFile {
  id: string;
  file: File;
  progress: number;
}

const FileAnalysis: React.FC<FileAnalysisProps> = ({ lang, dictionary }) => {
  // File Upload States
  const [payslipFiles, setPayslipFiles] = useState<UploadedFile[]>([]);
  const [contractFiles, setContractFiles] = useState<UploadedFile[]>([]);
  const [attendanceFiles, setAttendanceFiles] = useState<UploadedFile[]>([]); // New state for attendance reports
  const [context, setContext] = useState<string>(''); // State for additional context input
  const router = useRouter();
  const { isLoggedIn } = useAuthStore(); // Use the auth store

  // Analysis States
  const [isVisible, setIsVisible] = useState(false);
  const [typedContent, setTypedContent] = useState('');
  const animationStartedRef = React.useRef(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingResult, setProcessingResult] = useState<any>(null); // State to hold API response
  const [processingError, setProcessingError] = useState<string | null>(null); // State to hold API error

  // Analysis Handlers
  const scrollToAnalysis = () => {
    const analysisSection = document.getElementById('analysis-section');
    if (analysisSection) {
      const y = analysisSection.getBoundingClientRect().top + window.pageYOffset - 30;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handleProcessDocuments = async () => {
    if (!isLoggedIn) {
      alert('Please log in to process documents.'); // Or use a more sophisticated notification
      return;
    }
    if (payslipFiles.length === 0 && contractFiles.length === 0 && attendanceFiles.length === 0) {
      alert('Please upload at least one payslip, contract, or attendance file.'); // Or use a more sophisticated notification
      return;
    }

    setIsProcessing(true);
    setProcessingResult(null);
    setProcessingError(null);

    const formData = new FormData();

    payslipFiles.forEach(uploadedFile => {
      formData.append('files', uploadedFile.file);
      formData.append('doc_types', 'payslip');
    });

    contractFiles.forEach(uploadedFile => {
      formData.append('files', uploadedFile.file);
      formData.append('doc_types', 'contract');
    });

    attendanceFiles.forEach(uploadedFile => { // Add attendance files to formData
      formData.append('files', uploadedFile.file);
      formData.append('doc_types', 'attendance');
    });

    try {
      // Assuming your backend API is running on the same origin or configured for CORS
      // Adjust the URL '/api/process' if your backend is hosted elsewhere or has a different prefix
      const response = await fetch('/api/process', { // Changed to use the Next.js API route
        method: 'POST',
        body: formData,
        credentials: 'include', // Include credentials for CORS
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setProcessingResult(result);
      console.log(result); // Log the response to the terminal
      return result
      // Optionally, trigger the analysis display or show a success message
      // handleShowAnalysis(); // You might want to show analysis based on the API result

    } catch (error: any) {
      console.error('Error processing documents:', error);
      setProcessingError(error.message || 'An unexpected error occurred.');
    //   alert(`Error processing files: ${error.message || 'An unexpected error occurred.'}`); // Placeholder error message
    } finally {
      setIsProcessing(false);
    }
  };

  const typeContent = (html: string) => {
    setTypedContent('');
    let i = 0;

    const typing = setInterval(() => {
      if (i < html.length) {
        setTypedContent(prev => prev + html.charAt(i));
        i++;
      } else {
        clearInterval(typing);
      }
    }, 0);
  };

  const handleShowAnalysis = (content:string) => {
    // if (!animationStartedRef.current) {
    //   animationStartedRef.current = true;
        setTypedContent('');
        setIsVisible(true);

      setTimeout(() => {
        scrollToAnalysis();
        setTimeout(() => {
        //   const content = document.getElementById('analysis-content')?.innerHTML || '';
          typeContent(content);
        }, 100);
      }, 100);
    // } else {
    //   scrollToAnalysis();
    // }
  };

const handleCreateReport = async (type:string) => {
    if (!isLoggedIn) {
      alert('Please log in to create a report.'); // Or use a more sophisticated notification
      return;
    }
    var returnResult = null
    if(processingResult == null) {
        returnResult = await handleProcessDocuments()
    }
    setIsVisible(false)
    setIsProcessing(true);
    setProcessingError(null);

    console.log("processingResult",processingResult)
    console.log("returnResult",returnResult)
  
    try {
      const response = await fetch('/api/report', { // Changed to use the Next.js API route
        method: 'POST',
        credentials: 'include', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payslip_text: processingResult?.payslip_text ? processingResult.payslip_text : returnResult?.payslip_text,
          contract_text: processingResult?.contract_text ? processingResult.contract_text : returnResult?.contract_text,
          attendance_text: processingResult?.attendance_text ? processingResult.attendance_text : returnResult?.attendance_text,
          type: type,
          context: context
        })
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Report creation failed');
      }
  
      const result = await response.json();
      console.log(result); // Log the response to the termina
      // Handle successful report creation
      handleShowAnalysis(result.legal_analysis);
    } catch (error: any) {
      console.error('Report creation error:', error);
      setProcessingError(error.message);
    //   alert(`Error creating report: ${error.message}`);
    } finally {
      setIsProcessing(false);
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
        </div>
        <div className="col-3">
          <button
            type="button"
            className="btn btn-success w-100 p-4"
            onClick={handleProcessDocuments}
            disabled={isProcessing || (payslipFiles.length === 0 && contractFiles.length === 0 && attendanceFiles.length === 0)}
          >
            {/* {processingResult != null ? 'Processed' : (
                <>
                {isProcessing ? 'Processing...' : (dictionary.hero.processButton || 'Process Documents')}
                </>
            )} */}
                <>
                {isProcessing ? 'Processing...' : processingResult != null ? 'Processed' : (dictionary.hero.processButton || 'Process Documents')}
                </>
            {!isProcessing && <span><i className="bi bi-arrow-right-short"></i></span>}
          </button>
        </div>
      </div>

      {/* Action Buttons - Rendered individually for unique functionality */}
      <div className="row">
        {/* Example: Button 1 - Create a report */}
        {dictionary.hero.actionButtons.createReport && (
          <div className="col-6 col-md-3 mt-4" data-aos="fade-up" data-aos-duration="1500">
        <button
          type="button"
          className="btn btn-outline-dark thumbnail-btn show-btn"
          onClick={() => handleCreateReport('report')}
          disabled={isProcessing}
        >
          <div dangerouslySetInnerHTML={{ __html: dictionary.hero.actionButtons.createReport.replace(' ', '<br>') }} />
          <span><i className="bi bi-arrow-right-short"></i></span>
        </button>
          </div>
        )}

        {/* Example: Button 2 - Create a company page */}
        {dictionary.hero.actionButtons.createCompanyPage && (
          <div className="col-6 col-md-3 mt-4" data-aos="fade-up" data-aos-duration="1500">
        <button
          type="button"
          className="btn btn-outline-dark thumbnail-btn show-btn"
          disabled
        >
          <div dangerouslySetInnerHTML={{ __html: dictionary.hero.actionButtons.createCompanyPage.replace(' ', '<br>') }} />
          <span><i className="bi bi-arrow-right-short"></i></span>
        </button>
          </div>
        )}

        {/* Add other buttons similarly, accessing them by index from dictionary.hero.actionButtons */}
        {/* Example: Button 3 - Document history */}
        {dictionary.hero.actionButtons.documentHistory && (
          <div className="col-6 col-md-3 mt-4" data-aos="fade-up" data-aos-duration="1500">
        <button
          type="button"
          className="btn btn-outline-dark thumbnail-btn show-btn"
          onClick={() => router.push(`/reports`)}
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

        {/* Button 11 - Serial employer */}
        {dictionary.hero.actionButtons.identifySerialEmployer && (
          <div className="col-6 col-md-3 mt-4" data-aos="fade-up" data-aos-duration="1500">
        <button
          type="button"
          className="btn btn-outline-dark thumbnail-btn show-btn"
          disabled
        >
          <div dangerouslySetInnerHTML={{ __html: dictionary.hero.actionButtons.identifySerialEmployer.replace(' ', '<br>') }} />
          <span><i className="bi bi-arrow-right-short"></i></span>
        </button>
          </div>
        )}
      </div>

      {/* Processing Status Messages */}
      {processingError && (
        <div className="alert alert-danger mt-3" role="alert">
          Error: {processingError}
        </div>
      )}

      {/* Analysis Section */}
     {isVisible && <div className="result-card mt-4" id="analysis-section" style={{ display: isVisible ? 'block' : 'none' }}>
        <div id="typing-output" style={{ whiteSpace: 'pre-wrap' }}>
          <ReactMarkdown>{typedContent}</ReactMarkdown>
          <div className="d-sm-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center mt-4">
              <p className="mb-0 text-muted">{dictionary.hero.sharing.title} </p>
              <button 
                type="button" 
                className="btn btn-dark btn-icon btn-sm ms-2"
                onClick={() => {
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
                className="btn btn-dark btn-icon btn-sm ms-2"
                onClick={() => {
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

            <button type="submit" className="btn btn-primary mt-4" data-bs-toggle="modal" data-bs-target="#exampleModal">
            {dictionary.hero.sharing.findLawyer}
              <span><i className="bi bi-arrow-right-short"></i></span>
            </button>
          </div>
        </div>
      </div>}
    </div>
  );
};

export default FileAnalysis;
