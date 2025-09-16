import React from 'react';

interface JsonUploadFormProps {
  uploadedJson: string;
  onJsonChange: (json: string) => void;
}

export default function JsonUploadForm({ uploadedJson, onJsonChange }: JsonUploadFormProps) {
  return (
    <div className="mb-4">
      <label className="form-label fw-bold" style={{
        fontFamily: "'Space Grotesk', sans-serif",
        color: 'rgba(15, 15, 20, 0.8)',
        fontSize: '1rem'
      }}>
        <i className="bi bi-file-earmark-code me-2"></i>
        Upload JSON Data
      </label>
      <textarea
        className="form-control"
        rows={8}
        style={{
          borderRadius: '12px',
          border: '2px solid #0C756F',
          fontFamily: "'Manrope', sans-serif",
          fontSize: '0.9rem',
          boxShadow: '0 2px 8px rgba(12, 117, 111, 0.1)',
          backgroundColor: 'rgba(12, 117, 111, 0.02)'
        }}
        value={uploadedJson}
        onChange={(e) => onJsonChange(e.target.value)}
        placeholder={`{
  "employee_id": "TEST_001",
  "month": "2024-07",
  "payslip": {
    "hourly_rate": 30.0,
    "base_salary": 4800.0
  },
  "attendance": {
    "overtime_hours": 5,
    "regular_hours": 160
  },
  "contract": {
    "hourly_rate": 30.0
  }
}`}
      />
    </div>
  );
}
