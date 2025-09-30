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
  employee: Record<string, any>;
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

  // Get current month in YYYY-MM format
  const currentMonth = new Date().toISOString().slice(0, 7);

  // Key mapping between Hebrew and English
  const hebrewToEnglishKeyMap: Record<string, string> = {
    'מזהה_עובד': 'employee_id',
    'חודש': 'month'
  };

  const englishToHebrewKeyMap: Record<string, string> = {
    'employee_id': 'מזהה_עובד',
    'month': 'חודש'
  };

  // Convert Hebrew keys to English keys for internal use
  const convertHebrewKeysToEnglish = (obj: any): any => {
    const result: any = {};
    for (const key in obj) {
      const englishKey = hebrewToEnglishKeyMap[key] || key;
      result[englishKey] = obj[key];
    }
    return result;

  };

  // Convert English keys to Hebrew keys for submission
  const convertEnglishKeysToHebrew = (obj: any): any => {
    const result: any = {};
    for (const key in obj) {
      const hebrewKey = englishToHebrewKeyMap[key] || key;
      result[hebrewKey] = obj[key];
    }
    return result;
  };

  // Populate form data from the current processingResult when modal opens
  useEffect(() => {
    if (showManualEntryModal && processingResult) {
      const initial = processingResult;
      const newFormData: ManualEntryData = {
        employee_id: '',
        payslips: [],
        attendance: [],
        contract: {},
        employee: {}
      };

      const convertApiData = (obj: any): any => {
        // First convert Hebrew keys to English
        const convertedKeys = convertHebrewKeysToEnglish(obj);
        const result: any = {};
        for (const key in convertedKeys) {
          if (convertedKeys[key] === null) {
            result[key] = '';
          } else if (typeof convertedKeys[key] === 'string') {
            // Remove commas, currency, units, and percentage signs
            const cleaned = convertedKeys[key].replace(/[,₪שעותימים%]/g, '').trim();
            const numValue = parseFloat(cleaned);
            if (!isNaN(numValue) && cleaned === numValue.toString()) {
              result[key] = numValue;
            } else {
              result[key] = convertedKeys[key];
            }
          } else {
            result[key] = convertedKeys[key];
          }
        }
        return result;
      };

      if ((initial as any).payslip_data && (initial as any).payslip_data.length > 0) {
        // employee_id is expected to be present only in payslip_data now
        newFormData.employee_id = (initial as any).payslip_data[0].employee_id || '';
        newFormData.payslips = (initial as any).payslip_data.map((p: any) => ({
          ...convertApiData(p),
          month: convertApiData(p).month || ''
        }));
      }

      if ((initial as any).attendance_data && (initial as any).attendance_data.length > 0) {
        // attendance_data no longer contains employee_id; only map values
        newFormData.attendance = (initial as any).attendance_data.map((a: any) => ({
          ...convertApiData(a),
          month: convertApiData(a).month || ''
        }));
        console.log(newFormData.attendance)
      }

      if ((initial as any).contract_data) {
        // contract_data no longer contains employee_id
        newFormData.contract = convertApiData((initial as any).contract_data);
      }

      if ((initial as any).employee_data) {
        // employee_data no longer contains employee_id
        newFormData.employee = convertApiData((initial as any).employee_data);
      }

      console.log(newFormData)
      // Only populate if formData is in its initial empty state
      const isFormDataEmpty = formData.employee_id === '' &&
                             formData.payslips.length === 1 && 
                             Object.keys(formData.payslips[0]).length <= 1 && // only month or empty
                             formData.payslips[0].month === currentMonth &&
                             formData.attendance.length === 0 &&
                             Object.keys(formData.contract).length === 0 &&
                             Object.keys(formData.employee).length === 0;

      if (isFormDataEmpty) {
        setFormData(newFormData);
      }
    }
  }, [showManualEntryModal, processingResult, currentMonth]);


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
              setDynamicParams({ payslip: [], attendance: [], contract: [], employee: [] });
          }
        } catch (err) {
          console.error('Error fetching dynamic params:', err);
          // Set empty params to allow basic functionality
            setDynamicParams({ payslip: [], attendance: [], contract: [], employee: [] });
        }
      };
      fetchDynamicParams();
    }
  }, [showManualEntryModal, dynamicParams, setDynamicParams]);

  const [formData, setFormData] = useState<ManualEntryData>({
    employee_id: '',
    payslips: [{
      month: currentMonth,
    }],
    attendance: [],
    contract: {}
    ,
    employee: {}
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

    const handleEmployeeChange = (field: string, value: any) => {
      setFormData(prev => ({
        ...prev,
        employee: { ...prev.employee, [field]: value }
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
    const hasPayslip = formData.payslips.length > 0 && formData.payslips.some(p => p.month);
    if (hasContract && !hasPayslip) {
      console.log('Contract provided without payslip data'); // Debug log
      return (
        dictionary.manualEntryModal.validation.contractWithoutPayslip ||
        'Contract data exists but no payslip data.'
      );
    }

    // 4. Only employee data, no payslip
    const hasEmployee = Object.keys(formData.employee).length > 0;
    if (hasEmployee && !hasPayslip) {
      console.log('Employee data provided without payslip data'); // Debug log
      return (
        'Employee data exists but no payslip data.'
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
    
    // Convert payslips back to Hebrew keys before submission
    const convertedPayslips = formData.payslips.map(payslip => convertEnglishKeysToHebrew(payslip));
    const convertedAttendance = formData.attendance.map(attendance => convertEnglishKeysToHebrew(attendance));
    const convertedContract = convertEnglishKeysToHebrew(formData.contract);
    const convertedEmployee = convertEnglishKeysToHebrew(formData.employee);
    
    console.log("converted data",convertedPayslips)
    console.log("attendance:",convertedAttendance)
    
    setProcessingResult({
      payslip_data: convertedPayslips,
      contract_data: convertedContract,
      attendance_data: convertedAttendance,
      employee_data: convertedEmployee
    });
    setShowManualEntryModal(false);
  };

  const getParamNames = (section: string) => {
    if (!dynamicParams || !dynamicParams[section]) return [];
    return dynamicParams[section]
      .filter((p: any) => {
        const englishParam = hebrewToEnglishKeyMap[p.param] || p.param;
        return !['employee_id', 'month'].includes(englishParam);
      })
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
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === 'employee' ? 'active' : ''}`}
                  onClick={() => setActiveTab('employee')}
                  type="button"
                >
                  <i className="bi bi-person-lines-fill me-1"></i>
                  {dictionary.manualEntryModal.employee || 'Employee'}
                </button>
              </li>
            </ul>

            {/* Tab Content */}
            <div className="tab-content">
              {/* Payslips Tab */}
              {activeTab === 'payslips' && (
                <div className="tab-pane fade show active">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className={`btn-group btn-group-sm ${lang === 'he' ? 'flex-row-reverse' : ''}`} role="group" style={{display: 'flex', flexWrap: 'wrap'}}>
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
                      <div className={`btn-group btn-group-sm ${lang === 'he' ? 'flex-row-reverse' : ''}`} role="group" style={{display: 'flex'}}>
                        <button
                          type="button"
                          className="btn btn-success"
                          onClick={addPayslip}
                        >
                          <i className="bi bi-plus"></i> {dictionary.manualEntryModal.add}
                        </button>
                        {formData.payslips.length > 1 && (
                          <button
                            type="button"
                            className="btn btn-danger"
                            onClick={() => removePayslip(selectedPayslipIndex)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        )}
                      </div>
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
                      {getParamNames('payslip').map((param: string) => {
                        const englishParam = hebrewToEnglishKeyMap[param] || param;
                        return (
                          <div key={param} className="col-md-6">
                            <label className="form-label">{getParamLabel('payslip', param)}</label>
                            <input
                              type={getParamType('payslip', param) === 'number' ? 'number' : 'text'}
                              className="form-control form-control-sm"
                              step="0.01"
                              value={formData.payslips[selectedPayslipIndex][englishParam] ?? ''}
                              onChange={(e) => {
                                const v = e.target.value;
                                const paramType = getParamType('payslip', param);
                                handlePayslipChange(
                                  selectedPayslipIndex,
                                  englishParam,
                                  v === '' ? '' : (paramType === 'number' ? parseFloat(v) : v)
                                );
                              }}
                            />
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Attendance Tab */}
              {activeTab === 'attendance' && (
                <div className="tab-pane fade show active">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className={`btn-group btn-group-sm ${lang === 'he' ? 'flex-row-reverse' : ''}`} role="group" style={{display: 'flex', flexWrap: 'wrap'}}>
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
                      <div className={`btn-group btn-group-sm ${lang === 'he' ? 'flex-row-reverse' : ''}`} role="group" style={{display: 'flex'}}>
                        <button
                          type="button"
                          className="btn btn-success"
                          onClick={addAttendance}
                        >
                          <i className="bi bi-plus"></i> {dictionary.manualEntryModal.add}
                        </button>
                        {formData.attendance.length > 0 && (
                          <button
                            type="button"
                            className="btn btn-danger"
                            onClick={() => removeAttendance(selectedAttendanceIndex)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        )}
                      </div>
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
                      {getParamNames('attendance').map((param: string) => {
                        const englishParam = hebrewToEnglishKeyMap[param] || param;
                        return (
                          <div key={param} className="col-md-6">
                            <label className="form-label">{getParamLabel('attendance', param)}</label>
                            <input
                              type={getParamType('attendance', param) === 'number' ? 'number' : 'text'}
                              className="form-control form-control-sm"
                              step="0.01"
                              value={formData.attendance[selectedAttendanceIndex][englishParam] ?? ''}
                              onChange={(e) => {
                                const v = e.target.value;
                                const paramType = getParamType('attendance', param);
                                handleAttendanceChange(
                                  selectedAttendanceIndex,
                                  englishParam as keyof typeof formData.attendance[number],
                                  v === '' ? '' : (paramType === 'number' ? parseFloat(v) : v)
                                );
                              }}
                            />
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Contract Tab */}
              {activeTab === 'contract' && (
                <div className="tab-pane fade show active">
                  <div className="row g-3">
                    {getParamNames('contract').map((param: string) => {
                      const englishParam = hebrewToEnglishKeyMap[param] || param;
                      return (
                        <div key={param} className="col-md-6">
                          <label className="form-label">{getParamLabel('contract', param)}</label>
                          <input
                            type={getParamType('contract', param) === 'number' ? 'number' : 'text'}
                            className="form-control form-control-sm"
                            step="0.01"
                            value={formData.contract[englishParam] ?? ''}
                            onChange={(e) => {
                              const v = e.target.value;
                              const paramType = getParamType('contract', param);
                              handleContractChange(englishParam, v === '' ? '' : (paramType === 'number' ? parseFloat(v) : v));
                            }}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              {activeTab === 'employee' && (
                <div className="tab-pane fade show active">
                  <div className="row g-3">
                    {getParamNames('employee').map((param: string) => {
                      const englishParam = hebrewToEnglishKeyMap[param] || param;
                      return (
                        <div key={param} className="col-md-6">
                          <label className="form-label">{getParamLabel('employee', param)}</label>
                          <input
                            type={getParamType('employee', param) === 'number' ? 'number' : 'text'}
                            className="form-control form-control-sm"
                            step="0.01"
                            value={formData.employee[englishParam] ?? ''}
                            onChange={(e) => {
                              const v = e.target.value;
                              const paramType = getParamType('employee', param);
                              handleEmployeeChange(englishParam, v === '' ? '' : (paramType === 'number' ? parseFloat(v) : v));
                            }}
                          />
                        </div>
                      );
                    })}
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