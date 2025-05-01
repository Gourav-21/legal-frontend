'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Locale } from "@/i18n-config";
import FileUpload from './FileUpload';
import ReactMarkdown from 'react-markdown';

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
  const [context, setContext] = useState<string>(''); // State for additional context input
  const router = useRouter();

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
    if (payslipFiles.length === 0 && contractFiles.length === 0) {
      alert('Please upload at least one payslip or contract file.'); // Or use a more sophisticated notification
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

    try {
      // Assuming your backend API is running on the same origin or configured for CORS
      // Adjust the URL '/api/process' if your backend is hosted elsewhere or has a different prefix
      const response = await fetch('http://127.0.0.1:8000/api/process', { // IMPORTANT: Adjust this URL if needed
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setProcessingResult(result);
      // Optionally, trigger the analysis display or show a success message
      // handleShowAnalysis(); // You might want to show analysis based on the API result

    } catch (error: any) {
      console.error('Error processing documents:', error);
      setProcessingError(error.message || 'An unexpected error occurred.');
      alert(`Error processing files: ${error.message || 'An unexpected error occurred.'}`); // Placeholder error message
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
    }, 5);
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
    setIsVisible(false)
    setIsProcessing(true);
    setProcessingError(null);
  
    try {
      const response = await fetch('http://127.0.0.1:8000/api/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payslip_text: processingResult?.payslip_text,
          contract_text: processingResult?.contract_text,
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
      alert(`Error creating report: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };  

  return (
    <div>
      {/* File Upload Section */}
      <div className="row">
        {/* Payslip Upload */}
        <div className="col-lg-6" data-aos="fade-up" data-aos-duration="1500">
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
        <div className="col-lg-6 mt-4 mt-lg-0" data-aos="fade-up" data-aos-duration="1500">
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
            disabled={isProcessing || (payslipFiles.length === 0 && contractFiles.length === 0)}
          >
            {processingResult != null ? 'Processed' : (
                <>
                {isProcessing ? 'Processing...' : (dictionary.hero.processButton || 'Process Documents')}
                </>
            )}
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
              onClick={() => handleCreateReport('report') }
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
            //   onClick={() => handleShowAnalysis()}
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
            >
              <div dangerouslySetInnerHTML={{ __html: dictionary.hero.actionButtons.documentHistory.replace(' ', '<br>') }} />
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
              disabled
            //   onClick={() => handleShowAnalysis()}
            >
              <div dangerouslySetInnerHTML={{ __html: dictionary.hero.actionButtons.prepareClaim.replace(' ', '<br>') }} />
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
              onClick={() => handleCreateReport('profitability') }
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
              onClick={() => handleCreateReport('warning_letter') }
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
              onClick={() => handleCreateReport('professional') }
            >
              <div dangerouslySetInnerHTML={{ __html: dictionary.hero.actionButtons.professionalOpinion.replace(' ', '<br>') }} />
              <span><i className="bi bi-arrow-right-short"></i></span>
            </button>
          </div>
        )}

        {/* Button 8 - Predicting success */}
        {dictionary.hero.actionButtons.predictSuccess && (
          <div className="col-6 col-md-3 mt-4" data-aos="fade-up" data-aos-duration="1500">
            <button
              type="button"
              className="btn btn-outline-dark thumbnail-btn show-btn"
              disabled
            //   onClick={() => handleShowAnalysis()}
            >
              <div dangerouslySetInnerHTML={{ __html: dictionary.hero.actionButtons.predictSuccess.replace(' ', '<br>') }} />
              <span><i className="bi bi-arrow-right-short"></i></span>
            </button>
          </div>
        )}

        {/* Button 9 - Let's mediate */}
        {dictionary.hero.actionButtons.mediate && (
          <div className="col-6 col-md-3 mt-4" data-aos="fade-up" data-aos-duration="1500">
            <button
              type="button"
              className="btn btn-outline-dark thumbnail-btn show-btn"
              disabled
            //   onClick={() => { /* TODO: Add specific handler */ handleShowAnalysis(); }}
            >
              <div dangerouslySetInnerHTML={{ __html: dictionary.hero.actionButtons.mediate.replace(' ', '<br>') }} />
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
              disabled
            //   onClick={() => { /* TODO: Add specific handler */ handleShowAnalysis(); }}
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
            //   onClick={() => { /* TODO: Add specific handler */ handleShowAnalysis(); }}
            >
              <div dangerouslySetInnerHTML={{ __html: dictionary.hero.actionButtons.identifySerialEmployer.replace(' ', '<br>') }} />
              <span><i className="bi bi-arrow-right-short"></i></span>
            </button>
          </div>
        )}

        {/* Button 12 - Refresh before testing */}
        {dictionary.hero.actionButtons.refreshBeforeTest && (
          <div className="col-6 col-md-3 mt-4" data-aos="fade-up" data-aos-duration="1500">
            <button
              type="button"
              className="btn btn-outline-dark thumbnail-btn show-btn"
              disabled
            //   onClick={() => { /* TODO: Add specific handler */ handleShowAnalysis(); }}
            >
              <div dangerouslySetInnerHTML={{ __html: dictionary.hero.actionButtons.refreshBeforeTest.replace(' ', '<br>') }} />
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
        <div id="analysis-content" style={{ display: 'none' }}>
          <br />
          <h3>Economic Feasibility Analysis Results</h3>
          <p>Great! I will proceed with the analysis as requested. <br />Let's begin by reviewing the relevant labor laws:</p>

          <h5 className="mt-4">Labor Laws Provided</h5>
          <ol className="text-sm">
            <li>Add a new labor law one</li>
            <li>Add a new labor law two</li>
          </ol>

          <h5 className="mt-4">Example Law:</h5>
          <p className="text-sm mb-2">Every employee is entitled to receive no less than the legal minimum wage for all hours worked—including during trial periods, training, or apprenticeships—even if the employee agreed to a lower rate.</p>
          <p className="text-sm mb-0">Failure to meet this requirement or to pay wages on time is considered a <span className="text-dark fw-700">criminal offense</span>.</p>

          <h5 className="mt-4">Updated Rate <span className="text-muted fw-400">Effective from April 1, 2025</span></h5>
          <ul className="text-sm">
            <li><span className="text-dark fw-700">Monthly Minimum Wage</span>: 6,247.67 NIS</li>
            <li><span className="text-dark fw-700">Hourly Minimum Wage</span>: 34.32 NIS <br /><span className="text-muted">Previously: 5,880.02 NIS / 32.30 NIS per hour</span></li>
          </ul>

          <div className="d-sm-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center mt-4">
              <p className="mb-0 text-muted">Send Reports via:</p>
              <button type="submit" className="btn btn-dark btn-icon btn-sm ms-2">
                <i className="bi bi-whatsapp"></i>
              </button>
              <button type="submit" className="btn btn-dark btn-icon btn-sm ms-2">
                <i className="bi bi-envelope"></i>
              </button>
            </div>

            <button type="submit" className="btn btn-primary mt-4" data-bs-toggle="modal" data-bs-target="#exampleModal">
              Find Your Lawyer
              <span><i className="bi bi-arrow-right-short"></i></span>
            </button>
          </div>
        </div>
       {/* <div id="typing-output" dangerouslySetInnerHTML={{ __html: typedContent }} style={{ whiteSpace: 'pre-wrap' }} /> */}
        <div id="typing-output" style={{ whiteSpace: 'pre-wrap' }}>
        <ReactMarkdown>{typedContent}</ReactMarkdown>
        </div>
      </div>}
    </div>
  );
};

export default FileAnalysis;
