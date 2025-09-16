'use client';

interface Rule {
  rule_id: string;
  name: string;
  law_reference: string;
  description: string;
  effective_from: string;
  effective_to?: string;
  checks: {
    condition: string;
    amount_owed: string;
    violation_message: string;
  }[];
  penalty: string[];
  created_date?: string;
  updated_date?: string;
}

interface RuleDetailsProps {
  selectedRule: Rule | null;
  onEditRule: (rule: Rule) => void;
  onDeleteRule: (ruleId: string) => void;
}

export default function RuleDetails({ selectedRule, onEditRule, onDeleteRule }: RuleDetailsProps) {
  if (!selectedRule) return null;

  return (
    <div className="rule-details mt-4">
      <div className="card" style={{ backgroundColor: '#EFEADC', border: '1px solid rgba(12, 117, 111, 0.2)', borderRadius: '12px' }}>
        <div className="card-header d-flex justify-content-between align-items-center" style={{ backgroundColor: '#0C756F', color: 'white', borderRadius: '12px 12px 0 0' }}>
          <h5 className="mb-0" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Rule Details</h5>
          <div>
            <button
              className="btn btn-sm me-2"
              style={{ backgroundColor: '#FDCF6F', color: '#0C756F', border: 'none', borderRadius: '6px', transform: 'scale(1)', transition: 'all 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              onClick={() => onEditRule(selectedRule)}
            >
              <i className="bi bi-pencil me-1"></i>Edit
            </button>
            <button
              className="btn btn-sm"
              style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '6px', transform: 'scale(1)', transition: 'all 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              onClick={() => onDeleteRule(selectedRule.rule_id)}
            >
              <i className="bi bi-trash me-1"></i>Delete
            </button>
          </div>
        </div>
        <div className="card-body" style={{ backgroundColor: '#EFEADC' }}>
          <div className="row mb-3">
            <div className="col-md-6">
              <h6 style={{ color: '#0C756F', fontFamily: 'Space Grotesk, sans-serif' }}>Basic Information</h6>
              <p><strong style={{ color: '#0C756F' }}>ID:</strong> {selectedRule.rule_id}</p>
              <p><strong style={{ color: '#0C756F' }}>Name:</strong> {selectedRule.name}</p>
              <p><strong style={{ color: '#0C756F' }}>Law Reference:</strong> {selectedRule.law_reference}</p>
              <p><strong style={{ color: '#0C756F' }}>Description:</strong> {selectedRule.description}</p>
              <p>
                <strong style={{ color: '#0C756F' }}>Effective Period:</strong> {selectedRule.effective_from} to {selectedRule.effective_to || 'Ongoing'}
              </p>
              {selectedRule.created_date && (
                <p><strong style={{ color: '#0C756F' }}>Created:</strong> {new Date(selectedRule.created_date).toLocaleString()}</p>
              )}
              {selectedRule.updated_date && (
                <p><strong style={{ color: '#0C756F' }}>Last Updated:</strong> {new Date(selectedRule.updated_date).toLocaleString()}</p>
              )}
            </div>
            <div className="col-md-6">
              <h6 style={{ color: '#0C756F', fontFamily: 'Space Grotesk, sans-serif' }}>Checks</h6>
              {selectedRule.checks.map((check, index) => (
                <div key={index} className="card mb-2" style={{ backgroundColor: 'white', border: '1px solid rgba(12, 117, 111, 0.1)', borderRadius: '8px' }}>
                  <div className="card-body py-2 px-3">
                    <p className="mb-1"><strong style={{ color: '#0C756F' }}>Violation:</strong> {check.violation_message}</p>
                    <p className="mb-1"><strong style={{ color: '#0C756F' }}>Condition:</strong> <code style={{ backgroundColor: '#f8f9fa', color: '#0C756F' }}>{check.condition}</code></p>
                    <p className="mb-0"><strong style={{ color: '#0C756F' }}>Amount Owed:</strong> <code style={{ backgroundColor: '#f8f9fa', color: '#0C756F' }}>{check.amount_owed}</code></p>
                  </div>
                </div>
              ))}

              <h6 className="mt-3" style={{ color: '#0C756F', fontFamily: 'Space Grotesk, sans-serif' }}>Penalty Calculation</h6>
              <div className="card" style={{ backgroundColor: 'white', border: '1px solid rgba(12, 117, 111, 0.1)', borderRadius: '8px' }}>
                <div className="card-body py-2 px-3">
                  {selectedRule.penalty.map((line, index) => (
                    <p key={index} className="mb-1"><code style={{ backgroundColor: '#f8f9fa', color: '#0C756F' }}>{line}</code></p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}