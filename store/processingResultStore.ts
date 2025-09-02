import { create } from "zustand";

type ProcessingResult = {
    payslip_text: string | any[];
    contract_text: string | object;
    attendance_text: string | any[];
} | null;

interface ProcessingResultState {
    processingResult: ProcessingResult;
    setProcessingResult: (result: ProcessingResult) => void;
}

export const useProcessingResultStore = create<ProcessingResultState>((set) => ({
    processingResult: null,
    setProcessingResult: (result) => set({ processingResult: result }),
}));
