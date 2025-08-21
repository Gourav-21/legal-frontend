"use client";
import React from 'react';
import { useOcrEditorStore } from '../store/ocrEditorStore';
import { MDXEditor, headingsPlugin, listsPlugin, markdownShortcutPlugin, tablePlugin, toolbarPlugin, UndoRedo, BoldItalicUnderlineToggles, InsertTable, ListsToggle, Separator } from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';
import { Locale } from '@/i18n-config';

interface OcrEditorModalProps {
  lang: Locale;
  dictionary: Record<string, any>;
}

// Custom styles to fix z-index issues with MDXEditor in modals
const modalEditorStyles = `
  .mdxeditor-popup-container,
  .mdxeditor-toolbar-item-popup,
  .mdxeditor-table-editor,
  .mdxeditor-context-menu,
  [data-floating-ui-portal] {
    z-index: 1060 !important;
  }
  
  .modal .mdxeditor {
    position: relative;
    z-index: 1;
  }
  
  .modal .mdxeditor-popup-container {
    position: fixed !important;
    z-index: 1060 !important;
  }
`;

// Optimized plugins configuration - shared across all editors for better performance
const editorPlugins = [
  headingsPlugin(),
  listsPlugin(),
  markdownShortcutPlugin(),
  tablePlugin(),
  toolbarPlugin({
    toolbarContents: () => (
      <>
        <UndoRedo />
        <Separator />
        <BoldItalicUnderlineToggles />
        <Separator />
        <ListsToggle />
        <Separator />
        <InsertTable />
      </>
    )
  })
];

const OcrEditorModal: React.FC<OcrEditorModalProps> = ({ dictionary }) => {
  const { showOcrEditor, editableOcrData, onSaveCallback, setShowOcrEditor, setEditableOcrData, resetOcrData } = useOcrEditorStore();
  const [fixingField, setFixingField] = React.useState<string | null>(null);
  const [originalContent, setOriginalContent] = React.useState<{
    payslip_text?: string;
    contract_text?: string;
    attendance_text?: string;
  }>({});
  const [canUndo, setCanUndo] = React.useState<{
    payslip_text: boolean;
    contract_text: boolean;
    attendance_text: boolean;
  }>({
    payslip_text: false,
    contract_text: false,
    attendance_text: false
  });

  // Force re-render keys for MDXEditor when content changes programmatically
  const [editorKeys, setEditorKeys] = React.useState({
    payslip_text: 0,
    contract_text: 0,
    attendance_text: 0
  });

  // Save handler (can be extended to trigger global effects)
  const handleSave = () => {
    // Call the callback with the edited data if it exists
    if (onSaveCallback) {
      onSaveCallback(editableOcrData);
    }
    setShowOcrEditor(false);
  };

  // Cancel handler
  const handleCancel = () => {
    setShowOcrEditor(false);
    resetOcrData();
  };

  // Markdown change handler
  const handleChange = (value: string, field: 'payslip_text' | 'contract_text' | 'attendance_text') => {
    setEditableOcrData({ [field]: value || '' });
  };

  // AI Fix handler
  const handleAiFix = async (field: 'payslip_text' | 'contract_text' | 'attendance_text') => {
    const currentContent = editableOcrData[field];
    if (!currentContent) return;

    // Store original content for undo functionality
    setOriginalContent(prev => ({
      ...prev,
      [field]: currentContent
    }));

    setFixingField(field);
    try {
      const response = await fetch('/api/fix_ocr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ocr_content: currentContent
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fix OCR content');
      }

      const result = await response.json();
      setEditableOcrData({ [field]: result.fixed_content });

      // Force MDXEditor to re-render with new content
      setEditorKeys(prev => ({
        ...prev,
        [field]: prev[field] + 1
      }));

      // Enable undo for this field
      setCanUndo(prev => ({
        ...prev,
        [field]: true
      }));
    } catch (error) {
      console.error('Error fixing OCR content:', error);
      alert('Failed to fix OCR content. Please try again.');
    } finally {
      setFixingField(null);
    }
  };

  // Undo AI Fix handler
  const handleUndoAiFix = (field: 'payslip_text' | 'contract_text' | 'attendance_text') => {
    const originalText = originalContent[field];
    if (originalText) {
      setEditableOcrData({ [field]: originalText });

      // Force MDXEditor to re-render with original content
      setEditorKeys(prev => ({
        ...prev,
        [field]: prev[field] + 1
      }));

      setCanUndo(prev => ({
        ...prev,
        [field]: false
      }));
    }
  };

  if (!showOcrEditor) return null;
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: modalEditorStyles }} />
      <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }} tabIndex={-1}>
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <div>
                <h5 className="modal-title">{dictionary.ocrEditorModal.title}</h5>
                <small className="text-muted">
                  {dictionary.ocrEditorModal.subtitle}
                </small>
              </div>
              <button
                type="button"
                className="btn-close"
                onClick={handleCancel}
              ></button>
            </div>
            <div className="modal-body">
              <div className="row">
                {/* Payslip Text Editor */}
                {editableOcrData.payslip_text && (
                  <div className="col-12 mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <label className="form-label fw-bold text-primary mb-0">
                        <i className="bi bi-file-earmark-text me-2"></i>
                        {dictionary.ocrEditorModal.payslipText}
                      </label>
                      <div className="d-flex gap-2">
                        {canUndo.payslip_text && (
                          <button
                            type="button"
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => handleUndoAiFix('payslip_text')}
                            disabled={fixingField === 'payslip_text'}
                          >
                            <i className="bi bi-arrow-counterclockwise me-1"></i>
                            {dictionary.ocrEditorModal.undoButton}
                          </button>
                        )}
                        <button
                          type="button"
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => handleAiFix('payslip_text')}
                          disabled={fixingField === 'payslip_text'}
                        >
                          {fixingField === 'payslip_text' ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                              {dictionary.ocrEditorModal.fixingButton}
                            </>
                          ) : (
                            <>
                              <i className="bi bi-magic me-1"></i>
                              {dictionary.ocrEditorModal.aiFixButton}
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                    <div style={{ border: '1px solid #ddd', borderRadius: '4px' }}>
                      <MDXEditor
                        key={`payslip-${editorKeys.payslip_text}`}
                        markdown={editableOcrData.payslip_text}
                        onChange={(value) => handleChange(value || '', 'payslip_text')}
                        plugins={editorPlugins}
                      />
                    </div>
                    <small className="text-muted">{editableOcrData.payslip_text.length} {dictionary.ocrEditorModal.charactersCount}</small>
                  </div>
                )}
                {/* Contract Text Editor */}
                {editableOcrData.contract_text && (
                  <div className="col-12 mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <label className="form-label fw-bold text-success mb-0">
                        <i className="bi bi-file-earmark-contract me-2"></i>
                        {dictionary.ocrEditorModal.contractText}
                      </label>
                      <div className="d-flex gap-2">
                        {canUndo.contract_text && (
                          <button
                            type="button"
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => handleUndoAiFix('contract_text')}
                            disabled={fixingField === 'contract_text'}
                          >
                            <i className="bi bi-arrow-counterclockwise me-1"></i>
                            {dictionary.ocrEditorModal.undoButton}
                          </button>
                        )}
                        <button
                          type="button"
                          className="btn btn-outline-success btn-sm"
                          onClick={() => handleAiFix('contract_text')}
                          disabled={fixingField === 'contract_text'}
                        >
                          {fixingField === 'contract_text' ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                              {dictionary.ocrEditorModal.fixingButton}
                            </>
                          ) : (
                            <>
                              <i className="bi bi-magic me-1"></i>
                              {dictionary.ocrEditorModal.aiFixButton}
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                    <div style={{ border: '1px solid #ddd', borderRadius: '4px' }}>
                      <MDXEditor
                        key={`contract-${editorKeys.contract_text}`}
                        markdown={editableOcrData.contract_text}
                        onChange={(value) => handleChange(value || '', 'contract_text')}
                        plugins={editorPlugins}
                      />
                    </div>
                    <small className="text-muted">{editableOcrData.contract_text.length} {dictionary.ocrEditorModal.charactersCount}</small>
                  </div>
                )}
                {/* Attendance Text Editor */}
                {editableOcrData.attendance_text && (
                  <div className="col-12 mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <label className="form-label fw-bold text-warning mb-0">
                        <i className="bi bi-calendar-check me-2"></i>
                        {dictionary.ocrEditorModal.attendanceText}
                      </label>
                      <div className="d-flex gap-2">
                        {canUndo.attendance_text && (
                          <button
                            type="button"
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => handleUndoAiFix('attendance_text')}
                            disabled={fixingField === 'attendance_text'}
                          >
                            <i className="bi bi-arrow-counterclockwise me-1"></i>
                            {dictionary.ocrEditorModal.undoButton}
                          </button>
                        )}
                        <button
                          type="button"
                          className="btn btn-outline-warning btn-sm"
                          onClick={() => handleAiFix('attendance_text')}
                          disabled={fixingField === 'attendance_text'}
                        >
                          {fixingField === 'attendance_text' ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                              {dictionary.ocrEditorModal.fixingButton}
                            </>
                          ) : (
                            <>
                              <i className="bi bi-magic me-1"></i>
                              {dictionary.ocrEditorModal.aiFixButton}
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                    <div style={{ border: '1px solid #ddd', borderRadius: '4px' }}>
                      <MDXEditor
                        key={`attendance-${editorKeys.attendance_text}`}
                        markdown={editableOcrData.attendance_text}
                        onChange={(value) => handleChange(value || '', 'attendance_text')}
                        plugins={editorPlugins}
                      />
                    </div>
                    <small className="text-muted">{editableOcrData.attendance_text.length} {dictionary.ocrEditorModal.charactersCount}</small>
                  </div>
                )}

                {!editableOcrData.payslip_text && !editableOcrData.contract_text && !editableOcrData.attendance_text && (
                  <div className="col-12">
                    <p className="text-muted">{dictionary.ocrEditorModal.noOcrText}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer d-flex justify-content-between">
              <div className="w-100 d-flex flex-column flex-md-row align-items-md-center justify-content-between">
                <div className="d-flex align-items-center w-100">

                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCancel}
                    style={{ minWidth: '100px' }}
                  >
                    {dictionary.ocrEditorModal.cancelButton}
                  </button>
                  <div className="flex-grow-1"></div>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleSave}
                    style={{ minWidth: '120px' }}
                  >
                    <i className="bi bi-check-lg me-2"></i>
                    {dictionary.ocrEditorModal.saveChangesButton}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OcrEditorModal;
