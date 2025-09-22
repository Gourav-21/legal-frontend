'use client';

import React, { useState, useEffect } from 'react';
import { useManualEntryStore } from '@/store/manualEntryStore';
import { useProcessingResultStore } from '@/store/processingResultStore';

interface PayslipData {
  month: string;
  [key: string]: any;
}

interface AttendanceData {
  month: string;
  [key: string]: any;
}

interface ContractData {
  [key: string]: any;
}

interface ManualEntryData {
  employee_id: string;
  payslips: PayslipData[];
  attendance: AttendanceData[];
  contract: ContractData;
}

interface ManualEntryModalProps {
  dictionary: Record<string, any>;
  lang: string;
}

const ManualEntryModal: React.FC<ManualEntryModalProps> = ({ dictionary, lang }) => {
  const { showManualEntryModal, setShowManualEntryModal, dynamicParams, setDynamicParams } = useManualEntryStore();
  const { processingResult, setProcessingResult } = useProcessingResultStore();
  const [activeTab, setActiveTab] = useState('payslips');
  const [selectedPayslipIndex, setSelectedPayslipIndex] = useState(0);
  const [selectedAttendanceIndex, setSelectedAttendanceIndex] = useState(0);

  // Populate form data from the current processingResult when modal opens
  useEffect(() => {
    if (showManualEntryModal && processingResult) {
      const initial = processingResult;
      const newFormData: ManualEntryData = {
        employee_id: '',
        payslips: [],
        attendance: [],
        contract: {}
      };

      const convertApiData = (obj: any): any => {
        const result: any = {};
        for (const key in obj) {
          if (obj[key] === null) {
            result[key] = '';
          } else if (typeof obj[key] === 'string') {
            // Remove commas, currency, units, and percentage signs
            const cleaned = obj[key].replace(/[,₪שעותימים%]/g, '').trim();
            const numValue = parseFloat(cleaned);
            if (!isNaN(numValue) && cleaned === numValue.toString()) {
              result[key] = numValue;
            } else {
              result[key] = obj[key];
            }
          } else {
            result[key] = obj[key];
          }
        }
        return result;
      };

      if ((initial as any).payslip_data && (initial as any).payslip_data.length > 0) {
        newFormData.employee_id = (initial as any).payslip_data[0].employee_id || '';
        newFormData.payslips = (initial as any).payslip_data.map((p: any) => ({
          ...convertApiData(p),
          month: p.month || ''
        }));
      }

      if ((initial as any).attendance_data && (initial as any).attendance_data.length > 0) {
        if (!newFormData.employee_id) newFormData.employee_id = (initial as any).attendance_data[0].employee_id || '';
        newFormData.attendance = (initial as any).attendance_data.map((a: any) => ({
          ...convertApiData(a),
          month: a.month || ''
        }));
      }

      if ((initial as any).contract_data) {
        if (!newFormData.employee_id) newFormData.employee_id = (initial as any).contract_data.employee_id || '';
        newFormData.contract = convertApiData((initial as any).contract_data);
      }

      setFormData(newFormData);
    }
  }, [showManualEntryModal, processingResult]);

  // Fetch dynamic params when modal opens
  useEffect(() => {
    if (showManualEntryModal && !dynamicParams) {
      const fetchDynamicParams = async () => {
        try {
          const response = await fetch('/api/dynamic-params');
          if (response.ok) {
            const data = await response.json();
            setDynamicParams(data);
          } else {
            console.error('Failed to fetch dynamic params');
            // Set empty params to allow basic functionality
            setDynamicParams({ payslip: [], attendance: [], contract: [] });
          }
        } catch (err) {
          console.error('Error fetching dynamic params:', err);
          // Set empty params to allow basic functionality
          setDynamicParams({ payslip: [], attendance: [], contract: [] });
        }
      };
      fetchDynamicParams();
    }
  }, [showManualEntryModal, dynamicParams, setDynamicParams]);

  // Get current month in YYYY-MM format
  const currentMonth = new Date().toISOString().slice(0, 7);

  const [formData, setFormData] = useState<ManualEntryData>({
    employee_id: '',
    payslips: [{
      month: currentMonth,
    }],
    attendance: [],
    contract: {}
  });

  const handleEmployeeIdChange = (value: string) => {
    setFormData(prev => ({ ...prev, employee_id: value }));
  };

  const handlePayslipChange = (index: number, field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      payslips: prev.payslips.map((payslip, i) =>
        i === index ? { ...payslip, [field]: value } : payslip
      )
    }));
  };

  const handleAttendanceChange = (index: number, field: keyof AttendanceData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      attendance: prev.attendance.map((attendance, i) =>
        i === index ? { ...attendance, [field]: value } : attendance
      )
    }));
  };

  const handleContractChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      contract: { ...prev.contract, [field]: value }
    }));
  };

  const addPayslip = () => {
    const newPayslip: PayslipData = {
      month: currentMonth,
    };
    setFormData(prev => ({
      ...prev,
      payslips: [...prev.payslips, newPayslip]
    }));
    setSelectedPayslipIndex(formData.payslips.length);
  };

  const removePayslip = (index: number) => {
    if (formData.payslips.length > 1) {
      setFormData(prev => ({
        ...prev,
        payslips: prev.payslips.filter((_, i) => i !== index)
      }));
      setSelectedPayslipIndex(Math.max(0, index - 1));
    }
  };

  const addAttendance = () => {
    const newAttendance: AttendanceData = {
      month: currentMonth,
    };
    setFormData(prev => ({
      ...prev,
      attendance: [...prev.attendance, newAttendance]
    }));
    setSelectedAttendanceIndex(formData.attendance.length);
  };

  const removeAttendance = (index: number) => {
    if (formData.attendance.length > 0) {
      setFormData(prev => ({
        ...prev,
        attendance: prev.attendance.filter((_, i) => i !== index)
      }));
      setSelectedAttendanceIndex(Math.max(0, index - 1));
    }
  };

  const [validationError, setValidationError] = useState<string | null>(null);

  const validateForm = (): string | null => {
    // 1. No timestamp (missing month)
    const missingPayslipMonth = formData.payslips.some(p => !p.month);
    const missingAttendanceMonth = formData.attendance.some(a => !a.month);
    if (missingPayslipMonth || missingAttendanceMonth) {
      return dictionary.manualEntryModal.validation.missingMonth || 'All entries must have a month.';
    }

    // 2. Attendance for a month but no payslip for same month
    const payslipMonths = new Set(formData.payslips.map(p => p.month));
    const attendanceMonths = formData.attendance.map(a => a.month);
    for (const attMonth of attendanceMonths) {
      if (!payslipMonths.has(attMonth)) {
        return `${attMonth} ${dictionary.manualEntryModal.validation.attendanceWithoutPayslip || 'Attendance exists but no payslip for that month'}`;
      }
    }

    // 3. Only contract, no payslip
    const hasContract = Object.keys(formData.contract).length > 0;
    const hasPayslip = formData.payslips.length > 2 && formData.payslips.some(p => p.month);
    if (hasContract && !hasPayslip) {
      console.log('Contract provided without payslip data'); // Debug log
      return (
        dictionary.manualEntryModal.validation.contractWithoutPayslip ||
        'Contract data exists but no payslip data.'
      );
    }

    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const error = validateForm();
    if (error) {
      setValidationError(error);
      console.log('Validation error:', error); // Debug log
      return;
    }
    // setTimeout(() => {
    //   setValidationError(null);
    // }, 1000);
    setProcessingResult({
      payslip_data: formData.payslips,
      contract_data: formData.contract,
      attendance_data: formData.attendance
    });
    setShowManualEntryModal(false);
  };

  const getParamNames = (section: string) => {
    if (!dynamicParams || !dynamicParams[section]) return [];
    return dynamicParams[section]
      .filter((p: any) => !['employee_id', 'month'].includes(p.param))
      .map((p: any) => p.param.trim()); // Trim to remove extra spaces
  };

  const getParamLabel = (section: string, param: string) => {
    if (!dynamicParams || !dynamicParams[section]) return param;
    const paramObj = dynamicParams[section].find((p: any) => p.param.trim() === param.trim()); // Trim for matching
    if (!paramObj) return param;

    // Use Hebrew label if language is Hebrew and it exists, otherwise use English
    if (lang === 'he' && paramObj.label_he) {
      return paramObj.label_he;
    }
    return paramObj.label_en || param;
  };

  const getParamType = (section: string, param: string): string => {
    if (!dynamicParams || !dynamicParams[section]) return 'number'; // Default to number
    const paramObj = dynamicParams[section].find((p: any) => p.param.trim() === param.trim());
    return paramObj?.type || 'number';
  };

  const handleClose = () => {
    setShowManualEntryModal(false);
  };

  // Clear validation error when form data changes
  useEffect(() => {
    if (validationError) {
      setValidationError(null);
    }
  }, [formData]);

  if (!showManualEntryModal) return null;

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="bi bi-pencil-square me-2"></i>
              {dictionary.manualEntryModal.title}
            </h5>
            <button type="button" className="btn-close" onClick={handleClose}></button>
          </div>
          <div className="modal-body" style={{ position: 'relative' }}>
            {validationError && (
              <div style={{ position: 'sticky', top: 0, zIndex: 10 }} className="alert alert-danger mb-3" role="alert">
                {validationError}
              </div>
            )}
            {/* Employee ID Always Visible */}
            <div className="row mb-4">
              <div className="col-12">
                <label className="form-label">{dictionary.manualEntryModal.employeeId}</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={formData.employee_id}
                  onChange={(e) => handleEmployeeIdChange(e.target.value)}
                />
              </div>
            </div>

            {/* Tab Navigation */}
            <ul className="nav nav-tabs mb-3" role="tablist">
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === 'payslips' ? 'active' : ''}`}
                  onClick={() => setActiveTab('payslips')}
                  type="button"
                >
                  <i className="bi bi-currency-dollar me-1"></i>
                  {dictionary.manualEntryModal.payslips} ({formData.payslips.length})
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === 'attendance' ? 'active' : ''}`}
                  onClick={() => setActiveTab('attendance')}
                  type="button"
                >
                  <i className="bi bi-clock me-1"></i>
                  {dictionary.manualEntryModal.attendance} ({formData.attendance.length})
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === 'contract' ? 'active' : ''}`}
                  onClick={() => setActiveTab('contract')}
                  type="button"
                >
                  <i className="bi bi-file-text me-1"></i>
                  {dictionary.manualEntryModal.contract}
                </button>
              </li>
            </ul>

            {/* Tab Content */}
            <div className="tab-content">
              {/* Payslips Tab */}
              {activeTab === 'payslips' && (
                <div className="tab-pane fade show active">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="btn-group btn-group-sm" role="group">
                      {formData.payslips.map((payslip, index) => (
                        <button
                          key={index}
                          type="button"
                          className={`btn ${selectedPayslipIndex === index ? 'btn-primary' : 'btn-outline-primary'}`}
                          onClick={() => setSelectedPayslipIndex(index)}
                        >
                          {payslip.month}
                        </button>
                      ))}
                    </div>
                    <div>
                      <button
                        type="button"
                        className="btn btn-success btn-sm me-2"
                        onClick={addPayslip}
                      >
                        <i className="bi bi-plus"></i> {dictionary.manualEntryModal.add}
                      </button>
                      {formData.payslips.length > 1 && (
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => removePayslip(selectedPayslipIndex)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      )}
                    </div>
                  </div>

                  {formData.payslips[selectedPayslipIndex] && (
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label">{dictionary.manualEntryModal.month}</label>
                        <input
                          type="month"
                          className="form-control form-control-sm"
                          value={formData.payslips[selectedPayslipIndex].month}
                          onChange={(e) => handlePayslipChange(selectedPayslipIndex, 'month', e.target.value)}
                        />
                      </div>
                      {getParamNames('payslip').map((param: string) => (
                        <div key={param} className="col-md-6">
                          <label className="form-label">{getParamLabel('payslip', param)}</label>
                          <input
                            type={getParamType('payslip', param) === 'number' ? 'number' : 'text'}
                            className="form-control form-control-sm"
                            step="0.01"
                            value={formData.payslips[selectedPayslipIndex][param] ?? ''}
                            onChange={(e) => {
                              const v = e.target.value;
                              const paramType = getParamType('payslip', param);
                              handlePayslipChange(
                                selectedPayslipIndex,
                                param,
                                v === '' ? '' : (paramType === 'number' ? parseFloat(v) : v)
                              );
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Attendance Tab */}
              {activeTab === 'attendance' && (
                <div className="tab-pane fade show active">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="btn-group btn-group-sm" role="group">
                      {formData.attendance.map((attendance, index) => (
                        <button
                          key={index}
                          type="button"
                          className={`btn ${selectedAttendanceIndex === index ? 'btn-primary' : 'btn-outline-primary'}`}
                          onClick={() => setSelectedAttendanceIndex(index)}
                        >
                          {attendance.month}
                        </button>
                      ))}
                    </div>
                    <div>
                      <button
                        type="button"
                        className="btn btn-success btn-sm me-2"
                        onClick={addAttendance}
                      >
                        <i className="bi bi-plus"></i> {dictionary.manualEntryModal.add}
                      </button>
                      {formData.attendance.length > 0 && (
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => removeAttendance(selectedAttendanceIndex)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      )}
                    </div>
                  </div>

                  {formData.attendance[selectedAttendanceIndex] && (
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label">{dictionary.manualEntryModal.month}</label>
                        <input
                          type="month"
                          className="form-control form-control-sm"
                          value={formData.attendance[selectedAttendanceIndex].month}
                          onChange={(e) => handleAttendanceChange(selectedAttendanceIndex, 'month', e.target.value)}
                        />
                      </div>
                      {getParamNames('attendance').map((param: string) => (
                        <div key={param} className="col-md-6">
                          <label className="form-label">{getParamLabel('attendance', param)}</label>
                          <input
                            type={getParamType('attendance', param) === 'number' ? 'number' : 'text'}
                            className="form-control form-control-sm"
                            step="0.01"
                            value={formData.attendance[selectedAttendanceIndex][param] ?? ''}
                            onChange={(e) => {
                              const v = e.target.value;
                              const paramType = getParamType('attendance', param);
                              handleAttendanceChange(
                                selectedAttendanceIndex,
                                param as keyof typeof formData.attendance[number],
                                v === '' ? '' : (paramType === 'number' ? parseFloat(v) : v)
                              );
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Contract Tab */}
              {activeTab === 'contract' && (
                <div className="tab-pane fade show active">
                  <div className="row g-3">
                    {getParamNames('contract').map((param: string) => (
                      <div key={param} className="col-md-6">
                        <label className="form-label">{getParamLabel('contract', param)}</label>
                        <input
                          type={getParamType('contract', param) === 'number' ? 'number' : 'text'}
                          className="form-control form-control-sm"
                          step="0.01"
                          value={formData.contract[param] ?? ''}
                          onChange={(e) => {
                            const v = e.target.value;
                            const paramType = getParamType('contract', param);
                            handleContractChange(param, v === '' ? '' : (paramType === 'number' ? parseFloat(v) : v));
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* Error alert is now only shown at the top of the modal body */}
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={handleClose}>
              {dictionary.manualEntryModal.cancel}
            </button>
            <button type="button" className="btn btn-primary" onClick={handleSubmit}>
              <i className="bi bi-check-lg me-1"></i>
              {dictionary.manualEntryModal.submitEntry}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManualEntryModal;