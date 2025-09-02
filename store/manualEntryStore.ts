import { create } from 'zustand';

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

interface ManualEntryStore {
  showManualEntryModal: boolean;
  manualEntryData: ManualEntryData | null;
  setShowManualEntryModal: (show: boolean) => void;
  setManualEntryData: (data: ManualEntryData | null) => void;
  resetManualEntry: () => void;
}

export const useManualEntryStore = create<ManualEntryStore>((set) => ({
  showManualEntryModal: false,
  manualEntryData: null,
  setShowManualEntryModal: (show) => set({ showManualEntryModal: show }),
  setManualEntryData: (data) => set({ manualEntryData: data }),
  resetManualEntry: () => set({ manualEntryData: null, showManualEntryModal: false }),
}));