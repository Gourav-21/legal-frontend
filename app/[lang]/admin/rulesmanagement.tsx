'use client';

import { useEffect, useState } from 'react';
import DynamicParametersTab from './DynamicParametersTab';
import ManageRulesTab from './ManageRulesTab';
import TestExpressionTab from './TestExpressionTab';
import { Locale } from "../../../i18n-config";

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
  dictionary: Record<string, any>;
}

type TabType = 'manage' | 'test' | 'params';

export default function RulesManagement({ lang, dictionary }: RulesManagementProps) {
  const [activeTab, setActiveTab] = useState<TabType>('manage');
  const [rules, setRules] = useState<Rule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [formSubmitError, setFormSubmitError] = useState<string | null>(null);
  const [isUnauthorized, setIsUnauthorized] = useState(false);

  // For rule details view
  const [selectedRule, setSelectedRule] = useState<Rule | null>(null);

  // For unified add/edit form
  const [showRuleForm, setShowRuleForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingRule, setEditingRule] = useState<Rule | null>(null);

  // Form data for unified form
  const [ruleFormData, setRuleFormData] = useState<{
    rule_id?: string;
    name: string;
    law_reference: string;
    description: string;
    effective_from: string;
    effective_to?: string;
  }>({
    name: '',
    law_reference: '',
    description: '',
    effective_from: new Date().toISOString().split('T')[0],
    effective_to: undefined
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

      const trimmedChecks = data.generated_checks.map((check: {condition: string; amount_owed: string; violation_message: string}) => ({
        condition: check.condition.trim(),
        amount_owed: check.amount_owed.trim(),
        violation_message: check.violation_message.trim()
      }));

      setRuleChecks(trimmedChecks);
      // Clear the 'checks' validation error if checks are added
      setFormErrors(prev => {
        const { checks, ...rest } = prev;
        return rest;
      });
      return trimmedChecks;
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

  // For expression tester
  const [expression, setExpression] = useState('');
  const [expressionType, setExpressionType] = useState<'condition' | 'calculation'>('condition');
  const [expressionResult, setExpressionResult] = useState<any>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  // For dynamic test data setup
  const [dynamicParams, setDynamicParams] = useState<any>(null);
  const [includePayslip, setIncludePayslip] = useState(true);
  const [includeContract, setIncludeContract] = useState(true);
  const [includeEmployee, setIncludeEmployee] = useState(true);
  const [includeAttendance, setIncludeAttendance] = useState(true);

  // Dynamic form data
  const [dynamicFormData, setDynamicFormData] = useState({
    employee_id: 'TEST_001',
    month: '2024-07',
    payslip: {} as Record<string, any>,
    attendance: {} as Record<string, any>,
    contract: {} as Record<string, any>,
    employee: {} as Record<string, any>
  });

  // Test-related state for individual rule testing in expanded rows
  const [testInputMethod, setTestInputMethod] = useState<'manual' | 'json' | 'sample'>('manual');
  const [testUploadedJson, setTestUploadedJson] = useState<string>('');
  const [testDynamicFormData, setTestDynamicFormData] = useState({
    employee_id: 'TEST_001',
    month: '2024-07',
    payslip: {} as Record<string, any>,
    attendance: {} as Record<string, any>,
    contract: {} as Record<string, any>,
    employee: {} as Record<string, any>
  });
  const [testIncludePayslip, setTestIncludePayslip] = useState(true);
  const [testIncludeContract, setTestIncludeContract] = useState(true);
  const [testIncludeEmployee, setTestIncludeEmployee] = useState(true);
  const [testIncludeAttendance, setTestIncludeAttendance] = useState(true);

  // For adding/removing dynamic parameters
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
        } : {},
        employee: testIncludeEmployee ? {
          employee_id: testDynamicFormData.employee_id,
          ...testDynamicFormData.employee
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
      const errorMessage = dictionary.admin.rulesManagement.messages.addAtLeastOneRuleCheck;
      setTestResults({ error: errorMessage });
      // Also show in form errors for better visibility
      setFormErrors(prev => ({ ...prev, test: errorMessage }));
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
        ,
        employee: includeEmployee ? dynamicFormData.employee : {}
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
      // Clear any test errors from form errors on success
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.test;
        return newErrors;
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Test failed';
      setTestResults({ error: errorMessage });
      // Also show in form errors for better visibility
      setFormErrors(prev => ({ ...prev, test: errorMessage }));
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
        ,
        employee: includeEmployee ? dynamicFormData.employee : {}
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
        contract: [],
        employee: []
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
  const handleDynamicInputChange = (section: 'payslip' | 'attendance' | 'contract' | 'employee', param: string, value: any) => {
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
          newData.employee = {
            ...newData.employee,
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
      },
      employee: {}
    });
  };

  // Add a new dynamic parameter
  const addDynamicParam = async (section: 'payslip' | 'attendance' | 'contract' | 'employee', paramName: string, labelEn: string, labelHe: string, description: string, type: string) => {
    try {
      const response = await fetch(`/api/dynamic-params/${section}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          param: paramName,
          label_en: labelEn,
          label_he: labelHe,
          description: description,
          type: type
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
  const removeDynamicParam = async (section: 'payslip' | 'attendance' | 'contract' | 'employee', paramName: string) => {
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
      // setRemoveParamName('');

      return result;
    } catch (err) {
      console.error('Error removing parameter:', err);
      throw err;
    }
  };

  // Update a dynamic parameter
  const updateDynamicParam = async (section: 'payslip' | 'attendance' | 'contract' | 'employee', paramName: string, labelEn: string, labelHe: string, description: string, type: string) => {
    try {
      const response = await fetch(`/api/dynamic-params/${section}/${paramName}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          label_en: labelEn,
          label_he: labelHe,
          description: description,
          type: type
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
        const errorData = await response.json();
        const errorMessage = errorData.detail || errorData.message || response.statusText;
        throw new Error(errorMessage);
      }

      const newRule = await response.json();
      setRules([...rules, newRule]);
      setError(null);
      setSuccessMessage(dictionary.admin.rulesManagement.messages.ruleCreatedSuccessfully);
      setTimeout(() => setSuccessMessage(null), 5000);
      return newRule;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : dictionary.admin.rulesManagement.messages.failedToAddRule;
      setFormSubmitError(`${dictionary.admin.rulesManagement.messages.failedToAddRule}: ${errorMessage}`);
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
        const errorData = await response.json();
        const errorMessage = errorData.detail || errorData.message || response.statusText;
        throw new Error(errorMessage);
      }

      const updatedRule = await response.json();
      setRules(rules.map(r => r.rule_id === rule.rule_id ? updatedRule : r));
      setError(null);
      setSuccessMessage(dictionary.admin.rulesManagement.messages.ruleUpdatedSuccessfully);
      setTimeout(() => setSuccessMessage(null), 5000);
      return updatedRule;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : dictionary.admin.rulesManagement.messages.failedToUpdateRule;
      setFormSubmitError(`${dictionary.admin.rulesManagement.messages.failedToUpdateRule}: ${errorMessage}`);
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
        const errorData = await response.json();
        const errorMessage = errorData.detail || errorData.message || response.statusText;
        throw new Error(errorMessage);
      }

      const deletedRule = await response.json();
      setRules(rules.filter(rule => rule.rule_id !== ruleId));
      setSelectedRule(null);
      setError(null);
      setSuccessMessage(dictionary.admin.rulesManagement.messages.ruleDeletedSuccessfully);
      setTimeout(() => setSuccessMessage(null), 5000);
      return deletedRule;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : dictionary.admin.rulesManagement.messages.failedToDeleteRule;
      setError(`${dictionary.admin.rulesManagement.messages.failedToDeleteRule}: ${errorMessage}`);
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
      effective_to: rule.effective_to || undefined
    });
    setRuleChecks(JSON.parse(JSON.stringify(rule.checks)).map((check: {condition: string; amount_owed: string; violation_message: string}) => ({
      condition: check.condition.trim(),
      amount_owed: check.amount_owed.trim(),
      violation_message: check.violation_message.trim()
    })));
    setFormErrors({});
    setFormSubmitError(null);
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
      effective_to: undefined
    });
    setRuleChecks([]);
    setFormErrors({});
    setFormSubmitError(null);
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
      effective_to: undefined
    });
    setRuleChecks([]);
    setFormErrors({});
    setFormSubmitError(null);
    setTestResults(null); // Clear test results when cancelling form
  };


  // Add a new check item
  const addCheck = () => {
    const newCheck = {
      condition: checkEditor.condition.trim(),
      amount_owed: checkEditor.amount_owed.trim(),
      violation_message: checkEditor.violation_message
    };
    setRuleChecks([...ruleChecks, newCheck]);
    if (formErrors.checks) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.checks;
        return newErrors;
      });
    }
    setCheckEditor({
      condition: '',
      amount_owed: '',
      violation_message: ''
    });
  };

  // Update a check item by index
  const updateCheck = (index: number, updatedCheck: {condition: string; amount_owed: string; violation_message: string}) => {
    const updatedChecks = ruleChecks.map((check, idx) => idx === index ? updatedCheck : check);
    setRuleChecks(updatedChecks);
    // Clear the checks error when a check is updated
    if (formErrors.checks) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.checks;
        return newErrors;
      });
    }
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

  // (Removed old updateCheck, now handled by new function above)

  // Remove a check item
  const removeCheck = (index: number) => {
    const updatedChecks = [...ruleChecks];
    updatedChecks.splice(index, 1);
    setRuleChecks(updatedChecks);

    // If no checks remain, add the checks error
    if (updatedChecks.length === 0) {
      setFormErrors(prev => ({
        ...prev,
        checks: dictionary.admin.rulesManagement.validation.atLeastOneCheckIsRequired
      }));
    }
  };

  // Handle form submission
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const errors: Record<string, string> = {};

    if (!ruleFormData?.name || !ruleFormData.name.trim()) {
      errors.name = dictionary.admin.rulesManagement.validation.ruleNameIsRequired;
    }
    if (!ruleFormData?.description || !ruleFormData.description.trim()) {
      errors.description = dictionary.admin.rulesManagement.validation.descriptionIsRequired;
    }
    if (!ruleFormData?.effective_from) {
      errors.effective_from = dictionary.admin.rulesManagement.validation.effectiveFromDateIsRequired;
    }
    if (ruleFormData?.effective_from && ruleFormData?.effective_to && new Date(ruleFormData.effective_to) <= new Date(ruleFormData.effective_from)) {
      errors.effective_to = dictionary.admin.rulesManagement.validation.effectiveToMustBeAfterEffectiveFrom;
    }
    if (ruleChecks.length === 0) {
      errors.checks = dictionary.admin.rulesManagement.validation.atLeastOneCheckIsRequired;
    } else {
      ruleChecks.forEach((check, index) => {
        // Ensure check is a valid object
        if (!check || typeof check !== 'object') {
          errors[`check_${index}_invalid`] = dictionary.admin.rulesManagement.validation.invalidCheckData;
          return;
        }

        if (!check?.condition || typeof check.condition !== 'string' || !check.condition.trim()) {
          errors[`check_${index}_condition`] = dictionary.admin.rulesManagement.validation.conditionIsRequired;
        }
        if (!check?.amount_owed || typeof check.amount_owed !== 'string' || !check.amount_owed.trim()) {
          errors[`check_${index}_amount_owed`] = dictionary.admin.rulesManagement.validation.amountOwedFormulaIsRequired;
        }
        if (!check?.violation_message || typeof check.violation_message !== 'string' || !check.violation_message.trim()) {
          errors[`check_${index}_violation`] = dictionary.admin.rulesManagement.validation.violationMessageIsRequired;
        }
      });
    }

    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      if (isEditing && editingRule) {
        const ruleToUpdate: Rule = {
          ...editingRule,
          rule_id: ruleFormData.rule_id || editingRule.rule_id,
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
      const errorMessage = err instanceof Error ? err.message : 'Failed to save rule';
      setFormSubmitError(errorMessage);
    }
  };

  // Render the rule details

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
            successMessage={successMessage}
            formSubmitError={formSubmitError}
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
            includeEmployee={includeEmployee}
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
            testIncludeEmployee={testIncludeEmployee}
            onRuleSelect={handleRuleSelect}
            onStartEditRule={startEditRule}
            onDeleteRule={deleteRule}
            onTestRuleInForm={testRuleInForm}
            onFormDataChange={(data) => {
              setRuleFormData({...ruleFormData, ...data, effective_to: data.effective_to === '' ? undefined : data.effective_to});
              
              // Clear specific field error when user starts typing
              const newErrors = { ...formErrors };
              let hasChanges = false;
              
              if (data.name && newErrors.name) {
                delete newErrors.name;
                hasChanges = true;
              }
              if (data.law_reference && newErrors.law_reference) {
                delete newErrors.law_reference;
                hasChanges = true;
              }
              if (data.description && newErrors.description) {
                delete newErrors.description;
                hasChanges = true;
              }
              if (data.effective_from && newErrors.effective_from) {
                delete newErrors.effective_from;
                hasChanges = true;
              }
              if (data.effective_to && newErrors.effective_to) {
                delete newErrors.effective_to;
                hasChanges = true;
              }
              
              if (hasChanges) {
                setFormErrors(newErrors);
              }
            }}
            onFormSubmit={handleFormSubmit}
            onAddCheck={addCheck}
            onUpdateCheck={updateCheck}
            onRemoveCheck={removeCheck}
            onCancelForm={cancelForm}
            onDynamicInputChange={handleDynamicInputChange}
            onIncludePayslipChange={setIncludePayslip}
            onIncludeContractChange={setIncludeContract}
            onIncludeEmployeeChange={setIncludeEmployee}
            onIncludeAttendanceChange={setIncludeAttendance}
            onLoadSampleData={loadSampleData}
            onSetActiveTab={(tab: string) => setActiveTab(tab as TabType)}
            // Test-related handlers
            onTestInputMethodChange={setTestInputMethod}
            onTestJsonChange={setTestUploadedJson}
            onTestDynamicInputChange={(section, param, value) => {
              const validSection = section as 'payslip' | 'attendance' | 'contract' | 'employee';
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
                    newData.employee = {
                      ...newData.employee,
                      [param]: value
                    };
                  }
                
                return newData;
              });
            }}
            onTestIncludePayslipChange={setTestIncludePayslip}
            onTestIncludeContractChange={setTestIncludeContract}
            onTestIncludeEmployeeChange={setTestIncludeEmployee}
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
                },
                employee: {}
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
            includeEmployee={includeEmployee}
            dictionary={dictionary}
            lang={lang}
            onExpressionChange={setExpression}
            onExpressionTypeChange={setExpressionType}
            onEvaluateExpression={evaluateExpression}
            onDynamicInputChange={handleDynamicInputChange}
            onIncludePayslipChange={setIncludePayslip}
            onIncludeContractChange={setIncludeContract}
            onIncludeEmployeeChange={setIncludeEmployee}
            onIncludeAttendanceChange={setIncludeAttendance}
            onLoadSampleData={loadSampleData}
          />
        )}

        {/* Dynamic Parameters Tab */}
        {activeTab === 'params' && (
          <DynamicParametersTab
            dynamicParams={dynamicParams}
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
