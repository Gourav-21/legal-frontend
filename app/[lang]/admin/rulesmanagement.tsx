'use client';

import { useEffect, useState } from 'react';
import InputMethodSelector from '../../../components/InputMethodSelector';
import JsonUploadForm from '../../../components/JsonUploadForm';
import ManualEntryForm from '../../../components/ManualEntryForm';
import TestResults from '../../../components/TestResults';
import { Locale } from "../../../i18n-config";
import DynamicParametersTab from './DynamicParametersTab';
import ManageRulesTab from './ManageRulesTab';
import TestExpressionTab from './TestExpressionTab';

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

interface RulesManagementProps {
  lang: Locale;
  dictionary: any;
}

type TabType = 'manage' | 'test' | 'params';

export default function RulesManagement({ lang, dictionary }: RulesManagementProps) {
  const [activeTab, setActiveTab] = useState<TabType>('manage');
  const [rules, setRules] = useState<Rule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUnauthorized, setIsUnauthorized] = useState(false);

  // For rule details view
  const [selectedRule, setSelectedRule] = useState<Rule | null>(null);

  // For unified add/edit form
  const [showRuleForm, setShowRuleForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingRule, setEditingRule] = useState<Rule | null>(null);

  // Form data for unified form
  const [ruleFormData, setRuleFormData] = useState({
    rule_id: '',
    name: '',
    law_reference: '',
    description: '',
    effective_from: new Date().toISOString().split('T')[0],
    effective_to: ''
  });

  // For form validation
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Generate AI checks by calling server endpoint which proxies to backend AI
  const generateAIChecks = async () => {
    if (!ruleFormData.description || !ruleFormData.description.trim()) {
      setFormErrors(prev => ({ ...prev, description: 'Description is required for AI generation' }));
      return null;
    }

    try {
      const payload = {
        rule_description: ruleFormData.description
      };

      const res = await fetch('/api/generate-rule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({ detail: 'AI generation failed' }));
        throw new Error(errData.detail || 'AI generation failed');
      }

      const data = await res.json();

      // Expect backend to return { generated_checks: [ {condition, amount_owed, violation_message}, ... ] }
      if (!data || !Array.isArray(data.generated_checks)) {
        console.error('Unexpected AI response', data);
        return null;
      }

      setRuleChecks(data.generated_checks);
      return data.generated_checks;
    } catch (err) {
      console.error('Error generating AI checks:', err);
      setFormErrors(prev => ({ ...prev, ai_generation: err instanceof Error ? err.message : 'AI generation failed' }));
      return null;
    }
  };

  // For check items management
  const [ruleChecks, setRuleChecks] = useState<{condition: string; amount_owed: string; violation_message: string}[]>([]);

  // Separate state for check editor
  const [checkEditor, setCheckEditor] = useState({
    condition: '',
    amount_owed: '',
    violation_message: ''
  });

  // For testing functionality
  const [testResults, setTestResults] = useState<any>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [testData, setTestData] = useState({
    employee_id: 'TEST_001',
    month: '2024-07',
    hourly_rate: 30.0,
    base_salary: 4800.0,
    overtime_rate: 35.0,
    overtime_hours: 5,
    regular_hours: 160
  });

  // For expression tester
  const [expression, setExpression] = useState('');
  const [expressionType, setExpressionType] = useState<'condition' | 'calculation'>('condition');
  const [expressionResult, setExpressionResult] = useState<any>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  // For dynamic test data setup
  const [inputMethod, setInputMethod] = useState<'manual' | 'json' | 'sample'>('manual');
  const [dynamicParams, setDynamicParams] = useState<any>(null);
  const [includePayslip, setIncludePayslip] = useState(true);
  const [includeContract, setIncludeContract] = useState(true);
  const [includeAttendance, setIncludeAttendance] = useState(true);
  const [uploadedJson, setUploadedJson] = useState<string>('');

  // Dynamic form data
  const [dynamicFormData, setDynamicFormData] = useState({
    employee_id: 'TEST_001',
    month: '2024-07',
    payslip: {} as Record<string, any>,
    attendance: {} as Record<string, any>,
    contract: {} as Record<string, any>
  });

  // Test-related state for individual rule testing in expanded rows
  const [testInputMethod, setTestInputMethod] = useState<'manual' | 'json' | 'sample'>('manual');
  const [testUploadedJson, setTestUploadedJson] = useState<string>('');
  const [testDynamicFormData, setTestDynamicFormData] = useState({
    employee_id: 'TEST_001',
    month: '2024-07',
    payslip: {} as Record<string, any>,
    attendance: {} as Record<string, any>,
    contract: {} as Record<string, any>
  });
  const [testIncludePayslip, setTestIncludePayslip] = useState(true);
  const [testIncludeContract, setTestIncludeContract] = useState(true);
  const [testIncludeAttendance, setTestIncludeAttendance] = useState(true);

  // For adding/removing dynamic parameters
  const [newParamSection, setNewParamSection] = useState<'payslip' | 'attendance' | 'contract'>('payslip');
  const [newParamName, setNewParamName] = useState('');
  const [newParamLabel, setNewParamLabel] = useState('');
  const [removeParamSection, setRemoveParamSection] = useState<'payslip' | 'attendance' | 'contract'>('payslip');
  const [removeParamName, setRemoveParamName] = useState('');
  const [showAddParamForm, setShowAddParamForm] = useState(true);
  const [showRemoveParamForm, setShowRemoveParamForm] = useState(true);
  const [paramOperationLoading, setParamOperationLoading] = useState(false);
  const [paramOperationMessage, setParamOperationMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  // Test a rule with test data from manual entry
  const testRule = async (rule: Rule) => {
    setIsTesting(true);
    try {
      const testPayload = {
        rule_id: rule.rule_id,
        name: rule.name,
        checks: rule.checks.map((check, index) => ({
          id: `check_${index + 1}`,
          condition: check.condition,
          amount_owed: check.amount_owed,
          violation_message: check.violation_message
        })),
        payslip: testIncludePayslip ? {
          employee_id: testDynamicFormData.employee_id,
          month: testDynamicFormData.month,
          ...testDynamicFormData.payslip
        } : {},
        attendance: testIncludeAttendance ? {
          employee_id: testDynamicFormData.employee_id,
          month: testDynamicFormData.month,
          ...testDynamicFormData.attendance
        } : {},
        contract: testIncludeContract ? {
          employee_id: testDynamicFormData.employee_id,
          month: testDynamicFormData.month,
          ...testDynamicFormData.contract
        } : {}
      };

      const response = await fetch('/api/test-rule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testPayload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Test failed' }));
        throw new Error(errorData.error || 'Test failed');
      }

      const result = await response.json();
      setTestResults(result);
    } catch (err) {
      setTestResults({ error: err instanceof Error ? err.message : 'Test failed' });
    } finally {
      setIsTesting(false);
    }
  };

  // Test rule in form with current form data
  const testRuleInForm = async () => {
    if (ruleChecks.length === 0) {
      setTestResults({ error: dictionary.admin.messages.addAtLeastOneRuleCheck });
      return;
    }

    setIsTesting(true);
    try {
      // Prepare test data in the new API format
      const testPayload = {
        rule_id: ruleFormData.rule_id || 'TEMP_RULE',
        name: ruleFormData.name || 'Temporary Rule',
        checks: ruleChecks.map((check, index) => ({
          id: `check_${index + 1}`,
          condition: check.condition,
          amount_owed: check.amount_owed,
          violation_message: check.violation_message
        })),
        payslip: includePayslip ? dynamicFormData.payslip : {},
        attendance: includeAttendance ? dynamicFormData.attendance : {},
        contract: includeContract ? dynamicFormData.contract : {}
      };

      const response = await fetch('/api/test-rule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testPayload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Test failed' }));
        throw new Error(errorData.error || 'Test failed');
      }

      const result = await response.json();
      setTestResults(result);
    } catch (err) {
      setTestResults({ error: err instanceof Error ? err.message : 'Test failed' });
    } finally {
      setIsTesting(false);
    }
  };

  // Evaluate expression with test data
  const evaluateExpression = async () => {
    if (!expression.trim()) {
      setExpressionResult({ error: 'Please enter an expression to evaluate' });
      return;
    }

    setIsEvaluating(true);
    try {
      const payload = {
        expression: expression.trim(),
        expression_type: expressionType,
        payslip: includePayslip ? dynamicFormData.payslip : {},
        attendance: includeAttendance ? dynamicFormData.attendance : {},
        contract: includeContract ? dynamicFormData.contract : {}
      };

      const response = await fetch('/api/test-expression', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Expression evaluation failed');
      }

      const result = await response.json();
      setExpressionResult(result);
    } catch (err) {
      setExpressionResult({ error: err instanceof Error ? err.message : 'Expression evaluation failed' });
    } finally {
      setIsEvaluating(false);
    }
  };

  // Fetch all rules on component mount
  useEffect(() => {
    fetchRules();
    fetchDynamicParams();
  }, []);

  // Clear parameter operation message after 5 seconds
  useEffect(() => {
    if (paramOperationMessage) {
      const timer = setTimeout(() => {
        setParamOperationMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [paramOperationMessage]);

  // Handle tab changes
  useEffect(() => {
    if (activeTab === 'test') {
      // Reset expression tester when switching to test tab
      setExpression('');
      setExpressionResult(null);
      setExpressionType('condition');
    }
  }, [activeTab]);

  // Fetch all rules from the API
  const fetchRules = async () => {
    try {
      setLoading(true);
      setIsUnauthorized(false);
      const response = await fetch('/api/labor-law-rules');

      if (response.status === 401) {
        setIsUnauthorized(true);
        setError('You need to log in to access this page.');
        return;
      }

      if (!response.ok) {
        throw new Error(`Error fetching rules: ${response.statusText}`);
      }

      const data = await response.json();
      setRules(data.rules || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch rules');
      console.error('Error fetching rules:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch dynamic parameters for test data
  const fetchDynamicParams = async () => {
    try {
      const response = await fetch('/api/dynamic-params');

      if (!response.ok) {
        throw new Error(`Failed to fetch parameters: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setDynamicParams(data);
    } catch (err) {
      console.error('Error fetching dynamic params:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch dynamic parameters from backend');
      // Set empty data structure to prevent crashes
      setDynamicParams({
        payslip: [],
        attendance: [],
        contract: []
      });
    }
  };

  // Handle rule selection and clear test results when switching rules
  const handleRuleSelect = (rule: Rule | null) => {
    // If selecting a different rule or closing the current one, clear test results
    if (!rule || (selectedRule && rule.rule_id !== selectedRule.rule_id)) {
      setTestResults(null);
    }
    setSelectedRule(rule);
  };

  // Handle dynamic form data changes
  const handleDynamicInputChange = (section: 'payslip' | 'attendance' | 'contract', param: string, value: any) => {
    setDynamicFormData(prev => {
      const newData = {
        ...prev,
        [section]: {
          ...prev[section],
          [param]: value
        }
      };
      
      // If updating employee_id or month in payslip section, automatically update attendance and contract sections
      if (section === 'payslip' && (param === 'employee_id' || param === 'month')) {
        newData.attendance = {
          ...newData.attendance,
          [param]: value
        };
        newData.contract = {
          ...newData.contract,
          [param]: value
        };
      }
      
      return newData;
    });
  };

  // Load sample data
  const loadSampleData = () => {
    setDynamicFormData({
      employee_id: 'TEST_001',
      month: '2024-07',
      payslip: {
        hourly_rate: 30.0,
        base_salary: 4800.0,
        overtime_rate: 35.0,
        total_hours: 165
      },
      attendance: {
        overtime_hours: 5,
        regular_hours: 160,
        total_hours: 165
      },
      contract: {
        hourly_rate: 30.0
      }
    });
  };

  // Handle JSON upload
  const handleJsonUpload = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const jsonText = event.target.value;
    setUploadedJson(jsonText);
    try {
      const parsedData = JSON.parse(jsonText);
      setDynamicFormData({
        employee_id: parsedData.employee_id || 'TEST_001',
        month: parsedData.month || '2024-07',
        payslip: parsedData.payslip || {},
        attendance: parsedData.attendance || {},
        contract: parsedData.contract || {}
      });
    } catch (err) {
      console.error('Invalid JSON:', err);
    }
  };

  // Add a new dynamic parameter
  const addDynamicParam = async (section: 'payslip' | 'attendance' | 'contract', paramName: string, labelEn: string, labelHe: string, description: string) => {
    try {
      const response = await fetch(`/api/dynamic-params/${section}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          param: paramName,
          label_en: labelEn,
          label_he: labelHe,
          description: description
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to add parameter');
      }

      const result = await response.json();

      // Refresh parameters from server
      await fetchDynamicParams();

      // Initialize the new parameter in form data
      setDynamicFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [paramName]: 0
        }
      }));

      return result;
    } catch (err) {
      console.error('Error adding parameter:', err);
      throw err;
    }
  };

  // Remove a dynamic parameter
  const removeDynamicParam = async (section: 'payslip' | 'attendance' | 'contract', paramName: string) => {
    try {
      const response = await fetch(`/api/dynamic-params/${section}/${paramName}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to remove parameter');
      }

      const result = await response.json();

      // Refresh parameters from server
      await fetchDynamicParams();

      // Remove from form data
      setDynamicFormData(prev => {
        const updated = { ...prev };
        delete updated[section][paramName];
        return updated;
      });

      // Clear remove form
      setRemoveParamName('');

      return result;
    } catch (err) {
      console.error('Error removing parameter:', err);
      throw err;
    }
  };

  // Update a dynamic parameter
  const updateDynamicParam = async (section: 'payslip' | 'attendance' | 'contract', paramName: string, labelEn: string, labelHe: string, description: string) => {
    try {
      const response = await fetch(`/api/dynamic-params/${section}/${paramName}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          label_en: labelEn,
          label_he: labelHe,
          description: description
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to update parameter');
      }

      const result = await response.json();

      // Refresh parameters from server
      await fetchDynamicParams();

      return result;
    } catch (err) {
      console.error('Error updating parameter:', err);
      throw err;
    }
  };

  // Get parameter names for a section
  const getParamNames = (section: 'payslip' | 'attendance' | 'contract') => {
    if (!dynamicParams) return [];
    return dynamicParams[section]
      .filter((p: any) => !['employee_id', 'month'].includes(p.param))
      .map((p: any) => p.param);
  };

  // Add a new rule
  const addRule = async (rule: Omit<Rule, 'rule_id' | 'created_date' | 'updated_date'>) => {
    try {
      setLoading(true);
      const response = await fetch('/api/labor-law-rules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(rule),
      });

      if (!response.ok) {
        throw new Error(`${dictionary.admin.messages.errorAddingRule} ${response.statusText}`);
      }

      const newRule = await response.json();
      setRules([...rules, newRule]);
      setError(null);
      return newRule;
    } catch (err) {
      setError(err instanceof Error ? err.message : dictionary.admin.messages.failedToAddRule);
      console.error('Error adding rule:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update an existing rule
  const updateRule = async (rule: Rule) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/labor-law-rules/${rule.rule_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(rule),
      });

      if (!response.ok) {
        throw new Error(`Error updating rule: ${response.statusText}`);
      }

      const updatedRule = await response.json();
      setRules(rules.map(r => r.rule_id === rule.rule_id ? updatedRule : r));
      setError(null);
      return updatedRule;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update rule');
      console.error('Error updating rule:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Delete a rule
  const deleteRule = async (ruleId: string) => {
    if (!confirm('Are you sure you want to delete this rule?')) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/labor-law-rules/${ruleId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Error deleting rule: ${response.statusText}`);
      }

      const deletedRule = await response.json();
      setRules(rules.filter(rule => rule.rule_id !== ruleId));
      setSelectedRule(null);
      setError(null);
      return deletedRule;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete rule');
      console.error('Error deleting rule:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Start editing a rule
  const startEditRule = (rule: Rule) => {
    setEditingRule(rule);
    setRuleFormData({
      rule_id: rule.rule_id,
      name: rule.name,
      law_reference: rule.law_reference,
      description: rule.description,
      effective_from: rule.effective_from,
      effective_to: rule.effective_to || ''
    });
    setRuleChecks(JSON.parse(JSON.stringify(rule.checks)));
    setIsEditing(true);
    setShowRuleForm(true);
    setActiveTab('manage');

    // Ensure dynamic parameters are loaded for testing
    if (!dynamicParams) {
      fetchDynamicParams();
    }
  };

  // Start creating a new rule
  const startCreateRule = () => {
    setEditingRule(null);
    setRuleFormData({
      rule_id: '',
      name: '',
      law_reference: '',
      description: '',
      effective_from: new Date().toISOString().split('T')[0],
      effective_to: ''
    });
    setRuleChecks([]);
    setIsEditing(false);
    setShowRuleForm(true);
    setActiveTab('manage');

    // Ensure dynamic parameters are loaded for testing
    if (!dynamicParams) {
      fetchDynamicParams();
    }
  };

  // Cancel form
  const cancelForm = () => {
    setShowRuleForm(false);
    setEditingRule(null);
    setRuleFormData({
      rule_id: '',
      name: '',
      law_reference: '',
      description: '',
      effective_from: new Date().toISOString().split('T')[0],
      effective_to: ''
    });
    setRuleChecks([]);
    setFormErrors({});
    setTestResults(null); // Clear test results when cancelling form
  };

  // Add a new check item
  const addCheck = () => {
    // Add the current editor content as a new check
    const newCheck = {
      condition: checkEditor.condition,
      amount_owed: checkEditor.amount_owed,
      violation_message: checkEditor.violation_message
    };
    setRuleChecks([...ruleChecks, newCheck]);

    // Clear the editor after adding
    setCheckEditor({
      condition: '',
      amount_owed: '',
      violation_message: ''
    });
  };

  // Update check editor
  const updateCheckEditor = (field: keyof typeof checkEditor, value: string) => {
    setCheckEditor(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Update a check item
  const updateCheck = (index: number, field: keyof typeof ruleChecks[0], value: string) => {
    const updatedChecks = [...ruleChecks];
    updatedChecks[index][field] = value;
    setRuleChecks(updatedChecks);
  };

  // Remove a check item
  const removeCheck = (index: number) => {
    const updatedChecks = [...ruleChecks];
    updatedChecks.splice(index, 1);
    setRuleChecks(updatedChecks);
  };

  // Handle form submission
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const errors: Record<string, string> = {};

    if (!ruleFormData?.name || !ruleFormData.name.trim()) {
      errors.name = 'Rule name is required';
    }
    if (!ruleFormData?.law_reference || !ruleFormData.law_reference.trim()) {
      errors.law_reference = 'Law reference is required';
    }
    if (!ruleFormData?.description || !ruleFormData.description.trim()) {
      errors.description = 'Description is required';
    }
    if (!ruleFormData?.effective_from) {
      errors.effective_from = 'Effective from date is required';
    }
    if (ruleChecks.length === 0) {
      errors.checks = 'At least one check is required';
    } else {
      ruleChecks.forEach((check, index) => {
        // Ensure check is a valid object
        if (!check || typeof check !== 'object') {
          errors[`check_${index}_invalid`] = 'Invalid check data';
          return;
        }

        if (!check?.condition || typeof check.condition !== 'string' || !check.condition.trim()) {
          errors[`check_${index}_condition`] = 'Condition is required';
        }
        if (!check?.amount_owed || typeof check.amount_owed !== 'string' || !check.amount_owed.trim()) {
          errors[`check_${index}_amount_owed`] = 'Amount owed formula is required';
        }
        if (!check?.violation_message || typeof check.violation_message !== 'string' || !check.violation_message.trim()) {
          errors[`check_${index}_violation`] = 'Violation message is required';
        }
      });
    }

    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      if (isEditing && editingRule) {
        // Check if rule ID changed and if it's already taken
        if (editingRule.rule_id !== ruleFormData.rule_id) {
          const existingIds = rules.map(r => r.rule_id);
          if (existingIds.includes(ruleFormData.rule_id)) {
            setFormErrors({ rule_id: 'Rule ID already exists. Please choose a different ID.' });
            return;
          }
        }

        const ruleToUpdate: Rule = {
          ...editingRule,
          rule_id: ruleFormData.rule_id,
          name: ruleFormData.name,
          law_reference: ruleFormData.law_reference,
          description: ruleFormData.description,
          effective_from: ruleFormData.effective_from,
          effective_to: ruleFormData.effective_to || undefined,
          checks: ruleChecks,
          updated_date: new Date().toISOString()
        };

        const result = await updateRule(ruleToUpdate);
        if (result) {
          setShowRuleForm(false);
          setEditingRule(null);
          setSelectedRule(result);
        }
      } else {
        const newRule = {
          name: ruleFormData.name,
          law_reference: ruleFormData.law_reference,
          description: ruleFormData.description,
          effective_from: ruleFormData.effective_from,
          effective_to: ruleFormData.effective_to || undefined,
          checks: ruleChecks,
          penalty: []
        };

        const result = await addRule(newRule);
        if (result) {
          setShowRuleForm(false);
          setSelectedRule(result);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save rule');
    }
  };

  // Render the unified rule form
  const renderRuleForm = () => {
    if (!showRuleForm) return null;

    return (
      <div className="rule-form-modal">
        <div className="card" style={{ backgroundColor: '#EFEADC', border: 'none', borderRadius: '15px' }}>
          <div className="card-header d-flex justify-content-between align-items-center" style={{ backgroundColor: '#0C756F', color: 'white', border: 'none', borderRadius: '15px 15px 0 0' }}>
            <h5 className="mb-0" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {isEditing ? `${dictionary.admin.ruleForm.editTitle}: ${editingRule?.rule_id}` : dictionary.admin.ruleForm.createTitle}
            </h5>
            <button
              className="btn btn-sm"
              style={{ backgroundColor: 'transparent', color: 'white', border: '1px solid white', borderRadius: '8px', fontFamily: "'Space Grotesk', sans-serif" }}
              onClick={cancelForm}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <i className="bi bi-x-circle me-1"></i> Cancel
            </button>
          </div>
          <div className="card-body">
            <form onSubmit={handleFormSubmit}>
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label htmlFor="ruleId" className="form-label" style={{ fontFamily: "'Space Grotesk', sans-serif", color: 'rgba(15, 15, 20, 0.7)' }}>{dictionary.admin.rulesManagement.ruleId}{isEditing ? '*' : ' (Auto-generated)'}</label>
                    <input
                      type="text"
                      className={`form-control ${formErrors.rule_id ? 'is-invalid' : ''}`}
                      id="ruleId"
                      value={ruleFormData.rule_id}
                      onChange={(e) => setRuleFormData({...ruleFormData, rule_id: e.target.value})}
                      placeholder={isEditing ? "e.g., OVERTIME_125" : "Will be auto-generated"}
                      disabled={isEditing} // Don't allow changing ID when editing
                      style={{ borderRadius: '8px', border: '1px solid #0C756F', fontFamily: "'Manrope', sans-serif" }}
                    />
                    {formErrors.rule_id && <div className="invalid-feedback">{formErrors.rule_id}</div>}
                    {!isEditing && (
                      <div className="form-text text-muted">
                        {dictionary.admin.rulesManagement.ruleIdAutoGenerated}
                      </div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="ruleName" className="form-label" style={{ fontFamily: "'Space Grotesk', sans-serif", color: 'rgba(15, 15, 20, 0.7)' }}>{dictionary.admin.rulesManagement.ruleName}</label>
                    <input
                      type="text"
                      className={`form-control ${formErrors.name ? 'is-invalid' : ''}`}
                      id="ruleName"
                      value={ruleFormData.name}
                      onChange={(e) => setRuleFormData({...ruleFormData, name: e.target.value})}
                      placeholder="e.g., First 2 hours overtime at 125%"
                      style={{ borderRadius: '8px', border: '1px solid #0C756F', fontFamily: "'Manrope', sans-serif" }}
                    />
                    {formErrors.name && <div className="invalid-feedback">{formErrors.name}</div>}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="lawReference" className="form-label" style={{ fontFamily: "'Space Grotesk', sans-serif", color: 'rgba(15, 15, 20, 0.7)' }}>{dictionary.admin.rulesManagement.lawReferenceLabel}</label>
                    <input
                      type="text"
                      className={`form-control ${formErrors.law_reference ? 'is-invalid' : ''}`}
                      id="lawReference"
                      value={ruleFormData.law_reference}
                      onChange={(e) => setRuleFormData({...ruleFormData, law_reference: e.target.value})}
                      placeholder="e.g., Section 16A"
                      style={{ borderRadius: '8px', border: '1px solid #0C756F', fontFamily: "'Manrope', sans-serif" }}
                    />
                    {formErrors.law_reference && <div className="invalid-feedback">{formErrors.law_reference}</div>}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="description" className="form-label" style={{ fontFamily: "'Space Grotesk', sans-serif", color: 'rgba(15, 15, 20, 0.7)' }}>{dictionary.admin.rulesManagement.description}</label>
                    <textarea
                      className={`form-control ${formErrors.description ? 'is-invalid' : ''}`}
                      id="description"
                      rows={3}
                      value={ruleFormData.description}
                      onChange={(e) => setRuleFormData({...ruleFormData, description: e.target.value})}
                      placeholder="What this rule checks for"
                      style={{ borderRadius: '8px', border: '1px solid #0C756F', fontFamily: "'Manrope', sans-serif" }}
                    />
                    {formErrors.description && <div className="invalid-feedback">{formErrors.description}</div>}
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="effectiveFrom" className="form-label" style={{ fontFamily: "'Space Grotesk', sans-serif", color: 'rgba(15, 15, 20, 0.7)' }}>{dictionary.admin.rulesManagement.effectiveFrom}</label>
                      <input
                        type="date"
                        className={`form-control ${formErrors.effective_from ? 'is-invalid' : ''}`}
                        id="effectiveFrom"
                        value={ruleFormData.effective_from}
                        onChange={(e) => setRuleFormData({...ruleFormData, effective_from: e.target.value})}
                        style={{ borderRadius: '8px', border: '1px solid #0C756F', fontFamily: "'Manrope', sans-serif" }}
                      />
                      {formErrors.effective_from && <div className="invalid-feedback">{formErrors.effective_from}</div>}
                    </div>

                    <div className="col-md-6 mb-3">
                      <label htmlFor="effectiveTo" className="form-label" style={{ fontFamily: "'Space Grotesk', sans-serif", color: 'rgba(15, 15, 20, 0.7)' }}>{dictionary.admin.rulesManagement.effectiveTo}</label>
                      <input
                        type="date"
                        className="form-control"
                        id="effectiveTo"
                        value={ruleFormData.effective_to}
                        onChange={(e) => setRuleFormData({...ruleFormData, effective_to: e.target.value})}
                        placeholder="YYYY-MM-DD or leave blank"
                        style={{ borderRadius: '8px', border: '1px solid #0C756F', fontFamily: "'Manrope', sans-serif" }}
                      />
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <label className="form-label mb-0" style={{ fontFamily: "'Space Grotesk', sans-serif", color: 'rgba(15, 15, 20, 0.7)' }}>Available Functions:</label>
                    </div>
                    <div className="small mb-2" style={{ color: 'rgba(15, 15, 20, 0.7)', fontFamily: "'Manrope', sans-serif" }}>
                      <code style={{ backgroundColor: 'rgba(12, 117, 111, 0.1)', padding: '2px 4px', borderRadius: '3px', color: '#0C756F' }}>min(), max(), abs(), round()</code>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <label className="form-label mb-0" style={{ fontFamily: "'Space Grotesk', sans-serif", color: 'rgba(15, 15, 20, 0.7)' }}>Available Variables:</label>
                    </div>
                    <div className="small" style={{ color: 'rgba(15, 15, 20, 0.7)', fontFamily: "'Manrope', sans-serif" }}>
                      <code style={{ backgroundColor: 'rgba(12, 117, 111, 0.1)', padding: '2px 4px', borderRadius: '3px', color: '#0C756F' }}>payslip.*, attendance.*, contract.*</code><br/>
                      <code style={{ backgroundColor: 'rgba(12, 117, 111, 0.1)', padding: '2px 4px', borderRadius: '3px', color: '#0C756F' }}>employee_id, month, hourly_rate, overtime_hours, total_hours, etc.</code>
                    </div>
                  </div>

                  {/* Test Expression Button */}
                  <div className="mb-3">
                    <button
                      type="button"
                      className="btn"
                      style={{ backgroundColor: '#FDCF6F', color: '#0F0F14', border: 'none', borderRadius: '8px', fontFamily: "'Space Grotesk', sans-serif", transform: 'scale(1)', transition: 'all 0.2s' }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      onClick={() => setActiveTab('test')}
                    >
                      🧪 Test Expression in Tab 2
                    </button>
                  </div>
                </div>
              </div>

              {/* Test Rule Section within Form */}
              <div className="mt-4">
                <div className="card" style={{ backgroundColor: 'rgba(253, 207, 111, 0.1)', border: '1px solid #FDCF6F', borderRadius: '12px' }}>
                  <div className="card-header" style={{ backgroundColor: '#FDCF6F', color: '#0F0F14', borderRadius: '12px 12px 0 0' }}>
                    <h6 className="mb-0" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      🧪 Test Rule (Manual Entry)
                    </h6>
                  </div>
                  <div className="card-body">
                    {/* Input Method Selection */}
                    <InputMethodSelector
                      inputMethod={inputMethod}
                      onInputMethodChange={(method) => {
                        setInputMethod(method);
                        if (method === 'sample') {
                          loadSampleData();
                        }
                      }}
                      onLoadSampleData={loadSampleData}
                      dictionary={dictionary}
                    />

                    {inputMethod === 'json' && (
                      <JsonUploadForm
                        uploadedJson={uploadedJson}
                        onJsonChange={(json) => handleJsonUpload({ target: { value: json } } as any)}
                      />
                    )}

                    {inputMethod === 'manual' && dynamicParams && (
                      <ManualEntryForm
                        dynamicParams={dynamicParams}
                        dynamicFormData={dynamicFormData}
                        onDynamicInputChange={(section: string, param: string, value: any) => handleDynamicInputChange(section as 'payslip' | 'attendance' | 'contract', param, value)}
                        includePayslip={includePayslip}
                        includeContract={includeContract}
                        includeAttendance={includeAttendance}
                        onIncludePayslipChange={setIncludePayslip}
                        onIncludeContractChange={setIncludeContract}
                        onIncludeAttendanceChange={setIncludeAttendance}
                        dictionary={dictionary}
                        lang={lang}
                      />
                    )}

                    {/* Test Rule Button */}
                    <div className="mb-3">
                      <button
                        type="button"
                        className="btn"
                        style={{ backgroundColor: '#0C756F', color: 'white', border: 'none', borderRadius: '8px', fontFamily: "'Space Grotesk', sans-serif", transform: 'scale(1)', transition: 'all 0.2s' }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        onClick={() => testRuleInForm()}
                        disabled={isTesting || ruleChecks.length === 0}
                      >
                        {isTesting ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            Testing Rule...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-play-circle-fill me-2"></i>Test Rule
                          </>
                        )}
                      </button>
                      {ruleChecks.length === 0 && (
                        <small className="text-muted ms-2" style={{ fontFamily: "'Manrope', sans-serif" }}>
                          {dictionary.admin.messages.addAtLeastOneCheckToTest}
                        </small>
                      )}
                    </div>

                    {/* Test Results */}
                    {testResults && (
                      <TestResults testResults={testResults} isLoading={isTesting} dictionary={dictionary} lang={lang} />
                    )}
                  </div>
                </div>
              </div>

              {/* Rule Checks Section */}
              <div className="mt-4">
                <h6 className="mb-3">Rule Checks</h6>

                {/* Display current checks */}
                {ruleChecks.length > 0 && (
                  <div className="mb-3">
                    <h6>Current Checks:</h6>
                    {ruleChecks.map((check, index) => (
                      <div key={index} className="card mb-2">
                        <div className="card-body py-2 px-3">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <strong>Check {index + 1}: {check.violation_message || 'No message'}</strong>
                            <button
                              type="button"
                              className="btn btn-sm btn-danger"
                              onClick={() => removeCheck(index)}
                            >
                              <i className="bi bi-trash"></i> Remove
                            </button>
                          </div>
                          <div className="row">
                            <div className="col-md-6">
                              <small><strong>Condition:</strong></small><br/>
                              <code>{check.condition || 'Not set'}</code>
                            </div>
                            <div className="col-md-6">
                              <small><strong>Amount Owed:</strong></small><br/>
                              <code>{check.amount_owed || 'Not set'}</code>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add new check inputs */}
                <div className="card mb-3">
                  <div className="card-header">
                    <strong>Add/Edit Check</strong>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Condition</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="e.g., attendance.overtime_hours > 0"
                          value={ruleChecks.length > 0 ? ruleChecks[ruleChecks.length - 1]?.condition || '' : ''}
                          onChange={(e) => {
                            if (ruleChecks.length === 0) {
                              addCheck();
                            }
                            updateCheck(ruleChecks.length - 1, 'condition', e.target.value);
                          }}
                        />
                        <div className="form-text">e.g., attendance.overtime_hours &gt; 0</div>
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Amount Owed Formula</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="(contract.hourly_rate * 1.25 - payslip.overtime_rate) * min(attendance.overtime_hours, 2)"
                          value={ruleChecks.length > 0 ? ruleChecks[ruleChecks.length - 1]?.amount_owed || '' : ''}
                          onChange={(e) => {
                            if (ruleChecks.length === 0) {
                              addCheck();
                            }
                            updateCheck(ruleChecks.length - 1, 'amount_owed', e.target.value);
                          }}
                        />
                        <div className="form-text">e.g., (contract.hourly_rate * 1.25 - payslip.overtime_rate) * min(attendance.overtime_hours, 2)</div>
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Violation Message</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g., Overtime rate violation"
                        value={ruleChecks.length > 0 ? ruleChecks[ruleChecks.length - 1]?.violation_message || '' : ''}
                        onChange={(e) => {
                          if (ruleChecks.length === 0) {
                            addCheck();
                          }
                          updateCheck(ruleChecks.length - 1, 'violation_message', e.target.value);
                        }}
                      />
                      <div className="form-text">e.g., Overtime rate violation</div>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="row">
                  <div className="col-md-12">
                    <div className="d-flex gap-2 justify-content-end">
                      <button
                        type="button"
                        className="btn btn-success"
                        onClick={addCheck}
                      >
                        <i className="bi bi-plus-circle"></i> Add Check
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary"
                      >
                        <i className="bi bi-check-circle"></i> {isEditing ? 'Update Rule' : 'Create Rule'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  // Render the rule details
  const renderRuleDetails = () => {
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
                onClick={() => startEditRule(selectedRule)}
              >
                <i className="bi bi-pencil me-1"></i>Edit
              </button>
              <button
                className="btn btn-sm"
                style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '6px', transform: 'scale(1)', transition: 'all 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                onClick={() => deleteRule(selectedRule.rule_id)}
              >
                <i className="bi bi-trash me-1"></i>Delete
              </button>
            </div>
          </div>
          <div className="card-body" style={{ backgroundColor: '#EFEADC' }}>
            <div className="row mb-3">
              <div className="col-md-6">
                <h6 style={{ color: '#0C756F', fontFamily: 'Space Grotesk, sans-serif' }}>{dictionary.admin.rulesManagement.expandedRow.basicInformation}</h6>
                <p><strong style={{ color: '#0C756F' }}>{dictionary.admin.rulesManagement.expandedRow.id}</strong> {selectedRule.rule_id}</p>
                <p><strong style={{ color: '#0C756F' }}>{dictionary.admin.rulesManagement.expandedRow.name}</strong> {selectedRule.name}</p>
                <p><strong style={{ color: '#0C756F' }}>{dictionary.admin.rulesManagement.expandedRow.lawReference}</strong> {selectedRule.law_reference}</p>
                <p><strong style={{ color: '#0C756F' }}>{dictionary.admin.rulesManagement.expandedRow.description}</strong> {selectedRule.description}</p>
                <p>
                  <strong style={{ color: '#0C756F' }}>{dictionary.admin.rulesManagement.expandedRow.effectivePeriod}</strong> {selectedRule.effective_from} to {selectedRule.effective_to || dictionary.admin.rulesManagement.ongoing}
                </p>
                {selectedRule.created_date && (
                  <p><strong style={{ color: '#0C756F' }}>{dictionary.admin.rulesManagement.expandedRow.created}</strong> {new Date(selectedRule.created_date).toLocaleString()}</p>
                )}
                {selectedRule.updated_date && (
                  <p><strong style={{ color: '#0C756F' }}>{dictionary.admin.rulesManagement.expandedRow.lastUpdated}</strong> {new Date(selectedRule.updated_date).toLocaleString()}</p>
                )}
              </div>
              <div className="col-md-6">
                <h6 style={{ color: '#0C756F', fontFamily: 'Space Grotesk, sans-serif' }}>{dictionary.admin.rulesManagement.checks}</h6>
                {selectedRule.checks.map((check, index) => (
                  <div key={index} className="card mb-2" style={{ backgroundColor: 'white', border: '1px solid rgba(12, 117, 111, 0.1)', borderRadius: '8px' }}>
                    <div className="card-body py-2 px-3">
                      <p className="mb-1"><strong style={{ color: '#0C756F' }}>{dictionary.admin.rulesManagement.expandedRow.violation}</strong> {check.violation_message}</p>
                      <p className="mb-1"><strong style={{ color: '#0C756F' }}>{dictionary.admin.rulesManagement.expandedRow.condition}</strong> <code style={{ backgroundColor: '#f8f9fa', color: '#0C756F' }}>{check.condition}</code></p>
                      <p className="mb-0"><strong style={{ color: '#0C756F' }}>{dictionary.admin.rulesManagement.expandedRow.amountOwed}</strong> <code style={{ backgroundColor: '#f8f9fa', color: '#0C756F' }}>{check.amount_owed}</code></p>
                    </div>
                  </div>
                ))}

                <h6 className="mt-3" style={{ color: '#0C756F', fontFamily: 'Space Grotesk, sans-serif' }}>{dictionary.admin.rulesManagement.expandedRow.penaltyCalculation}</h6>
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
  };

  // Render the rules list
  const renderRulesList = () => {
    if (loading) {
      return (
        <div className="text-center py-4">
          <div className="spinner-border" style={{ color: '#0C756F' }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2" style={{ color: '#0C756F', fontFamily: 'Manrope, sans-serif' }}>Loading rules...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="alert" style={{ backgroundColor: '#fef2f2', color: '#dc3545', border: '1px solid #fecaca', borderRadius: '8px' }} role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
        </div>
      );
    }

    if (rules.length === 0) {
      return (
        <div className="text-center py-4">
          <i className="bi bi-exclamation-circle fs-1" style={{ color: '#0C756F' }}></i>
          <p className="mt-2" style={{ color: '#666', fontFamily: 'Manrope, sans-serif' }}>No labor law rules found. Create your first rule using the button above.</p>
        </div>
      );
    }

    return (
      <div className="table-responsive">
        <table className="table" style={{ backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <thead style={{ backgroundColor: '#0C756F', color: 'white' }}>
            <tr>
              <th style={{ fontFamily: "'Space Grotesk', sans-serif", border: 'none', padding: '12px' }}>{dictionary.admin.rulesManagement.name}</th>
              <th style={{ fontFamily: "'Space Grotesk', sans-serif", border: 'none', padding: '12px' }}>{dictionary.admin.rulesManagement.lawReference}</th>
              <th style={{ fontFamily: "'Space Grotesk', sans-serif", border: 'none', padding: '12px' }}>{dictionary.admin.rulesManagement.effectivePeriod}</th>
              <th style={{ fontFamily: "'Space Grotesk', sans-serif", border: 'none', padding: '12px' }}>{dictionary.admin.rulesManagement.checks}</th>
              <th className="text-end" style={{ fontFamily: "'Space Grotesk', sans-serif", border: 'none', padding: '12px' }}>{dictionary.admin.rulesManagement.actions}</th>
            </tr>
          </thead>
          <tbody>
            {rules.map(rule => (
              <tr key={rule.rule_id} onClick={() => setSelectedRule(rule)} style={{ cursor: 'pointer', transition: 'all 0.2s', fontFamily: "'Manrope', sans-serif" }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(12, 117, 111, 0.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                <td style={{ padding: '12px', borderBottom: '1px solid rgba(12, 117, 111, 0.1)' }}>{rule.name}</td>
                <td style={{ padding: '12px', borderBottom: '1px solid rgba(12, 117, 111, 0.1)' }}>{rule.law_reference}</td>
                <td style={{ padding: '12px', borderBottom: '1px solid rgba(12, 117, 111, 0.1)' }}>{rule.effective_from} to {rule.effective_to || dictionary.admin.rulesManagement.ongoing}</td>
                <td style={{ padding: '12px', borderBottom: '1px solid rgba(12, 117, 111, 0.1)' }}>
                  <span className="badge" style={{ backgroundColor: '#0C756F', color: 'white', borderRadius: '12px', padding: '4px 8px' }}>
                    {rule.checks.length}
                  </span>
                </td>
                <td className="text-end" style={{ padding: '12px', borderBottom: '1px solid rgba(12, 117, 111, 0.1)' }}>
                  <button
                    className="btn btn-sm me-2"
                    style={{ backgroundColor: '#0C756F', color: 'white', border: 'none', borderRadius: '6px', transform: 'scale(1)', transition: 'all 0.2s' }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    onClick={(e) => { e.stopPropagation(); startEditRule(rule); }}
                  >
                    <i className="bi bi-pencil me-1"></i>{dictionary.admin.rulesManagement.edit}
                  </button>
                  <button
                    className="btn btn-sm"
                    style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '6px', transform: 'scale(1)', transition: 'all 0.2s' }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    onClick={(e) => { e.stopPropagation(); deleteRule(rule.rule_id); }}
                  >
                    <i className="bi bi-trash me-1"></i>{dictionary.admin.rulesManagement.delete}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="rules-management-container">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">{dictionary.admin.rulesManagement.laborLawRulesManagement}</h4>
        <button
          className="btn btn-success"
          onClick={startCreateRule}
        >
          <i className="bi bi-plus-circle"></i> {dictionary.admin.rulesManagement.addNewRule}
        </button>
      </div>

      {/* Tab Navigation */}
      <ul className="nav nav-tabs mb-4" id="rulesTabs" role="tablist">
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link ${activeTab === 'manage' ? 'active' : ''}`}
            id="manage-tab"
            type="button"
            role="tab"
            onClick={() => setActiveTab('manage')}
          >
            {dictionary.admin.rulesManagement.viewEditRules}
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link ${activeTab === 'test' ? 'active' : ''}`}
            id="test-tab"
            type="button"
            role="tab"
            onClick={() => setActiveTab('test')}
          >
            {dictionary.admin.rulesManagement.quickExpressionTester}
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link ${activeTab === 'params' ? 'active' : ''}`}
            id="params-tab"
            type="button"
            role="tab"
            onClick={() => setActiveTab('params')}
          >
            {dictionary.admin.rulesManagement.manageDynamicParameters}
          </button>
        </li>
      </ul>

      {/* Tab Content */}
      <div className="tab-content">
        {/* Manage Rules Tab */}
        {activeTab === 'manage' && (
          <ManageRulesTab
            lang={lang}
            rules={rules}
            loading={loading}
            error={error}
            isUnauthorized={isUnauthorized}
            selectedRule={selectedRule}
            showRuleForm={showRuleForm}
            isEditing={isEditing}
            editingRule={editingRule}
            ruleFormData={ruleFormData}
            formErrors={formErrors}
            ruleChecks={ruleChecks}
            dynamicParams={dynamicParams}
            dynamicFormData={dynamicFormData}
            includePayslip={includePayslip}
            includeContract={includeContract}
            includeAttendance={includeAttendance}
            testResults={testResults}
            isTesting={isTesting}
            dictionary={dictionary}
            // Test-related props for individual rule testing
            testInputMethod={testInputMethod}
            testUploadedJson={testUploadedJson}
            testDynamicFormData={testDynamicFormData}
            testIncludePayslip={testIncludePayslip}
            testIncludeContract={testIncludeContract}
            testIncludeAttendance={testIncludeAttendance}
            onRuleSelect={handleRuleSelect}
            onStartCreateRule={startCreateRule}
            onStartEditRule={startEditRule}
            onDeleteRule={deleteRule}
            onTestRule={testRule}
            onTestRuleInForm={testRuleInForm}
            onFormDataChange={(data) => setRuleFormData({...ruleFormData, ...data})}
            onFormSubmit={handleFormSubmit}
            onAddCheck={addCheck}
            onUpdateCheck={updateCheck}
            onRemoveCheck={removeCheck}
            onCancelForm={cancelForm}
            onDynamicInputChange={handleDynamicInputChange}
            onIncludePayslipChange={setIncludePayslip}
            onIncludeContractChange={setIncludeContract}
            onIncludeAttendanceChange={setIncludeAttendance}
            onLoadSampleData={loadSampleData}
            onSetActiveTab={(tab: string) => setActiveTab(tab as TabType)}
            // Test-related handlers
            onTestInputMethodChange={setTestInputMethod}
            onTestJsonChange={setTestUploadedJson}
            onTestDynamicInputChange={(section, param, value) => {
              const validSection = section as 'payslip' | 'attendance' | 'contract';
              setTestDynamicFormData(prev => {
                const newData = {
                  ...prev,
                  [validSection]: {
                    ...prev[validSection],
                    [param]: value
                  }
                };
                
                // If updating employee_id or month in payslip section, automatically update attendance and contract sections
                if (validSection === 'payslip' && (param === 'employee_id' || param === 'month')) {
                  newData.attendance = {
                    ...newData.attendance,
                    [param]: value
                  };
                  newData.contract = {
                    ...newData.contract,
                    [param]: value
                  };
                }
                
                return newData;
              });
            }}
            onTestIncludePayslipChange={setTestIncludePayslip}
            onTestIncludeContractChange={setTestIncludeContract}
            onTestIncludeAttendanceChange={setTestIncludeAttendance}
            onTestLoadSampleData={() => {
              // Load sample data for test
              setTestDynamicFormData({
                employee_id: 'TEST_001',
                month: '2024-07',
                payslip: {
                  base_salary: 4800.0,
                  overtime_rate: 35.0,
                  hourly_rate: 30.0
                },
                attendance: {
                  overtime_hours: 5,
                  regular_hours: 160,
                  total_hours: 165
                },
                contract: {
                  hourly_rate: 30.0,
                  employee_id: 'TEST_001'
                }
              });
            }}
            onExecuteRuleTest={testRule}
            onClearTestResults={() => setTestResults(null)}
            checkEditor={checkEditor}
            onUpdateCheckEditor={updateCheckEditor}
            onGenerateAIChecks={generateAIChecks}
          />
        )}

        {/* Test Expression Tab */}
        {activeTab === 'test' && (
          <TestExpressionTab
            expression={expression}
            expressionType={expressionType}
            expressionResult={expressionResult}
            isEvaluating={isEvaluating}
            dynamicParams={dynamicParams}
            dynamicFormData={dynamicFormData}
            includePayslip={includePayslip}
            includeContract={includeContract}
            includeAttendance={includeAttendance}
            dictionary={dictionary}
            lang={lang}
            onExpressionChange={setExpression}
            onExpressionTypeChange={setExpressionType}
            onEvaluateExpression={evaluateExpression}
            onDynamicInputChange={handleDynamicInputChange}
            onIncludePayslipChange={setIncludePayslip}
            onIncludeContractChange={setIncludeContract}
            onIncludeAttendanceChange={setIncludeAttendance}
            onLoadSampleData={loadSampleData}
          />
        )}

        {/* Dynamic Parameters Tab */}
        {activeTab === 'params' && (
          <DynamicParametersTab
            dynamicParams={dynamicParams}
            paramOperationLoading={paramOperationLoading}
            paramOperationMessage={paramOperationMessage}
            dictionary={dictionary}
            onAddDynamicParam={addDynamicParam}
            onUpdateDynamicParam={updateDynamicParam}
            onRemoveDynamicParam={removeDynamicParam}
            onClearParamOperationMessage={() => setParamOperationMessage(null)}
          />
        )}
      </div>
    </div>
  );
}
