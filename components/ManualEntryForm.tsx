import React from 'react';

interface DynamicParam {
  param: string;
  label_en: string;
  label_he: string;
  description: string;
}

interface ManualEntryFormProps {
  dynamicParams: {
    payslip: DynamicParam[];
    contract: DynamicParam[];
    attendance: DynamicParam[];
  } | null;
  dynamicFormData: Record<string, any>;
  onDynamicInputChange: (section: string, param: string, value: any) => void;
  includePayslip: boolean;
  includeContract: boolean;
  includeAttendance: boolean;
  onIncludePayslipChange: (checked: boolean) => void;
  onIncludeContractChange: (checked: boolean) => void;
  onIncludeAttendanceChange: (checked: boolean) => void;
  dictionary: any;
  lang: string;
}

export default function ManualEntryForm({
  dynamicParams,
  dynamicFormData,
  onDynamicInputChange,
  includePayslip,
  includeContract,
  includeAttendance,
  onIncludePayslipChange,
  onIncludeContractChange,
  onIncludeAttendanceChange,
  dictionary,
  lang
}: ManualEntryFormProps) {
  if (!dynamicParams) return null;

  const getParamLabel = (param: DynamicParam) => {
    return lang === 'he' ? param.label_he : param.label_en;
  };
  return (
    <>
      {/* Employee Information */}
      <div className="mb-4">
        <h6 className="mb-3" style={{
          fontFamily: "'Space Grotesk', sans-serif",
          color: '#0C756F',
          fontSize: '1.1rem',
          fontWeight: '600'
        }}>
          <i className="bi bi-person-badge me-2"></i>
          {dictionary.admin.testExpression.employeeInformation}
        </h6>
        <div className="row">
          {dynamicParams.payslip
            .filter((p: any) => ['employee_id', 'month'].includes(p.param))
            .map((param: any) => (
              <div key={param.param} className="col-md-6 mb-3">
                <label className="form-label fw-bold" style={{
                  fontFamily: "'Manrope', sans-serif",
                  color: 'rgba(15, 15, 20, 0.7)',
                  fontSize: '0.9rem'
                }}>
                  {getParamLabel(param)}
                </label>
                <input
                  type="text"
                  className="form-control"
                  style={{
                    borderRadius: '8px',
                    border: '2px solid #0C756F',
                    fontFamily: "'Manrope', sans-serif",
                    boxShadow: '0 2px 6px rgba(12, 117, 111, 0.1)'
                  }}
                  value={dynamicFormData[param.param] ?? ''}
                  onChange={(e) => onDynamicInputChange('payslip', param.param, e.target.value)}
                />
              </div>
            ))}
        </div>
      </div>

      {/* Data Sections */}
      <div className="mb-4">
        <h6 className="mb-3" style={{
          fontFamily: "'Space Grotesk', sans-serif",
          color: '#0C756F',
          fontSize: '1.1rem',
          fontWeight: '600'
        }}>
          <i className="bi bi-check-square me-2"></i>
          {dictionary.admin.testExpression.dataSections}
        </h6>
        <div className="row">
          <div className="col-4">
            <div className={`${lang === 'he' ? '' : 'form-check'} mb-2`} dir={lang === 'he' ? 'rtl' : 'ltr'}>
              <input
                className={`form-check-input ${lang === 'he' ? 'mx-2' : ''}`}
                type="checkbox"
                id="form-include-payslip"
                checked={includePayslip}
                onChange={(e) => onIncludePayslipChange(e.target.checked)}
                style={{
                  accentColor: '#0C756F',
                  transform: 'scale(1.2)',
                  cursor: 'pointer'
                }}
              />
              <label className="form-check-label fw-bold" htmlFor="form-include-payslip" style={{
                fontFamily: "'Manrope', sans-serif",
                color: 'rgba(15, 15, 20, 0.7)',
                cursor: 'pointer',
                fontSize: '0.95rem'
              }}>
                💰 {dictionary.admin.testExpression.payslipData}
              </label>
            </div>
          </div>
          <div className="col-4">
            <div className={`${lang === 'he' ? '' : 'form-check'} mb-2`} dir={lang === 'he' ? 'rtl' : 'ltr'}>
              <input
                className={`form-check-input ${lang === 'he' ? 'mx-2' : ''}`}
                type="checkbox"
                id="form-include-contract"
                checked={includeContract}
                onChange={(e) => onIncludeContractChange(e.target.checked)}
                style={{
                  accentColor: '#0C756F',
                  transform: 'scale(1.2)',
                  cursor: 'pointer'
                }}
              />
              <label className="form-check-label fw-bold" htmlFor="form-include-contract" style={{
                fontFamily: "'Manrope', sans-serif",
                color: 'rgba(15, 15, 20, 0.7)',
                cursor: 'pointer',
                fontSize: '0.95rem'
              }}>
                📋 {dictionary.admin.testExpression.contractData}
              </label>
            </div>
          </div>
          <div className="col-4">
            <div className={`${lang === 'he' ? '' : 'form-check'} mb-2`} dir={lang === 'he' ? 'rtl' : 'ltr'}>
              <input
                className={`form-check-input ${lang === 'he' ? 'mx-2' : ''}`}
                type="checkbox"
                id="form-include-attendance"
                checked={includeAttendance}
                onChange={(e) => onIncludeAttendanceChange(e.target.checked)}
                style={{
                  accentColor: '#0C756F',
                  transform: 'scale(1.2)',
                  cursor: 'pointer'
                }}
              />
              <label className="form-check-label fw-bold" htmlFor="form-include-attendance" style={{
                fontFamily: "'Manrope', sans-serif",
                color: 'rgba(15, 15, 20, 0.7)',
                cursor: 'pointer',
                fontSize: '0.95rem'
              }}>
                ⏰ {dictionary.admin.testExpression.attendanceData}
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Payslip Data */}
      {includePayslip && (
        <div className="mb-3">
          <h6 className="mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif", color: '#0C756F' }}>
            <i className="bi bi-cash me-1"></i>{dictionary.admin.testExpression.payslipDetails}
          </h6>
          <div className="row">
            {dynamicParams.payslip
              .filter((p: any) => !['employee_id', 'month'].includes(p.param))
              .map((param: any) => {
                const isCurrency = param.param.includes('rate') || param.param.includes('salary');
                return (
                  <div key={param.param} className="col-md-3 mb-2">
                    <label className="form-label small fw-bold" style={{ fontFamily: "'Manrope', sans-serif", color: 'rgba(15, 15, 20, 0.7)' }}>{getParamLabel(param)}</label>
                    <input
                      type={isCurrency ? "number" : "number"}
                      step={isCurrency ? "0.1" : "1"}
                      min="0"
                      className="form-control form-control-sm"
                      style={{ borderRadius: '6px', border: '1px solid #0C756F', fontFamily: "'Manrope', sans-serif" }}
                      value={dynamicFormData.payslip[param.param] ?? ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === '') {
                          onDynamicInputChange('payslip', param.param, '');
                        } else {
                          onDynamicInputChange('payslip', param.param, isCurrency ? parseFloat(val) : parseInt(val));
                        }
                      }}
                    />
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Dynamic Contract Data */}
      {includeContract && (
        <div className="mb-3">
          <h6 className="mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif", color: '#0C756F' }}>
            <i className="bi bi-file-earmark-text me-1"></i>{dictionary.admin.testExpression.contractDetails}
          </h6>
          <div className="row">
            {dynamicParams.contract
              .filter((p: any) => !['employee_id', 'month'].includes(p.param))
              .map((param: any) => {
                const isCurrency = param.param.includes('rate') || param.param.includes('salary');
                return (
                  <div key={param.param} className="col-md-3 mb-2">
                    <label className="form-label small fw-bold" style={{ fontFamily: "'Manrope', sans-serif", color: 'rgba(15, 15, 20, 0.7)' }}>{getParamLabel(param)}</label>
                    <input
                      type={isCurrency ? "number" : "number"}
                      step={isCurrency ? "0.1" : "1"}
                      min="0"
                      className="form-control form-control-sm"
                      style={{ borderRadius: '6px', border: '1px solid #0C756F', fontFamily: "'Manrope', sans-serif" }}
                      value={dynamicFormData.contract[param.param] ?? ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === '') {
                          onDynamicInputChange('contract', param.param, '');
                        } else {
                          onDynamicInputChange('contract', param.param, isCurrency ? parseFloat(val) : parseInt(val));
                        }
                      }}
                    />
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Dynamic Attendance Data */}
      {includeAttendance && (
        <div className="mb-3">
          <h6 className="mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif", color: '#0C756F' }}>
            <i className="bi bi-calendar-check me-1"></i>{dictionary.admin.testExpression.attendanceDetails}
          </h6>
          <div className="row">
            {dynamicParams.attendance
              .filter((p: any) => !['employee_id', 'month'].includes(p.param))
              .map((param: any) => (
                <div key={param.param} className="col-md-3 mb-2">
                  <label className="form-label small fw-bold" style={{ fontFamily: "'Manrope', sans-serif", color: 'rgba(15, 15, 20, 0.7)' }}>{getParamLabel(param)}</label>
                  <input
                    type="number"
                    min="0"
                    className="form-control form-control-sm"
                    style={{ borderRadius: '6px', border: '1px solid #0C756F', fontFamily: "'Manrope', sans-serif" }}
                    value={dynamicFormData.attendance[param.param] ?? ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === '') {
                        onDynamicInputChange('attendance', param.param, '');
                      } else {
                        onDynamicInputChange('attendance', param.param, parseInt(val));
                      }
                    }}
                  />
                </div>
              ))}
          </div>
        </div>
      )}
    </>
  );
}
