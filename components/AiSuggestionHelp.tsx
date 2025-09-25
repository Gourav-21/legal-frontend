'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface AiSuggestionHelpProps {
  dictionary?: Record<string, unknown>;
}

export default function AiSuggestionHelp({ dictionary }: AiSuggestionHelpProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [description, setDescription] = useState<string>('');
  const [aiResponse, setAiResponse] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Fallback values for when dictionary is not provided
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const t = (dictionary as any)?.aiSuggestionHelp || {};

  const handleGetSuggestion = async () => {
    if (!description.trim()) {
      setError('Please enter a description');
      return;
    }

    setIsLoading(true);
    setError('');
    setAiResponse('');

    try {
      const response = await fetch('/api/suggest-params-formulas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ law_description: description })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Failed to get AI suggestion' }));
        throw new Error(errorData.detail || 'Failed to get AI suggestion');
      }

      const suggestions = await response.json();
      console.log('AI suggestions:', suggestions.suggestions);

      // Display the AI suggestions
      setAiResponse(suggestions.suggestions);
    } catch (err) {
      console.error('AI suggestion error:', err);
      setError(err instanceof Error ? err.message : 'Failed to get AI suggestion');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <button
        type="button"
        className="btn w-100"
        style={{
          backgroundColor: isExpanded ? '#E6C84A' : '#FDCF6F',
          color: '#0F0F14',
          border: 'none',
          borderRadius: '8px',
          fontFamily: "'Space Grotesk', sans-serif",
          transform: 'scale(1)',
          transition: 'all 0.2s',
          fontWeight: '600',
          boxShadow: isExpanded ? '0 2px 8px rgba(253, 207, 111, 0.3)' : 'none'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        🤖 {t.title || "AI Suggestion and Explanation"}
        <i
          className={`bi ms-2 ${isExpanded ? 'bi-chevron-up' : 'bi-chevron-down'}`}
          style={{
            fontSize: '0.9rem',
            transition: 'transform 0.3s ease-in-out'
          }}
        ></i>
      </button>

      {isExpanded && (
        <div className="mt-3 p-4" style={{
          backgroundColor: 'rgba(12, 117, 111, 0.05)',
          border: '1px solid rgba(12, 117, 111, 0.1)',
          borderRadius: '12px',
          transition: 'all 0.3s ease-in-out'
        }}>
          <h5 style={{ color: '#0C756F', fontFamily: 'Space Grotesk, sans-serif', marginBottom: '20px' }}>
            <i className="bi bi-robot me-2"></i>{t.subtitle || "Get AI-powered suggestions for parameters and formulas"}
          </h5>

          <div className="mb-3">
            <label htmlFor="aiDescription" className="form-label" style={{ fontFamily: "'Space Grotesk', sans-serif", color: 'rgba(15, 15, 20, 0.7)' }}>
              <i className="bi bi-pencil me-1"></i>{t.descriptionLabel || "Describe your rule requirement"}
            </label>
            <textarea
              className="form-control"
              id="aiDescription"
              rows={8}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t.descriptionPlaceholder || "Describe the labor law requirement or rule you need parameters and formulas for..."}
              style={{ borderRadius: '8px', border: '1px solid #0C756F', fontFamily: "'Manrope', sans-serif" }}
            />
          </div>

          <div className="d-flex gap-2 mb-3">
            <button
              type="button"
              className="btn"
              style={{
                backgroundColor: '#0C756F',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: '600',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0A5F58'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0C756F'}
              onClick={handleGetSuggestion}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  {t.loading || "Getting AI Suggestion..."}
                </>
              ) : (
                <>
                  <i className="bi bi-lightbulb me-1"></i>
                  {t.getSuggestion || "Get AI Suggestion"}
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="alert alert-danger" style={{ borderRadius: '8px' }}>
              <i className="bi bi-exclamation-triangle me-2"></i>
              {error}
            </div>
          )}

          {aiResponse && (
            <div className="mt-3">
              <h6 style={{ color: '#0C756F', fontFamily: 'Space Grotesk, sans-serif', marginBottom: '12px' }}>
                <i className="bi bi-chat-quote me-2"></i>{t.aiResponse || "AI Response"}
              </h6>
              <div className="card" style={{
                backgroundColor: 'white',
                border: '2px solid #FDCF6F',
                borderRadius: '8px'
              }}>
                <div className="card-body">
                  <div style={{
                    fontFamily: "'Manrope', sans-serif",
                    color: '#2d3748',
                    fontSize: '0.9rem'
                  }}>
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        table: ({ ...props }) => (
                          <table className="markdown-table" {...props} />
                        )
                      }}
                    >
                      {aiResponse}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}