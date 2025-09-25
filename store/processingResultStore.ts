import { create } from "zustand";

type ProcessingResult = {
    payslip_data?: any[];
    contract_data?: any;
    attendance_data?: any[];
    employee_data?: any;
} | null;

interface ProcessingResultState {
    processingResult: ProcessingResult;
    setProcessingResult: (result: ProcessingResult) => void;
}

export const useProcessingResultStore = create<ProcessingResultState>((set) => ({
    processingResult: null,
    setProcessingResult: (result) => set({ processingResult: result }),
}));
