import { create } from "zustand";

type ProcessingResult = {
    payslip_text: string;
    contract_text: string;
    attendance_text: string;
} | null;

interface ProcessingResultState {
    processingResult: ProcessingResult;
    setProcessingResult: (result: ProcessingResult) => void;
}

export const useProcessingResultStore = create<ProcessingResultState>((set) => ({
    processingResult: null,
    setProcessingResult: (result) => set({ processingResult: result }),
}));
