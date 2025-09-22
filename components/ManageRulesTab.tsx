'use client';

import React from 'react';

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
  onRuleSelect: (rule: Rule) => void;
  onStartEditRule: (rule: Rule) => void;
  onDeleteRule: (ruleId: string) => void;
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
  onAddCheck: () => void;
  onUpdateCheck: (index: number, updatedCheck: {condition: string; amount_owed: string; violation_message: string}) => void;
  onUpdateCheckEditor: (field: keyof ManageRulesTabProps['checkEditor'], value: string) => void;
  onRemoveCheck: (index: number) => void;
  onFormDataChange: (data: Partial<ManageRulesTabProps['ruleFormData']>) => void;
  onFormSubmit: (e: React.FormEvent) => void;
  onCancelForm: () => void;
  dynamicParams: any;
  dynamicFormData: any;
  includePayslip: boolean;
  includeContract: boolean;
  includeAttendance: boolean;
  testResults: any;
  isTesting: boolean;
  dictionary: Record<string, any>;
  onTestRuleInForm: () => void;
  onDynamicInputChange: (section: 'payslip' | 'attendance' | 'contract', param: string, value: any) => void;
  onIncludePayslipChange: (checked: boolean) => void;
  onIncludeContractChange: (checked: boolean) => void;
  onIncludeAttendanceChange: (checked: boolean) => void;
  onLoadSampleData: () => void;
  onSetActiveTab: (tab: string) => void;
  onGenerateAIChecks?: () => Promise<{condition: string; amount_owed: string; violation_message: string}[] | null>;
}

export default function ManageRulesTab({
  rules,
  loading,
  error,
  selectedRule,
  onRuleSelect,
  onStartEditRule,
  onDeleteRule,
  showRuleForm,
  isEditing,
  editingRule,
  ruleFormData,
  formErrors,
  ruleChecks,
  checkEditor,
  onAddCheck,
  onUpdateCheck,
  onUpdateCheckEditor,
  onRemoveCheck,
  onFormDataChange,
  onFormSubmit,
  onCancelForm,
  dynamicParams,
  dynamicFormData,
  includePayslip,
  includeContract,
  includeAttendance,
  testResults,
  isTesting,
  dictionary,
  onTestRuleInForm,
  onDynamicInputChange,
  onIncludePayslipChange,
  onIncludeContractChange,
  onIncludeAttendanceChange,
  onLoadSampleData,
  onSetActiveTab,
  onGenerateAIChecks
}: ManageRulesTabProps) {
  // Render the rules list
  const renderRulesList = () => {
    if (loading) {
      return (
        <div className="text-center py-4">
          <div className="spinner-border" style={{ color: '#0C756F' }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2" style={{ color: '#0C756F', fontFamily: 'Manrope, sans-serif' }}>Loading rules...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="alert" style={{ backgroundColor: '#fef2f2', color: '#dc3545', border: '1px solid #fecaca', borderRadius: '8px' }} role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
        </div>
      );
    }

    if (rules.length === 0) {
      return (
        <div className="text-center py-4">
          <i className="bi bi-exclamation-circle fs-1" style={{ color: '#0C756F' }}></i>
          <p className="mt-2" style={{ color: '#666', fontFamily: 'Manrope, sans-serif' }}>No labor law rules found. Create your first rule using the button above.</p>
        </div>
      );
    }

    return (
      <div className="table-responsive">
        <table className="table" style={{ backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <thead style={{ backgroundColor: '#0C756F', color: 'white' }}>
            <tr>
              <th style={{ fontFamily: "'Space Grotesk', sans-serif", border: 'none', padding: '12px' }}>Name</th>
              <th style={{ fontFamily: "'Space Grotesk', sans-serif", border: 'none', padding: '12px' }}>Law Reference</th>
              <th style={{ fontFamily: "'Space Grotesk', sans-serif", border: 'none', padding: '12px' }}>Effective Period</th>
              <th style={{ fontFamily: "'Space Grotesk', sans-serif", border: 'none', padding: '12px' }}>Checks</th>
              <th className="text-end" style={{ fontFamily: "'Space Grotesk', sans-serif", border: 'none', padding: '12px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rules.map(rule => (
              <tr key={rule.rule_id} onClick={() => onRuleSelect(rule)} style={{ cursor: 'pointer', transition: 'all 0.2s', fontFamily: "'Manrope', sans-serif" }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(12, 117, 111, 0.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                <td style={{ padding: '12px', borderBottom: '1px solid rgba(12, 117, 111, 0.1)' }}>{rule.name}</td>
                <td style={{ padding: '12px', borderBottom: '1px solid rgba(12, 117, 111, 0.1)' }}>{rule.law_reference}</td>
                <td style={{ padding: '12px', borderBottom: '1px solid rgba(12, 117, 111, 0.1)' }}>{rule.effective_from} to {rule.effective_to || 'Ongoing'}</td>
                <td style={{ padding: '12px', borderBottom: '1px solid rgba(12, 117, 111, 0.1)' }}>
                  <span className="badge" style={{ backgroundColor: '#0C756F', color: 'white', borderRadius: '12px', padding: '4px 8px' }}>
                    {rule.checks.length}
                  </span>
                </td>
                <td className="text-end" style={{ padding: '12px', borderBottom: '1px solid rgba(12, 117, 111, 0.1)' }}>
                  <button
                    className="btn btn-sm me-2"
                    style={{ backgroundColor: '#0C756F', color: 'white', border: 'none', borderRadius: '6px', transform: 'scale(1)', transition: 'all 0.2s' }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    onClick={(e) => { e.stopPropagation(); onStartEditRule(rule); }}
                  >
                    <i className="bi bi-pencil me-1"></i>Edit
                  </button>
                  <button
                    className="btn btn-sm"
                    style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '6px', transform: 'scale(1)', transition: 'all 0.2s' }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    onClick={(e) => { e.stopPropagation(); onDeleteRule(rule.rule_id); }}
                  >
                    <i className="bi bi-trash me-1"></i>Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Render the rule details
  const renderRuleDetails = () => {
    if (!selectedRule) return null;

    return (
      <div className="rule-details mt-4">
        <div className="card" style={{ backgroundColor: '#EFEADC', border: '1px solid rgba(12, 117, 111, 0.2)', borderRadius: '12px' }}>
          <div className="card-header d-flex justify-content-between align-items-center" style={{ backgroundColor: '#0C756F', color: 'white', borderRadius: '12px 12px 0 0' }}>
            <h5 className="mb-0" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Rule Details</h5>
            <div>
              <button
                className="btn btn-sm me-2"
                style={{ backgroundColor: '#FDCF6F', color: '#0C756F', border: 'none', borderRadius: '6px', transform: 'scale(1)', transition: 'all 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                onClick={() => onStartEditRule(selectedRule)}
              >
                <i className="bi bi-pencil me-1"></i>Edit
              </button>
              <button
                className="btn btn-sm"
                style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '6px', transform: 'scale(1)', transition: 'all 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                onClick={() => onDeleteRule(selectedRule.rule_id)}
              >
                <i className="bi bi-trash me-1"></i>Delete
              </button>
            </div>
          </div>
          <div className="card-body" style={{ backgroundColor: '#EFEADC' }}>
            <div className="row mb-3">
              <div className="col-md-6">
                <h6 style={{ color: '#0C756F', fontFamily: 'Space Grotesk, sans-serif' }}>Basic Information</h6>
                <p><strong style={{ color: '#0C756F' }}>ID:</strong> {selectedRule.rule_id}</p>
                <p><strong style={{ color: '#0C756F' }}>Name:</strong> {selectedRule.name}</p>
                <p><strong style={{ color: '#0C756F' }}>Law Reference:</strong> {selectedRule.law_reference}</p>
                <p><strong style={{ color: '#0C756F' }}>Description:</strong> {selectedRule.description}</p>
                <p>
                  <strong style={{ color: '#0C756F' }}>Effective Period:</strong> {selectedRule.effective_from} to {selectedRule.effective_to || 'Ongoing'}
                </p>
                {selectedRule.created_date && (
                  <p><strong style={{ color: '#0C756F' }}>Created:</strong> {new Date(selectedRule.created_date).toLocaleString()}</p>
                )}
                {selectedRule.updated_date && (
                  <p><strong style={{ color: '#0C756F' }}>Last Updated:</strong> {new Date(selectedRule.updated_date).toLocaleString()}</p>
                )}
              </div>
              <div className="col-md-6">
                <h6 style={{ color: '#0C756F', fontFamily: 'Space Grotesk, sans-serif' }}>Checks</h6>
                {selectedRule.checks.map((check, index) => (
                  <div key={index} className="card mb-2" style={{ backgroundColor: 'white', border: '1px solid rgba(12, 117, 111, 0.1)', borderRadius: '8px' }}>
                    <div className="card-body py-2 px-3">
                      <p className="mb-1"><strong style={{ color: '#0C756F' }}>Violation:</strong> {check.violation_message}</p>
                      <p className="mb-1"><strong style={{ color: '#0C756F' }}>Condition:</strong> <code style={{ backgroundColor: '#f8f9fa', color: '#0C756F' }}>{check.condition}</code></p>
                      <p className="mb-0"><strong style={{ color: '#0C756F' }}>Amount Owed:</strong> <code style={{ backgroundColor: '#f8f9fa', color: '#0C756F' }}>{check.amount_owed}</code></p>
                    </div>
                  </div>
                ))}

                <h6 className="mt-3" style={{ color: '#0C756F', fontFamily: 'Space Grotesk, sans-serif' }}>Penalty Calculation</h6>
                <div className="card" style={{ backgroundColor: 'white', border: '1px solid rgba(12, 117, 111, 0.1)', borderRadius: '8px' }}>
                  <div className="card-body py-2 px-3">
                    {selectedRule.penalty.map((line, index) => (
                      <p key={index} className="mb-1"><code style={{ backgroundColor: '#f8f9fa', color: '#0C756F' }}>{line}</code></p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Rules List */}
      {renderRulesList()}

      {/* Rule Details */}
      {renderRuleDetails()}

      {/* Rule Form */}
      {showRuleForm && (
        <div className="mt-4">
          {/* Import and render RuleForm here, passing all relevant props */}
          {/* @ts-ignore: next-line for dynamic import or direct import */}
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
            onGenerateAIChecks={onGenerateAIChecks}
            onTestRuleInForm={onTestRuleInForm}
            onDynamicInputChange={onDynamicInputChange}
            onIncludePayslipChange={onIncludePayslipChange}
            onIncludeContractChange={onIncludeContractChange}
            onIncludeAttendanceChange={onIncludeAttendanceChange}
            onLoadSampleData={onLoadSampleData}
            onSetActiveTab={onSetActiveTab}
            dictionary={dictionary}
            lang={"en"} // Pass lang if needed
          />
        </div>
      )}
    </div>
  );
}