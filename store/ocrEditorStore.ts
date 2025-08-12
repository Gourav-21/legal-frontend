import { create } from 'zustand';

interface OcrEditorState {
  showOcrEditor: boolean;
  editableOcrData: {
    payslip_text: string;
    contract_text: string;
    attendance_text: string;
  };
  onSaveCallback?: (data: OcrEditorState['editableOcrData']) => void;
  setShowOcrEditor: (show: boolean) => void;
  setEditableOcrData: (data: Partial<OcrEditorState['editableOcrData']>) => void;
  setOnSaveCallback: (callback: (data: OcrEditorState['editableOcrData']) => void) => void;
  resetOcrData: () => void;
}

const initialOcrData = {
  payslip_text: '',
  contract_text: '',
  attendance_text: ''
};

export const useOcrEditorStore = create<OcrEditorState>((set) => ({
  showOcrEditor: false,
  editableOcrData: { ...initialOcrData },
  onSaveCallback: undefined,
  setShowOcrEditor: (show) => set({ showOcrEditor: show }),
  setEditableOcrData: (data) => set((state) => {
    const updated = { ...state.editableOcrData, ...data };
    console.log('Store setEditableOcrData - updating from:', state.editableOcrData, 'to:', updated);
    return { editableOcrData: updated };
  }),
  setOnSaveCallback: (callback) => set({ onSaveCallback: callback }),
  resetOcrData: () => set({ editableOcrData: { ...initialOcrData } })
}));
