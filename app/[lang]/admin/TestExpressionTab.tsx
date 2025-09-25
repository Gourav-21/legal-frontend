'use client';

import { useState } from 'react';
import InputMethodSelector from '../../../components/InputMethodSelector';
import JsonUploadForm from '../../../components/JsonUploadForm';
import ManualEntryForm from '../../../components/ManualEntryForm';

interface DynamicParam {
  param: string;
  label_en: string;
  label_he: string;
  description: string;
  type: string;
}

interface TestExpressionTabProps {
  expression: string;
  expressionType: 'condition' | 'calculation';
  expressionResult: any;
  isEvaluating: boolean;
  dynamicParams: {
    payslip: DynamicParam[];
    contract: DynamicParam[];
    attendance: DynamicParam[];
    employee?: DynamicParam[];
  };
  dynamicFormData: Record<string, any>;
  includePayslip: boolean;
  includeContract: boolean;
  includeAttendance: boolean;
  includeEmployee?: boolean;
  dictionary: Record<string, any>;
  lang: string;
  onExpressionChange: (expression: string) => void;
  onExpressionTypeChange: (type: 'condition' | 'calculation') => void;
  onEvaluateExpression: () => void;
  onDynamicInputChange: (section: 'payslip' | 'attendance' | 'contract' | 'employee', param: string, value: any) => void;
  onIncludePayslipChange: (checked: boolean) => void;
  onIncludeContractChange: (checked: boolean) => void;
  onIncludeEmployeeChange?: (checked: boolean) => void;
  onIncludeAttendanceChange: (checked: boolean) => void;
  onLoadSampleData: () => void;
}

export default function TestExpressionTab({
  expression,
  expressionType,
  expressionResult,
  isEvaluating,
  dynamicParams,
  dynamicFormData,
  includePayslip,
  includeContract,
  includeAttendance,
  dictionary,
  lang,
  onExpressionChange,
  onExpressionTypeChange,
  onEvaluateExpression,
  onDynamicInputChange,
  onIncludePayslipChange,
  onIncludeContractChange,
  includeEmployee,
  onIncludeEmployeeChange,
  onIncludeAttendanceChange,
  onLoadSampleData
}: TestExpressionTabProps) {
  // Local state for input method
  const [inputMethod, setInputMethod] = useState<'manual' | 'json' | 'sample'>('manual');
  const [uploadedJson, setUploadedJson] = useState<string>('');
  const [isTestDataCollapsed, setIsTestDataCollapsed] = useState<boolean>(true);

  return (
    <div className="tab-pane fade show active">
      <div className="row">
        {/* Expression Tester Section */}
        <div className="col-lg-12">
          <div className="card mb-4" style={{ backgroundColor: '#EFEADC', border: 'none', borderRadius: '15px' }}>
            <div className="card-header" style={{ backgroundColor: '#0C756F', color: 'white', border: 'none', borderRadius: '15px 15px 0 0' }}>
              <h5 className="mb-0" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {dictionary.admin.testExpression.quickExpressionTester}
              </h5>
            </div>
            <div className="card-body">
              {/* Expression Type Selector */}
              <div className="mb-3">
                <label className="form-label fw-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: 'rgba(15, 15, 20, 0.7)' }}>{dictionary.admin.testExpression.expressionType}</label>
                <div className="d-flex" style={{ border: '1px solid #0C756F', borderRadius: '12px', overflow: 'hidden' }}>
                  <input
                    type="radio"
                    className="btn-check"
                    id="condition-type"
                    checked={expressionType === 'condition'}
                    onChange={() => onExpressionTypeChange('condition')}
                  />
                  <label className="btn flex-fill" htmlFor="condition-type" style={{
                    backgroundColor: expressionType === 'condition' ? '#0C756F' : 'transparent',
                    color: expressionType === 'condition' ? 'white' : '#0C756F',
                    border: 'none',
                    borderRadius: '0',
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: '500',
                    padding: '12px 20px',
                    transition: 'all 0.2s ease',
                    position: 'relative'
                  }}>
                    <i className="bi bi-check-circle me-2"></i>{dictionary.admin.testExpression.condition}
                  </label>
                  <input
                    type="radio"
                    className="btn-check"
                    id="calculation-type"
                    checked={expressionType === 'calculation'}
                    onChange={() => onExpressionTypeChange('calculation')}
                  />
                  <label className="btn flex-fill" htmlFor="calculation-type" style={{
                    backgroundColor: expressionType === 'calculation' ? '#0C756F' : 'transparent',
                    color: expressionType === 'calculation' ? 'white' : '#0C756F',
                    border: 'none',
                    borderRadius: '0',
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: '500',
                    padding: '12px 20px',
                    transition: 'all 0.2s ease',
                    position: 'relative'
                  }}>
                    <i className="bi bi-calculator me-2"></i>{dictionary.admin.testExpression.calculation}
                  </label>
                </div>
              </div>

              {/* Expression Input */}
              <div className="mb-3">
                <label htmlFor="expression" className="form-label fw-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: 'rgba(15, 15, 20, 0.7)' }}>
                  {expressionType === 'condition' ? dictionary.admin.testExpression.conditionExpression : dictionary.admin.testExpression.calculationExpression}
                </label>
                <textarea
                  className="form-control"
                  id="expression"
                  rows={4}
                  style={{ borderRadius: '12px', border: '1px solid #0C756F', fontFamily: "'Manrope', sans-serif" }}
                  value={expression}
                  onChange={(e) => onExpressionChange(e.target.value)}
                  placeholder={
                    expressionType === 'condition'
                      ? dictionary.admin.testExpression.conditionExample
                      : dictionary.admin.testExpression.calculationExample
                  }
                />
                <div className="form-text">
                  <small style={{ color: 'rgba(15, 15, 20, 0.6)', fontFamily: "'Manrope', sans-serif" }}>
                    {dictionary.admin.testExpression.useVariablesLike} <code style={{ color: '#0C756F', backgroundColor: 'rgba(12, 117, 111, 0.1)', padding: '2px 4px', borderRadius: '3px' }}>payslip.*</code>, <code style={{ color: '#0C756F', backgroundColor: 'rgba(12, 117, 111, 0.1)', padding: '2px 4px', borderRadius: '3px' }}>attendance.*</code>, <code style={{ color: '#0C756F', backgroundColor: 'rgba(12, 117, 111, 0.1)', padding: '2px 4px', borderRadius: '3px' }}>contract.*</code>, <code style={{ color: '#0C756F', backgroundColor: 'rgba(12, 117, 111, 0.1)', padding: '2px 4px', borderRadius: '3px' }}>employee.*</code>
                  </small>
                </div>
              </div>

              {/* Quick Examples */}
              <div className="mb-3">
                <div className="card" style={{ backgroundColor: 'rgba(253, 207, 111, 0.1)', border: '1px solid #FDCF6F', borderRadius: '12px' }}>
                  <div className="card-body py-2">
                    <div className="d-flex justify-content-between align-items-center">
                      <small className="text-muted" style={{ fontFamily: "'Manrope', sans-serif", color: 'rgba(15, 15, 20, 0.7)' }}>
                        <i className="bi bi-lightbulb me-1"></i>
                        <strong>{dictionary.admin.testExpression.quickExamples}</strong> {expressionType === 'condition' ? 'attendance.overtime_hours > 0' : '(contract.hourly_rate * 1.25 - payslip.overtime_rate) * min(attendance.overtime_hours, 2)'}
                      </small>
                      <button
                        className="btn btn-sm"
                        style={{ backgroundColor: '#0C756F', color: 'white', border: 'none', borderRadius: '8px', fontSize: '0.75rem', padding: '2px 8px' }}
                        onClick={() => {
                          const example = expressionType === 'condition'
                            ? 'attendance.overtime_hours > 0'
                            : '(contract.hourly_rate * 1.25 - payslip.overtime_rate) * min(attendance.overtime_hours, 2)';
                          onExpressionChange(example);
                        }}
                      >
                        {dictionary.admin.testExpression.useExample}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="d-flex gap-2 mb-3">
                <button
                  type="button"
                  className="btn flex-fill"
                  style={{ backgroundColor: '#0C756F', color: 'white', border: 'none', borderRadius: '12px', fontFamily: "'Space Grotesk', sans-serif", transform: 'scale(1)', transition: 'transform 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  onClick={onEvaluateExpression}
                  disabled={isEvaluating || !expression.trim()}
                >
                  {isEvaluating ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" style={{ color: 'white' }}></span>
                      {dictionary.admin.testExpression.evaluating}
                    </>
                  ) : (
                    <>
                      <i className="bi bi-play-circle-fill me-2"></i>{dictionary.admin.testExpression.evaluateExpression}
                    </>
                  )}
                </button>
                <button
                  type="button"
                  className="btn"
                  style={{ backgroundColor: 'transparent', color: '#0C756F', border: '1px solid #0C756F', borderRadius: '12px', fontFamily: "'Space Grotesk', sans-serif", transform: 'scale(1)', transition: 'all 0.2s' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#0C756F';
                    e.currentTarget.style.color = 'white';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#0C756F';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                  onClick={() => {
                    onExpressionChange('');
                  }}
                >
                  <i className="bi bi-x-circle me-2"></i>{dictionary.admin.testExpression.clear}
                </button>
              </div>

              {/* Expression Result */}
              {expressionResult && (
                <div className="card border-0" style={{ backgroundColor: '#EFEADC', borderRadius: '12px' }}>
                  <div className="card-body p-3">
                    <h6 className="card-title mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif", color: '#0C756F' }}>
                      <i className="bi bi-graph-up me-2"></i>{dictionary.admin.testExpression.evaluationResult}
                    </h6>
                    {expressionResult.error ? (
                      <div className="alert mb-0" style={{ backgroundColor: '#FDCF6F', color: '#0F0F14', border: 'none', borderRadius: '8px' }}>
                        <i className="bi bi-exclamation-triangle-fill me-2"></i>
                        <strong>{dictionary.admin.testExpression.error}</strong> {expressionResult.error}
                      </div>
                    ) : (
                      <div className="alert mb-0" style={{ backgroundColor: '#0C756F', color: 'white', border: 'none', borderRadius: '8px' }}>
                        <i className="bi bi-check-circle-fill me-2"></i>
                        <strong>{dictionary.admin.testExpression.result}</strong>
                        <div className="mt-2">
                          <code className="fs-5 fw-bold" style={{ color: 'white' }}>
                            {typeof expressionResult.result === 'boolean'
                              ? expressionResult.result ? dictionary.admin.testExpression.true : dictionary.admin.testExpression.false
                              : expressionResult.result
                            }
                          </code>
                        </div>
                        {expressionResult.details && (
                          <div className="mt-2 small" style={{ color: 'rgba(255, 255, 255, 0.9)', fontFamily: "'Manrope', sans-serif" }}>
                            <strong style={{ color: 'white' }}>{dictionary.admin.testExpression.details}</strong>
                            <pre style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: '8px', borderRadius: '6px', marginTop: '4px', fontSize: '0.85em', color: 'white' }}>
                              {JSON.stringify(expressionResult.details, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Test Data Setup Section */}
        <div className="col-lg-12">
          <div className="card mb-4" style={{ backgroundColor: '#EFEADC', border: 'none', borderRadius: '15px' }}>
            <div className="card-header" style={{ backgroundColor: '#FDCF6F', color: '#0F0F14', border: 'none', borderRadius: '15px 15px 0 0', cursor: 'pointer' }} onClick={() => setIsTestDataCollapsed(!isTestDataCollapsed)}>
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {dictionary.admin.testExpression.testDataConfiguration}
                </h5>
                <button
                  type="button"
                  className="btn btn-sm"
                  style={{
                    backgroundColor: 'transparent',
                    color: '#0F0F14',
                    border: '1px solid #0F0F14',
                    borderRadius: '6px',
                    padding: '0.25rem 0.5rem',
                    transform: isTestDataCollapsed ? 'rotate(0deg)' : 'rotate(180deg)',
                    transition: 'transform 0.3s ease'
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsTestDataCollapsed(!isTestDataCollapsed);
                  }}
                >
                  <i className={`bi ${isTestDataCollapsed ? 'bi-chevron-down' : 'bi-chevron-up'}`}></i>
                </button>
              </div>
            </div>
            {!isTestDataCollapsed && (
              <div className="card-body" style={{
                maxHeight: isTestDataCollapsed ? '0' : '2000px',
                overflow: 'hidden',
                transition: 'max-height 0.3s ease-in-out'
              }}>
              {/* Input Method Selection */}
              <InputMethodSelector
                inputMethod={inputMethod}
                onInputMethodChange={setInputMethod}
                onLoadSampleData={onLoadSampleData}
                dictionary={dictionary}
              />

              {inputMethod === 'json' && (
                <JsonUploadForm
                  uploadedJson={uploadedJson}
                  onJsonChange={(json: string) => {
                    setUploadedJson(json);
                    try {
                      const parsedData = JSON.parse(json);
                      // Update parent form data
                      onDynamicInputChange('payslip', 'employee_id', parsedData.employee_id || 'TEST_001');
                      onDynamicInputChange('payslip', 'month', parsedData.month || '2024-07');
                      if (parsedData.payslip) {
                        Object.entries(parsedData.payslip).forEach(([key, value]) => {
                          onDynamicInputChange('payslip', key, value);
                        });
                      }
                      if (parsedData.attendance) {
                        Object.entries(parsedData.attendance).forEach(([key, value]) => {
                          onDynamicInputChange('attendance', key, value);
                        });
                      }
                      if (parsedData.contract) {
                        Object.entries(parsedData.contract).forEach(([key, value]) => {
                          onDynamicInputChange('contract', key, value);
                        });
                      }
                    } catch (err) {
                      console.error('Invalid JSON:', err);
                    }
                  }}
                />
              )}

              {inputMethod === 'manual' && dynamicParams && (
                <ManualEntryForm
                  dynamicParams={dynamicParams}
                  dynamicFormData={dynamicFormData}
                  onDynamicInputChange={(section: string, param: string, value: any) => onDynamicInputChange(section as "payslip" | "attendance" | "contract" | "employee", param, value)}
                  includePayslip={includePayslip}
                  includeContract={includeContract}
                  includeEmployee={includeEmployee}
                  includeAttendance={includeAttendance}
                  onIncludePayslipChange={onIncludePayslipChange}
                  onIncludeContractChange={onIncludeContractChange}
                  onIncludeEmployeeChange={onIncludeEmployeeChange}
                  onIncludeAttendanceChange={onIncludeAttendanceChange}
                  dictionary={dictionary}
                  lang={lang}
                />
              )}

              {inputMethod === 'sample' && (
                <div className="alert" style={{ backgroundColor: '#FDCF6F', color: '#0F0F14', border: 'none', borderRadius: '12px' }}>
                  <i className="bi bi-check-circle-fill me-2"></i>
                  <strong>{dictionary.admin.testExpression.sampleDataLoaded}</strong>
                </div>
              )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}