import React from 'react';

interface CheckResult {
  check_id: string;
  condition_result: boolean;
  amount_owed: number;
  violation_message: string;
  missing_fields: string[];
  condition_error: string | null;
  amount_error: string | null;
}

interface TestResult {
  success: boolean;
  rule_id: string;
  rule_name: string;
  total_violations: number;
  total_amount_owed: number;
  check_results: CheckResult[];
  context_used?: any;
  error?: string;
}

interface TestResultsProps {
  testResults: TestResult;
  isLoading: boolean;
  dictionary: Record<string, any>;
  lang: string;
}

export default function TestResults({ testResults, isLoading, dictionary, lang }: TestResultsProps) {
  if (isLoading) {
    return (
      <div className="text-center py-4">
        <div className="spinner-border" role="status" style={{ color: '#0C756F' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2" style={{ fontFamily: "'Manrope', sans-serif", color: 'rgba(15, 15, 20, 0.7)' }}>
          {dictionary.admin.testResults.runningTests}
        </p>
      </div>
    );
  }

  if (!testResults) {
    return (
      <div className="text-center py-4">
        <i className="bi bi-info-circle" style={{ fontSize: '2rem', color: '#0C756F' }}></i>
        <p className="mt-2" style={{ fontFamily: "'Manrope', sans-serif", color: 'rgba(15, 15, 20, 0.7)' }}>
          {dictionary.admin.testResults.noTestResultsAvailable}
        </p>
      </div>
    );
  }

  if (testResults.error) {
    return (
      <div className="alert alert-danger" style={{ borderRadius: '12px', border: 'none' }}>
        <i className="bi bi-exclamation-triangle-fill me-2"></i>
        <strong>{dictionary.admin.testResults.testError}</strong> {testResults.error}
      </div>
    );
  }

  const getStatusIcon = (conditionResult: boolean, hasError: boolean) => {
    if (hasError) {
      return <i className="bi bi-x-circle-fill" style={{ color: '#dc3545' }}></i>;
    }
    return conditionResult ?
      <i className="bi bi-check-circle-fill" style={{ color: '#28a745' }}></i> :
      <i className="bi bi-dash-circle-fill" style={{ color: '#6c757d' }}></i>;
  };

  const getStatusBadge = (conditionResult: boolean, hasError: boolean) => {
    if (hasError) return "badge bg-danger me-2";
    return conditionResult ? "badge bg-success me-2" : "badge bg-secondary me-2";
  };

  const getStatusText = (conditionResult: boolean, hasError: boolean) => {
    if (hasError) return dictionary.admin.testResults.error;
    return conditionResult ? dictionary.admin.testResults.violation : dictionary.admin.testResults.noViolation;
  };

  return (
    <div className="test-results-container" dir={lang === 'he' ? 'rtl' : 'ltr'}>
      {/* Overall Test Summary */}
      <div className="mb-4 p-3" style={{
        backgroundColor: testResults.success ? 'rgba(40, 167, 69, 0.1)' : 'rgba(220, 53, 69, 0.1)',
        borderRadius: '12px',
        border: `2px solid ${testResults.success ? '#28a745' : '#dc3545'}`
      }}>
        <div className="d-flex align-items-center mb-2">
          <i className={`bi ${testResults.success ? 'bi-check-circle-fill' : 'bi-x-circle-fill'} me-2`} style={{ fontSize: '1.5rem', color: testResults.success ? '#28a745' : '#dc3545' }}></i>
          <h6 className="mb-0" style={{
            fontFamily: "'Space Grotesk', sans-serif",
            color: testResults.success ? '#28a745' : '#dc3545',
            fontSize: '1.1rem',
            fontWeight: '600'
          }}>
            Test Results: {testResults.rule_name || testResults.rule_id}
          </h6>
        </div>
        <div className="row text-center mt-3">
          <div className="col-6">
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#dc3545' }}>
              {testResults.total_violations}
            </div>
            <small style={{ fontFamily: "'Manrope', sans-serif", color: 'rgba(15, 15, 20, 0.7)' }}>
              {dictionary.admin.testResults.violationsFound}
            </small>
          </div>
          <div className="col-6">
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#0C756F' }}>
              ₪{testResults.total_amount_owed?.toFixed(2) || '0.00'}
            </div>
            <small style={{ fontFamily: "'Manrope', sans-serif", color: 'rgba(15, 15, 20, 0.7)' }}>
              {dictionary.admin.testResults.totalAmountOwed}
            </small>
          </div>
        </div>
      </div>

      {/* Individual Check Results */}
      <h6 className="mb-3" style={{
        fontFamily: "'Space Grotesk', sans-serif",
        color: '#0C756F',
        fontSize: '1.1rem',
        fontWeight: '600'
      }}>
        <i className="bi bi-list-check me-2"></i>
        {dictionary.admin.testResults.checkResults} ({testResults.check_results?.length || 0})
      </h6>

      <div className="row">
        {testResults.check_results?.map((check, index) => {
          const hasError = !!(check.condition_error || check.amount_error);
          return (
            <div key={check.check_id || index} className="col-12 mb-3">
              <div className="card border-0 shadow-sm" style={{
                borderRadius: '12px',
                backgroundColor: '#EFEADC',
                border: '1px solid rgba(12, 117, 111, 0.1)'
              }}>
                <div className="card-body p-3">
                  <div className="d-flex align-items-start">
                    <div className="me-3 mt-1">
                      {getStatusIcon(check.condition_result, hasError)}
                    </div>
                    <div className="flex-grow-1">
                      <div className="d-flex align-items-center mb-2">
                        <span className={getStatusBadge(check.condition_result, hasError)}>
                          {getStatusText(check.condition_result, hasError)}
                        </span>
                        <small className="text-muted ms-2" style={{ fontFamily: "'Manrope', sans-serif" }}>
                          {dictionary.admin.testResults.checkId} {check.check_id}
                        </small>
                      </div>

                      <div className="mb-2">
                        <strong style={{ color: '#0C756F', fontSize: '0.85rem' }}>{dictionary.admin.testResults.violationLabel}</strong>
                        <span style={{ color: '#2d3748', fontSize: '0.85rem', marginLeft: '8px' }}>
                          {check.violation_message}
                        </span>
                      </div>

                      <div className="mb-2">
                        <strong style={{ color: '#0C756F', fontSize: '0.85rem' }}>{dictionary.admin.testResults.amountOwedLabel}</strong>
                        <code style={{
                          backgroundColor: '#f8f9fa',
                          color: '#0C756F',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontSize: '0.8rem',
                          marginLeft: '8px'
                        }}>
                          ₪{check.amount_owed?.toFixed(2) || '0.00'}
                        </code>
                      </div>

                      {/* Error Details */}
                      {hasError && (
                        <div className="mt-3 p-2" style={{
                          backgroundColor: 'rgba(220, 53, 69, 0.1)',
                          borderRadius: '6px',
                          border: '1px solid rgba(220, 53, 69, 0.2)'
                        }}>
                          {check.condition_error && (
                            <div className="mb-1">
                              <strong style={{ color: '#dc3545', fontSize: '0.8rem' }}>{dictionary.admin.testResults.conditionError}</strong>
                              <span style={{ color: '#dc3545', fontSize: '0.8rem', marginLeft: '4px' }}>
                                {check.condition_error}
                              </span>
                            </div>
                          )}
                          {check.amount_error && (
                            <div>
                              <strong style={{ color: '#dc3545', fontSize: '0.8rem' }}>{dictionary.admin.testResults.amountError}</strong>
                              <span style={{ color: '#dc3545', fontSize: '0.8rem', marginLeft: '4px' }}>
                                {check.amount_error}
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Missing Fields */}
                      {check.missing_fields && check.missing_fields.length > 0 && (
                        <div className="mt-2">
                          <strong style={{ color: '#ffc107', fontSize: '0.8rem' }}>{dictionary.admin.testResults.missingFields}</strong>
                          <div className="mt-1">
                            {check.missing_fields.map((field, fieldIndex) => (
                              <code key={fieldIndex} style={{
                                backgroundColor: 'rgba(255, 193, 7, 0.1)',
                                color: '#856404',
                                padding: '1px 4px',
                                borderRadius: '3px',
                                fontSize: '0.75rem',
                                marginRight: '4px',
                                marginBottom: '2px',
                                display: 'inline-block'
                              }}>
                                {field}
                              </code>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Context Used */}
      {testResults.context_used && (
        <div className="mt-4">
          <details>
            <summary style={{
              cursor: 'pointer',
              fontFamily: "'Manrope', sans-serif",
              color: '#0C756F',
              fontSize: '0.9rem',
              fontWeight: '500'
            }}>
              <i className="bi bi-eye me-2"></i>{dictionary.admin.testResults.viewTestContextData}
            </summary>
            <pre className="mt-2 p-3" style={{
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              borderRadius: '6px',
              fontSize: '0.8rem',
              fontFamily: 'monospace',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              border: '1px solid rgba(12, 117, 111, 0.1)'
            }}>
              {JSON.stringify(testResults.context_used, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
}
