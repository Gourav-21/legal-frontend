'use client';

import { useState } from 'react';
import DataCollectionPanel from '../../../components/TestSection';
import LaborLawHelp from '../../../components/LaborLawHelp';

interface Rule {
  rule_id: string;
  name: string;
  law_reference: string;
  description: string;
  effective_from: string;
  effective_to?: string;
  checks: {
    condition: string;
    amount_owed: string;
    violation_message: string;
  }[];
  penalty: string[];
  created_date?: string;
  updated_date?: string;
}

interface RuleFormProps {
  showRuleForm: boolean;
  isEditing: boolean;
  editingRule: Rule | null;
  ruleFormData: {
    name: string;
    law_reference: string;
    description: string;
    effective_from: string;
    effective_to?: string;
  };
  formErrors: Record<string, string>;
  ruleChecks: {condition: string; amount_owed: string; violation_message: string}[];
  checkEditor: {condition: string; amount_owed: string; violation_message: string};
  dynamicParams: any;
  dynamicFormData: any;
  includePayslip: boolean;
  includeContract: boolean;
  includeAttendance: boolean;
  testResults: any;
  isTesting: boolean;
  onCancelForm: () => void;
  onFormDataChange: (data: Partial<RuleFormProps['ruleFormData']>) => void;
  onFormSubmit: (e: React.FormEvent) => void;
  onAddCheck: () => void;
  onUpdateCheck: (index: number, updatedCheck: {condition: string; amount_owed: string; violation_message: string}) => void;
  onUpdateCheckEditor: (field: keyof RuleFormProps['checkEditor'], value: string) => void;
  onRemoveCheck: (index: number) => void;
  onGenerateAIChecks?: () => Promise<{condition: string; amount_owed: string; violation_message: string}[] | null>;
  onTestRuleInForm: () => void;
  onDynamicInputChange: (section: 'payslip' | 'attendance' | 'contract', param: string, value: any) => void;
  onIncludePayslipChange: (checked: boolean) => void;
  onIncludeContractChange: (checked: boolean) => void;
  onIncludeAttendanceChange: (checked: boolean) => void;
  onLoadSampleData: () => void;
  onSetActiveTab: (tab: string) => void;
  dictionary: Record<string, any>;
  lang: string;
}

export default function RuleForm({
  showRuleForm,
  isEditing,
  editingRule,
  ruleFormData,
  formErrors,
  ruleChecks,
  checkEditor,
  dynamicParams,
  dynamicFormData,
  includePayslip,
  includeContract,
  includeAttendance,
  testResults,
  isTesting,
  onCancelForm,
  onFormDataChange,
  onFormSubmit,
  onAddCheck,
  onUpdateCheck,
  onUpdateCheckEditor,
  onRemoveCheck,
  onTestRuleInForm,
  onDynamicInputChange,
  onIncludePayslipChange,
  onIncludeContractChange,
  onIncludeAttendanceChange,
  onLoadSampleData,
  onSetActiveTab,
  onGenerateAIChecks,
  dictionary,
  lang
}: RuleFormProps) {
  // Track which check is being edited
  const [editingCheckIndex, setEditingCheckIndex] = useState<number | null>(null);

  // Handler to populate check editor with selected check
  const onEditCheck = (index: number) => {
    setEditingCheckIndex(index);
    const check = ruleChecks[index];
    onUpdateCheckEditor('condition', check.condition);
    onUpdateCheckEditor('amount_owed', check.amount_owed);
    onUpdateCheckEditor('violation_message', check.violation_message);
  };

  // Add or update check logic
  const handleAddOrUpdateCheck = () => {
    if (
      checkEditor.condition.trim() === '' &&
      checkEditor.amount_owed.trim() === '' &&
      checkEditor.violation_message.trim() === ''
    ) return;

    if (editingCheckIndex !== null && typeof onUpdateCheck === 'function') {
      // Update existing check using parent handler
      onUpdateCheck(editingCheckIndex, { ...checkEditor });
      setEditingCheckIndex(null);
      onUpdateCheckEditor('condition', '');
      onUpdateCheckEditor('amount_owed', '');
      onUpdateCheckEditor('violation_message', '');
    } else if (typeof onAddCheck === 'function') {
      // Add new check
      onAddCheck();
      onUpdateCheckEditor('condition', '');
      onUpdateCheckEditor('amount_owed', '');
      onUpdateCheckEditor('violation_message', '');
    }
  };
  // Local state for form testing
  const [inputMethod, setInputMethod] = useState<'manual' | 'json' | 'sample'>('manual');
  const [uploadedJson, setUploadedJson] = useState<string>('');
  const [isTestSectionExpanded, setIsTestSectionExpanded] = useState<boolean>(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState<boolean>(false);

  // Handle JSON upload
  const handleJsonUpload = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const jsonText = event.target.value;
    setUploadedJson(jsonText);
    try {
      const parsedData = JSON.parse(jsonText);
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
  };

  if (!showRuleForm) return null;

  return (
    <div className="rule-form-modal">
      <div className="card" style={{ backgroundColor: '#EFEADC', border: 'none', borderRadius: '15px' }}>
        <div className="card-header d-flex justify-content-between align-items-center" style={{ backgroundColor: '#0C756F', color: 'white', border: 'none', borderRadius: '15px 15px 0 0' }}>
          <h5 className="mb-0 d-flex align-items-center" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {isEditing ? `${dictionary.admin.ruleForm.editTitle}: ${editingRule?.rule_id}` : dictionary.admin.ruleForm.createTitle}
          </h5>
          <button
            className="btn btn-sm"
            style={{ backgroundColor: 'transparent', color: 'white', border: '1px solid white', borderRadius: '8px', fontFamily: "'Space Grotesk', sans-serif", padding: '0.5rem 1rem' }}
            onClick={onCancelForm}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <i className="bi bi-x-circle me-1"></i> {dictionary.admin.ruleForm.cancel}
          </button>
        </div>
        <div className="card-body" style={{ padding: '2rem' }}>
          <form onSubmit={onFormSubmit}>
            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="ruleName" className="form-label" style={{ fontFamily: "'Space Grotesk', sans-serif", color: 'rgba(15, 15, 20, 0.7)' }}>
                    <i className="bi bi-tag me-1"></i>{dictionary.admin.ruleForm.ruleName}*
                  </label>
                  <input
                    type="text"
                    className={`form-control ${formErrors.name ? 'is-invalid' : ''}`}
                    id="ruleName"
                    value={ruleFormData.name}
                    onChange={(e) => onFormDataChange({ name: e.target.value })}
                    placeholder={dictionary.admin.ruleForm.ruleNamePlaceholder}
                    style={{ borderRadius: '8px', border: '1px solid #0C756F', fontFamily: "'Manrope', sans-serif" }}
                  />
                  {formErrors.name && (
                    <div className="invalid-feedback d-flex align-items-center" style={{ 
                      fontSize: '0.875rem', 
                      marginTop: '0.25rem',
                      display: 'block !important',
                      color: '#dc3545',
                      fontWeight: '500'
                    }}>
                      <i className="bi bi-exclamation-circle me-1"></i>
                      {formErrors.name}
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="lawReference" className="form-label" style={{ fontFamily: "'Space Grotesk', sans-serif", color: 'rgba(15, 15, 20, 0.7)' }}>
                    <i className="bi bi-book me-1"></i>{dictionary.admin.ruleForm.lawReference}*
                  </label>
                  <input
                    type="text"
                    className={`form-control ${formErrors.law_reference ? 'is-invalid' : ''}`}
                    id="lawReference"
                    value={ruleFormData.law_reference}
                    onChange={(e) => onFormDataChange({ law_reference: e.target.value })}
                    placeholder={dictionary.admin.ruleForm.lawReferencePlaceholder}
                    style={{ borderRadius: '8px', border: '1px solid #0C756F', fontFamily: "'Manrope', sans-serif" }}
                  />
                  {formErrors.law_reference && (
                    <div className="invalid-feedback d-flex align-items-center" style={{ 
                      fontSize: '0.875rem', 
                      marginTop: '0.25rem',
                      display: 'block !important',
                      color: '#dc3545',
                      fontWeight: '500'
                    }}>
                      <i className="bi bi-exclamation-circle me-1"></i>
                      {formErrors.law_reference}
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="description" className="form-label" style={{ fontFamily: "'Space Grotesk', sans-serif", color: 'rgba(15, 15, 20, 0.7)' }}>
                    <i className="bi bi-file-text me-1"></i>{dictionary.admin.ruleForm.description}*
                  </label>
                  <textarea
                    className={`form-control ${formErrors.description ? 'is-invalid' : ''}`}
                    id="description"
                    rows={3}
                    value={ruleFormData.description}
                    onChange={(e) => onFormDataChange({ description: e.target.value })}
                    placeholder={dictionary.admin.ruleForm.descriptionPlaceholder}
                    style={{ borderRadius: '8px', border: '1px solid #0C756F', fontFamily: "'Manrope', sans-serif" }}
                  />
                  {formErrors.description && (
                    <div className="invalid-feedback d-flex align-items-center" style={{ 
                      fontSize: '0.875rem', 
                      marginTop: '0.25rem',
                      display: 'block !important',
                      color: '#dc3545',
                      fontWeight: '500'
                    }}>
                      <i className="bi bi-exclamation-circle me-1"></i>
                      {formErrors.description}
                    </div>
                  )}
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="effectiveFrom" className="form-label" style={{ fontFamily: "'Space Grotesk', sans-serif", color: 'rgba(15, 15, 20, 0.7)' }}>{dictionary.admin.ruleForm.effectiveFrom}*</label>
                    <input
                      type="date"
                      className={`form-control ${formErrors.effective_from ? 'is-invalid' : ''}`}
                      id="effectiveFrom"
                      value={ruleFormData.effective_from}
                      onChange={(e) => onFormDataChange({ effective_from: e.target.value })}
                      style={{ borderRadius: '8px', border: '1px solid #0C756F', fontFamily: "'Manrope', sans-serif" }}
                    />
                    {formErrors.effective_from && (
                    <div className="invalid-feedback d-flex align-items-center" style={{ 
                      fontSize: '0.875rem', 
                      marginTop: '0.25rem',
                      display: 'block !important',
                      color: '#dc3545',
                      fontWeight: '500'
                    }}>
                      <i className="bi bi-exclamation-circle me-1"></i>
                      {formErrors.effective_from}
                    </div>
                  )}
                  </div>

                  <div className="col-md-6 mb-3">
                    <label htmlFor="effectiveTo" className="form-label" style={{ fontFamily: "'Space Grotesk', sans-serif", color: 'rgba(15, 15, 20, 0.7)' }}>{dictionary.admin.ruleForm.effectiveTo}</label>
                    <input
                      type="date"
                      className={`form-control ${formErrors.effective_to ? 'is-invalid' : ''}`}
                      id="effectiveTo"
                      value={ruleFormData.effective_to || ''}
                      onChange={(e) => onFormDataChange({ effective_to: e.target.value || undefined })}
                      placeholder={dictionary.admin.ruleForm.effectiveToPlaceholder}
                      style={{ borderRadius: '8px', border: '1px solid #0C756F', fontFamily: "'Manrope', sans-serif" }}
                    />
                    {formErrors.effective_to && (
                    <div className="invalid-feedback d-flex align-items-center" style={{ 
                      fontSize: '0.875rem', 
                      marginTop: '0.25rem',
                      display: 'block !important',
                      color: '#dc3545',
                      fontWeight: '500'
                    }}>
                      <i className="bi bi-exclamation-circle me-1"></i>
                      {formErrors.effective_to}
                    </div>
                  )}
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <label className="form-label mb-0" style={{ fontFamily: "'Space Grotesk', sans-serif", color: 'rgba(15, 15, 20, 0.7)' }}>{dictionary.admin.ruleForm.availableFunctions}</label>
                  </div>
                  <div className="small mb-2" style={{ color: 'rgba(15, 15, 20, 0.7)', fontFamily: "'Manrope', sans-serif" }}>
                    <code style={{ backgroundColor: 'rgba(12, 117, 111, 0.1)', padding: '2px 4px', borderRadius: '3px', color: '#0C756F' }}>min(), max(), abs(), round()</code>
                  </div>

                  {/* <div className="d-flex justify-content-between align-items-center mb-2">
                    <label className="form-label mb-0" style={{ fontFamily: "'Space Grotesk', sans-serif", color: 'rgba(15, 15, 20, 0.7)' }}>Available Variables:</label>
                  </div>
                  <div className="small" style={{ color: 'rgba(15, 15, 20, 0.7)', fontFamily: "'Manrope', sans-serif" }}>
                    <code style={{ backgroundColor: 'rgba(12, 117, 111, 0.1)', padding: '2px 4px', borderRadius: '3px', color: '#0C756F' }}>payslip.*, attendance.*, contract.*</code><br/>
                    <code style={{ backgroundColor: 'rgba(12, 117, 111, 0.1)', padding: '2px 4px', borderRadius: '3px', color: '#0C756F' }}>employee_id, month, hourly_rate, overtime_hours, total_hours, etc.</code>
                  </div> */}
                </div>

                {/* Dynamic Parameters Reference */}
                {dynamicParams && (
                  <div className="mb-3">
                    <h6 style={{ color: '#0C756F', fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.9rem', fontWeight: '600', marginBottom: '12px', letterSpacing: '0.3px' }}>
                      <i className="bi bi-database me-2"></i>All Dynamic Parameters
                    </h6>
                    <div className="card" style={{ backgroundColor: 'rgba(12, 117, 111, 0.05)', border: '1px solid rgba(12, 117, 111, 0.1)', borderRadius: '8px', maxHeight: '300px', overflowY: 'auto' }}>
                      <div className="card-body p-3">
                        {/* Payslip Parameters */}
                        {dynamicParams.payslip && dynamicParams.payslip.length > 0 && (
                          <div className="mb-3">
                            <div className="d-flex align-items-center mb-2">
                              <i className="bi bi-cash-stack me-2" style={{ color: '#0C756F', fontSize: '0.8rem' }}></i>
                              <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.8rem', fontWeight: '600', color: '#0C756F' }}>{dictionary.admin.ruleForm.payslipParameters}</span>
                            </div>
                            <div className="d-flex flex-wrap gap-1">
                              {dynamicParams.payslip.map((param: any) => (
                                <code key={`payslip-${param.param}`} style={{
                                  backgroundColor: 'rgba(12, 117, 111, 0.1)',
                                  color: '#0C756F',
                                  padding: '2px 6px',
                                  borderRadius: '4px',
                                  fontSize: '0.7rem',
                                  fontWeight: '500',
                                  border: '1px solid rgba(12, 117, 111, 0.2)'
                                }}>
                                  payslip.{param.param}
                                </code>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Attendance Parameters */}
                        {dynamicParams.attendance && dynamicParams.attendance.length > 0 && (
                          <div className="mb-3">
                            <div className="d-flex align-items-center mb-2">
                              <i className="bi bi-calendar-check me-2" style={{ color: '#0C756F', fontSize: '0.8rem' }}></i>
                              <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.8rem', fontWeight: '600', color: '#0C756F' }}>{dictionary.admin.ruleForm.attendanceParameters}</span>
                            </div>
                            <div className="d-flex flex-wrap gap-1">
                              {dynamicParams.attendance.map((param: any) => (
                                <code key={`attendance-${param.param}`} style={{
                                  backgroundColor: 'rgba(12, 117, 111, 0.1)',
                                  color: '#0C756F',
                                  padding: '2px 6px',
                                  borderRadius: '4px',
                                  fontSize: '0.7rem',
                                  fontWeight: '500',
                                  border: '1px solid rgba(12, 117, 111, 0.2)'
                                }}>
                                  attendance.{param.param}
                                </code>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Contract Parameters */}
                        {dynamicParams.contract && dynamicParams.contract.length > 0 && (
                          <div className="mb-3">
                            <div className="d-flex align-items-center mb-2">
                              <i className="bi bi-file-earmark-text me-2" style={{ color: '#0C756F', fontSize: '0.8rem' }}></i>
                              <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.8rem', fontWeight: '600', color: '#0C756F' }}>{dictionary.admin.ruleForm.contractParameters}</span>
                            </div>
                            <div className="d-flex flex-wrap gap-1">
                              {dynamicParams.contract.map((param: any) => (
                                <code key={`contract-${param.param}`} style={{
                                  backgroundColor: 'rgba(12, 117, 111, 0.1)',
                                  color: '#0C756F',
                                  padding: '2px 6px',
                                  borderRadius: '4px',
                                  fontSize: '0.7rem',
                                  fontWeight: '500',
                                  border: '1px solid rgba(12, 117, 111, 0.2)'
                                }}>
                                  contract.{param.param}
                                </code>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Test Expression Button */}
                <div className="mb-3">
                  <button
                    type="button"
                    className="btn"
                    style={{ backgroundColor: '#FDCF6F', color: '#0F0F14', border: 'none', borderRadius: '8px', fontFamily: "'Space Grotesk', sans-serif", transform: 'scale(1)', transition: 'all 0.2s' }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    onClick={() => onSetActiveTab('test')}
                  >
                    🧪 {dictionary.admin.ruleForm.testExpressionButton}
                  </button>
                </div>
              </div>
            </div>

            {/* Rule Checks Section */}
            <div className="mt-4">
              <h6 className="mb-3" style={{ color: '#0C756F', fontFamily: 'Space Grotesk, sans-serif', fontSize: '1rem', fontWeight: '600', letterSpacing: '0.5px' }}>
                <i className="bi bi-list-check me-2"></i>{dictionary.admin.ruleForm.ruleChecks}
              </h6>

              {/* Display checks validation error */}
              {formErrors.checks && (
                <div className="alert alert-danger d-flex align-items-center" style={{ 
                  fontSize: '0.875rem', 
                  marginBottom: '1rem', 
                  borderRadius: '8px',
                  display: 'block !important',
                  backgroundColor: '#f8d7da',
                  borderColor: '#f5c6cb',
                  color: '#721c24'
                }}>
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {formErrors.checks}
                </div>
              )}

              {/* Display current checks */}
              {ruleChecks.length > 0 && (
                <div className="mb-4">
                    <h6 style={{ color: '#0C756F', fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.9rem', fontWeight: '600', marginBottom: '16px', letterSpacing: '0.3px' }}>
                      {dictionary.admin.ruleForm.currentChecks} ({ruleChecks.length})
                    </h6>
                  {ruleChecks.map((check, index) => (
                    <div key={index} className="mb-3 p-3" style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid rgba(12, 117, 111, 0.1)', boxShadow: '0 4px 12px rgba(12, 117, 111, 0.08)' }}>
                      <div className="d-flex justify-content-between align-items-start ">
                        <div className="flex-grow-1">
                          <div className="d-flex align-items-center mb-2">
                            <span className="badge" style={{ backgroundColor: '#0C756F', color: 'white', borderRadius: '12px', padding: '4px 10px', fontSize: '0.75rem', fontWeight: '600', marginRight: '8px' }}>
                              {dictionary.admin.ruleForm.checkNumber} {index + 1}
                            </span>
                            <h6 className="mb-0" style={{ color: '#2d3748', fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.9rem', fontWeight: '600' }}>
                              {check.violation_message || dictionary.admin.ruleForm.noViolationMessage}
                            </h6>
                          </div>
                        </div>
                        <div className="d-flex gap-2">
                          <button
                            type="button"
                            className="btn btn-sm"
                            style={{
                              backgroundColor: '#e7f6f2',
                              color: '#0C756F',
                              border: '1px solid #0C756F',
                              borderRadius: '6px',
                              padding: '4px 8px',
                              fontSize: '0.75rem',
                              transition: 'all 0.2s ease',
                              fontWeight: '500'
                            }}
                            onClick={() => onEditCheck(index)}
                            title={dictionary.admin.ruleForm.editCheck || 'Edit'}
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm"
                            style={{
                              backgroundColor: '#fff5f5',
                              color: '#dc3545',
                              border: '1px solid rgba(220, 53, 69, 0.2)',
                              borderRadius: '6px',
                              padding: '4px 8px',
                              fontSize: '0.75rem',
                              transition: 'all 0.2s ease',
                              fontWeight: '500'
                            }}
                            onClick={() => onRemoveCheck(index)}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#ffeaea';
                              e.currentTarget.style.borderColor = '#dc3545';
                              e.currentTarget.style.transform = 'translateY(-1px)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = '#fff5f5';
                              e.currentTarget.style.borderColor = 'rgba(220, 53, 69, 0.2)';
                              e.currentTarget.style.transform = 'translateY(0)';
                            }}
                            title={dictionary.admin.ruleForm.removeCheck}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-6 mb-2">
                            <strong style={{ color: '#0C756F', fontSize: '0.8rem', fontWeight: '600' }}>{dictionary.admin.ruleForm.condition}</strong>
                          <code style={{
                            backgroundColor: '#f8f9fa',
                            color: '#0C756F',
                            padding: '6px 10px',
                            borderRadius: '6px',
                            fontSize: '0.8rem',
                            fontWeight: '500',
                            display: 'block',
                            border: '1px solid rgba(12, 117, 111, 0.1)',
                            wordBreak: 'break-all'
                          }}>
                            {check.condition || dictionary.admin.ruleForm.notSet}
                          </code>
                        </div>
                        <div className="col-md-6 mb-2">
                            <strong style={{ color: '#0C756F', fontSize: '0.8rem', fontWeight: '600' }}>{dictionary.admin.ruleForm.amountOwed}</strong>
                          <code style={{
                            backgroundColor: '#f8f9fa',
                            color: '#0C756F',
                            padding: '6px 10px',
                            borderRadius: '6px',
                            fontSize: '0.8rem',
                            fontWeight: '500',
                            display: 'block',
                            border: '1px solid rgba(12, 117, 111, 0.1)',
                            wordBreak: 'break-all'
                          }}>
                            {check.amount_owed || dictionary.admin.ruleForm.notSet}
                          </code>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add new check inputs */}
              <div className="card mb-3" style={{ backgroundColor: 'rgba(253, 207, 111, 0.1)', border: '2px solid #FDCF6F', borderRadius: '12px', boxShadow: '0 4px 12px rgba(253, 207, 111, 0.15)' }}>
                <div className="card-header d-flex justify-content-between align-items-center" style={{ backgroundColor: '#FDCF6F', color: '#0F0F14', borderRadius: '12px 12px 0 0', border: 'none' }}>
                  <h6 className="mb-0" style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.95rem', fontWeight: '600' }}>
                    <i className={`bi ${editingCheckIndex !== null ? 'bi-pencil-square' : isEditing ? 'bi-pencil' : 'bi-plus-circle'} me-2`}></i>
                    {editingCheckIndex !== null ? dictionary.admin.ruleForm.editingCheck : isEditing ? dictionary.admin.ruleForm.editingRule || 'Editing Rule' : dictionary.admin.ruleForm.addNewCheck}
                  </h6>
                  {editingCheckIndex !== null && (
                    <div className="d-flex gap-2">
                      <button
                        type="button"
                        className="btn btn-sm"
                        style={{ backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '600' }}
                        onClick={handleAddOrUpdateCheck}
                      >
                        <i className="bi bi-check-circle me-1"></i>{dictionary.admin.ruleForm.save || 'Save'}
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm"
                        style={{ backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '600' }}
                        onClick={() => {
                          setEditingCheckIndex(null);
                          onUpdateCheckEditor('condition', '');
                          onUpdateCheckEditor('amount_owed', '');
                          onUpdateCheckEditor('violation_message', '');
                        }}
                      >
                        <i className="bi bi-x-circle me-1"></i>{dictionary.admin.ruleForm.cancel || 'Cancel'}
                      </button>
                    </div>
                  )}
                </div>
                <div className="card-body" style={{ padding: '20px' }}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label" style={{ fontFamily: 'Space Grotesk, sans-serif', color: 'rgba(15, 15, 20, 0.7)', fontSize: '0.85rem', fontWeight: '600' }}>
                        <i className="bi bi-code-slash me-1"></i>{dictionary.admin.ruleForm.conditionLabel}*
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder={dictionary.admin.ruleForm.conditionPlaceholder}
                        value={checkEditor.condition}
                        onChange={(e) => onUpdateCheckEditor('condition', e.target.value)}
                        style={{ borderRadius: '8px', border: '1px solid #0C756F', fontFamily: 'Manrope, sans-serif', fontSize: '0.85rem' }}
                      />
                        <div className="form-text" style={{ fontSize: '0.75rem', color: 'rgba(15, 15, 20, 0.6)' }}>
                          {dictionary.admin.ruleForm.conditionHelp}
                        </div>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label" style={{ fontFamily: 'Space Grotesk, sans-serif', color: 'rgba(15, 15, 20, 0.7)', fontSize: '0.85rem', fontWeight: '600' }}>
                        <i className="bi bi-calculator me-1"></i>{dictionary.admin.ruleForm.amountOwedFormula}*
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder={dictionary.admin.ruleForm.amountOwedPlaceholder}
                        value={checkEditor.amount_owed}
                        onChange={(e) => onUpdateCheckEditor('amount_owed', e.target.value)}
                        style={{ borderRadius: '8px', border: '1px solid #0C756F', fontFamily: 'Manrope, sans-serif', fontSize: '0.85rem' }}
                      />
                        <div className="form-text" style={{ fontSize: '0.75rem', color: 'rgba(15, 15, 20, 0.6)' }}>
                          {dictionary.admin.ruleForm.amountOwedHelp}
                        </div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label" style={{ fontFamily: 'Space Grotesk, sans-serif', color: 'rgba(15, 15, 20, 0.7)', fontSize: '0.85rem', fontWeight: '600' }}>
                      <i className="bi bi-exclamation-triangle me-1"></i>{dictionary.admin.ruleForm.violationMessage}*
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder={dictionary.admin.ruleForm.violationMessagePlaceholder}
                      value={checkEditor.violation_message}
                      onChange={(e) => onUpdateCheckEditor('violation_message', e.target.value)}
                      style={{ borderRadius: '8px', border: '1px solid #0C756F', fontFamily: 'Manrope, sans-serif', fontSize: '0.85rem' }}
                    />
                    <div className="form-text" style={{ fontSize: '0.75rem', color: 'rgba(15, 15, 20, 0.6)' }}>
                      {dictionary.admin.ruleForm.violationMessageHelp}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="row">
                <div className="col-md-12">
                  <div className="d-flex gap-2 justify-content-between align-items-center">
                    <button
                      type="button"
                      className="btn"
                      style={{ 
                        backgroundColor: isTestSectionExpanded ? '#E6C84A' : '#FDCF6F', 
                        color: '#0F0F14', 
                        border: 'none', 
                        borderRadius: '8px', 
                        fontFamily: "'Space Grotesk', sans-serif", 
                        transform: 'scale(1)', 
                        transition: 'all 0.2s',
                        fontWeight: '600',
                        boxShadow: isTestSectionExpanded ? '0 2px 8px rgba(253, 207, 111, 0.3)' : 'none'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      onClick={() => setIsTestSectionExpanded(!isTestSectionExpanded)}
                    >
                      <i className="bi bi-flask me-1"></i> {dictionary.admin.ruleForm.testRule}
                      <i 
                        className={`bi ms-2 ${isTestSectionExpanded ? 'bi-chevron-up' : 'bi-chevron-down'}`} 
                        style={{ 
                          fontSize: '0.9rem',
                          transition: 'transform 0.3s ease-in-out',
                          transform: isTestSectionExpanded ? 'rotate(0deg)' : 'rotate(0deg)'
                        }}
                      ></i>
                    </button>
                    <div className="d-flex gap-2">
                      <button
                        type="button"
                        className="btn"
                        style={{ backgroundColor: '#6f42c1', color: 'white', border: 'none', borderRadius: '8px', fontFamily: "'Space Grotesk', sans-serif", transform: 'scale(1)', transition: 'all 0.2s' }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        onClick={async () => {
                          if (!onGenerateAIChecks) return;
                          try {
                            setIsGeneratingAI(true);
                            await onGenerateAIChecks();
                            // Parent will update ruleChecks; we don't need to do anything here
                          } catch (err) {
                            console.error('AI generation failed', err);
                          } finally {
                            setIsGeneratingAI(false);
                          }
                        }}
                        disabled={isGeneratingAI}
                      >
                        <i className="bi bi-robot me-1"></i> {isGeneratingAI ? dictionary.admin.ruleForm.generating : dictionary.admin.ruleForm.generateAiChecks}
                      </button>
                      <button
                        type="button"
                        className="btn"
                        style={{ backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '8px', fontFamily: "'Space Grotesk', sans-serif", transform: 'scale(1)', transition: 'all 0.2s' }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        onClick={handleAddOrUpdateCheck}
                      >
                        <i className="bi bi-plus-circle me-1"></i> {editingCheckIndex !== null ? dictionary.admin.ruleForm.saveCheck || 'Save Check' : dictionary.admin.ruleForm.addCheck}
                      </button>
                      <button
                        type="submit"
                        className="btn"
                        style={{ backgroundColor: '#0C756F', color: 'white', border: 'none', borderRadius: '8px', fontFamily: "'Space Grotesk', sans-serif", transform: 'scale(1)', transition: 'all 0.2s' }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      >
                        <i className="bi bi-check-circle me-1"></i> {isEditing ? dictionary.admin.ruleForm.update : dictionary.admin.ruleForm.create}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Validation Errors Display - Below form in separate row */}
            {Object.keys(formErrors).filter(([field, error]) => error && error.trim() !== '').length > 0 && (
              <div className="row mt-3">
                <div className="col-12">
                  <div className="alert alert-danger" style={{ borderRadius: '8px' }}>
                    <h6 className="mb-2">
                      <i className="bi bi-exclamation-triangle-fill me-2"></i>
                      Please fix the following errors:
                    </h6>
                    <ul className="mb-0">
                      {Object.entries(formErrors).filter(([field, error]) => error && error.trim() !== '').map(([field, error]) => (
                        <li key={field}>{error}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Test Section */}
            {isTestSectionExpanded && (
              <div className="mt-4" style={{
                transition: 'all 0.3s ease-in-out',
                opacity: 1,
                transform: 'translateY(0)'
              }}>
                <DataCollectionPanel
                  title={dictionary.admin.ruleForm.testRuleTitle}
                  icon="bi-flask"
                  headerColor="#FDCF6F"
                  borderColor="#FDCF6F"
                  showCloseButton={true}
                  onClose={() => setIsTestSectionExpanded(false)}

                  // Data collection props
                  inputMethod={inputMethod}
                  onInputMethodChange={(method) => {
                    setInputMethod(method);
                    if (method === 'sample') {
                      onLoadSampleData();
                    }
                  }}
                  onLoadSampleData={onLoadSampleData}

                  // JSON upload props
                  uploadedJson={uploadedJson}
                  onJsonChange={(json) => handleJsonUpload({ target: { value: json } } as any)}

                  // Manual entry props
                  dynamicParams={dynamicParams}
                  dynamicFormData={dynamicFormData}
                  onDynamicInputChange={(section: string, param: string, value: any) => onDynamicInputChange(section as 'payslip' | 'attendance' | 'contract', param, value)}
                  includePayslip={includePayslip}
                  includeContract={includeContract}
                  includeAttendance={includeAttendance}
                  onIncludePayslipChange={onIncludePayslipChange}
                  onIncludeContractChange={onIncludeContractChange}
                  onIncludeAttendanceChange={onIncludeAttendanceChange}

                  // Test execution props
                  onExecuteTest={onTestRuleInForm}
                  isTesting={isTesting}
                  testResults={testResults}
                  executeButtonText={dictionary.admin.testExpression.testRule}
                  showExecuteButton={true}
                  dictionary={dictionary}
                  lang={lang}
                />
              </div>
            )}

            {/* Help Section - At the very bottom */}
            <div className="mt-4">
              <LaborLawHelp dictionary={dictionary} />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}