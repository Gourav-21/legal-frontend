"use client";
import React from 'react';
import { useOcrEditorStore } from '../store/ocrEditorStore';
import { MDXEditor, headingsPlugin, listsPlugin, quotePlugin, thematicBreakPlugin, markdownShortcutPlugin, linkPlugin, linkDialogPlugin, imagePlugin, tablePlugin, codeBlockPlugin, codeMirrorPlugin, diffSourcePlugin, frontmatterPlugin, directivesPlugin, toolbarPlugin, UndoRedo, BoldItalicUnderlineToggles, CodeToggle, CreateLink, InsertImage, InsertTable, InsertThematicBreak, ListsToggle, Separator } from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';

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

const OcrEditorModal: React.FC = () => {
  const { showOcrEditor, editableOcrData, onSaveCallback, setShowOcrEditor, setEditableOcrData, resetOcrData } = useOcrEditorStore();

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

  if (!showOcrEditor) return null;
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: modalEditorStyles }} />
      <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }} tabIndex={-1}>
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <div>
                <h5 className="modal-title">Edit OCR Results</h5>
                <small className="text-muted">
                  Edit the extracted text from your documents using the markdown editor with live preview. Changes will be used when creating reports.
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
                    <label className="form-label fw-bold text-primary">
                      <i className="bi bi-file-earmark-text me-2"></i>
                      Payslip Text:
                    </label>
                    <div style={{ border: '1px solid #ddd', borderRadius: '4px' }}>
                      <MDXEditor
                        markdown={editableOcrData.payslip_text}
                        onChange={(value) => handleChange(value || '', 'payslip_text')}
                        plugins={[
                          headingsPlugin(),
                          listsPlugin(),
                          quotePlugin(),
                          thematicBreakPlugin(),
                          markdownShortcutPlugin(),
                          linkPlugin(),
                          linkDialogPlugin(),
                          imagePlugin(),
                          tablePlugin(),
                          codeBlockPlugin({ defaultCodeBlockLanguage: 'txt' }),
                          codeMirrorPlugin({ codeBlockLanguages: { txt: 'Text', js: 'JavaScript', css: 'CSS' } }),
                          diffSourcePlugin({ viewMode: 'rich-text', diffMarkdown: '' }),
                          frontmatterPlugin(),
                          directivesPlugin(),
                          toolbarPlugin({
                            toolbarContents: () => (
                              <>
                                <UndoRedo />
                                <Separator />
                                <BoldItalicUnderlineToggles />
                                <CodeToggle />
                                <Separator />
                                <ListsToggle />
                                <Separator />
                                <CreateLink />
                                <InsertImage />
                                <Separator />
                                <InsertTable />
                                <InsertThematicBreak />
                              </>
                            )
                          })
                        ]}
                      />
                    </div>
                    <small className="text-muted">{editableOcrData.payslip_text.length} characters</small>
                  </div>
                )}
                {/* Contract Text Editor */}
                {editableOcrData.contract_text && (
                  <div className="col-12 mb-4">
                    <label className="form-label fw-bold text-success">
                      <i className="bi bi-file-earmark-contract me-2"></i>
                      Contract Text:
                    </label>
                    <div style={{ border: '1px solid #ddd', borderRadius: '4px' }}>
                      <MDXEditor
                        markdown={editableOcrData.contract_text}
                        onChange={(value) => handleChange(value || '', 'contract_text')}
                        plugins={[
                          headingsPlugin(),
                          listsPlugin(),
                          quotePlugin(),
                          thematicBreakPlugin(),
                          markdownShortcutPlugin(),
                          linkPlugin(),
                          linkDialogPlugin(),
                          imagePlugin(),
                          tablePlugin(),
                          codeBlockPlugin({ defaultCodeBlockLanguage: 'txt' }),
                          codeMirrorPlugin({ codeBlockLanguages: { txt: 'Text', js: 'JavaScript', css: 'CSS' } }),
                          diffSourcePlugin({ viewMode: 'rich-text', diffMarkdown: '' }),
                          frontmatterPlugin(),
                          directivesPlugin(),
                          toolbarPlugin({
                            toolbarContents: () => (
                              <>
                                <UndoRedo />
                                <Separator />
                                <BoldItalicUnderlineToggles />
                                <CodeToggle />
                                <Separator />
                                <ListsToggle />
                                <Separator />
                                <CreateLink />
                                <InsertImage />
                                <Separator />
                                <InsertTable />
                                <InsertThematicBreak />
                              </>
                            )
                          })
                        ]}
                      />
                    </div>
                    <small className="text-muted">{editableOcrData.contract_text.length} characters</small>
                  </div>
                )}
                {/* Attendance Text Editor */}
                {editableOcrData.attendance_text && (
                  <div className="col-12 mb-4">
                    <label className="form-label fw-bold text-warning">
                      <i className="bi bi-calendar-check me-2"></i>
                      Attendance Text:
                    </label>
                    <div style={{ border: '1px solid #ddd', borderRadius: '4px' }}>
                      <MDXEditor
                        markdown={editableOcrData.attendance_text}
                        onChange={(value) => handleChange(value || '', 'attendance_text')}
                        plugins={[
                          headingsPlugin(),
                          listsPlugin(),
                          quotePlugin(),
                          thematicBreakPlugin(),
                          markdownShortcutPlugin(),
                          linkPlugin(),
                          linkDialogPlugin(),
                          imagePlugin(),
                          tablePlugin(),
                          codeBlockPlugin({ defaultCodeBlockLanguage: 'txt' }),
                          codeMirrorPlugin({ codeBlockLanguages: { txt: 'Text', js: 'JavaScript', css: 'CSS' } }),
                          diffSourcePlugin({ viewMode: 'rich-text', diffMarkdown: '' }),
                          frontmatterPlugin(),
                          directivesPlugin(),
                          toolbarPlugin({
                            toolbarContents: () => (
                              <>
                                <UndoRedo />
                                <Separator />
                                <BoldItalicUnderlineToggles />
                                <CodeToggle />
                                <Separator />
                                <ListsToggle />
                                <Separator />
                                <CreateLink />
                                <InsertImage />
                                <Separator />
                                <InsertTable />
                                <InsertThematicBreak />
                              </>
                            )
                          })
                        ]}
                      />
                    </div>
                    <small className="text-muted">{editableOcrData.attendance_text.length} characters</small>
                  </div>
                )}

                {!editableOcrData.payslip_text && !editableOcrData.contract_text && !editableOcrData.attendance_text && (
                  <div className="col-12">
                    <p className="text-muted">No OCR text available to edit.</p>
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
                    Cancel
                  </button>
                  <div className="flex-grow-1"></div>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleSave}
                    style={{ minWidth: '120px' }}
                  >
                    <i className="bi bi-check-lg me-2"></i>
                    Save Changes
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
