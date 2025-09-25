import { create } from 'zustand';

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
  employee?: Record<string, any>;
}

interface ApiResponse {
  payslip_data?: any[];
  contract_data?: any;
  attendance_data?: any[];
  employee_data?: any;
}

interface ManualEntryStore {
  showManualEntryModal: boolean;
  dynamicParams: any;
  setShowManualEntryModal: (show: boolean) => void;
  setDynamicParams: (params: any) => void;
  resetManualEntry: () => void;
}

export const useManualEntryStore = create<ManualEntryStore>((set) => ({
  showManualEntryModal: false,
  dynamicParams: null,

  setShowManualEntryModal: (show) => set({ showManualEntryModal: show }),
  setDynamicParams: (params) => set({ dynamicParams: params }),
  resetManualEntry: () => set({ showManualEntryModal: false }),
}));