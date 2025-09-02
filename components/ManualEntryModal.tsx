'use client';

import React, { useState } from 'react';
import { useManualEntryStore } from '@/store/manualEntryStore';

interface PayslipData {
  month: string;
  base_salary: number;
  overtime_hours: number;
  overtime_pay: number;
  overtime_rate: number;
  total_salary: number;
  hours_worked: number;
  hourly_rate: number;
  sick_days_taken: number;
  vacation_days_taken: number;
}

interface AttendanceData {
  month: string;
  days_worked: number;
  regular_hours: number;
  overtime_hours: number;
  total_hours: number;
  sick_days: number;
  vacation_days: number;
}

interface ContractData {
  minimum_wage_monthly: number;
  minimum_wage_hourly: number;
  hourly_rate: number;
  overtime_rate_125: number;
  overtime_rate_150: number;
  overtime_rate_175: number;
  overtime_rate_200: number;
  standard_hours_per_month: number;
  standard_hours_per_day: number;
  max_overtime_daily: number;
  vacation_days_per_year: number;
  sick_days_per_year: number;
}

interface ManualEntryData {
  employee_id: string;
  payslips: PayslipData[];
  attendance: AttendanceData[];
  contract: ContractData;
}

const ManualEntryModal: React.FC = () => {
  const { showManualEntryModal, setShowManualEntryModal, setManualEntryData } = useManualEntryStore();
  const [activeTab, setActiveTab] = useState('payslips');
  const [selectedPayslipIndex, setSelectedPayslipIndex] = useState(0);
  const [selectedAttendanceIndex, setSelectedAttendanceIndex] = useState(0);

  const [formData, setFormData] = useState<ManualEntryData>({
    employee_id: 'EMP_001',
    payslips: [{
      month: '2024-07',
      base_salary: 4800,
      overtime_hours: 12,
      overtime_pay: 456,
      overtime_rate: 38,
      total_salary: 5256,
      hours_worked: 172,
      hourly_rate: 30,
      sick_days_taken: 0,
      vacation_days_taken: 0
    }],
    attendance: [{
      month: '2024-07',
      days_worked: 22,
      regular_hours: 160,
      overtime_hours: 12,
      total_hours: 172,
      sick_days: 0,
      vacation_days: 0
    }],
    contract: {
      minimum_wage_monthly: 5572,
      minimum_wage_hourly: 32.7,
      hourly_rate: 32.7,
      overtime_rate_125: 1.25,
      overtime_rate_150: 1.50,
      overtime_rate_175: 1.75,
      overtime_rate_200: 2.00,
      standard_hours_per_month: 186,
      standard_hours_per_day: 8,
      max_overtime_daily: 3,
      vacation_days_per_year: 14,
      sick_days_per_year: 18
    }
  });

  const handleEmployeeIdChange = (value: string) => {
    setFormData(prev => ({ ...prev, employee_id: value }));
  };

  const handlePayslipChange = (index: number, field: keyof PayslipData, value: string | number) => {
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

  const handleContractChange = (field: keyof ContractData, value: number) => {
    setFormData(prev => ({
      ...prev,
      contract: { ...prev.contract, [field]: value }
    }));
  };

  const addPayslip = () => {
    const newPayslip: PayslipData = {
      month: '2024-08',
      base_salary: 4800,
      overtime_hours: 0,
      overtime_pay: 0,
      overtime_rate: 38,
      total_salary: 4800,
      hours_worked: 160,
      hourly_rate: 30,
      sick_days_taken: 0,
      vacation_days_taken: 0
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
      month: '2024-08',
      days_worked: 22,
      regular_hours: 160,
      overtime_hours: 0,
      total_hours: 160,
      sick_days: 0,
      vacation_days: 0
    };
    setFormData(prev => ({
      ...prev,
      attendance: [...prev.attendance, newAttendance]
    }));
    setSelectedAttendanceIndex(formData.attendance.length);
  };

  const removeAttendance = (index: number) => {
    if (formData.attendance.length > 1) {
      setFormData(prev => ({
        ...prev,
        attendance: prev.attendance.filter((_, i) => i !== index)
      }));
      setSelectedAttendanceIndex(Math.max(0, index - 1));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setManualEntryData(formData);
    setShowManualEntryModal(false);
  };

  const handleClose = () => {
    setShowManualEntryModal(false);
  };

  if (!showManualEntryModal) return null;

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="bi bi-pencil-square me-2"></i>
              Manual Entry
            </h5>
            <button type="button" className="btn-close" onClick={handleClose}></button>
          </div>
          <div className="modal-body">
            {/* Employee ID Always Visible */}
            <div className="row mb-4">
              <div className="col-12">
                <label className="form-label">Employee ID</label>
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
                  Payslips ({formData.payslips.length})
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === 'attendance' ? 'active' : ''}`}
                  onClick={() => setActiveTab('attendance')}
                  type="button"
                >
                  <i className="bi bi-clock me-1"></i>
                  Attendance ({formData.attendance.length})
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === 'contract' ? 'active' : ''}`}
                  onClick={() => setActiveTab('contract')}
                  type="button"
                >
                  <i className="bi bi-file-text me-1"></i>
                  Contract
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
                        <i className="bi bi-plus"></i> Add
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
                        <label className="form-label">Month</label>
                        <input
                          type="month"
                          className="form-control form-control-sm"
                          value={formData.payslips[selectedPayslipIndex].month}
                          onChange={(e) => handlePayslipChange(selectedPayslipIndex, 'month', e.target.value)}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Base Salary (₪)</label>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          value={formData.payslips[selectedPayslipIndex].base_salary}
                          onChange={(e) => handlePayslipChange(selectedPayslipIndex, 'base_salary', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Overtime Hours</label>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          value={formData.payslips[selectedPayslipIndex].overtime_hours}
                          onChange={(e) => handlePayslipChange(selectedPayslipIndex, 'overtime_hours', parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Overtime Pay (₪)</label>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          value={formData.payslips[selectedPayslipIndex].overtime_pay}
                          onChange={(e) => handlePayslipChange(selectedPayslipIndex, 'overtime_pay', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Overtime Rate (₪/hr)</label>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          step="0.1"
                          value={formData.payslips[selectedPayslipIndex].overtime_rate}
                          onChange={(e) => handlePayslipChange(selectedPayslipIndex, 'overtime_rate', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Total Salary (₪)</label>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          value={formData.payslips[selectedPayslipIndex].total_salary}
                          onChange={(e) => handlePayslipChange(selectedPayslipIndex, 'total_salary', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Hours Worked</label>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          value={formData.payslips[selectedPayslipIndex].hours_worked}
                          onChange={(e) => handlePayslipChange(selectedPayslipIndex, 'hours_worked', parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Hourly Rate (₪)</label>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          step="0.1"
                          value={formData.payslips[selectedPayslipIndex].hourly_rate}
                          onChange={(e) => handlePayslipChange(selectedPayslipIndex, 'hourly_rate', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Sick Days Taken</label>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          value={formData.payslips[selectedPayslipIndex].sick_days_taken}
                          onChange={(e) => handlePayslipChange(selectedPayslipIndex, 'sick_days_taken', parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Vacation Days Taken</label>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          value={formData.payslips[selectedPayslipIndex].vacation_days_taken}
                          onChange={(e) => handlePayslipChange(selectedPayslipIndex, 'vacation_days_taken', parseInt(e.target.value) || 0)}
                        />
                      </div>
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
                        <i className="bi bi-plus"></i> Add
                      </button>
                      {formData.attendance.length > 1 && (
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
                        <label className="form-label">Month</label>
                        <input
                          type="month"
                          className="form-control form-control-sm"
                          value={formData.attendance[selectedAttendanceIndex].month}
                          onChange={(e) => handleAttendanceChange(selectedAttendanceIndex, 'month', e.target.value)}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Days Worked</label>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          value={formData.attendance[selectedAttendanceIndex].days_worked}
                          onChange={(e) => handleAttendanceChange(selectedAttendanceIndex, 'days_worked', parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Regular Hours</label>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          value={formData.attendance[selectedAttendanceIndex].regular_hours}
                          onChange={(e) => handleAttendanceChange(selectedAttendanceIndex, 'regular_hours', parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Overtime Hours</label>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          value={formData.attendance[selectedAttendanceIndex].overtime_hours}
                          onChange={(e) => handleAttendanceChange(selectedAttendanceIndex, 'overtime_hours', parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Total Hours</label>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          value={formData.attendance[selectedAttendanceIndex].total_hours}
                          onChange={(e) => handleAttendanceChange(selectedAttendanceIndex, 'total_hours', parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Sick Days</label>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          value={formData.attendance[selectedAttendanceIndex].sick_days}
                          onChange={(e) => handleAttendanceChange(selectedAttendanceIndex, 'sick_days', parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Vacation Days</label>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          value={formData.attendance[selectedAttendanceIndex].vacation_days}
                          onChange={(e) => handleAttendanceChange(selectedAttendanceIndex, 'vacation_days', parseInt(e.target.value) || 0)}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Contract Tab */}
              {activeTab === 'contract' && (
                <div className="tab-pane fade show active">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Minimum Wage Monthly (₪)</label>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        value={formData.contract.minimum_wage_monthly}
                        onChange={(e) => handleContractChange('minimum_wage_monthly', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Minimum Wage Hourly (₪)</label>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        step="0.1"
                        value={formData.contract.minimum_wage_hourly}
                        onChange={(e) => handleContractChange('minimum_wage_hourly', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Hourly Rate (₪)</label>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        step="0.1"
                        value={formData.contract.hourly_rate}
                        onChange={(e) => handleContractChange('hourly_rate', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Standard Hours/Month</label>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        value={formData.contract.standard_hours_per_month}
                        onChange={(e) => handleContractChange('standard_hours_per_month', parseInt(e.target.value) || 0)}
                      />
                    </div>

                    <div className="col-12"><hr /><h6>Overtime Rates</h6></div>
                    <div className="col-md-3">
                      <label className="form-label">125% Rate</label>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        step="0.01"
                        value={formData.contract.overtime_rate_125}
                        onChange={(e) => handleContractChange('overtime_rate_125', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">150% Rate</label>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        step="0.01"
                        value={formData.contract.overtime_rate_150}
                        onChange={(e) => handleContractChange('overtime_rate_150', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">175% Rate</label>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        step="0.01"
                        value={formData.contract.overtime_rate_175}
                        onChange={(e) => handleContractChange('overtime_rate_175', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">200% Rate</label>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        step="0.01"
                        value={formData.contract.overtime_rate_200}
                        onChange={(e) => handleContractChange('overtime_rate_200', parseFloat(e.target.value) || 0)}
                      />
                    </div>

                    <div className="col-12"><hr /><h6>Work Standards & Benefits</h6></div>
                    <div className="col-md-4">
                      <label className="form-label">Hours/Day</label>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        value={formData.contract.standard_hours_per_day}
                        onChange={(e) => handleContractChange('standard_hours_per_day', parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Max Overtime/Day</label>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        value={formData.contract.max_overtime_daily}
                        onChange={(e) => handleContractChange('max_overtime_daily', parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Vacation Days/Year</label>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        value={formData.contract.vacation_days_per_year}
                        onChange={(e) => handleContractChange('vacation_days_per_year', parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Sick Days/Year</label>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        value={formData.contract.sick_days_per_year}
                        onChange={(e) => handleContractChange('sick_days_per_year', parseInt(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={handleClose}>
              Cancel
            </button>
            <button type="button" className="btn btn-primary" onClick={handleSubmit}>
              <i className="bi bi-check-lg me-1"></i>
              Submit Entry
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManualEntryModal;