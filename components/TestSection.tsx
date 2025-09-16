'use client';

import React from 'react';
import InputMethodSelector from './InputMethodSelector';
import JsonUploadForm from './JsonUploadForm';
import ManualEntryForm from './ManualEntryForm';
import TestResults from './TestResults';

interface DynamicParam {
  param: string;
  label_en: string;
  label_he: string;
  description: string;
}

interface TestResult {
  success: boolean;
  rule_id: string;
  rule_name: string;
  total_violations: number;
  total_amount_owed: number;
  check_results: any[];
  context_used?: any;
  error?: string;
}

interface DataCollectionPanelProps {
  title: string;
  icon?: string;
  headerColor?: string;
  borderColor?: string;
  showCloseButton?: boolean;
  onClose?: () => void;

  // Data collection props
  inputMethod: 'manual' | 'json' | 'sample';
  onInputMethodChange: (method: 'manual' | 'json' | 'sample') => void;
  onLoadSampleData: () => void;

  // Dictionary prop for internationalization
  dictionary: any;

  // JSON upload props
  uploadedJson: string;
  onJsonChange: (json: string) => void;

  // Manual entry props
  dynamicParams?: {
    payslip: DynamicParam[];
    contract: DynamicParam[];
    attendance: DynamicParam[];
  } | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dynamicFormData: Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onDynamicInputChange: (section: string, param: string, value: any) => void;
  includePayslip: boolean;
  includeContract: boolean;
  includeAttendance: boolean;
  onIncludePayslipChange: (checked: boolean) => void;
  onIncludeContractChange: (checked: boolean) => void;
  onIncludeAttendanceChange: (checked: boolean) => void;

  // Test execution props
  onExecuteTest?: () => void;
  isTesting?: boolean;
  testResults?: TestResult;
  executeButtonText?: string;
  showExecuteButton?: boolean;

  // Language prop
  lang: string;
}

export default function DataCollectionPanel({
  title,
  icon = 'bi-flask',
  headerColor = '#FDCF6F',
  borderColor = '#FDCF6F',
  showCloseButton = false,
  onClose,

  // Data collection props
  inputMethod,
  onInputMethodChange,
  onLoadSampleData,

  // JSON upload props
  uploadedJson,
  onJsonChange,

  // Manual entry props
  dynamicParams,
  dynamicFormData,
  onDynamicInputChange,
  includePayslip,
  includeContract,
  includeAttendance,
  onIncludePayslipChange,
  onIncludeContractChange,
  onIncludeAttendanceChange,

  // Test execution props
  onExecuteTest,
  isTesting = false,
  testResults,
  executeButtonText = 'Execute Test',
  showExecuteButton = true,

  // Dictionary prop for internationalization
  dictionary,

  // Language prop
  lang
}: DataCollectionPanelProps) {
  return (
    <div className="card" style={{
      border: `2px solid ${borderColor}`,
      borderRadius: '12px',
      boxShadow: `0 4px 12px rgba(253, 207, 111, 0.15)`,
      backgroundColor: 'rgba(253, 207, 111, 0.05)',
      position: 'relative'
    }}>
      <div className="card-header" style={{
        backgroundColor: headerColor,
        color: '#0F0F14',
        border: 'none',
        borderRadius: '12px 12px 0 0',
        padding: '1rem 1.5rem'
      }}>
        <div className="d-flex justify-content-between align-items-center">
          <h6 className="mb-0 d-flex align-items-center" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            <i className={`bi ${icon} me-2`}></i>
            {title}
          </h6>
          {showCloseButton && onClose && (
            <button
              type="button"
              className="btn btn-sm"
              style={{
                backgroundColor: 'transparent',
                color: '#0F0F14',
                border: '1px solid #0F0F14',
                borderRadius: '6px',
                padding: '0.25rem 0.5rem'
              }}
              onClick={onClose}
            >
              <i className="bi bi-x"></i>
            </button>
          )}
        </div>
      </div>
      <div className="card-body" style={{ backgroundColor: '#f8f9fa' }}>
        {/* Input Method Selection */}
        <InputMethodSelector
          inputMethod={inputMethod}
          onInputMethodChange={onInputMethodChange}
          onLoadSampleData={onLoadSampleData}
          dictionary={dictionary}
        />

        {inputMethod === 'json' && (
          <JsonUploadForm
            uploadedJson={uploadedJson}
            onJsonChange={onJsonChange}
          />
        )}

        {inputMethod === 'manual' && dynamicParams && (
          <ManualEntryForm
            dynamicParams={dynamicParams}
            dynamicFormData={dynamicFormData}
            onDynamicInputChange={onDynamicInputChange}
            includePayslip={includePayslip}
            includeContract={includeContract}
            includeAttendance={includeAttendance}
            onIncludePayslipChange={onIncludePayslipChange}
            onIncludeContractChange={onIncludeContractChange}
            onIncludeAttendanceChange={onIncludeAttendanceChange}
            dictionary={dictionary}
            lang={lang}
          />
        )}

        {/* Execute Test Button */}
        {showExecuteButton && onExecuteTest && (
          <div className="mb-3">
            <button
              type="button"
              className="btn"
              style={{
                backgroundColor: '#0C756F',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontFamily: "'Space Grotesk', sans-serif",
                transform: 'scale(1)',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              onClick={onExecuteTest}
              disabled={isTesting}
            >
              {isTesting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Testing...
                </>
              ) : (
                <>
                  <i className="bi bi-play-circle-fill me-2"></i>{executeButtonText}
                </>
              )}
            </button>
          </div>
        )}

        {/* Test Results */}
        {testResults && (
          <TestResults testResults={testResults} isLoading={isTesting} dictionary={dictionary} lang={lang} />
        )}
      </div>
    </div>
  );
}