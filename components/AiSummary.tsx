'use client'
import React, { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown';
import { useAnalysisStore } from '@/store/analysisStore'; 

export default function AiSummaryModal() {
  const { legalAnalysis } = useAnalysisStore(); 
  const [summaryContent, setSummaryContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      if (legalAnalysis) {
        setIsLoading(true);
        setError(null);
        setSummaryContent(null);
        try {
          const response = await fetch('/api/summarise_analysis', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ai_content: legalAnalysis }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Failed to fetch summary');
          }

          const result = await response.json();
          console.log("Summary result:", result);
          setSummaryContent(result.summary);
        } catch (err: any) {
          setError(err.message);
          console.error("Error fetching summary:", err);
        } finally {
          setIsLoading(false);
        }
      }
    };

    const modalElement = document.getElementById('summaryModal');
    if (modalElement && modalElement.classList.contains('show')) {
      fetchSummary();
    } else if (modalElement) {
      const observer = new MutationObserver((mutationsList, observerInstance) => {
        for(let mutation of mutationsList) {
          if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
            const targetElement = mutation.target as HTMLElement;
            if (targetElement.classList.contains('show')) {
              fetchSummary();
            } else {
              setSummaryContent(null);
              setError(null);
            }
          }
        }
      });
      observer.observe(modalElement, { attributes: true });
      return () => observer.disconnect();
    }
  }, [legalAnalysis]);

  return (
    <div>
      <div className="modal fade" id="summaryModal" tabIndex={-1} aria-labelledby="summaryModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="summaryModalLabel">
                {'Summary'}
              </h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"><i className="bi bi-x"></i></button>
            </div>
            <div className="modal-body">
              {isLoading && <p>Loading summary...</p>}
              {error && <p>Error: {error}</p>}
              {summaryContent && !isLoading && !error && (
                <ReactMarkdown>{summaryContent}</ReactMarkdown>
              )}
              {!summaryContent && !isLoading && !error && legalAnalysis && (
                <p>Could not load summary, but the full analysis is available.</p>
              )}
              {!legalAnalysis && !isLoading && <p>No analysis available to summarize.</p>}
            </div>
            <div className="modal-footer">
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
