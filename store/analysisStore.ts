import {create} from 'zustand';

interface AnalysisState {
  legalAnalysis: string | null;
  setLegalAnalysis: (analysis: string | null) => void;
}

export const useAnalysisStore = create<AnalysisState>((set) => ({
  legalAnalysis: null,
  setLegalAnalysis: (analysis) => set({ legalAnalysis: analysis }),
}));
