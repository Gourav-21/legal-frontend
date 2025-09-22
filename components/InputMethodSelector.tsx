import React from 'react';

interface InputMethodSelectorProps {
  inputMethod: 'manual' | 'json' | 'sample';
  onInputMethodChange: (method: 'manual' | 'json' | 'sample') => void;
  onLoadSampleData: () => void;
  dictionary: Record<string, any>;
}

export default function InputMethodSelector({
  inputMethod,
  onInputMethodChange,
  onLoadSampleData,
  dictionary
}: InputMethodSelectorProps) {
  return (
    <div className="mb-4">
      <label className="form-label fw-bold mb-3" style={{
        fontFamily: "'Space Grotesk', sans-serif",
        color: 'rgba(15, 15, 20, 0.8)',
        fontSize: '1.1rem'
      }}>
        <i className="bi bi-input-cursor-text me-2"></i>
        {dictionary.admin.testExpression.chooseInputMethod}
      </label>
      <div className="d-flex" style={{ border: '1px solid #0C756F', borderRadius: '12px', overflow: 'hidden' }}>
        <input
          type="radio"
          className="btn-check"
          id="form-manual-entry"
          checked={inputMethod === 'manual'}
          onChange={() => onInputMethodChange('manual')}
        />
        <label className="btn flex-fill" htmlFor="form-manual-entry" style={{
          backgroundColor: inputMethod === 'manual' ? '#0C756F' : 'transparent',
          color: inputMethod === 'manual' ? 'white' : '#0C756F',
          border: 'none',
          borderRadius: '0',
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: '0.9rem',
          fontWeight: '500',
          padding: '12px 16px',
          transition: 'all 0.2s ease',
          position: 'relative'
        }}>
          <i className="bi bi-pencil-square me-2"></i>{dictionary.admin.testExpression.manualEntry}
        </label>
        <input
          type="radio"
          className="btn-check"
          id="form-upload-json"
          checked={inputMethod === 'json'}
          onChange={() => onInputMethodChange('json')}
        />
        <label className="btn flex-fill" htmlFor="form-upload-json" style={{
          backgroundColor: inputMethod === 'json' ? '#0C756F' : 'transparent',
          color: inputMethod === 'json' ? 'white' : '#0C756F',
          border: 'none',
          borderRadius: '0',
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: '0.9rem',
          fontWeight: '500',
          padding: '12px 16px',
          transition: 'all 0.2s ease',
          position: 'relative'
        }}>
          <i className="bi bi-file-earmark-code-fill me-2"></i>{dictionary.admin.testExpression.jsonUpload}
        </label>
        <input
          type="radio"
          className="btn-check"
          id="form-sample-data"
          checked={inputMethod === 'sample'}
          onChange={() => {
            onInputMethodChange('sample');
            onLoadSampleData();
          }}
        />
        <label className="btn flex-fill" htmlFor="form-sample-data" style={{
          backgroundColor: inputMethod === 'sample' ? '#0C756F' : 'transparent',
          color: inputMethod === 'sample' ? 'white' : '#0C756F',
          border: 'none',
          borderRadius: '0',
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: '0.9rem',
          fontWeight: '500',
          padding: '12px 16px',
          transition: 'all 0.2s ease',
          position: 'relative'
        }}>
          <i className="bi bi-star-fill me-2"></i>{dictionary.admin.testExpression.sampleData}
        </label>
      </div>
    </div>
  );
}
