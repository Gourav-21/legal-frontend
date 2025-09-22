'use client';

import React, { useState } from 'react';
import remarkGfm from 'remark-gfm';
import ReactMarkdown from 'react-markdown';
import { useAnalysisStore } from '@/store/analysisStore';

interface QuestionModalProps {
    dictionary: Record<string, any>;
}

const QuestionModal: React.FC<QuestionModalProps> = ({ dictionary }) => {
    const { legalAnalysis } = useAnalysisStore();
    const [question, setQuestion] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [answer, setAnswer] = useState('');
    const [error, setError] = useState('');

    const handleSubmitQuestion = async () => {
        if (!question.trim()) return;

        if (!legalAnalysis) {
            setError(dictionary.questionModal.noAnalysisError);
            return;
        }

        setIsLoading(true);
        setError('');
        setAnswer('');

        console.log(legalAnalysis);
        try {
            const response = await fetch('/api/question', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    question: question,
                    report: legalAnalysis,
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Question processing failed');
            }

            const result = await response.json();
            setAnswer(result.answer);
        } catch (error: unknown) {
            console.error('Question processing error:', error);
            const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setQuestion('');
        setAnswer('');
        setError('');
    };

    return (
        <div className="modal fade" id="questionModal" tabIndex={-1} aria-labelledby="questionModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="questionModalLabel">
                            <i className="bi bi-question-circle me-2"></i>
                            {dictionary.questionModal.title}
                        </h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleReset}></button>
                    </div>
                    <div className="modal-body">
                        {/* Question Input and Submit Button Side by Side, Same Height, No Clear Button */}
                        <div className="mb-3">
                            <label htmlFor="questionInput" className="form-label">
                                {dictionary.questionModal.title}
                            </label>
                            <div className="d-flex align-items-stretch gap-2">
                                <textarea
                                    id="questionInput"
                                    className="form-control"
                                    rows={3}
                                    style={{ resize: 'vertical', flex: 1, height: '48px', minHeight: '48px', maxHeight: '120px' }}
                                    placeholder={dictionary.questionModal.placeholder}
                                    value={question}
                                    onChange={(e) => setQuestion(e.target.value)}
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    className="btn btn-primary d-flex align-items-center justify-content-center"
                                    style={{ height: '48px', minWidth: '120px' }}
                                    onClick={handleSubmitQuestion}
                                    disabled={isLoading || !question.trim()}
                                >
                                    {isLoading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            {dictionary.questionModal.loading}
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-send me-2"></i>
                                            {dictionary.questionModal.submitButton}
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Error Display */}
                        {error && (
                            <div className="alert alert-danger" role="alert">
                                <i className="bi bi-exclamation-triangle me-2"></i>
                                {error}
                            </div>
                        )}

                        {/* Answer Display */}
                        {answer && (
                            <div className="mt-3">
                                <h6 className="fw-bold">Answer:</h6>
                                <div className="border rounded p-3 bg-light">
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        components={{
                                            table: ({ ...props }) => (
                                                <table className="markdown-table" {...props} />
                                            )
                                        }}
                                    >
                                        {answer}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={handleReset}>
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuestionModal;