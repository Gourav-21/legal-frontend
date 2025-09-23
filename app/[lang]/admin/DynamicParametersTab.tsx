'use client';

import { useState } from 'react';

interface DynamicParametersTabProps {
  dynamicParams: Record<string, any>;
  paramOperationLoading?: boolean;
  paramOperationMessage: {type: 'success' | 'error', text: string} | null;
  dictionary: Record<string, any>;
  onAddDynamicParam: (section: 'payslip' | 'attendance' | 'contract', paramName: string, labelEn: string, labelHe: string, description: string, type: string) => Promise<void>;
  onUpdateDynamicParam: (section: 'payslip' | 'attendance' | 'contract', paramName: string, labelEn: string, labelHe: string, description: string, type: string) => Promise<void>;
  onRemoveDynamicParam: (section: 'payslip' | 'attendance' | 'contract', paramName: string) => Promise<void>;
  onClearParamOperationMessage: () => void;
}

export default function DynamicParametersTab({
  dynamicParams,
  paramOperationLoading,
  paramOperationMessage,
  dictionary,
  onAddDynamicParam,
  onUpdateDynamicParam,
  onRemoveDynamicParam,
  onClearParamOperationMessage
}: DynamicParametersTabProps) {
  // Local state for parameter management
  const [showAddParamForm, setShowAddParamForm] = useState(true);
  const [showUpdateParamForm, setShowUpdateParamForm] = useState(true);
  const [showRemoveParamForm, setShowRemoveParamForm] = useState(true);
  const [newParamSection, setNewParamSection] = useState<'payslip' | 'attendance' | 'contract'>('payslip');
  const [newParamName, setNewParamName] = useState('');
  const [newParamLabelEn, setNewParamLabelEn] = useState('');
  const [newParamLabelHe, setNewParamLabelHe] = useState('');
  const [newParamDescription, setNewParamDescription] = useState('');
  const [newParamType, setNewParamType] = useState('number');
  const [updateParamSection, setUpdateParamSection] = useState<'payslip' | 'attendance' | 'contract'>('payslip');
  const [updateParamName, setUpdateParamName] = useState('');
  const [updateLabelEn, setUpdateLabelEn] = useState('');
  const [updateLabelHe, setUpdateLabelHe] = useState('');
  const [updateDescription, setUpdateDescription] = useState('');
  const [updateParamType, setUpdateParamType] = useState('number');
  const [removeParamSection, setRemoveParamSection] = useState<'payslip' | 'attendance' | 'contract'>('payslip');
  const [removeParamName, setRemoveParamName] = useState('');
  const [addErrorMessage, setAddErrorMessage] = useState<string | null>(null);
  const [removeErrorMessage, setRemoveErrorMessage] = useState<string | null>(null);
  const [updateErrorMessage, setUpdateErrorMessage] = useState<string | null>(null);
  const [addLoading, setAddLoading] = useState(false);
  const [removeLoading, setRemoveLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  // Get parameter names for a section
  const getParamNames = (section: 'payslip' | 'attendance' | 'contract') => {
    if (!dynamicParams) return [];
    return dynamicParams[section]
      .filter((p: any) => !['employee_id', 'month'].includes(p.param))
      .map((p: any) => p.param);
  };

  return (
    <div className="tab-pane fade show active">
      <div className="row">
        {/* Current Parameters Overview */}
        <div className="col-lg-8">
          <div className="card mb-4" style={{ backgroundColor: '#EFEADC', border: 'none', borderRadius: '15px' }}>
            <div className="card-header" style={{ backgroundColor: '#0C756F', color: 'white', border: 'none', borderRadius: '15px 15px 0 0' }}>
              <h5 className="mb-0" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {dictionary.admin.dynamicParameters.currentDynamicParameters}
              </h5>
            </div>
            <div className="card-body">
              {dynamicParams ? (
                <div className="row">
                  <div className="col-md-4">
                    <h6 className="text-primary" style={{ fontFamily: "'Space Grotesk', sans-serif", color: '#0C756F' }}>
                      {dictionary.admin.dynamicParameters.payslipParameters}
                    </h6>
                    <ul className="list-group list-group-flush">
                      {dynamicParams.payslip.map((param: any) => (
                        <li key={param.param} className="list-group-item d-flex justify-content-between align-items-start px-0 py-3" style={{ backgroundColor: 'transparent', border: 'none', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                          <div className="flex-grow-1">
                            <div className="d-flex align-items-center mb-2">
                              <code className="text-muted me-2" style={{ color: 'rgba(15, 15, 20, 0.7)', fontSize: '0.9em' }}>{param.param}</code>
                              {['employee_id', 'month'].includes(param.param) && (
                                <span className="badge bg-secondary" style={{ backgroundColor: '#6c757d', fontSize: '0.75em' }}>
                                  {dictionary.admin.dynamicParameters.required}
                                </span>
                              )}
                            </div>
                            <div className="mb-1">
                              <strong className="text-primary" style={{ fontSize: '0.85em', color: '#0C756F' }}>EN:</strong>
                              <span className="ms-1" style={{ color: 'rgba(15, 15, 20, 0.8)' }}>{param.label_en}</span>
                            </div>
                            <div className="mb-1">
                              <strong className="text-primary" style={{ fontSize: '0.85em', color: '#0C756F' }}>HE:</strong>
                              <span className="ms-1" style={{ color: 'rgba(15, 15, 20, 0.8)' }}>{param.label_he}</span>
                            </div>
                            <div>
                              <strong className="text-muted" style={{ fontSize: '0.8em' }}>{dictionary.admin.dynamicParameters.description}:</strong>
                              <span className="ms-1 text-muted" style={{ fontSize: '0.8em' }}>{param.description}</span>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="col-md-4">
                    <h6 className="text-success" style={{ fontFamily: "'Space Grotesk', sans-serif", color: '#0C756F' }}>
                      {dictionary.admin.dynamicParameters.attendanceParameters}
                    </h6>
                    <ul className="list-group list-group-flush">
                      {dynamicParams.attendance.map((param: any) => (
                        <li key={param.param} className="list-group-item d-flex justify-content-between align-items-start px-0 py-3" style={{ backgroundColor: 'transparent', border: 'none', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                          <div className="flex-grow-1">
                            <div className="d-flex align-items-center mb-2">
                              <code className="text-muted me-2" style={{ color: 'rgba(15, 15, 20, 0.7)', fontSize: '0.9em' }}>{param.param}</code>
                              {param.param === 'employee_id' && (
                                <span className="badge bg-secondary" style={{ backgroundColor: '#6c757d', fontSize: '0.75em' }}>
                                  {dictionary.admin.dynamicParameters.required}
                                </span>
                              )}
                            </div>
                            <div className="mb-1">
                              <strong className="text-primary" style={{ fontSize: '0.85em', color: '#0C756F' }}>EN:</strong>
                              <span className="ms-1" style={{ color: 'rgba(15, 15, 20, 0.8)' }}>{param.label_en}</span>
                            </div>
                            <div className="mb-1">
                              <strong className="text-primary" style={{ fontSize: '0.85em', color: '#0C756F' }}>HE:</strong>
                              <span className="ms-1" style={{ color: 'rgba(15, 15, 20, 0.8)' }}>{param.label_he}</span>
                            </div>
                            <div>
                              <strong className="text-muted" style={{ fontSize: '0.8em' }}>{dictionary.admin.dynamicParameters.description}:</strong>
                              <span className="ms-1 text-muted" style={{ fontSize: '0.8em' }}>{param.description}</span>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="col-md-4">
                    <h6 className="text-info" style={{ fontFamily: "'Space Grotesk', sans-serif", color: '#0C756F' }}>
                      {dictionary.admin.dynamicParameters.contractParameters}
                    </h6>
                    <ul className="list-group list-group-flush">
                      {dynamicParams.contract.map((param: any) => (
                        <li key={param.param} className="list-group-item d-flex justify-content-between align-items-start px-0 py-3" style={{ backgroundColor: 'transparent', border: 'none', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                          <div className="flex-grow-1">
                            <div className="d-flex align-items-center mb-2">
                              <code className="text-muted me-2" style={{ color: 'rgba(15, 15, 20, 0.7)', fontSize: '0.9em' }}>{param.param}</code>
                              {param.param === 'employee_id' && (
                                <span className="badge bg-secondary" style={{ backgroundColor: '#6c757d', fontSize: '0.75em' }}>
                                  {dictionary.admin.dynamicParameters.required}
                                </span>
                              )}
                            </div>
                            <div className="mb-1">
                              <strong className="text-primary" style={{ fontSize: '0.85em', color: '#0C756F' }}>EN:</strong>
                              <span className="ms-1" style={{ color: 'rgba(15, 15, 20, 0.8)' }}>{param.label_en}</span>
                            </div>
                            <div className="mb-1">
                              <strong className="text-primary" style={{ fontSize: '0.85em', color: '#0C756F' }}>HE:</strong>
                              <span className="ms-1" style={{ color: 'rgba(15, 15, 20, 0.8)' }}>{param.label_he}</span>
                            </div>
                            <div>
                              <strong className="text-muted" style={{ fontSize: '0.8em' }}>{dictionary.admin.dynamicParameters.description}:</strong>
                              <span className="ms-1 text-muted" style={{ fontSize: '0.8em' }}>{param.description}</span>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <div className="spinner-border" role="status" style={{ color: '#0C756F' }}>
                    <span className="visually-hidden">Loading parameters...</span>
                  </div>
                  <p className="mt-2" style={{ color: 'rgba(15, 15, 20, 0.7)' }}>Loading dynamic parameters...</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          {/* Add/Remove Dynamic Parameters Section */}
          <div className="card" style={{ backgroundColor: '#EFEADC', border: 'none', borderRadius: '15px' }}>
            <div className="card-header" style={{ backgroundColor: '#0C756F', color: 'white', border: 'none', borderRadius: '15px 15px 0 0' }}>
              <h6 className="mb-0" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{dictionary.admin.dynamicParameters.manageParameters}</h6>
            </div>
            <div className="card-body">
              {/* Add Parameter Form */}
              <div className="card mb-3" style={{ backgroundColor: 'white', border: 'none', borderRadius: '12px' }}>
                <div className="card-header" style={{ backgroundColor: '#FDCF6F', border: 'none', borderRadius: '12px 12px 0 0' }}>
                  <h6 className="mb-0 d-flex justify-content-between align-items-center" style={{ fontFamily: "'Space Grotesk', sans-serif", color: '#0F0F14' }}>
                    {dictionary.admin.dynamicParameters.addNewParameter}
                    <button
                      className="btn btn-sm"
                      style={{ backgroundColor: '#0C756F', color: 'white', border: 'none', borderRadius: '8px' }}
                      onClick={() => setShowAddParamForm(!showAddParamForm)}
                    >
                      {showAddParamForm ? '−' : '+'}
                    </button>
                  </h6>
                </div>
                {showAddParamForm && (
                  <div className="card-body">
                    <div className="row">
                      <div className="col-12 mb-3">
                        <label className="form-label" style={{ fontFamily: "'Manrope', sans-serif", color: 'rgba(15, 15, 20, 0.7)' }}>{dictionary.admin.dynamicParameters.section}</label>
                        <select
                          className="form-select"
                          style={{ borderRadius: '8px', border: '1px solid #0C756F' }}
                          value={newParamSection}
                          onChange={(e) => setNewParamSection(e.target.value as 'payslip' | 'attendance' | 'contract')}
                        >
                          <option value="payslip">{dictionary.admin.dynamicParameters.payslip}</option>
                          <option value="attendance">{dictionary.admin.dynamicParameters.attendance}</option>
                          <option value="contract">{dictionary.admin.dynamicParameters.contract}</option>
                        </select>
                      </div>
                      <div className="col-12 mb-3">
                        <label className="form-label" style={{ fontFamily: "'Manrope', sans-serif", color: 'rgba(15, 15, 20, 0.7)' }}>{dictionary.admin.dynamicParameters.parameterNameSnakeCase}</label>
                        <input
                          type="text"
                          className="form-control"
                          style={{ borderRadius: '8px', border: '1px solid #0C756F' }}
                          placeholder={dictionary.admin.dynamicParameters.egBonusAmount}
                          value={newParamName}
                          onChange={(e) => setNewParamName(e.target.value)}
                        />
                        <div className="form-text" style={{ color: 'rgba(15, 15, 20, 0.6)' }}>{dictionary.admin.dynamicParameters.useLowercaseWithUnderscoresNoSpaces}</div>
                      </div>
                      <div className="col-12 mb-3">
                        <label className="form-label" style={{ fontFamily: "'Manrope', sans-serif", color: 'rgba(15, 15, 20, 0.7)' }}>{dictionary.admin.dynamicParameters.parameterLabelEnglish}</label>
                        <input
                          type="text"
                          className="form-control"
                          style={{ borderRadius: '8px', border: '1px solid #0C756F' }}
                          placeholder={dictionary.admin.dynamicParameters.egBonusAmountShekel}
                          value={newParamLabelEn}
                          onChange={(e) => setNewParamLabelEn(e.target.value)}
                        />
                        <div className="form-text" style={{ color: 'rgba(15, 15, 20, 0.6)' }}>{dictionary.admin.dynamicParameters.englishLabelForTheUI}</div>
                      </div>
                      <div className="col-12 mb-3">
                        <label className="form-label" style={{ fontFamily: "'Manrope', sans-serif", color: 'rgba(15, 15, 20, 0.7)' }}>{dictionary.admin.dynamicParameters.parameterLabelHebrew}</label>
                        <input
                          type="text"
                          className="form-control"
                          style={{ borderRadius: '8px', border: '1px solid #0C756F' }}
                          placeholder={dictionary.admin.dynamicParameters.egBonusAmountHebrew}
                          value={newParamLabelHe}
                          onChange={(e) => setNewParamLabelHe(e.target.value)}
                        />
                        <div className="form-text" style={{ color: 'rgba(15, 15, 20, 0.6)' }}>{dictionary.admin.dynamicParameters.hebrewLabelForTheUI}</div>
                      </div>
                      <div className="col-12 mb-3">
                        <label className="form-label" style={{ fontFamily: "'Manrope', sans-serif", color: 'rgba(15, 15, 20, 0.7)' }}>{dictionary.admin.dynamicParameters.parameterDescription}</label>
                        <input
                          type="text"
                          className="form-control"
                          style={{ borderRadius: '8px', border: '1px solid #0C756F' }}
                          placeholder={dictionary.admin.dynamicParameters.egEmployeeBonus}
                          value={newParamDescription}
                          onChange={(e) => setNewParamDescription(e.target.value)}
                        />
                        <div className="form-text" style={{ color: 'rgba(15, 15, 20, 0.6)' }}>{dictionary.admin.dynamicParameters.descriptionOfTheParameter}</div>
                      </div>
                      <div className="col-12 mb-3">
                        <label className="form-label" style={{ fontFamily: "'Manrope', sans-serif", color: 'rgba(15, 15, 20, 0.7)' }}>{dictionary.admin.dynamicParameters.type}</label>
                        <select
                          className="form-select"
                          style={{ borderRadius: '8px', border: '1px solid #0C756F' }}
                          value={newParamType}
                          onChange={(e) => setNewParamType(e.target.value)}
                        >
                          <option value="number">{dictionary.admin.dynamicParameters.number}</option>
                          <option value="text">{dictionary.admin.dynamicParameters.text}</option>
                        </select>
                        <div className="form-text" style={{ color: 'rgba(15, 15, 20, 0.6)' }}>{dictionary.admin.dynamicParameters.typeDescription}</div>
                      </div>
                    </div>
                    <div className="d-flex gap-2">
                      <button
                        className="btn"
                        style={{ backgroundColor: '#0C756F', color: 'white', border: 'none', borderRadius: '12px', fontFamily: "'Space Grotesk', sans-serif", transform: 'scale(1)', transition: 'transform 0.2s' }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        onClick={async () => {
                          if (newParamName && newParamLabelEn && newParamLabelHe && newParamDescription) {
                            onClearParamOperationMessage();
                            setAddErrorMessage(null);
                            setAddLoading(true);
                            try {
                              await onAddDynamicParam(newParamSection, newParamName, newParamLabelEn, newParamLabelHe, newParamDescription, newParamType);
                              setNewParamName('');
                              setNewParamLabelEn('');
                              setNewParamLabelHe('');
                              setNewParamDescription('');
                              setNewParamType('number');
                              setShowAddParamForm(false);
                              setAddErrorMessage(null);
                            } catch (err) {
                              console.error('Error adding dynamic parameter:', err);
                              setAddErrorMessage(err instanceof Error ? err.message : 'An error occurred while adding the parameter');
                            } finally {
                              setAddLoading(false);
                            }
                          }
                        }}
                        disabled={!newParamName || !newParamLabelEn || !newParamLabelHe || !newParamDescription || addLoading}
                      >
                        {addLoading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            <i className="bi bi-plus-circle me-2"></i>{dictionary.admin.dynamicParameters.adding}
                          </>
                        ) : (
                          <>
                            <i className="bi bi-plus-circle me-2"></i>{dictionary.admin.dynamicParameters.addParameterButton}
                          </>
                        )}
                      </button>
                      <button
                        className="btn btn-secondary"
                        style={{ borderRadius: '12px', fontFamily: "'Space Grotesk', sans-serif" }}
                        onClick={() => {
                          setNewParamName('');
                          setNewParamLabelEn('');
                          setNewParamLabelHe('');
                          setNewParamDescription('');
                          onClearParamOperationMessage();
                          setAddErrorMessage(null);
                        }}
                      >
                        {dictionary.admin.dynamicParameters.clear}
                      </button>
                    </div>

                    {/* Add Parameter Error Message */}
                    {addErrorMessage && (
                      <div className="alert alert-danger mt-3" style={{ borderRadius: '12px', border: 'none' }}>
                        <i className="bi bi-exclamation-triangle me-2"></i>
                        {addErrorMessage}
                        <button
                          type="button"
                          className="btn-close float-end"
                          onClick={() => setAddErrorMessage(null)}
                          aria-label="Close"
                        ></button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Remove Parameter Form */}
              <div className="card mb-3" style={{ backgroundColor: 'white', border: 'none', borderRadius: '12px' }}>
                <div className="card-header" style={{ backgroundColor: '#FDCF6F', border: 'none', borderRadius: '12px 12px 0 0' }}>
                  <h6 className="mb-0 d-flex justify-content-between align-items-center" style={{ fontFamily: "'Space Grotesk', sans-serif", color: '#0F0F14' }}>
                    {dictionary.admin.dynamicParameters.removeParameterTitle}
                    <button
                      className="btn btn-sm"
                      style={{ backgroundColor: '#0C756F', color: 'white', border: 'none', borderRadius: '8px' }}
                      onClick={() => setShowRemoveParamForm(!showRemoveParamForm)}
                    >
                      {showRemoveParamForm ? '−' : '+'}
                    </button>
                  </h6>
                </div>
                {showRemoveParamForm && (
                  <div className="card-body">
                    <div className="row">
                      <div className="col-12 mb-3">
                        <label className="form-label" style={{ fontFamily: "'Manrope', sans-serif", color: 'rgba(15, 15, 20, 0.7)' }}>{dictionary.admin.dynamicParameters.section}</label>
                        <select
                          className="form-select"
                          style={{ borderRadius: '8px', border: '1px solid #0C756F' }}
                          value={removeParamSection}
                          onChange={(e) => {
                            setRemoveParamSection(e.target.value as 'payslip' | 'attendance' | 'contract');
                            setRemoveParamName('');
                          }}
                        >
                          <option value="payslip">{dictionary.admin.dynamicParameters.payslip}</option>
                          <option value="attendance">{dictionary.admin.dynamicParameters.attendance}</option>
                          <option value="contract">{dictionary.admin.dynamicParameters.contract}</option>
                        </select>
                      </div>
                      <div className="col-12 mb-3">
                        <label className="form-label" style={{ fontFamily: "'Manrope', sans-serif", color: 'rgba(15, 15, 20, 0.7)' }}>{dictionary.admin.dynamicParameters.parameterToRemove}</label>
                        <select
                          className="form-select"
                          style={{ borderRadius: '8px', border: '1px solid #0C756F' }}
                          value={removeParamName}
                          onChange={(e) => setRemoveParamName(e.target.value)}
                        >
                          <option value="">{dictionary.admin.dynamicParameters.selectParameter}</option>
                          {getParamNames(removeParamSection).map((paramName: string) => (
                            <option key={paramName} value={paramName}>
                              {paramName}
                            </option>
                          ))}
                        </select>
                        <div className="form-text" style={{ color: 'rgba(15, 15, 20, 0.6)' }}>{dictionary.admin.dynamicParameters.onlyDynamicParametersCanBeUpdated}</div>
                      </div>
                    </div>
                    <div className="d-flex gap-2">
                      <button
                        className="btn"
                        style={{ backgroundColor: '#0C756F', color: 'white', border: 'none', borderRadius: '12px', fontFamily: "'Space Grotesk', sans-serif", transform: 'scale(1)', transition: 'transform 0.2s' }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        onClick={async () => {
                          if (removeParamName) {
                            onClearParamOperationMessage();
                            setRemoveErrorMessage(null);
                            setRemoveLoading(true);
                            try {
                              await onRemoveDynamicParam(removeParamSection, removeParamName);
                              setRemoveParamName('');
                              setShowRemoveParamForm(false);
                              setRemoveErrorMessage(null);
                            } catch (err) {
                              console.error('Error removing dynamic parameter:', err);
                              setRemoveErrorMessage(err instanceof Error ? err.message : 'An error occurred while removing the parameter');
                            } finally {
                              setRemoveLoading(false);
                            }
                          }
                        }}
                        disabled={!removeParamName || removeLoading}
                      >
                        {removeLoading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            <i className="bi bi-trash me-2"></i>{dictionary.admin.dynamicParameters.removing}
                          </>
                        ) : (
                          <>
                            <i className="bi bi-trash me-2"></i>{dictionary.admin.dynamicParameters.removeParameterButton}
                          </>
                        )}
                      </button>
                      <button
                        className="btn btn-secondary"
                        style={{ borderRadius: '12px', fontFamily: "'Space Grotesk', sans-serif" }}
                        onClick={() => {
                          setRemoveParamName('');
                          onClearParamOperationMessage();
                          setRemoveErrorMessage(null);
                        }}
                      >
                        Clear
                      </button>
                    </div>

                    {/* Remove Parameter Error Message */}
                    {removeErrorMessage && (
                      <div className="alert alert-danger mt-3" style={{ borderRadius: '12px', border: 'none' }}>
                        <i className="bi bi-exclamation-triangle me-2"></i>
                        {removeErrorMessage}
                        <button
                          type="button"
                          className="btn-close float-end"
                          onClick={() => setRemoveErrorMessage(null)}
                          aria-label="Close"
                        ></button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Update Parameter Form */}
              <div className="card mb-3" style={{ backgroundColor: 'white', border: 'none', borderRadius: '12px' }}>
                <div className="card-header" style={{ backgroundColor: '#FDCF6F', border: 'none', borderRadius: '12px 12px 0 0' }}>
                  <h6 className="mb-0 d-flex justify-content-between align-items-center" style={{ fontFamily: "'Space Grotesk', sans-serif", color: '#0F0F14' }}>
                    {dictionary.admin.dynamicParameters.updateParameterTitle}
                    <button
                      className="btn btn-sm"
                      style={{ backgroundColor: '#0C756F', color: 'white', border: 'none', borderRadius: '8px' }}
                      onClick={() => setShowUpdateParamForm(!showUpdateParamForm)}
                    >
                      {showUpdateParamForm ? '−' : '+'}
                    </button>
                  </h6>
                </div>
                {showUpdateParamForm && (
                  <div className="card-body">
                    <div className="row">
                      <div className="col-12 mb-3">
                        <label className="form-label" style={{ fontFamily: "'Manrope', sans-serif", color: 'rgba(15, 15, 20, 0.7)' }}>{dictionary.admin.dynamicParameters.section}</label>
                        <select
                          className="form-select"
                          style={{ borderRadius: '8px', border: '1px solid #0C756F' }}
                          value={updateParamSection}
                          onChange={(e) => {
                            setUpdateParamSection(e.target.value as 'payslip' | 'attendance' | 'contract');
                            setUpdateParamName('');
                            setUpdateLabelEn('');
                            setUpdateLabelHe('');
                            setUpdateDescription('');
                            setUpdateParamType('number');
                          }}
                        >
                          <option value="payslip">{dictionary.admin.dynamicParameters.payslip}</option>
                          <option value="attendance">{dictionary.admin.dynamicParameters.attendance}</option>
                          <option value="contract">{dictionary.admin.dynamicParameters.contract}</option>
                        </select>
                      </div>
                      <div className="col-12 mb-3">
                        <label className="form-label" style={{ fontFamily: "'Manrope', sans-serif", color: 'rgba(15, 15, 20, 0.7)' }}>{dictionary.admin.dynamicParameters.parameterToUpdate}</label>
                        <select
                          className="form-select"
                          style={{ borderRadius: '8px', border: '1px solid #0C756F' }}
                          value={updateParamName}
                          onChange={(e) => {
                            const selectedParam = e.target.value;
                            setUpdateParamName(selectedParam);
                            if (selectedParam && dynamicParams) {
                              const param = dynamicParams[updateParamSection].find((p: any) => p.param === selectedParam);
                              if (param) {
                                setUpdateLabelEn(param.label_en || '');
                                setUpdateLabelHe(param.label_he || '');
                                setUpdateDescription(param.description || '');
                                setUpdateParamType(param.type || 'number');
                              }
                            } else {
                              setUpdateLabelEn('');
                              setUpdateLabelHe('');
                              setUpdateDescription('');
                              setUpdateParamType('number');
                            }
                          }}
                        >
                          <option value="">{dictionary.admin.dynamicParameters.selectParameter}</option>
                          {getParamNames(updateParamSection).map((paramName: string) => (
                            <option key={paramName} value={paramName}>
                              {paramName}
                            </option>
                          ))}
                        </select>
                        <div className="form-text" style={{ color: 'rgba(15, 15, 20, 0.6)' }}>{dictionary.admin.dynamicParameters.onlyDynamicParametersCanBeUpdated}</div>
                      </div>
                      <div className="col-12 mb-3">
                        <label className="form-label" style={{ fontFamily: "'Manrope', sans-serif", color: 'rgba(15, 15, 20, 0.7)' }}>{dictionary.admin.dynamicParameters.labelEnglish}</label>
                        <input
                          type="text"
                          className="form-control"
                          style={{ borderRadius: '8px', border: '1px solid #0C756F' }}
                          value={updateLabelEn}
                          onChange={(e) => setUpdateLabelEn(e.target.value)}
                        />
                      </div>
                      <div className="col-12 mb-3">
                        <label className="form-label" style={{ fontFamily: "'Manrope', sans-serif", color: 'rgba(15, 15, 20, 0.7)' }}>{dictionary.admin.dynamicParameters.labelHebrew}</label>
                        <input
                          type="text"
                          className="form-control"
                          style={{ borderRadius: '8px', border: '1px solid #0C756F' }}
                          value={updateLabelHe}
                          onChange={(e) => setUpdateLabelHe(e.target.value)}
                        />
                      </div>
                      <div className="col-12 mb-3">
                        <label className="form-label" style={{ fontFamily: "'Manrope', sans-serif", color: 'rgba(15, 15, 20, 0.7)' }}>{dictionary.admin.dynamicParameters.parameterDescription}</label>
                        <input
                          type="text"
                          className="form-control"
                          style={{ borderRadius: '8px', border: '1px solid #0C756F' }}
                          value={updateDescription}
                          onChange={(e) => setUpdateDescription(e.target.value)}
                        />
                      </div>
                      <div className="col-12 mb-3">
                        <label className="form-label" style={{ fontFamily: "'Manrope', sans-serif", color: 'rgba(15, 15, 20, 0.7)' }}>{dictionary.admin.dynamicParameters.type}</label>
                        <select
                          className="form-select"
                          style={{ borderRadius: '8px', border: '1px solid #0C756F' }}
                          value={updateParamType}
                          onChange={(e) => setUpdateParamType(e.target.value)}
                        >
                          <option value="number">{dictionary.admin.dynamicParameters.number}</option>
                          <option value="text">{dictionary.admin.dynamicParameters.text}</option>
                        </select>
                        <div className="form-text" style={{ color: 'rgba(15, 15, 20, 0.6)' }}>{dictionary.admin.dynamicParameters.typeDescription}</div>
                      </div>
                    </div>
                    <div className="d-flex gap-2">
                      <button
                        className="btn"
                        style={{ backgroundColor: '#0C756F', color: 'white', border: 'none', borderRadius: '12px', fontFamily: "'Space Grotesk', sans-serif", transform: 'scale(1)', transition: 'transform 0.2s' }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        onClick={async () => {
                          if (updateParamName && updateLabelEn && updateLabelHe && updateDescription) {
                            onClearParamOperationMessage();
                            setUpdateErrorMessage(null);
                            setUpdateLoading(true);
                            try {
                              await onUpdateDynamicParam(updateParamSection, updateParamName, updateLabelEn, updateLabelHe, updateDescription, updateParamType);
                              setUpdateParamName('');
                              setUpdateLabelEn('');
                              setUpdateLabelHe('');
                              setUpdateDescription('');
                              setUpdateParamType('number');
                              setShowUpdateParamForm(false);
                              setUpdateErrorMessage(null);
                            } catch (err) {
                              console.error('Error updating dynamic parameter:', err);
                              setUpdateErrorMessage(err instanceof Error ? err.message : 'An error occurred while updating the parameter');
                            } finally {
                              setUpdateLoading(false);
                            }
                          }
                        }}
                        disabled={!updateParamName || !updateLabelEn || !updateLabelHe || !updateDescription || updateLoading}
                      >
                        {updateLoading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            <i className="bi bi-pencil me-2"></i>{dictionary.admin.dynamicParameters.updating}
                          </>
                        ) : (
                          <>
                            <i className="bi bi-pencil me-2"></i>{dictionary.admin.dynamicParameters.updateParameterButton}
                          </>
                        )}
                      </button>
                      <button
                        className="btn btn-secondary"
                        style={{ borderRadius: '12px', fontFamily: "'Space Grotesk', sans-serif" }}
                        onClick={() => {
                          setUpdateParamName('');
                          setUpdateLabelEn('');
                          setUpdateLabelHe('');
                          setUpdateDescription('');
                          onClearParamOperationMessage();
                          setUpdateErrorMessage(null);
                        }}
                      >
                        {dictionary.admin.dynamicParameters.clear}
                      </button>
                    </div>

                    {/* Update Parameter Error Message */}
                    {updateErrorMessage && (
                      <div className="alert alert-danger mt-3" style={{ borderRadius: '12px', border: 'none' }}>
                        <i className="bi bi-exclamation-triangle me-2"></i>
                        {updateErrorMessage}
                        <button
                          type="button"
                          className="btn-close float-end"
                          onClick={() => setUpdateErrorMessage(null)}
                          aria-label="Close"
                        ></button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Operation Messages */}
              {paramOperationMessage && (
                <div className={`alert mt-3 ${paramOperationMessage.type === 'success' ? 'alert-success' : 'alert-danger'}`} style={{ borderRadius: '12px', border: 'none' }}>
                  <i className={`bi ${paramOperationMessage.type === 'success' ? 'bi-check-circle' : 'bi-exclamation-triangle'} me-2`}></i>
                  {paramOperationMessage.text}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}