'use client';

import React, { useState } from 'react';
import RuleForm from './RuleForm';
import TestSection from '../../../components/TestSection';

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

interface ManageRulesTabProps {
  rules: Rule[];
  loading: boolean;
  error: string | null;
  selectedRule: Rule | null;
  showRuleForm: boolean;
  isEditing: boolean;
  editingRule: Rule | null;
  ruleFormData: {
    rule_id: string;
    name: string;
    law_reference: string;
    description: string;
    effective_from: string;
    effective_to: string;
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
  dictionary: any;
  lang: string;
  // Test-related props for individual rule testing
  testInputMethod: 'manual' | 'json' | 'sample';
  testUploadedJson: string;
  testDynamicFormData: any;
  testIncludePayslip: boolean;
  testIncludeContract: boolean;
  testIncludeAttendance: boolean;
  onRuleSelect: (rule: Rule | null) => void;
  onStartCreateRule: () => void;
  onStartEditRule: (rule: Rule) => void;
  onDeleteRule: (ruleId: string) => void;
  onTestRule: (rule: Rule) => void;
  onTestRuleInForm: () => void;
  onFormDataChange: (data: Partial<ManageRulesTabProps['ruleFormData']>) => void;
  onFormSubmit: (e: React.FormEvent) => void;
  onAddCheck: () => void;
  onUpdateCheck: (index: number, field: keyof ManageRulesTabProps['ruleChecks'][0], value: string) => void;
  onUpdateCheckEditor: (field: keyof ManageRulesTabProps['checkEditor'], value: string) => void;
  onRemoveCheck: (index: number) => void;
  onCancelForm: () => void;
  onDynamicInputChange: (section: 'payslip' | 'attendance' | 'contract', param: string, value: any) => void;
  onIncludePayslipChange: (checked: boolean) => void;
  onIncludeContractChange: (checked: boolean) => void;
  onIncludeAttendanceChange: (checked: boolean) => void;
  onLoadSampleData: () => void;
  onSetActiveTab: (tab: string) => void;
  onGenerateAIChecks?: () => Promise<{condition: string; amount_owed: string; violation_message: string}[] | null>;
  // Test-related handlers
  onTestInputMethodChange: (method: 'manual' | 'json' | 'sample') => void;
  onTestJsonChange: (json: string) => void;
  onTestDynamicInputChange: (section: string, param: string, value: any) => void;
  onTestIncludePayslipChange: (checked: boolean) => void;
  onTestIncludeContractChange: (checked: boolean) => void;
  onTestIncludeAttendanceChange: (checked: boolean) => void;
  onTestLoadSampleData: () => void;
  onExecuteRuleTest: (rule: Rule) => void;
  onClearTestResults?: () => void;
}

export default function ManageRulesTab({
  rules,
  loading,
  error,
  selectedRule,
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
  dictionary,
  lang,
  // Test-related props
  testInputMethod,
  testUploadedJson,
  testDynamicFormData,
  testIncludePayslip,
  testIncludeContract,
  testIncludeAttendance,
  onRuleSelect,
  onStartCreateRule,
  onStartEditRule,
  onDeleteRule,
  onTestRule,
  onTestRuleInForm,
  onFormDataChange,
  onFormSubmit,
  onAddCheck,
  onUpdateCheck,
  onUpdateCheckEditor,
  onRemoveCheck,
  onCancelForm,
  onDynamicInputChange,
  onIncludePayslipChange,
  onIncludeContractChange,
  onIncludeAttendanceChange,
  onLoadSampleData,
  onSetActiveTab,
  onGenerateAIChecks,
  // Test-related handlers
  onTestInputMethodChange,
  onTestJsonChange,
  onTestDynamicInputChange,
  onTestIncludePayslipChange,
  onTestIncludeContractChange,
  onTestIncludeAttendanceChange,
  onTestLoadSampleData,
  onExecuteRuleTest,
  onClearTestResults
}: ManageRulesTabProps) {
  // Local state for showing test section
  const [showTestSection, setShowTestSection] = useState(false);
  // Handle JSON upload
  const handleJsonUpload = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const jsonText = event.target.value;
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

  // Render the rules list
  const renderRulesList = () => {
    if (loading) {
      return (
        <div className="text-center py-5">
          <div className="d-flex flex-column align-items-center">
            <div className="spinner-border" style={{ color: '#0C756F', width: '3rem', height: '3rem' }} role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3" style={{ color: '#0C756F', fontFamily: 'Manrope, sans-serif', fontSize: '1rem', fontWeight: '500' }}>{dictionary.admin.rulesManagement.loading}</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="alert mx-3" style={{ backgroundColor: '#fef2f2', color: '#dc3545', border: '1px solid #fecaca', borderRadius: '12px', boxShadow: '0 4px 12px rgba(220, 53, 69, 0.1)' }} role="alert">
          <div className="d-flex align-items-center">
            <i className="bi bi-exclamation-triangle-fill fs-4 me-3"></i>
            <div>
              <h6 className="mb-1" style={{ color: '#dc3545', fontFamily: 'Space Grotesk, sans-serif', fontWeight: '600' }}>{dictionary.admin.rulesManagement.errors.failedToLoadRules}</h6>
              <p className="mb-0" style={{ fontSize: '0.9rem' }}>{error}</p>
            </div>
          </div>
        </div>
      );
    }

    if (rules.length === 0) {
      return (
        <div className="text-center py-5">
          <div className="d-flex flex-column align-items-center">
            <i className="bi bi-exclamation-circle fs-1 mb-3" style={{ color: '#0C756F' }}></i>
            <h5 style={{ color: '#2d3748', fontFamily: 'Space Grotesk, sans-serif', fontWeight: '600', marginBottom: '8px' }}>{dictionary.admin.rulesManagement.noLaborLawRulesFound}</h5>
            <p className="mb-0" style={{ color: '#718096', fontFamily: 'Manrope, sans-serif', fontSize: '0.95rem' }}>{dictionary.admin.rulesManagement.createUpdateDeleteRules}</p>
          </div>
        </div>
      );
    }

    return (
      <div className="table-responsive">
        <table className="table table-sm" style={{ backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(12, 117, 111, 0.08)', marginBottom: '0', border: '1px solid rgba(12, 117, 111, 0.1)' }}>
          <thead style={{ backgroundColor: '#0C756F', color: 'white' }}>
            <tr>
              <th style={{ fontFamily: "'Space Grotesk', sans-serif", border: 'none', padding: '12px 16px', fontSize: '0.9rem', fontWeight: '600', letterSpacing: '0.5px' }}>{dictionary.admin.rulesManagement.name}</th>
              <th style={{ fontFamily: "'Space Grotesk', sans-serif", border: 'none', padding: '12px 16px', fontSize: '0.9rem', fontWeight: '600', letterSpacing: '0.5px' }}>{dictionary.admin.rulesManagement.lawReference}</th>
              <th style={{ fontFamily: "'Space Grotesk', sans-serif", border: 'none', padding: '12px 16px', fontSize: '0.9rem', fontWeight: '600', letterSpacing: '0.5px' }}>{dictionary.admin.rulesManagement.effectivePeriod}</th>
              <th style={{ fontFamily: "'Space Grotesk', sans-serif", border: 'none', padding: '12px 16px', fontSize: '0.9rem', fontWeight: '600', letterSpacing: '0.5px' }}>{dictionary.admin.rulesManagement.checks}</th>
              <th className="text-center" style={{ fontFamily: "'Space Grotesk', sans-serif", border: 'none', padding: '12px 16px', fontSize: '0.9rem', fontWeight: '600', letterSpacing: '0.5px', width: '140px' }}>{dictionary.admin.rulesManagement.actions}</th>
            </tr>
          </thead>
          <tbody>
            {rules.map(rule => (
              <React.Fragment key={rule.rule_id}>
                <tr
                  onClick={() => {
                    const newSelectedRule = selectedRule && selectedRule.rule_id === rule.rule_id ? null : rule;
                    onRuleSelect(newSelectedRule);
                    // Always close test section when clicking on row (either collapsing or switching rules)
                    setShowTestSection(false);
                  }}
                  style={{
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    fontFamily: "'Manrope', sans-serif",
                    fontSize: '0.85rem',
                    borderBottom: '1px solid rgba(12, 117, 111, 0.08)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(12, 117, 111, 0.03)';
                    e.currentTarget.style.transform = 'translateX(2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  <td style={{ padding: '12px 16px', borderBottom: '1px solid rgba(12, 117, 111, 0.08)', verticalAlign: 'middle' }}>
                    <div className="d-flex align-items-center">
                      <i className={`bi bi-chevron-${selectedRule && selectedRule.rule_id === rule.rule_id ? 'down' : 'right'} me-3`} style={{ color: '#0C756F', fontSize: '0.9rem', transition: 'transform 0.3s ease' }}></i>
                      <span style={{ fontWeight: '500', color: '#2d3748' }}>{rule.name || 'Unnamed Rule'}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', borderBottom: '1px solid rgba(12, 117, 111, 0.08)', verticalAlign: 'middle', color: '#4a5568' }}>{rule.law_reference || dictionary.admin.rulesManagement.expandedRow.notAvailable}</td>
                  <td style={{ padding: '12px 16px', borderBottom: '1px solid rgba(12, 117, 111, 0.08)', verticalAlign: 'middle', fontSize: '0.8rem', color: '#718096' }}>
                    {rule.effective_from || dictionary.admin.rulesManagement.expandedRow.notAvailable} to {rule.effective_to || dictionary.admin.rulesManagement.expandedRow.ongoing}
                  </td>
                  <td style={{ padding: '12px 16px', borderBottom: '1px solid rgba(12, 117, 111, 0.08)', verticalAlign: 'middle' }}>
                    <span className="badge" style={{ backgroundColor: '#0C756F', color: 'white', borderRadius: '12px', padding: '4px 10px', fontSize: '0.75rem', fontWeight: '600' }}>
                      {rule.checks ? rule.checks.length : 0}
                    </span>
                  </td>
                  <td className="text-center" style={{ padding: '8px 12px', borderBottom: '1px solid rgba(12, 117, 111, 0.1)', verticalAlign: 'middle' }}>
                    <div className="btn-group btn-group-sm" role="group" style={{ boxShadow: '0 2px 4px rgba(12, 117, 111, 0.1)', borderRadius: '6px', overflow: 'hidden' }}>
                      <button
                        className="btn btn-sm"
                        style={{
                          backgroundColor: (selectedRule && selectedRule.rule_id === rule.rule_id && showTestSection) ? '#0A5F58' : '#0C756F',
                          color: 'white',
                          border: 'none',
                          padding: '6px 8px',
                          fontSize: '0.75rem',
                          borderRadius: '0',
                          transition: 'all 0.2s ease',
                          fontWeight: '500'
                        }}
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          // If clicking on a different rule, close the current test section and select new rule
                          if (!selectedRule || selectedRule.rule_id !== rule.rule_id) {
                            setShowTestSection(false); // Close any open test section first
                            onRuleSelect(rule);
                            // Use setTimeout to ensure the rule selection happens before showing test section
                            setTimeout(() => setShowTestSection(true), 50);
                          } else {
                            // If clicking on the same rule, toggle the test section
                            setShowTestSection(!showTestSection);
                          }
                        }}
                        disabled={isTesting}
                        title={selectedRule && selectedRule.rule_id === rule.rule_id && showTestSection ? "Test Section Active" : "Show Test Section"}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = (selectedRule && selectedRule.rule_id === rule.rule_id && showTestSection) ? '#084F47' : '#0A5F58';
                          e.currentTarget.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = (selectedRule && selectedRule.rule_id === rule.rule_id && showTestSection) ? '#0A5F58' : '#0C756F';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        <i className={`bi ${showTestSection && selectedRule && selectedRule.rule_id === rule.rule_id ? 'bi-play-circle-fill' : 'bi-play-circle'}`}></i>
                      </button>
                      <button
                        className="btn btn-sm"
                        style={{
                          backgroundColor: '#f8f9fa',
                          color: '#0C756F',
                          border: '1px solid rgba(12, 117, 111, 0.2)',
                          padding: '6px 8px',
                          fontSize: '0.75rem',
                          borderRadius: '0',
                          transition: 'all 0.2s ease',
                          fontWeight: '500'
                        }}
                        onClick={(e) => { e.stopPropagation(); onStartEditRule(rule); }}
                        title={dictionary.admin.rulesManagement.edit}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#e9ecef';
                          e.currentTarget.style.borderColor = '#0C756F';
                          e.currentTarget.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#f8f9fa';
                          e.currentTarget.style.borderColor = 'rgba(12, 117, 111, 0.2)';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button
                        className="btn btn-sm"
                        style={{
                          backgroundColor: '#fff5f5',
                          color: '#dc3545',
                          border: '1px solid rgba(220, 53, 69, 0.2)',
                          padding: '6px 8px',
                          fontSize: '0.75rem',
                          borderRadius: '0',
                          transition: 'all 0.2s ease',
                          fontWeight: '500'
                        }}
                        onClick={(e) => { e.stopPropagation(); onDeleteRule(rule.rule_id); }}
                        title={dictionary.admin.rulesManagement.delete}
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
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
                {selectedRule && selectedRule.rule_id === rule.rule_id && (
                  <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #0C756F' }}>
                    <td colSpan={5} style={{ padding: '0', borderBottom: '2px solid #0C756F' }}>
                      <div className="p-4" style={{ backgroundColor: '#EFEADC', borderRadius: '0 0 12px 12px', border: '1px solid rgba(12, 117, 111, 0.1)', borderTop: 'none' }}>
                        <div className="row">
                          <div className="col-md-6">
                            <h6 style={{ color: '#0C756F', fontFamily: 'Space Grotesk, sans-serif', fontSize: '1rem', fontWeight: '600', marginBottom: '16px', letterSpacing: '0.5px' }}>
                              <i className="bi bi-info-circle me-2" style={{ fontSize: '1.1rem' }}></i>{dictionary.admin.rulesManagement.expandedRow.basicInformation}
                            </h6>
                            <div className="mb-3" style={{ backgroundColor: '#f0f8ff', padding: '16px', borderRadius: '12px', border: '2px solid #0C756F', boxShadow: '0 4px 8px rgba(12, 117, 111, 0.15)' }}>
                              <div className="mb-2"><strong style={{ color: '#0C756F', fontSize: '0.85rem', fontWeight: '600' }}>{dictionary.admin.rulesManagement.expandedRow.id}</strong> <code style={{ fontSize: '0.8rem', backgroundColor: '#e6f7ff', color: '#2d3748', padding: '2px 6px', borderRadius: '4px' }}>{selectedRule.rule_id || dictionary.admin.rulesManagement.expandedRow.notAvailable}</code></div>
                              <div className="mb-2"><strong style={{ color: '#0C756F', fontSize: '0.85rem', fontWeight: '600' }}>{dictionary.admin.rulesManagement.expandedRow.name}</strong> <span style={{ color: '#2d3748', fontSize: '0.85rem' }}>{selectedRule.name || dictionary.admin.rulesManagement.expandedRow.unnamedRule}</span></div>
                              <div className="mb-2"><strong style={{ color: '#0C756F', fontSize: '0.85rem', fontWeight: '600' }}>{dictionary.admin.rulesManagement.expandedRow.lawReference}</strong> <span style={{ color: '#4a5568', fontSize: '0.85rem' }}>{selectedRule.law_reference || dictionary.admin.rulesManagement.expandedRow.notAvailable}</span></div>
                              <div className="mb-2"><strong style={{ color: '#0C756F', fontSize: '0.85rem', fontWeight: '600' }}>{dictionary.admin.rulesManagement.expandedRow.description}</strong> <span style={{ color: '#4a5568', fontSize: '0.85rem' }}>{selectedRule.description || dictionary.admin.rulesManagement.expandedRow.notAvailable}</span></div>
                              <div className="mb-0">
                                <strong style={{ color: '#0C756F', fontSize: '0.85rem', fontWeight: '600' }}>{dictionary.admin.rulesManagement.expandedRow.effectivePeriod}</strong> <span style={{ color: '#718096', fontSize: '0.85rem' }}>{selectedRule.effective_from || dictionary.admin.rulesManagement.expandedRow.notAvailable} to {selectedRule.effective_to || dictionary.admin.rulesManagement.expandedRow.ongoing}</span>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <h6 style={{ color: '#0C756F', fontFamily: 'Space Grotesk, sans-serif', fontSize: '1rem', fontWeight: '600', marginBottom: '16px', letterSpacing: '0.5px' }}>{dictionary.admin.rulesManagement.expandedRow.checksAndPenalties}</h6>
                            {selectedRule.checks && selectedRule.checks.length > 0 ? (
                              <div className="mb-3">
                                {selectedRule.checks.map((check, index) => (
                                  <div key={index} className="mb-3 p-3" style={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid rgba(12, 117, 111, 0.1)', boxShadow: '0 2px 4px rgba(12, 117, 111, 0.05)' }}>
                                    <div className="mb-2"><strong style={{ color: '#0C756F', fontSize: '0.8rem', fontWeight: '600' }}>{dictionary.admin.rulesManagement.expandedRow.violation}</strong> <span style={{ fontSize: '0.8rem', color: '#2d3748' }}>{check?.violation_message || dictionary.admin.rulesManagement.expandedRow.notAvailable}</span></div>
                                    <div className="mb-2"><strong style={{ color: '#0C756F', fontSize: '0.8rem', fontWeight: '600' }}>{dictionary.admin.rulesManagement.expandedRow.condition}</strong> <code style={{ backgroundColor: '#f8f9fa', color: '#0C756F', fontSize: '0.75rem', padding: '2px 6px', borderRadius: '4px', fontWeight: '500' }}>{check?.condition || dictionary.admin.rulesManagement.expandedRow.notAvailable}</code></div>
                                    <div><strong style={{ color: '#0C756F', fontSize: '0.8rem', fontWeight: '600' }}>{dictionary.admin.rulesManagement.expandedRow.amountOwed}</strong> <code style={{ backgroundColor: '#f8f9fa', color: '#0C756F', fontSize: '0.75rem', padding: '2px 6px', borderRadius: '4px', fontWeight: '500' }}>{check?.amount_owed || dictionary.admin.rulesManagement.expandedRow.notAvailable}</code></div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-muted p-3" style={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid rgba(12, 117, 111, 0.1)', fontSize: '0.85rem', color: '#a0aec0' }}>{dictionary.admin.rulesManagement.expandedRow.noChecksDefined}</div>
                            )}
                            {selectedRule.penalty && selectedRule.penalty.length > 0 && (
                              <div className="mt-3">
                                <strong style={{ color: '#0C756F', fontSize: '0.9rem', fontWeight: '600', marginBottom: '8px', display: 'block' }}>{dictionary.admin.rulesManagement.expandedRow.penaltyCalculation}</strong>
                                <div className="p-3" style={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid rgba(12, 117, 111, 0.1)', boxShadow: '0 2px 4px rgba(12, 117, 111, 0.05)' }}>
                                  {selectedRule.penalty.map((line, index) => (
                                    <code key={index} style={{ display: 'block', fontSize: '0.75rem', backgroundColor: '#f8f9fa', color: '#0C756F', padding: '3px 6px', marginBottom: '4px', borderRadius: '4px', fontWeight: '500' }}>{line || dictionary.admin.rulesManagement.expandedRow.notAvailable}</code>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Test Button */}
                        <div className="mt-4 pt-3 border-top border-secondary" style={{ borderColor: 'rgba(12, 117, 111, 0.2) !important' }}>
                          <div className="d-flex justify-content-center">
                            <button
                              className="btn"
                              style={{
                                backgroundColor: '#0C756F',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '10px 24px',
                                fontFamily: "'Space Grotesk', sans-serif",
                                fontSize: '0.9rem',
                                fontWeight: '600',
                                transition: 'all 0.2s ease',
                                boxShadow: '0 2px 4px rgba(12, 117, 111, 0.2)'
                              }}
                              onClick={() => setShowTestSection(!showTestSection)}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#0A5F58';
                                e.currentTarget.style.transform = 'translateY(-1px)';
                                e.currentTarget.style.boxShadow = '0 4px 8px rgba(12, 117, 111, 0.3)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = '#0C756F';
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 2px 4px rgba(12, 117, 111, 0.2)';
                              }}
                            >
                              <i className={`bi ${showTestSection ? 'bi-chevron-up' : 'bi-play-circle'} me-2`}></i>
                              {showTestSection ? dictionary.admin.rulesManagement.expandedRow.hideTest : dictionary.admin.rulesManagement.expandedRow.testRule}
                            </button>
                          </div>
                        </div>

                        {/* Test Section */}
                        {showTestSection && (
                          <div className="mt-4">
                            <TestSection
                              title={`${dictionary.admin.rulesManagement.expandedRow.testRuleTitle} ${selectedRule.name || dictionary.admin.rulesManagement.expandedRow.unnamedRule}`}
                              icon="bi-play-circle"
                              headerColor="#0C756F"
                              borderColor="#0C756F"
                              inputMethod={testInputMethod}
                              onInputMethodChange={onTestInputMethodChange}
                              onLoadSampleData={onTestLoadSampleData}
                              uploadedJson={testUploadedJson}
                              onJsonChange={onTestJsonChange}
                              dynamicParams={dynamicParams}
                              dynamicFormData={testDynamicFormData}
                              onDynamicInputChange={onTestDynamicInputChange}
                              includePayslip={testIncludePayslip}
                              includeContract={testIncludeContract}
                              includeAttendance={testIncludeAttendance}
                              onIncludePayslipChange={onTestIncludePayslipChange}
                              onIncludeContractChange={onTestIncludeContractChange}
                              onIncludeAttendanceChange={onTestIncludeAttendanceChange}
                              onExecuteTest={() => {
                                // Clear any existing test results first
                                if (onClearTestResults) {
                                  onClearTestResults();
                                }
                                // Then execute the test for the selected rule
                                onExecuteRuleTest(selectedRule);
                              }}
                              isTesting={isTesting}
                              testResults={testResults}
                              executeButtonText={dictionary.admin.testExpression.testRule}
                              showExecuteButton={true}
                              dictionary={dictionary}
                              lang={lang}
                            />
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="tab-pane fade show active">
      {/* Rule Form */}
      {showRuleForm && (
        <RuleForm
          showRuleForm={showRuleForm}
          isEditing={isEditing}
          editingRule={editingRule}
          ruleFormData={ruleFormData}
          formErrors={formErrors}
          ruleChecks={ruleChecks}
          checkEditor={checkEditor}
          dynamicParams={dynamicParams}
          dynamicFormData={dynamicFormData}
          includePayslip={includePayslip}
          includeContract={includeContract}
          includeAttendance={includeAttendance}
          testResults={testResults}
          isTesting={isTesting}
          onCancelForm={onCancelForm}
          onFormDataChange={onFormDataChange}
          onFormSubmit={onFormSubmit}
          onAddCheck={onAddCheck}
          onUpdateCheck={onUpdateCheck}
          onUpdateCheckEditor={onUpdateCheckEditor}
          onRemoveCheck={onRemoveCheck}
          onTestRuleInForm={onTestRuleInForm}
          onDynamicInputChange={onDynamicInputChange}
          onIncludePayslipChange={onIncludePayslipChange}
          onIncludeContractChange={onIncludeContractChange}
          onIncludeAttendanceChange={onIncludeAttendanceChange}
          onLoadSampleData={onLoadSampleData}
          onSetActiveTab={onSetActiveTab}
          onGenerateAIChecks={onGenerateAIChecks}
          dictionary={dictionary}
          lang={lang}
        />
      )}

      {/* Rules list */}
      {!showRuleForm && renderRulesList()}
    </div>
  );
}