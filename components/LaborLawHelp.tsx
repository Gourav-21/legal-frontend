'use client';

import { useState } from 'react';

interface LaborLawHelpProps {
  dictionary?: Record<string, unknown>;
}

export default function LaborLawHelp({ dictionary }: LaborLawHelpProps) {
  const [isHelpExpanded, setIsHelpExpanded] = useState<boolean>(false);
  
  // Fallback values for when dictionary is not provided
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const t = (dictionary as any)?.laborLawHelp || {};

  return (
    <div className="mt-4">
      <button
        type="button"
        className="btn w-100"
        style={{
          backgroundColor: isHelpExpanded ? '#E6C84A' : '#FDCF6F',
          color: '#0F0F14',
          border: 'none',
          borderRadius: '8px',
          fontFamily: "'Space Grotesk', sans-serif",
          transform: 'scale(1)',
          transition: 'all 0.2s',
          fontWeight: '600',
          boxShadow: isHelpExpanded ? '0 2px 8px rgba(253, 207, 111, 0.3)' : 'none'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        onClick={() => setIsHelpExpanded(!isHelpExpanded)}
      >
        📚 {t.title || "Understanding Labor Law Calculations"}
        <i
          className={`bi ms-2 ${isHelpExpanded ? 'bi-chevron-up' : 'bi-chevron-down'}`}
          style={{
            fontSize: '0.9rem',
            transition: 'transform 0.3s ease-in-out'
          }}
        ></i>
      </button>

      {isHelpExpanded && (
        <div className="mt-3 p-4" style={{
          backgroundColor: 'rgba(12, 117, 111, 0.05)',
          border: '1px solid rgba(12, 117, 111, 0.1)',
          borderRadius: '12px',
          transition: 'all 0.3s ease-in-out'
        }}>
          <h5 style={{ color: '#0C756F', fontFamily: 'Space Grotesk, sans-serif', marginBottom: '20px' }}>
            <i className="bi bi-book me-2"></i>{t.laborLawComplianceGuides || "Labor Law Compliance Guides"}
          </h5>



          {/* Tab Navigation */}
          <ul className="nav nav-tabs" id="lawTabs" role="tablist" style={{ borderBottom: '2px solid #0C756F', marginBottom: '20px' }}>
            <li className="nav-item" role="presentation">
              <button className="nav-link active" id="overtime-tab" data-bs-toggle="tab" data-bs-target="#overtime" type="button" role="tab" aria-controls="overtime" aria-selected="true" style={{ color: '#0C756F', fontWeight: '600', border: 'none', borderBottom: '3px solid transparent' }}>
                <i className="bi bi-clock me-2"></i>{t.tabs?.overtimePay || "Overtime Pay"}
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button className="nav-link" id="minimum-wage-tab" data-bs-toggle="tab" data-bs-target="#minimum-wage" type="button" role="tab" aria-controls="minimum-wage" aria-selected="false" style={{ color: '#0C756F', fontWeight: '600', border: 'none', borderBottom: '3px solid transparent' }}>
                <i className="bi bi-cash-stack me-2"></i>{t.tabs?.minimumWage || "Minimum Wage"}
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button className="nav-link" id="vacation-tab" data-bs-toggle="tab" data-bs-target="#vacation" type="button" role="tab" aria-controls="vacation" aria-selected="false" style={{ color: '#0C756F', fontWeight: '600', border: 'none', borderBottom: '3px solid transparent' }}>
                <i className="bi bi-airplane me-2"></i>{t.tabs?.vacationPay || "Vacation Pay"}
              </button>
            </li>
          </ul>

          {/* Tab Content */}
          <div className="tab-content" id="lawTabsContent">

            {/* Overtime Pay Tab */}
            <div className="tab-pane fade show active" id="overtime" role="tabpanel" aria-labelledby="overtime-tab">
              <div className="mb-4">
                <h6 style={{ color: '#0C756F', fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.1rem', fontWeight: '600', marginBottom: '15px' }}>
                  <i className="bi bi-1-circle me-2"></i>{t.steps?.step1 || "Step 1: Understand the Law Requirement"}
                </h6>
                <div className="card" style={{ backgroundColor: 'white', border: '2px solid #FDCF6F' }}>
                  <div className="card-body">
                    <h6 style={{ color: '#0C756F' }}>{t.overtimePay?.lawTitle || "Overtime Pay Law (Israel)"}</h6>
                    <ul style={{ color: '#2d3748', fontSize: '0.95rem' }}>
                      {(t.overtimePay?.lawDetails || [
                        t.common?.regularTimeHours1to9 || "Regular time: Hours 1-9 per day = 100% of hourly rate",
                        t.common?.firstOvertimeTier || "First overtime tier: Hours 10-11 (first 2 overtime hours) = 125% of hourly rate",
                        t.common?.secondOvertimeTier || "Second overtime tier: Hour 12+ (beyond 2 overtime hours) = 150% of hourly rate"
                      ]).map((detail: string, index: number) => (
                        <li key={index}><strong>{detail.split(':')[0]}:</strong>{detail.split(':').slice(1).join(':')}</li>
                      ))}
                    </ul>
                    <p style={{ color: '#2d3748', fontSize: '0.9rem', marginTop: '10px' }}>
                      <strong>{t.overtimePay?.lawDescription || "In simple terms: If an employee works 11 hours in a day, they get:"}</strong>
                      <br/>• {t.common?.nineHoursAtRegularPay || "9 hours at regular pay"}
                      <br/>• {t.common?.twoHoursAt125PercentPayOvertimePremium || "2 hours at 125% pay (overtime premium)"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h6 style={{ color: '#0C756F', fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.1rem', fontWeight: '600', marginBottom: '15px' }}>
                  <i className="bi bi-2-circle me-2"></i>{t.steps?.step2 || "Step 2: What Data Do We Need?"}
                </h6>
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <div className="card h-100" style={{ backgroundColor: 'rgba(12, 117, 111, 0.05)', border: '1px solid rgba(12, 117, 111, 0.2)' }}>
                      <div className="card-body text-center">
                        <i className="bi bi-file-earmark-text" style={{ fontSize: '2rem', color: '#0C756F' }}></i>
                        <h6 style={{ color: '#0C756F', fontSize: '0.9rem', marginTop: '10px' }}>{t.overtimePay?.dataNeeded?.contractData || "Contract Data"}</h6>
                        <code style={{ backgroundColor: 'rgba(12, 117, 111, 0.1)', padding: '2px 4px', borderRadius: '3px', fontSize: '0.8rem' }}>
                          {t.common?.contractHourlyRate || "contract.hourly_rate"}
                        </code>
                        <p style={{ fontSize: '0.8rem', color: '#2d3748', marginTop: '5px' }}>{t.common?.theAgreedHourlyPayRate || "The agreed hourly pay rate"}</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 mb-3">
                    <div className="card h-100" style={{ backgroundColor: 'rgba(12, 117, 111, 0.05)', border: '1px solid rgba(12, 117, 111, 0.2)' }}>
                      <div className="card-body text-center">
                        <i className="bi bi-calendar-check" style={{ fontSize: '2rem', color: '#0C756F' }}></i>
                        <h6 style={{ color: '#0C756F', fontSize: '0.9rem', marginTop: '10px' }}>{t.overtimePay?.dataNeeded?.attendanceData || "Attendance Data"}</h6>
                        <code style={{ backgroundColor: 'rgba(12, 117, 111, 0.1)', padding: '2px 4px', borderRadius: '3px', fontSize: '0.8rem' }}>
                          {t.common?.attendanceOvertimeHours || "attendance.overtime_hours"}
                        </code>
                        <p style={{ fontSize: '0.8rem', color: '#2d3748', marginTop: '5px' }}>{t.common?.totalOvertimeHoursWorked || "Total overtime hours worked"}</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 mb-3">
                    <div className="card h-100" style={{ backgroundColor: 'rgba(12, 117, 111, 0.05)', border: '1px solid rgba(12, 117, 111, 0.2)' }}>
                      <div className="card-body text-center">
                        <i className="bi bi-cash-stack" style={{ fontSize: '2rem', color: '#0C756F' }}></i>
                        <h6 style={{ color: '#0C756F', fontSize: '0.9rem', marginTop: '10px' }}>{t.overtimePay?.dataNeeded?.payslipData || "Payslip Data"}</h6>
                        <code style={{ backgroundColor: 'rgba(12, 117, 111, 0.1)', padding: '2px 4px', borderRadius: '3px', fontSize: '0.8rem' }}>
                          {t.common?.payslipOvertimeRate || "payslip.overtime_rate"}
                        </code>
                        <p style={{ fontSize: '0.8rem', color: '#2d3748', marginTop: '5px' }}>{t.common?.whatTheyWereActuallyPaidPerOvertimeHour || "What they were actually paid per overtime hour"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h6 style={{ color: '#0C756F', fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.1rem', fontWeight: '600', marginBottom: '15px' }}>
                  <i className="bi bi-3-circle me-2"></i>{t.steps?.step3 || "Step 3: Available Functions & Examples"}
                </h6>
                <div className="alert alert-info" style={{ backgroundColor: 'rgba(23, 162, 184, 0.1)', border: '1px solid #17a2b8', borderRadius: '8px', marginBottom: '20px' }}>
                  <i className="bi bi-info-circle me-2"></i>
                  <strong style={{ color: '#0C756F' }}>{t.common?.availableFunctions || "Available Functions:"}</strong> <code>min()</code>, <code>max()</code>, <code>abs()</code>, <code>round()</code>
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <div className="card h-100 shadow-sm" style={{ border: '2px solid #28a745', borderRadius: '12px' }}>
                      <div className="card-header" style={{ backgroundColor: '#28a745', color: 'white', borderRadius: '10px 10px 0 0' }}>
                        <h6 className="mb-0" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                          <i className="bi bi-chevron-down me-2"></i>min(a, b) - {t.common?.smallerValue || "Smaller Value"}
                        </h6>
                      </div>
                      <div className="card-body">
                        <p style={{ color: '#2d3748', fontSize: '0.9rem', marginBottom: '15px' }}>
                          <strong>{t.common?.purpose || "Purpose:"}</strong> {t.common?.returnsSmallerOfTwoValues || "Returns the smaller of two values. Perfect for \"capping\" calculations."}
                        </p>

                        <div className="mb-3">
                          <h6 style={{ color: '#0C756F', fontSize: '0.95rem', marginBottom: '10px' }}>{t.common?.example || "Example"} 1: {t.common?.overtimeCap || "Overtime Cap"}</h6>
                          <div className="bg-light p-2 rounded mb-2">
                            <code style={{ fontSize: '0.85rem' }}>{t.common?.minAttendanceOvertimeHours2 || "min(attendance.overtime_hours, 2)"}</code>
                          </div>
                          <ul style={{ fontSize: '0.85rem', color: '#2d3748', paddingLeft: '20px' }}>
                            <li>{t.common?.employeeWorked || "Employee worked"} 5 {t.common?.hoursWorked || "hours"} → {t.common?.returns || "returns"} 2 ({t.common?.firstHoursOnly || "first 2 hours only"})</li>
                            <li>{t.common?.employeeWorked || "Employee worked"} 1 {t.common?.hoursWorked || "hour"} → {t.common?.returns || "returns"} 1 ({t.common?.actualHours || "actual hours"})</li>
                          </ul>
                        </div>

                        <div className="mb-3">
                          <h6 style={{ color: '#0C756F', fontSize: '0.95rem', marginBottom: '10px' }}>{t.common?.example || "Example"} 2: {t.common?.maximumDeduction || "Maximum Deduction"}</h6>
                          <div className="bg-light p-2 rounded mb-2">
                            <code style={{ fontSize: '0.85rem' }}>min(payslip.deductions, contract.max_deductions)</code>
                          </div>
                          <ul style={{ fontSize: '0.85rem', color: '#2d3748', paddingLeft: '20px' }}>
                            <li>{t.common?.deductions || "Deductions"}: ₪500, {t.common?.maxAllowed || "Max allowed"}: ₪300 → {t.common?.returns || "returns"} 300</li>
                            <li>{t.common?.deductions || "Deductions"}: ₪200, {t.common?.maxAllowed || "Max allowed"}: ₪300 → {t.common?.returns || "returns"} 200</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="card h-100 shadow-sm" style={{ border: '2px solid #dc3545', borderRadius: '12px' }}>
                      <div className="card-header" style={{ backgroundColor: '#dc3545', color: 'white', borderRadius: '10px 10px 0 0' }}>
                        <h6 className="mb-0" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                          <i className="bi bi-chevron-up me-2"></i>max(a, b) - {t.common?.largerValue || "Larger Value"}
                        </h6>
                      </div>
                      <div className="card-body">
                        <p style={{ color: '#2d3748', fontSize: '0.9rem', marginBottom: '15px' }}>
                          <strong>{t.common?.purpose || "Purpose:"}</strong> {t.common?.returnsLargerOfTwoValuesExtended || "Returns the larger of two values. Great for ensuring minimums or handling negative numbers."}
                        </p>

                        <div className="mb-3">
                          <h6 style={{ color: '#0C756F', fontSize: '0.95rem', marginBottom: '10px' }}>{t.common?.example || "Example"} 1: {t.common?.extraOvertimeHours || "Extra Overtime Hours"}</h6>
                          <div className="bg-light p-2 rounded mb-2">
                            <code style={{ fontSize: '0.85rem' }}>{t.common?.maxAttendanceOvertimeHoursMinus20 || "max(attendance.overtime_hours - 2, 0)"}</code>
                          </div>
                          <ul style={{ fontSize: '0.85rem', color: '#2d3748', paddingLeft: '20px' }}>
                            <li>{t.common?.worked || "Worked"} 5 {t.common?.hoursWorked || "hours"} → max(5-2, 0) = max(3, 0) = 3 ({t.common?.extraHours || "extra hours"})</li>
                            <li>{t.common?.worked || "Worked"} 1 {t.common?.hoursWorked || "hour"} → max(1-2, 0) = max(-1, 0) = 0 ({t.common?.noExtra || "no extra"})</li>
                          </ul>
                        </div>

                        <div className="mb-3">
                          <h6 style={{ color: '#0C756F', fontSize: '0.95rem', marginBottom: '10px' }}>{t.common?.example || "Example"} 2: {t.common?.minimumWageGuarantee || "Minimum Wage Guarantee"}</h6>
                          <div className="bg-light p-2 rounded mb-2">
                            <code style={{ fontSize: '0.85rem' }}>{t.common?.maxPayslipHourlyRateComma30 || "max(payslip.hourly_rate, 30)"}</code>
                          </div>
                          <ul style={{ fontSize: '0.85rem', color: '#2d3748', paddingLeft: '20px' }}>
                            <li>{t.common?.paid || "Paid"} ₪25/{t.common?.hourSlash || "hour"} → max(25, 30) = 30 ({t.common?.minimumWage || "minimum wage"})</li>
                            <li>{t.common?.paid || "Paid"} ₪35/{t.common?.hourSlash || "hour"} → max(35, 30) = 35 ({t.common?.actualRate || "actual rate"})</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <div className="card h-100 shadow-sm" style={{ border: '2px solid #ffc107', borderRadius: '12px' }}>
                      <div className="card-header" style={{ backgroundColor: '#ffc107', color: '#0F0F14', borderRadius: '10px 10px 0 0' }}>
                        <h6 className="mb-0" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                          <i className="bi bi-plus-slash-minus me-2"></i>abs(number) - Absolute Value
                        </h6>
                      </div>
                      <div className="card-body">
                        <p style={{ color: '#2d3748', fontSize: '0.9rem', marginBottom: '15px' }}>
                          <strong>{t.common?.purpose || "Purpose:"}</strong> {t.common?.removesNegativeSigns || "Removes negative signs. Ensures amounts are always positive."}
                        </p>

                        <div className="mb-3">
                          <h6 style={{ color: '#0C756F', fontSize: '0.95rem', marginBottom: '10px' }}>{t.common?.example1PaymentShortfall || "Example 1: Payment Shortfall"}</h6>
                          <div className="bg-light p-2 rounded mb-2">
                            <code style={{ fontSize: '0.85rem' }}>abs(payslip.amount - contract.required_amount)</code>
                          </div>
                          <ul style={{ fontSize: '0.85rem', color: '#2d3748', paddingLeft: '20px' }}>
                            <li>{t.common?.paid100Owed120Abs100Minus120EqualsAbsMinus20Equals20 || "Paid ₪100, owed ₪120 → abs(100-120) = abs(-20) = 20"}</li>
                            <li>{t.common?.paid130Owed120Abs130Minus120EqualsAbs10Equals10 || "Paid ₪130, owed ₪120 → abs(130-120) = abs(10) = 10"}</li>
                          </ul>
                        </div>

                        <div className="mb-3">
                          <h6 style={{ color: '#0C756F', fontSize: '0.95rem', marginBottom: '10px' }}>{t.common?.example2NegativeHoursCorrection || "Example 2: Negative Hours Correction"}</h6>
                          <div className="bg-light p-2 rounded mb-2">
                            <code style={{ fontSize: '0.85rem' }}>abs(attendance.adjusted_hours)</code>
                          </div>
                          <ul style={{ fontSize: '0.85rem', color: '#2d3748', paddingLeft: '20px' }}>
                            <li>{t.common?.adjustedHoursMinus2AbsMinus2Equals2PositiveHours || "Adjusted hours: -2 → abs(-2) = 2 (positive hours)"}</li>
                            <li>{t.common?.adjustedHours3Abs3Equals3AlreadyPositive || "Adjusted hours: 3 → abs(3) = 3 (already positive)"}</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="card h-100 shadow-sm" style={{ border: '2px solid #6f42c1', borderRadius: '12px' }}>
                      <div className="card-header" style={{ backgroundColor: '#6f42c1', color: 'white', borderRadius: '10px 10px 0 0' }}>
                        <h6 className="mb-0" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                          <i className="bi bi-hash me-2"></i>round(number) - Round to Whole Number
                        </h6>
                      </div>
                      <div className="card-body">
                        <p style={{ color: '#2d3748', fontSize: '0.9rem', marginBottom: '15px' }}>
                          <strong>{t.common?.purpose || "Purpose:"}</strong> {t.common?.roundsDecimalNumbers || "Rounds decimal numbers to the nearest whole number for clean money calculations."}
                        </p>

                        <div className="mb-3">
                          <h6 style={{ color: '#0C756F', fontSize: '0.95rem', marginBottom: '10px' }}>{t.common?.example1HourlyRateRounding || "Example 1: Hourly Rate Rounding"}</h6>
                          <div className="bg-light p-2 rounded mb-2">
                            <code style={{ fontSize: '0.85rem' }}>round({t.common?.contractHourlyRateTimes125 || "contract.hourly_rate * 1.25"})</code>
                          </div>
                          <ul style={{ fontSize: '0.85rem', color: '#2d3748', paddingLeft: '20px' }}>
                            <li>{t.common?.baseRate2950Times125Equals36875Round36875Equals37 || "Base rate ₪29.50 → 29.50 × 1.25 = 36.875 → round(36.875) = 37"}</li>
                            <li>{t.common?.baseRate3000Times125Equals375Round375Equals38 || "Base rate ₪30.00 → 30.00 × 1.25 = 37.5 → round(37.5) = 38"}</li>
                          </ul>
                        </div>

                        <div className="mb-3">
                          <h6 style={{ color: '#0C756F', fontSize: '0.95rem', marginBottom: '10px' }}>{t.common?.example2VacationDays || "Example 2: Vacation Days"}</h6>
                          <div className="bg-light p-2 rounded mb-2">
                            <code style={{ fontSize: '0.85rem' }}>round(attendance.years_service * 1.5)</code>
                          </div>
                          <ul style={{ fontSize: '0.85rem', color: '#2d3748', paddingLeft: '20px' }}>
                            <li>{t.common?.fivePoint2YearsServiceTimes15Equals78Round78Equals8Days || "5.2 years service → 5.2 × 1.5 = 7.8 → round(7.8) = 8 days"}</li>
                            <li>{t.common?.threePoint7YearsServiceTimes15Equals555Round555Equals6Days || "3.7 years service → 3.7 × 1.5 = 5.55 → round(5.55) = 6 days"}</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Function Usage Tips */}
                <div className="alert alert-warning" style={{ backgroundColor: 'rgba(255, 193, 7, 0.1)', border: '1px solid #ffc107', borderRadius: '8px' }}>
                  <i className="bi bi-lightbulb me-2"></i>
                  <strong style={{ color: '#0C756F' }}>{t.common?.functionTips || "Function Tips:"}</strong>
                  <ul className="mb-0 mt-2" style={{ color: '#2d3748', fontSize: '0.9rem' }}>
                    <li><strong>min()</strong> {t.common?.minPreventsOverpaymentCapMaximumAmounts || "prevents overpayment (cap maximum amounts)"}</li>
                    <li><strong>max()</strong> {t.common?.maxEnsuresMinimumAndHandlesNegativeResults || "ensures minimums and handles negative results"}</li>
                    <li><strong>abs()</strong> {t.common?.absMakesSureMoneyAmountsAreAlwaysPositive || "makes sure money amounts are always positive"}</li>
                    <li><strong>round()</strong> {t.common?.roundGivesCleanWholeNumbersForMoneyCalculations || "gives clean whole numbers for money calculations"}</li>
                    <li><em>{t.common?.youCanCombineFunctions || "You can combine functions:"} <code>round(max(amount, 0))</code></em></li>
                  </ul>
                </div>
              </div>

              <div className="mb-4">
                <h6 style={{ color: '#0C756F', fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.1rem', fontWeight: '600', marginBottom: '15px' }}>
                  <i className="bi bi-4-circle-fill me-2"></i>{t.steps?.step4 || "Step 4: Building the Rule"} - {t.common?.first2OvertimeHours125 || "First 2 Overtime Hours (125%)"}
                </h6>
                <div className="card" style={{ backgroundColor: 'rgba(40, 167, 69, 0.1)', border: '2px solid #28a745' }}>
                  <div className="card-body">
                    <h6 style={{ color: '#0C756F' }}>{t.common?.whatWeWantToCheck || "What we want to check:"}</h6>
                    <p style={{ color: '#2d3748', fontSize: '0.95rem' }}>
                      {t.common?.didEmployeeGetPaid || "Did the employee get paid at least 125% of their regular hourly rate for the first 2 overtime hours?"}
                    </p>

                    <div className="row mt-3">
                      <div className="col-md-6">
                        <h6 style={{ color: '#0C756F', fontSize: '1rem' }}>{t.common?.conditionWhenToCheck || "Condition (When to check):"}</h6>
                        <code style={{ backgroundColor: '#f8f9fa', padding: '8px', borderRadius: '4px', display: 'block', fontSize: '0.9rem' }}>
                          {t.common?.conditionOvertimeHours || "attendance.overtime_hours > 0"}
                        </code>
                        <p style={{ fontSize: '0.85rem', color: '#2d3748', marginTop: '5px' }}>
                          <em>{t.common?.translationIfEmployeeWorked || "Translation: \"If the employee worked any overtime hours\""}</em>
                        </p>
                      </div>
                      <div className="col-md-6">
                        <h6 style={{ color: '#0C756F', fontSize: '1rem' }}>{t.common?.amountOwedFormula || "Amount Owed Formula:"}</h6>
                        <code style={{ backgroundColor: '#f8f9fa', padding: '8px', borderRadius: '4px', display: 'block', fontSize: '0.9rem' }}>
                          ({t.common?.contractHourlyRateTimes125 || "contract.hourly_rate * 1.25"} - payslip.overtime_rate) * {t.common?.minAttendanceOvertimeHours2 || "min(attendance.overtime_hours, 2)"}
                        </code>
                      </div>
                    </div>

                    <div className="mt-3">
                      <h6 style={{ color: '#0C756F' }}>{t.common?.howFormulaWorks || "How the formula works:"}</h6>
                      <div className="bg-light p-3 rounded">
                        <strong style={{ color: '#0C756F' }}>{t.common?.part1 || "Part 1:"}</strong> <code>{t.common?.contractHourlyRateTimes125 || "contract.hourly_rate * 1.25"}</code><br/>
                        <small>{t.common?.shouldBePaid || "What they SHOULD get paid:"} {t.common?.contractHourlyRateTimes125 || "contract.hourly_rate × 1.25 = Required overtime rate for first 2 hours"}</small><br/><br/>

                        <strong style={{ color: '#0C756F' }}>{t.common?.part2 || "Part 2:"}</strong> <code>{t.common?.contractHourlyRateTimes125 || "contract.hourly_rate * 1.25"} - payslip.overtime_rate</code><br/>
                        <small>{t.common?.differenceBetweenRequired125 || "Difference between required pay and actual pay = Amount short per hour"}</small><br/><br/>

                        <strong style={{ color: '#0C756F' }}>{t.common?.part3 || "Part 3:"}</strong> <code>{t.common?.minAttendanceOvertimeHours2 || "min(attendance.overtime_hours, 2)"}</code><br/>
                        <small>{t.common?.hoursToPayAt125 || "Hours to pay at 125% rate: Only first 2 hours, or actual hours if less"}</small><br/><br/>

                        <strong style={{ color: '#0C756F' }}>{t.common?.final || "Final:"}</strong> <code>{t.common?.totalAmountOwedForFirst2 || "Total amount owed for first 2 overtime hours"}</code>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h6 style={{ color: '#0C756F', fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.1rem', fontWeight: '600', marginBottom: '15px' }}>
                  <i className="bi bi-5-circle me-2"></i>{t.steps?.step5 || "Step 5: Building the Rule"} - {t.common?.additionalOvertimeHours150 || "Additional Overtime Hours (150%)"}
                </h6>
                <div className="card" style={{ backgroundColor: 'rgba(220, 53, 69, 0.1)', border: '2px solid #dc3545' }}>
                  <div className="card-body">
                    <h6 style={{ color: '#0C756F' }}>{t.common?.whatWeWantToCheck || "What we want to check:"}</h6>
                    <p style={{ color: '#2d3748', fontSize: '0.95rem' }}>
                      {t.common?.didEmployeeGetPaid150Extended || "Did the employee get paid at least 150% of their regular hourly rate for overtime hours beyond the first 2?"}
                    </p>

                    <div className="row mt-3">
                      <div className="col-md-6">
                        <h6 style={{ color: '#0C756F', fontSize: '1rem' }}>{t.common?.conditionWhenToCheck || "Condition (When to check):"}</h6>
                        <code style={{ backgroundColor: '#f8f9fa', padding: '8px', borderRadius: '4px', display: 'block', fontSize: '0.9rem' }}>
                          {t.common?.attendanceOvertimeHoursGreaterThan2 || "attendance.overtime_hours > 2"}
                        </code>
                        <p style={{ fontSize: '0.85rem', color: '#2d3748', marginTop: '5px' }}>
                          <em>{t.common?.translationIfEmployeeWorkedMore || "Translation: \"If the employee worked more than 2 overtime hours\""}</em>
                        </p>
                      </div>
                      <div className="col-md-6">
                        <h6 style={{ color: '#0C756F', fontSize: '1rem' }}>{t.common?.amountOwedFormula || "Amount Owed Formula:"}</h6>
                        <code style={{ backgroundColor: '#f8f9fa', padding: '8px', borderRadius: '4px', display: 'block', fontSize: '0.9rem' }}>
                          ({t.common?.contractHourlyRateTimes150 || "contract.hourly_rate * 1.50"} - payslip.overtime_rate) * {t.common?.maxAttendanceOvertimeHoursMinus20 || "max(attendance.overtime_hours - 2, 0)"}
                        </code>
                      </div>
                    </div>

                    <div className="mt-3">
                      <h6 style={{ color: '#0C756F' }}>{t.common?.howFormulaWorks || "How the formula works:"}</h6>
                      <div className="bg-light p-3 rounded">
                        <strong style={{ color: '#0C756F' }}>{t.common?.part1 || "Part 1:"}</strong> <code>{t.common?.contractHourlyRateTimes150 || "contract.hourly_rate * 1.50"}</code><br/>
                        <small>{t.common?.shouldBePaid || "What they SHOULD get paid:"} {t.common?.regularRateTimes150Extended || "Regular rate × 150% = Required overtime rate for additional hours"}</small><br/><br/>

                        <strong style={{ color: '#0C756F' }}>{t.common?.part2 || "Part 2:"}</strong> <code>{t.common?.contractHourlyRateTimes150 || "contract.hourly_rate * 1.50"} - payslip.overtime_rate</code><br/>
                        <small>{t.common?.differenceBetweenRequired150Extended || "Difference between required pay and actual pay = Amount short per additional hour"}</small><br/><br/>

                        <strong style={{ color: '#0C756F' }}>{t.common?.part3 || "Part 3:"}</strong> <code>{t.common?.maxAttendanceOvertimeHoursMinus20 || "max(attendance.overtime_hours - 2, 0)"}</code><br/>
                        <small>{t.common?.hoursToPayAt150Extended || "Hours to pay at 150% rate: Only hours beyond the first 2, or 0 if no extra hours"}</small><br/><br/>

                        <strong style={{ color: '#0C756F' }}>{t.common?.final || "Final:"}</strong> <code>{t.common?.differenceTimesExtraHours || "(difference) × (extra hours) = Total amount owed for additional overtime"}</code>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h6 style={{ color: '#0C756F', fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.1rem', fontWeight: '600', marginBottom: '15px' }}>
                  <i className="bi bi-6-circle me-2"></i>{t.steps?.step6 || "Step 6: Real Example with Numbers"}
                </h6>
                <div className="card" style={{ backgroundColor: 'white', border: '2px solid #FDCF6F' }}>
                  <div className="card-body">
                    <h6 style={{ color: '#0C756F' }}>{t.common?.employeeScenario || "Employee Scenario:"}</h6>
                    <div className="row">
                      <div className="col-md-6">
                        <ul style={{ color: '#2d3748', fontSize: '0.95rem' }}>
                          <li><strong>{t.common?.contractHourlyRate50 || "Contract hourly rate:"}</strong> ₪30.00</li>
                          <li><strong>{t.common?.overtimeHoursWorked3 || "Overtime hours worked:"}</strong> 5 hours</li>
                          <li><strong>{t.common?.actuallyPaid || "Actually paid"} {t.common?.perOvertimeHour || "per overtime hour"}:</strong> ₪35.00</li>
                        </ul>
                      </div>
                      <div className="col-md-6">
                        <div className="alert alert-warning" style={{ backgroundColor: 'rgba(255, 193, 7, 0.1)', border: '1px solid #ffc107' }}>
                          <strong>{t.common?.problem || "Problem:"}</strong> {t.common?.theyShouldGet3750 || "They should get ₪37.50/hour for first 2 hours (125%) and ₪45.00/hour for additional hours (150%), but only got ₪35.00/hour for all overtime"}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3">
                      <h6 style={{ color: '#0C756F' }}>{t.common?.completeCalculation || "Complete Calculation"} - {t.common?.bothTiers || "Both Tiers"}:</h6>
                      <div className="bg-light p-3 rounded">
                        <div className="row mb-3">
                          <div className="col-md-12">
                            <h6 style={{ color: '#0C756F', fontSize: '1rem' }}>{t.common?.tier1First2Hours125Rate || "Tier 1: First 2 Hours (125% Rate)"}</h6>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-6">
                            <strong>1. {t.common?.requiredRateForFirst2Hours || "Required rate for first 2 hours:"}</strong><br/>
                            <code>{t.common?.contractHourlyRateTimes125 || "contract.hourly_rate * 1.25"}</code><br/>
                            <code>30.00 * 1.25 = 37.50</code><br/>
                            <small>{t.common?.shouldGet37PerHourForFirst2 || "Should get ₪37.50 per hour for first 2 overtime hours"}</small>
                          </div>
                          <div className="col-md-6">
                            <strong>2. {t.common?.shortfallPerHour || "Shortfall per hour:"}</strong><br/>
                            <code>{t.common?.thirtySevenPointFiveMinusPayslipOvertimeRate || "37.50 - payslip.overtime_rate"}</code><br/>
                            <code>37.50 - 35.00 = 2.50</code><br/>
                            <small>{t.common?.underpaidBy250PerHourInThisTier || "Underpaid by ₪2.50 per hour in this tier"}</small>
                          </div>
                        </div>
                        <hr/>
                        <div className="row">
                          <div className="col-md-6">
                            <strong>3. {t.common?.eligibleHours || "Eligible hours:"}</strong><br/>
                            <code>{t.common?.minAttendanceOvertimeHours2 || "min(attendance.overtime_hours, 2)"}</code><br/>
                            <code>min(5, 2) = 2</code><br/>
                            <small>{t.common?.all5HoursWorkedButOnlyFirst2Qualify || "All 5 hours worked, but only first 2 qualify for 125% rate"}</small>
                          </div>
                          <div className="col-md-6">
                            <strong>4. {t.common?.amountOwedForTier1 || "Amount owed for Tier 1:"}</strong><br/>
                            <code>2.50 * 2 = 5.00</code><br/>
                            <span style={{ color: '#28a745', fontWeight: 'bold' }}>{t.common?.owes5ForFirst2OvertimeHours || "Owes ₪5.00 for first 2 overtime hours"}</span>
                          </div>
                        </div>

                        <div className="row mt-4">
                          <div className="col-md-12">
                            <h6 style={{ color: '#0C756F', fontSize: '1rem' }}>{t.common?.tier2AdditionalHours150Rate || "Tier 2: Additional Hours (150% Rate)"}</h6>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-6">
                            <strong>5. {t.common?.requiredRateForAdditionalHours || "Required rate for additional hours:"}</strong><br/>
                            <code>{t.common?.contractHourlyRateTimes150 || "contract.hourly_rate * 1.50"}</code><br/>
                            <code>30.00 * 1.50 = 45.00</code><br/>
                            <small>{t.common?.shouldGet45PerHourForHoursBeyond2 || "Should get ₪45.00 per hour for hours beyond 2"}</small>
                          </div>
                          <div className="col-md-6">
                            <strong>6. {t.common?.shortfallPerAdditionalHour || "Shortfall per additional hour:"}</strong><br/>
                            <code>{t.common?.fortyFivePointZeroMinusPayslipOvertimeRate || "45.00 - payslip.overtime_rate"}</code><br/>
                            <code>45.00 - 35.00 = 10.00</code><br/>
                            <small>{t.common?.underpaidBy1000PerHourInThisTier || "Underpaid by ₪10.00 per hour in this tier"}</small>
                          </div>
                        </div>
                        <hr/>
                        <div className="row">
                          <div className="col-md-6">
                            <strong>7. {t.common?.additionalHours || "Additional hours:"}</strong><br/>
                            <code>{t.common?.maxAttendanceOvertimeHoursMinus20 || "max(attendance.overtime_hours - 2, 0)"}</code><br/>
                            <code>max(5 - 2, 0) = 3</code><br/>
                            <small>{t.common?.hours345QualifyFor150Rate || "Hours 3, 4, and 5 qualify for 150% rate"}</small>
                          </div>
                          <div className="col-md-6">
                            <strong>8. {t.common?.amountOwedForTier2 || "Amount owed for Tier 2:"}</strong><br/>
                            <code>10.00 * 3 = 30.00</code><br/>
                            <span style={{ color: '#dc3545', fontWeight: 'bold' }}>{t.common?.owes30ForAdditionalOvertimeHours || "Owes ₪30.00 for additional overtime hours"}</span>
                          </div>
                        </div>

                        <hr/>
                        <div className="row">
                          <div className="col-md-12 text-center">
                            <strong style={{ fontSize: '1.2rem', color: '#0C756F' }}>{t.common?.totalAmountOwed || "TOTAL AMOUNT OWED:"} ₪5.00 + ₪30.00 = ₪35.00</strong>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h6 style={{ color: '#0C756F', fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.1rem', fontWeight: '600', marginBottom: '15px' }}>
                  <i className="bi bi-7-circle me-2"></i>{t.steps?.step7 || "Step 7: Complete Rule Setup"}
                </h6>
                <div className="card" style={{ backgroundColor: 'rgba(0, 123, 255, 0.1)', border: '2px solid #007bff' }}>
                  <div className="card-body">
                    <h6 style={{ color: '#0C756F' }}>{t.common?.createTwoSeparateRulesOneForEachOvertimeTier || "Create Two Separate Rules - One for Each Overtime Tier:"}</h6>

                    <div className="row mb-4">
                      <div className="col-md-6">
                        <div className="card" style={{ backgroundColor: 'rgba(40, 167, 69, 0.1)', border: '2px solid #28a745' }}>
                          <div className="card-header" style={{ backgroundColor: '#28a745', color: 'white' }}>
                            <strong>{t.common?.rule1First2Hours125 || "Rule 1: First 2 Hours (125%)"}</strong>
                          </div>
                          <div className="card-body">
                            <strong>{t.common?.ruleName || "Rule Name:"}</strong> {t.common?.overtimePayFirst2Hours125 || "Overtime Pay - First 2 Hours (125%)"}<br/>
                            <strong>{t.common?.lawReference || "Law Reference:"}</strong> {t.common?.israeliLaborLawOvertime || "Israeli Labor Law - Overtime Regulations"}<br/>
                            <strong>{t.common?.description || "Description:"}</strong> &quot;{t.common?.employeesMustReceive125 || "Employees must receive 125% of regular rate for first 2 overtime hours"}&quot;<br/>
                            <strong>{t.common?.effectiveDates || "Effective Dates:"}</strong> {t.common?.currentDateRange || "Current date range"}<br/><br/>

                            <strong>{t.common?.condition || "Condition:"}</strong><br/>
                            <code style={{ backgroundColor: '#f8f9fa', padding: '4px', borderRadius: '3px', display: 'block', fontSize: '0.85rem' }}>
                              {t.common?.conditionOvertimeHours || "attendance.overtime_hours > 0"}
                            </code>
                            <strong>{t.common?.amountOwed || "Amount Owed:"}</strong><br/>
                            <code style={{ backgroundColor: '#f8f9fa', padding: '4px', borderRadius: '3px', display: 'block', fontSize: '0.85rem' }}>
                              ({t.common?.contractHourlyRateTimes125 || "contract.hourly_rate * 1.25"} - payslip.overtime_rate) * {t.common?.minAttendanceOvertimeHours2 || "min(attendance.overtime_hours, 2)"}
                            </code>
                            <strong>{t.common?.violationMessage || "Violation Message:"}</strong><br/>
                            <small>&quot;{t.common?.underpaidOvertimePremium || "Underpaid overtime premium for first 2 hours"}&quot;</small>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="card" style={{ backgroundColor: 'rgba(220, 53, 69, 0.1)', border: '2px solid #dc3545' }}>
                          <div className="card-header" style={{ backgroundColor: '#dc3545', color: 'white' }}>
                            <strong>{t.common?.rule2AdditionalHours150 || "Rule 2: Additional Hours (150%)"}</strong>
                          </div>
                          <div className="card-body">
                            <strong>{t.common?.ruleName || "Rule Name:"}</strong> {t.common?.overtimePayAdditionalHours150 || "Overtime Pay - Additional Hours (150%)"}<br/>
                            <strong>{t.common?.lawReference || "Law Reference:"}</strong> {t.common?.israeliLaborLawOvertime || "Israeli Labor Law - Overtime Regulations"}<br/>
                            <strong>{t.common?.description || "Description:"}</strong> {t.common?.employeesMustReceive150PercentOfRegularRateForOvertimeHoursBeyondFirst2 || "Employees must receive 150% of regular rate for overtime hours beyond the first 2"}<br/>
                            <strong>{t.common?.effectiveDates || "Effective Dates:"}</strong> {t.common?.currentDateRange || "Current date range"}<br/><br/>

                            <strong>{t.common?.condition || "Condition:"}</strong><br/>
                            <code style={{ backgroundColor: '#f8f9fa', padding: '4px', borderRadius: '3px', display: 'block', fontSize: '0.85rem' }}>
                              {t.common?.attendanceOvertimeHoursGreaterThan2 || "attendance.overtime_hours > 2"}
                            </code>
                            <strong>{t.common?.amountOwed || "Amount Owed:"}</strong><br/>
                            <code style={{ backgroundColor: '#f8f9fa', padding: '4px', borderRadius: '3px', display: 'block', fontSize: '0.85rem' }}>
                              ({t.common?.contractHourlyRateTimes150 || "contract.hourly_rate * 1.50"} - payslip.overtime_rate) * {t.common?.maxAttendanceOvertimeHoursMinus20 || "max(attendance.overtime_hours - 2, 0)"}
                            </code>
                            <strong>{t.common?.violationMessage || "Violation Message:"}</strong><br/>
                            <small>&quot;{t.common?.underpaidOvertimePremiumAdditional || "Underpaid overtime premium for additional hours"}&quot;</small>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="alert alert-info" style={{ backgroundColor: 'rgba(23, 162, 184, 0.1)', border: '1px solid #17a2b8' }}>
                      <i className="bi bi-info-circle me-2"></i>
                      <strong>{t.common?.important || "Important:"}</strong> {t.common?.createTheseAsTwoSeparateRules || "Create these as two separate rules. The system will evaluate both when checking overtime pay compliance."}
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Minimum Wage Tab */}
            <div className="tab-pane fade" id="minimum-wage" role="tabpanel" aria-labelledby="minimum-wage-tab">
              <div className="mb-4">
                <h6 style={{ color: '#0C756F', fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.1rem', fontWeight: '600', marginBottom: '15px' }}>
                  <i className="bi bi-1-circle me-2"></i>{t.steps?.step1 || "Step 1: Understand the Law Requirement"}
                </h6>
                <div className="card" style={{ backgroundColor: 'white', border: '2px solid #FDCF6F' }}>
                  <div className="card-body">
                    <h6 style={{ color: '#0C756F' }}>{t.minimumWage?.lawTitle || "Minimum Wage Law (Israel)"}</h6>
                    <ul style={{ color: '#2d3748', fontSize: '0.95rem' }}>
                      {(t.minimumWage?.lawDetails || [
                        t.common?.adultWorkers18Plus || "Adult workers (18+): Must be paid at least ₪30.70 per hour",
                        t.common?.youthWorkers16to18 || "Youth workers (16-18): Must be paid at least ₪21.49 per hour (70% of adult minimum)",
                        t.common?.apprentices || "Apprentices: Must be paid at least ₪24.56 per hour (80% of adult minimum) during training",
                        t.common?.overtimeAdditionalPremiums || "Overtime: Additional premiums apply on top of minimum wage"
                      ]).map((detail: string, index: number) => (
                        <li key={index}><strong>{detail.split(':')[0]}:</strong>{detail.split(':').slice(1).join(':')}</li>
                      ))}
                    </ul>
                    <p style={{ color: '#2d3748', fontSize: '0.9rem', marginTop: '10px' }}>
                      <strong>{t.minimumWage?.lawDescription || "In simple terms: Every employee must earn at least the minimum wage for every hour worked, regardless of their contract rate."}</strong>
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h6 style={{ color: '#0C756F', fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.1rem', fontWeight: '600', marginBottom: '15px' }}>
                  <i className="bi bi-2-circle me-2"></i>{t.steps?.step2 || "Step 2: What Data Do We Need?"}
                </h6>
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <div className="card h-100" style={{ backgroundColor: 'rgba(12, 117, 111, 0.05)', border: '1px solid rgba(12, 117, 111, 0.2)' }}>
                      <div className="card-body text-center">
                        <i className="bi bi-person-badge" style={{ fontSize: '2rem', color: '#0C756F' }}></i>
                        <h6 style={{ color: '#0C756F', fontSize: '0.9rem', marginTop: '10px' }}>{t.common?.employeeData || "Employee Data"}</h6>
                        <code style={{ backgroundColor: 'rgba(12, 117, 111, 0.1)', padding: '2px 4px', borderRadius: '3px', fontSize: '0.8rem' }}>
                          employee.age
                        </code>
                        <p style={{ fontSize: '0.8rem', color: '#2d3748', marginTop: '5px' }}>{t.common?.ageDeterminesMinimumWageRate || "Age determines minimum wage rate"}</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 mb-3">
                    <div className="card h-100" style={{ backgroundColor: 'rgba(12, 117, 111, 0.05)', border: '1px solid rgba(12, 117, 111, 0.2)' }}>
                      <div className="card-body text-center">
                        <i className="bi bi-calendar-check" style={{ fontSize: '2rem', color: '#0C756F' }}></i>
                        <h6 style={{ color: '#0C756F', fontSize: '0.9rem', marginTop: '10px' }}>{t.common?.attendanceData || "Attendance Data"}</h6>
                        <code style={{ backgroundColor: 'rgba(12, 117, 111, 0.1)', padding: '2px 4px', borderRadius: '3px', fontSize: '0.8rem' }}>
                          {t.common?.attendanceRegularHours || "attendance.regular_hours"}
                        </code>
                        <p style={{ fontSize: '0.8rem', color: '#2d3748', marginTop: '5px' }}>{t.common?.regularHoursWorkedNotOvertime || "Regular hours worked (not overtime)"}</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 mb-3">
                    <div className="card h-100" style={{ backgroundColor: 'rgba(12, 117, 111, 0.05)', border: '1px solid rgba(12, 117, 111, 0.2)' }}>
                      <div className="card-body text-center">
                        <i className="bi bi-cash-stack" style={{ fontSize: '2rem', color: '#0C756F' }}></i>
                        <h6 style={{ color: '#0C756F', fontSize: '0.9rem', marginTop: '10px' }}>{t.common?.payslipData || "Payslip Data"}</h6>
                        <code style={{ backgroundColor: 'rgba(12, 117, 111, 0.1)', padding: '2px 4px', borderRadius: '3px', fontSize: '0.8rem' }}>
                          {t.common?.payslipHourlyRate || "payslip.hourly_rate"}
                        </code>
                        <p style={{ fontSize: '0.8rem', color: '#2d3748', marginTop: '5px' }}>{t.common?.whatTheyWereActuallyPaidPerHour || "What they were actually paid per hour"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h6 style={{ color: '#0C756F', fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.1rem', fontWeight: '600', marginBottom: '15px' }}>
                  <i className="bi bi-3-circle me-2"></i>{t.steps?.step3 || "Step 3: Available Functions & Examples"}
                </h6>
                <div className="alert alert-info" style={{ backgroundColor: 'rgba(23, 162, 184, 0.1)', border: '1px solid #17a2b8', borderRadius: '8px', marginBottom: '20px' }}>
                  <i className="bi bi-info-circle me-2"></i>
                  <strong style={{ color: '#0C756F' }}>{t.common?.availableFunctions || "Available Functions:"}</strong> <code>min()</code>, <code>max()</code>, <code>abs()</code>, <code>round()</code>
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <div className="card h-100 shadow-sm" style={{ border: '2px solid #28a745', borderRadius: '12px' }}>
                      <div className="card-header" style={{ backgroundColor: '#28a745', color: 'white', borderRadius: '10px 10px 0 0' }}>
                        <h6 className="mb-0" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                          <i className="bi bi-chevron-down me-2"></i>min(a, b) - Smaller Value
                        </h6>
                </div>
                <div className="card-body">
                        <p style={{ color: '#2d3748', fontSize: '0.9rem', marginBottom: '15px' }}>
                          <strong>{t.common?.purpose || "Purpose:"}</strong> {t.common?.returnsSmallerOfTwoValuesCapping || "Returns the smaller of two values. Perfect for \"capping\" calculations."}
                        </p>

                        <div className="mb-3">
                          <h6 style={{ color: '#0C756F', fontSize: '0.95rem', marginBottom: '10px' }}>{t.common?.example1YouthWorkerRate || "Example 1: Youth Worker Rate"}</h6>
                          <div className="bg-light p-2 rounded mb-2">
                            <code style={{ fontSize: '0.85rem' }}>{t.common?.minEmployeeAge18LessThan18QuestionMark2149Colon3070 || "min(employee.age, 18) < 18 ? 21.49 : 30.70"}</code>
                          </div>
                          <ul style={{ fontSize: '0.85rem', color: '#2d3748', paddingLeft: '20px' }}>
                            <li>{t.common?.age16Returns2149YouthRate || "Age 16 → returns 21.49 (youth rate)"}</li>
                            <li>{t.common?.age20Returns3070AdultRate || "Age 20 → returns 30.70 (adult rate)"}</li>
                  </ul>
                </div>

                        <div className="mb-3">
                          <h6 style={{ color: '#0C756F', fontSize: '0.95rem', marginBottom: '10px' }}>{t.common?.example2MaximumDeduction || "Example 2: Maximum Deduction"}</h6>
                          <div className="bg-light p-2 rounded mb-2">
                            <code style={{ fontSize: '0.85rem' }}>min(payslip.deductions, contract.max_deductions)</code>
              </div>
                          <ul style={{ fontSize: '0.85rem', color: '#2d3748', paddingLeft: '20px' }}>
                            <li>{t.common?.deductions500MaxAllowed300Returns300 || "Deductions: ₪500, Max allowed: ₪300 → returns 300"}</li>
                            <li>{t.common?.deductions200MaxAllowed300Returns200 || "Deductions: ₪200, Max allowed: ₪300 → returns 200"}</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="card h-100 shadow-sm" style={{ border: '2px solid #dc3545', borderRadius: '12px' }}>
                      <div className="card-header" style={{ backgroundColor: '#dc3545', color: 'white', borderRadius: '10px 10px 0 0' }}>
                        <h6 className="mb-0" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                          <i className="bi bi-chevron-up me-2"></i>max(a, b) - {t.common?.largerValue || "Larger Value"}
                        </h6>
                      </div>
                      <div className="card-body">
                        <p style={{ color: '#2d3748', fontSize: '0.9rem', marginBottom: '15px' }}>
                          <strong>{t.common?.purpose || "Purpose:"}</strong> {t.common?.returnsLargerOfTwoValuesExtended || "Returns the larger of two values. Great for ensuring minimums or handling negative numbers."}
                        </p>

                        <div className="mb-3">
                          <h6 style={{ color: '#0C756F', fontSize: '0.95rem', marginBottom: '10px' }}>{t.common?.example1MinimumWageGuarantee || "Example 1: Minimum Wage Guarantee"}</h6>
                          <div className="bg-light p-2 rounded mb-2">
                            <code style={{ fontSize: '0.85rem' }}>{t.common?.maxPayslipHourlyRateComma3070 || "max(payslip.hourly_rate, 30.70)"}</code>
                          </div>
                          <ul style={{ fontSize: '0.85rem', color: '#2d3748', paddingLeft: '20px' }}>
                            <li>{t.common?.paid25PerHourMax25Comma3070Equals3070MinimumWage || "Paid ₪25/hour → max(25, 30.70) = 30.70 (minimum wage)"}</li>
                            <li>{t.common?.paid35PerHourMax35Comma3070Equals35ActualRate || "Paid ₪35/hour → max(35, 30.70) = 35 (actual rate)"}</li>
                          </ul>
                        </div>

                        <div className="mb-3">
                          <h6 style={{ color: '#0C756F', fontSize: '0.95rem', marginBottom: '10px' }}>{t.common?.example2PreventNegativeResults || "Example 2: Prevent Negative Results"}</h6>
                          <div className="bg-light p-2 rounded mb-2">
                            <code style={{ fontSize: '0.85rem' }}>{t.common?.max3070MinusPayslipHourlyRateTimesAttendanceRegularHoursComma0 || "max((30.70 - payslip.hourly_rate) * attendance.regular_hours, 0)"}</code>
                          </div>
                          <ul style={{ fontSize: '0.85rem', color: '#2d3748', paddingLeft: '20px' }}>
                            <li>{t.common?.paid25PerHourWorked8hMax3070Minus25Times8Comma0EqualsMax456Comma0Equals456 || "Paid ₪25/hour, worked 8h → max((30.70-25)*8, 0) = max(45.6, 0) = 45.6"}</li>
                            <li>{t.common?.paid35PerHourWorked8hMax3070Minus35Times8Comma0EqualsMaxMinus344Comma0Equals0 || "Paid ₪35/hour, worked 8h → max((30.70-35)*8, 0) = max(-34.4, 0) = 0"}</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <div className="card h-100 shadow-sm" style={{ border: '2px solid #ffc107', borderRadius: '12px' }}>
                      <div className="card-header" style={{ backgroundColor: '#ffc107', color: '#0F0F14', borderRadius: '10px 10px 0 0' }}>
                        <h6 className="mb-0" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                          <i className="bi bi-plus-slash-minus me-2"></i>abs(number) - Absolute Value
                        </h6>
                </div>
                <div className="card-body">
                        <p style={{ color: '#2d3748', fontSize: '0.9rem', marginBottom: '15px' }}>
                          <strong>{t.common?.purpose || "Purpose:"}</strong> {t.common?.removesNegativeSigns || "Removes negative signs. Ensures amounts are always positive."}
                        </p>

                        <div className="mb-3">
                          <h6 style={{ color: '#0C756F', fontSize: '0.95rem', marginBottom: '10px' }}>{t.common?.example1WageDifference || "Example 1: Wage Difference"}</h6>
                          <div className="bg-light p-2 rounded mb-2">
                            <code style={{ fontSize: '0.85rem' }}>{t.common?.absPayslipHourlyRateMinus3070 || "abs(payslip.hourly_rate - 30.70)"}</code>
                          </div>
                          <ul style={{ fontSize: '0.85rem', color: '#2d3748', paddingLeft: '20px' }}>
                            <li>{t.common?.paid25Abs25Minus3070EqualsAbsMinus570Equals570 || "Paid ₪25 → abs(25-30.70) = abs(-5.70) = 5.70"}</li>
                            <li>{t.common?.paid35Abs35Minus3070EqualsAbs430Equals430 || "Paid ₪35 → abs(35-30.70) = abs(4.30) = 4.30"}</li>
                          </ul>
                        </div>

                        <div className="mb-3">
                          <h6 style={{ color: '#0C756F', fontSize: '0.95rem', marginBottom: '10px' }}>{t.common?.example2TotalShortfall || "Example 2: Total Shortfall"}</h6>
                          <div className="bg-light p-2 rounded mb-2">
                            <code style={{ fontSize: '0.85rem' }}>{t.common?.abs3070MinusPayslipHourlyRateTimesAttendanceRegularHours || "abs((30.70 - payslip.hourly_rate) * attendance.regular_hours)"}</code>
                          </div>
                          <ul style={{ fontSize: '0.85rem', color: '#2d3748', paddingLeft: '20px' }}>
                            <li>{t.common?.underpaidBy570PerHourTimes8hEqualsAbsMinus4560Equals4560 || "Underpaid by ₪5.70/hour × 8h = abs(-45.60) = 45.60"}</li>
                            <li>{t.common?.overpaidBy430PerHourTimes8hEqualsAbs3440Equals3440 || "Overpaid by ₪4.30/hour × 8h = abs(34.40) = 34.40"}</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="card h-100 shadow-sm" style={{ border: '2px solid #6f42c1', borderRadius: '12px' }}>
                      <div className="card-header" style={{ backgroundColor: '#6f42c1', color: 'white', borderRadius: '10px 10px 0 0' }}>
                        <h6 className="mb-0" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                          <i className="bi bi-hash me-2"></i>round(number) - Round to Whole Number
                        </h6>
                    </div>
                    <div className="card-body">
                        <p style={{ color: '#2d3748', fontSize: '0.9rem', marginBottom: '15px' }}>
                          <strong>{t.common?.purpose || "Purpose:"}</strong> {t.common?.roundsDecimalNumbers || "Rounds decimal numbers to the nearest whole number for clean money calculations."}
                        </p>

                        <div className="mb-3">
                          <h6 style={{ color: '#0C756F', fontSize: '0.95rem', marginBottom: '10px' }}>{t.common?.example1YouthRateCalculation || "Example 1: Youth Rate Calculation"}</h6>
                          <div className="bg-light p-2 rounded mb-2">
                            <code style={{ fontSize: '0.85rem' }}>round(30.70 * 0.70)</code>
                          </div>
                          <ul style={{ fontSize: '0.85rem', color: '#2d3748', paddingLeft: '20px' }}>
                            <li>{t.common?.adultRate3070Times070Equals2149Round2149Equals21 || "Adult rate ₪30.70 → 30.70 × 0.70 = 21.49 → round(21.49) = 21"}</li>
                            <li>{t.common?.adultRate3070Times080Equals2456Round2456Equals25 || "Adult rate ₪30.70 → 30.70 × 0.80 = 24.56 → round(24.56) = 25"}</li>
                          </ul>
                        </div>

                        <div className="mb-3">
                          <h6 style={{ color: '#0C756F', fontSize: '0.95rem', marginBottom: '10px' }}>{t.common?.example2TotalAmountOwed || "Example 2: Total Amount Owed"}</h6>
                          <div className="bg-light p-2 rounded mb-2">
                            <code style={{ fontSize: '0.85rem' }}>{t.common?.round3070MinusPayslipHourlyRateTimesAttendanceRegularHours || "round((30.70 - payslip.hourly_rate) * attendance.regular_hours)"}</code>
                          </div>
                          <ul style={{ fontSize: '0.85rem', color: '#2d3748', paddingLeft: '20px' }}>
                            <li>{t.common?.shortfall570PerHourTimes8hEquals4560Round4560Equals46 || "Shortfall ₪5.70/hour × 8h = 45.60 → round(45.60) = 46"}</li>
                            <li>{t.common?.shortfall215PerHourTimes8hEquals1720Round1720Equals17 || "Shortfall ₪2.15/hour × 8h = 17.20 → round(17.20) = 17"}</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Function Usage Tips */}
                <div className="alert alert-warning" style={{ backgroundColor: 'rgba(255, 193, 7, 0.1)', border: '1px solid #ffc107', borderRadius: '8px' }}>
                  <i className="bi bi-lightbulb me-2"></i>
                  <strong style={{ color: '#0C756F' }}>{t.common?.functionTipsForMinimumWage || "Function Tips for Minimum Wage:"}</strong>
                  <ul className="mb-0 mt-2" style={{ color: '#2d3748', fontSize: '0.9rem' }}>
                    <li><strong>max()</strong> {t.common?.maxEnsuresMinimumWageCompliance || "ensures minimum wage compliance (prevents negative results)"}</li>
                    <li><strong>min()</strong> {t.common?.minCapsMaximumDeductionsOrLimitsCalculations || "caps maximum deductions or limits calculations"}</li>
                    <li><strong>abs()</strong> {t.common?.absHandlesWageDifferencesRegardlessOfOverUnderPayment || "handles wage differences regardless of over/under payment"}</li>
                    <li><strong>round()</strong> {t.common?.roundGivesCleanWholeNumbersForFinalAmounts || "gives clean whole numbers for final amounts"}</li>
                    <li><em>{t.common?.useConditionalLogicEmployeeAge18 || "Use conditional logic:"} <code>{t.common?.employeeAgeLessThan18QuestionMark2149Colon3070 || "employee.age < 18 ? 21.49 : 30.70"}</code></em></li>
                  </ul>
                </div>
              </div>

              <div className="mb-4">
                <h6 style={{ color: '#0C756F', fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.1rem', fontWeight: '600', marginBottom: '15px' }}>
                  <i className="bi bi-4-circle-fill me-2"></i>{t.steps?.step4 || "Step 4: Building the Rule"} - {t.common?.adultMinimumWage || "Adult Minimum Wage"}
                </h6>
                <div className="card" style={{ backgroundColor: 'rgba(40, 167, 69, 0.1)', border: '2px solid #28a745' }}>
                  <div className="card-body">
                    <h6 style={{ color: '#0C756F' }}>{t.common?.whatWeWantToCheck || "What we want to check:"}</h6>
                    <p style={{ color: '#2d3748', fontSize: '0.95rem' }}>
                      {t.common?.didEmployeeGetPaidMinimumWageForAgeGroup || "Did the employee get paid at least the minimum wage for their age group for all regular hours worked?"}
                    </p>

                    <div className="row mt-3">
                      <div className="col-md-6">
                        <h6 style={{ color: '#0C756F', fontSize: '1rem' }}>{t.common?.conditionWhenToCheck || "Condition (When to check):"}</h6>
                        <code style={{ backgroundColor: '#f8f9fa', padding: '8px', borderRadius: '4px', display: 'block', fontSize: '0.9rem' }}>
                          {t.common?.payslipHourlyRateLessThan3070 || "payslip.hourly_rate < 30.70"}
                        </code>
                        <p style={{ fontSize: '0.85rem', color: '#2d3748', marginTop: '5px' }}>
                          <em>{t.common?.translationIfEmployeePaidLessMinimum || "Translation: \"If the employee was paid less than minimum wage\""}</em>
                        </p>
                      </div>
                      <div className="col-md-6">
                        <h6 style={{ color: '#0C756F', fontSize: '1rem' }}>{t.common?.amountOwedFormula || "Amount Owed Formula:"}</h6>
                        <code style={{ backgroundColor: '#f8f9fa', padding: '8px', borderRadius: '4px', display: 'block', fontSize: '0.9rem' }}>
                          {t.common?.max3070MinusPayslipHourlyRateTimesAttendanceRegularHoursComma0 || "max((30.70 - payslip.hourly_rate) * attendance.regular_hours, 0)"}
                        </code>
                      </div>
                    </div>

                    <div className="mt-3">
                      <h6 style={{ color: '#0C756F' }}>{t.common?.howFormulaWorks || "How the formula works:"}</h6>
                      <div className="bg-light p-3 rounded">
                        <strong style={{ color: '#0C756F' }}>{t.common?.part1 || "Part 1:"}</strong> <code>{t.common?.thirtyPointSevenZeroMinusPayslipHourlyRate || "30.70 - payslip.hourly_rate"}</code><br/>
                        <small>{t.common?.differenceBetweenMinimumWageAndActualPay || "Difference between minimum wage and actual pay = Shortfall per hour"}</small><br/><br/>

                        <strong style={{ color: '#0C756F' }}>{t.common?.part2 || "Part 2:"}</strong> <code>{t.common?.thirtyPointSevenZeroMinusPayslipHourlyRateTimesAttendanceRegularHours || "(30.70 - payslip.hourly_rate) * attendance.regular_hours"}</code><br/>
                        <small>{t.common?.shortfallPerHourTimesTotalRegularHours || "Shortfall per hour × total regular hours = Total shortfall"}</small><br/><br/>

                        <strong style={{ color: '#0C756F' }}>{t.common?.part3 || "Part 3:"}</strong> <code>max(..., 0)</code><br/>
                        <small>{t.common?.ensuresWeOnlyGetPositiveAmounts || "Ensures we only get positive amounts (no negative results if overpaid)"}</small><br/><br/>

                        <strong style={{ color: '#0C756F' }}>{t.common?.final || "Final:"}</strong> <code>{t.common?.totalShortfallEqualsAmountOwedToEmployee || "Total shortfall = Amount owed to employee"}</code>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h6 style={{ color: '#0C756F', fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.1rem', fontWeight: '600', marginBottom: '15px' }}>
                  <i className="bi bi-5-circle me-2"></i>{t.steps?.step5 || "Step 5: Building the Rule"} - {t.common?.youthWorkerMinimumWage || "Youth Worker Minimum Wage"}
                </h6>
                <div className="card" style={{ backgroundColor: 'rgba(220, 53, 69, 0.1)', border: '2px solid #dc3545' }}>
                  <div className="card-body">
                    <h6 style={{ color: '#0C756F' }}>{t.common?.whatWeWantToCheck || "What we want to check:"}</h6>
                    <p style={{ color: '#2d3748', fontSize: '0.95rem' }}>
                      {t.common?.didYouthWorkerGetPaidMinimumWage || "Did the youth worker (16-18) get paid at least 70% of minimum wage for all regular hours worked?"}
                    </p>

                    <div className="row mt-3">
                      <div className="col-md-6">
                        <h6 style={{ color: '#0C756F', fontSize: '1rem' }}>{t.common?.conditionWhenToCheck || "Condition (When to check):"}</h6>
                        <code style={{ backgroundColor: '#f8f9fa', padding: '8px', borderRadius: '4px', display: 'block', fontSize: '0.9rem' }}>
                          {t.common?.employeeAgeLessThan18AndPayslipHourlyRateLessThan2149 || "employee.age < 18 AND payslip.hourly_rate < 21.49"}
                        </code>
                        <p style={{ fontSize: '0.85rem', color: '#2d3748', marginTop: '5px' }}>
                          <em>{t.common?.translationIfYouthWorkerPaidLess || "Translation: \"If youth worker was paid less than youth minimum wage\""}</em>
                        </p>
                      </div>
                      <div className="col-md-6">
                        <h6 style={{ color: '#0C756F', fontSize: '1rem' }}>{t.common?.amountOwedFormula || "Amount Owed Formula:"}</h6>
                        <code style={{ backgroundColor: '#f8f9fa', padding: '8px', borderRadius: '4px', display: 'block', fontSize: '0.9rem' }}>
                          {t.common?.max2149MinusPayslipHourlyRateTimesAttendanceRegularHoursComma0 || "max((21.49 - payslip.hourly_rate) * attendance.regular_hours, 0)"}
                        </code>
                      </div>
                    </div>

                    <div className="mt-3">
                      <h6 style={{ color: '#0C756F' }}>{t.common?.howFormulaWorks || "How the formula works:"}</h6>
                      <div className="bg-light p-3 rounded">
                        <strong style={{ color: '#0C756F' }}>{t.common?.part1 || "Part 1:"}</strong> <code>21.49</code><br/>
                        <small>{t.common?.youthMinimumWage70Percent || "Youth minimum wage: 70% of ₪30.70 = ₪21.49 per hour"}</small><br/><br/>

                        <strong style={{ color: '#0C756F' }}>{t.common?.part2 || "Part 2:"}</strong> <code>{t.common?.twentyOnePointFourNineMinusPayslipHourlyRate || "21.49 - payslip.hourly_rate"}</code><br/>
                        <small>{t.common?.differenceBetweenYouthMinimumAndActualPay || "Difference between youth minimum and actual pay = Shortfall per hour"}</small><br/><br/>

                        <strong style={{ color: '#0C756F' }}>{t.common?.part3 || "Part 3:"}</strong> <code>{t.common?.max2149MinusPayslipHourlyRateTimesAttendanceRegularHoursComma0 || "max((21.49 - payslip.hourly_rate) * attendance.regular_hours, 0)"}</code><br/>
                        <small>{t.common?.shortfallPerHourTimesRegularHoursEqualsTotalAmountOwedMinimum0 || "Shortfall per hour × regular hours = Total amount owed (minimum 0)"}</small><br/><br/>

                        <strong style={{ color: '#0C756F' }}>{t.common?.final || "Final:"}</strong> <code>{t.common?.totalShortfallEqualsAmountOwedToYouthWorker || "Total shortfall = Amount owed to youth worker"}</code>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h6 style={{ color: '#0C756F', fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.1rem', fontWeight: '600', marginBottom: '15px' }}>
                  <i className="bi bi-6-circle me-2"></i>{t.steps?.step6 || "Step 6: Real Example with Numbers"}
                </h6>
                <div className="card" style={{ backgroundColor: 'white', border: '2px solid #FDCF6F' }}>
                  <div className="card-body">
                    <h6 style={{ color: '#0C756F' }}>{t.common?.employeeScenario || "Employee Scenario:"}</h6>
                      <div className="row">
                        <div className="col-md-6">
                        <ul style={{ color: '#2d3748', fontSize: '0.95rem' }}>
                          <li><strong>{t.common?.employeeAge || "Employee age:"}</strong> {t.common?.yearsOldYouthWorker || "17 years old (youth worker)"}</li>
                          <li><strong>{t.common?.regularHoursWorked8Hours || "Regular hours worked: 8 hours"}</strong></li>
                          <li><strong>{t.common?.actuallyPaid || "Actually paid"} {t.common?.perHour || "per hour"}:</strong> ₪18.00</li>
                        </ul>
                        </div>
                        <div className="col-md-6">
                        <div className="alert alert-warning" style={{ backgroundColor: 'rgba(255, 193, 7, 0.1)', border: '1px solid #ffc107' }}>
                          <strong>{t.common?.problem || "Problem:"}</strong> {t.common?.problemYouthWorkerShouldGetAtLeast2149PerHour70PercentOfAdultMinimumButOnlyGot1800PerHour || "Youth worker should get at least ₪21.49/hour (70% of adult minimum), but only got ₪18.00/hour"}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3">
                      <h6 style={{ color: '#0C756F' }}>{t.common?.completeCalculation || "Complete Calculation:"}</h6>
                      <div className="bg-light p-3 rounded">
                        <div className="row">
                          <div className="col-md-6">
                            <strong>1. {t.common?.requiredMinimumWageForYouth || "Required minimum wage for youth:"}</strong><br/>
                            <code>30.70 * 0.70 = 21.49</code><br/>
                            <small>{t.common?.youthWorkersGet70PercentOfAdultMinimumWage || "Youth workers get 70% of adult minimum wage"}</small>
                  </div>
                          <div className="col-md-6">
                            <strong>2. {t.common?.shortfallPerHour || "Shortfall per hour:"}</strong><br/>
                            <code>{t.common?.twentyOnePointFourNineMinusPayslipHourlyRate || "21.49 - payslip.hourly_rate"}</code><br/>
                            <code>21.49 - 18.00 = 3.49</code><br/>
                            <small>{t.common?.underpaidBy349PerHour || "Underpaid by ₪3.49 per hour"}</small>
                          </div>
                        </div>
                        <hr/>
                        <div className="row">
                          <div className="col-md-6">
                            <strong>3. {t.common?.totalShortfallCalculation || "Total shortfall calculation:"}</strong><br/>
                            <code>{t.common?.twentyOnePointFourNineMinusPayslipHourlyRateTimesAttendanceRegularHours || "(21.49 - payslip.hourly_rate) * attendance.regular_hours"}</code><br/>
                            <code>3.49 * 8 = 27.92</code><br/>
                            <small>{t.common?.totalShortfallFor8Hours || "Total shortfall for 8 hours"}</small>
                          </div>
                          <div className="col-md-6">
                            <strong>4. {t.common?.finalAmountOwed || "Final amount owed:"}</strong><br/>
                            <code>max(27.92, 0) = 27.92</code><br/>
                            <span style={{ color: '#dc3545', fontWeight: 'bold' }}>{t.common?.owes2792ToYouthWorker || "Owes ₪27.92 to youth worker"}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h6 style={{ color: '#0C756F', fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.1rem', fontWeight: '600', marginBottom: '15px' }}>
                  <i className="bi bi-7-circle me-2"></i>{t.steps?.step7 || "Step 7: Complete Rule Setup"}
                </h6>
                <div className="card" style={{ backgroundColor: 'rgba(0, 123, 255, 0.1)', border: '2px solid #007bff' }}>
                  <div className="card-body">
                    <h6 style={{ color: '#0C756F' }}>{t.common?.createTwoSeparateRulesOneForEachAgeGroup || "Create Two Separate Rules - One for Each Age Group:"}</h6>

                    <div className="row mb-4">
                      <div className="col-md-6">
                        <div className="card" style={{ backgroundColor: 'rgba(40, 167, 69, 0.1)', border: '2px solid #28a745' }}>
                          <div className="card-header" style={{ backgroundColor: '#28a745', color: 'white' }}>
                            <strong>{t.common?.rule1AdultMinimumWage18Plus || "Rule 1: Adult Minimum Wage (18+)"}</strong>
                          </div>
                          <div className="card-body">
                            <strong>{t.common?.ruleName || "Rule Name:"}</strong> {t.common?.minimumWageAdultWorkers18Plus || "Minimum Wage - Adult Workers (18+)"}<br/>
                            <strong>{t.common?.lawReference || "Law Reference:"}</strong> {t.common?.israeliLaborLawMinimumWageRegulations || "Israeli Labor Law - Minimum Wage Regulations"}<br/>
                            <strong>{t.common?.description || "Description:"}</strong> {t.common?.adultWorkersMustReceiveAtLeast30 || "Adult workers must receive at least ₪30.70 per hour"}<br/>
                            <strong>{t.common?.effectiveDates || "Effective Dates:"}</strong> {t.common?.currentDateRange || "Current date range"}<br/><br/>

                          <strong>{t.common?.condition || "Condition:"}</strong><br/>
                            <code style={{ backgroundColor: '#f8f9fa', padding: '4px', borderRadius: '3px', display: 'block', fontSize: '0.85rem' }}>
                              {t.common?.employeeAgeGreaterThanOrEqual18AndPayslipHourlyRateLessThan3070 || "employee.age >= 18 AND payslip.hourly_rate < 30.70"}
                            </code>
                            <strong>{t.common?.amountOwed || "Amount Owed:"}</strong><br/>
                            <code style={{ backgroundColor: '#f8f9fa', padding: '4px', borderRadius: '3px', display: 'block', fontSize: '0.85rem' }}>
                              {t.common?.max3070MinusPayslipHourlyRateTimesAttendanceRegularHoursComma0 || "max((30.70 - payslip.hourly_rate) * attendance.regular_hours, 0)"}
                            </code>
                            <strong>{t.common?.violationMessage || "Violation Message:"}</strong><br/>
                            <small>&quot;{t.common?.underpaidMinimumWageAdult || "Underpaid minimum wage for adult worker"}&quot;</small>
                        </div>
                        </div>
                      </div>

                        <div className="col-md-6">
                        <div className="card" style={{ backgroundColor: 'rgba(220, 53, 69, 0.1)', border: '2px solid #dc3545' }}>
                          <div className="card-header" style={{ backgroundColor: '#dc3545', color: 'white' }}>
                            <strong>{t.common?.rule2YouthMinimumWage16to17 || "Rule 2: Youth Minimum Wage (16-17)"}</strong>
                          </div>
                          <div className="card-body">
                            <strong>{t.common?.ruleName || "Rule Name:"}</strong> {t.common?.minimumWageYouthWorkers16to17 || "Minimum Wage - Youth Workers (16-17)"}<br/>
                            <strong>{t.common?.lawReference || "Law Reference:"}</strong> {t.common?.israeliLaborLawMinimumWageRegulations || "Israeli Labor Law - Minimum Wage Regulations"}<br/>
                            <strong>{t.common?.description || "Description:"}</strong> {t.common?.youthWorkersMustReceiveAtLeast21 || "Youth workers must receive at least ₪21.49 per hour (70% of adult minimum)"}<br/>
                            <strong>{t.common?.effectiveDates || "Effective Dates:"}</strong> {t.common?.currentDateRange || "Current date range"}<br/><br/>

                            <strong>{t.common?.condition || "Condition:"}</strong><br/>
                            <code style={{ backgroundColor: '#f8f9fa', padding: '4px', borderRadius: '3px', display: 'block', fontSize: '0.85rem' }}>
                              {t.common?.employeeAgeLessThan18AndPayslipHourlyRateLessThan2149 || "employee.age < 18 AND payslip.hourly_rate < 21.49"}
                            </code>
                          <strong>{t.common?.amountOwed || "Amount Owed:"}</strong><br/>
                            <code style={{ backgroundColor: '#f8f9fa', padding: '4px', borderRadius: '3px', display: 'block', fontSize: '0.85rem' }}>
                              {t.common?.max2149MinusPayslipHourlyRateTimesAttendanceRegularHoursComma0 || "max((21.49 - payslip.hourly_rate) * attendance.regular_hours, 0)"}
                            </code>
                            <strong>{t.common?.violationMessage || "Violation Message:"}</strong><br/>
                            <small>&quot;{t.common?.underpaidMinimumWageYouth || "Underpaid minimum wage for youth worker"}&quot;</small>
                        </div>
                      </div>
                      </div>
                    </div>

                    <div className="alert alert-info" style={{ backgroundColor: 'rgba(23, 162, 184, 0.1)', border: '1px solid #17a2b8' }}>
                      <i className="bi bi-info-circle me-2"></i>
                      <strong>{t.common?.important || "Important:"}</strong> {t.common?.createTheseAsTwoSeparateRulesSystemWillEvaluateAppropriateRuleBasedOnEmployeeAge || "Create these as two separate rules. The system will evaluate the appropriate rule based on the employee's age."}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Vacation Pay Tab */}
            <div className="tab-pane fade" id="vacation" role="tabpanel" aria-labelledby="vacation-tab">
              <div className="mb-4">
                <h6 style={{ color: '#0C756F', fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.1rem', fontWeight: '600', marginBottom: '15px' }}>
                  <i className="bi bi-1-circle me-2"></i>{t.steps?.step1 || "Step 1: Understand the Law Requirement"}
                </h6>
                <div className="card" style={{ backgroundColor: 'white', border: '2px solid #FDCF6F' }}>
                  <div className="card-body">
                    <h6 style={{ color: '#0C756F' }}>{t.vacationPay?.lawTitle || "Vacation Pay Law (Israel)"}</h6>
                    <ul style={{ color: '#2d3748', fontSize: '0.95rem' }}>
                      {(t.vacationPay?.lawDetails || [
                        t.common?.years1To4VacationDays || "Years 1-4: 14 vacation days per year",
                        t.common?.years5To9VacationDays || "Years 5-9: 16 vacation days per year",
                        t.common?.years10To14VacationDays || "Years 10-14: 18 vacation days per year",
                        t.common?.years15To19VacationDays || "Years 15-19: 20 vacation days per year",
                        t.common?.years20PlusVacationDays || "Years 20+: 22 vacation days per year"
                      ]).map((detail: string, index: number) => (
                        <li key={index}><strong>{detail.split(':')[0]}:</strong>{detail.split(':').slice(1).join(':')}</li>
                      ))}
                    </ul>
                    <p style={{ color: '#2d3748', fontSize: '0.9rem', marginTop: '10px' }}>
                      <strong>{t.vacationPay?.lawDescription || "In simple terms: When employees take vacation, they must be paid their regular daily rate for each vacation day taken."}</strong>
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h6 style={{ color: '#0C756F', fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.1rem', fontWeight: '600', marginBottom: '15px' }}>
                  <i className="bi bi-2-circle me-2"></i>{t.steps?.step2 || "Step 2: What Data Do We Need?"}
                </h6>
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <div className="card h-100" style={{ backgroundColor: 'rgba(12, 117, 111, 0.05)', border: '1px solid rgba(12, 117, 111, 0.2)' }}>
                      <div className="card-body text-center">
                        <i className="bi bi-calendar-range" style={{ fontSize: '2rem', color: '#0C756F' }}></i>
                        <h6 style={{ color: '#0C756F', fontSize: '0.9rem', marginTop: '10px' }}>{t.common?.serviceData || "Service Data"}</h6>
                        <code style={{ backgroundColor: 'rgba(12, 117, 111, 0.1)', padding: '2px 4px', borderRadius: '3px', fontSize: '0.8rem' }}>
                          employee.years_of_service
                        </code>
                        <p style={{ fontSize: '0.8rem', color: '#2d3748', marginTop: '5px' }}>{t.common?.yearsOfServiceDeterminesVacationEntitlement || "Years of service determines vacation entitlement"}</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 mb-3">
                    <div className="card h-100" style={{ backgroundColor: 'rgba(12, 117, 111, 0.05)', border: '1px solid rgba(12, 117, 111, 0.2)' }}>
                      <div className="card-body text-center">
                        <i className="bi bi-airplane" style={{ fontSize: '2rem', color: '#0C756F' }}></i>
                        <h6 style={{ color: '#0C756F', fontSize: '0.9rem', marginTop: '10px' }}>{t.common?.vacationData || "Vacation Data"}</h6>
                        <code style={{ backgroundColor: 'rgba(12, 117, 111, 0.1)', padding: '2px 4px', borderRadius: '3px', fontSize: '0.8rem' }}>
                          payslip.vacation_days_taken
                        </code>
                        <p style={{ fontSize: '0.8rem', color: '#2d3748', marginTop: '5px' }}>{t.common?.numberOfVacationDaysTaken || "Number of vacation days taken"}</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 mb-3">
                    <div className="card h-100" style={{ backgroundColor: 'rgba(12, 117, 111, 0.05)', border: '1px solid rgba(12, 117, 111, 0.2)' }}>
                      <div className="card-body text-center">
                        <i className="bi bi-cash-stack" style={{ fontSize: '2rem', color: '#0C756F' }}></i>
                        <h6 style={{ color: '#0C756F', fontSize: '0.9rem', marginTop: '10px' }}>{t.common?.payData || "Pay Data"}</h6>
                        <code style={{ backgroundColor: 'rgba(12, 117, 111, 0.1)', padding: '2px 4px', borderRadius: '3px', fontSize: '0.8rem' }}>
                          payslip.vacation_pay
                        </code>
                        <p style={{ fontSize: '0.8rem', color: '#2d3748', marginTop: '5px' }}>{t.common?.whatTheyWereActuallyPaidForVacation || "What they were actually paid for vacation"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h6 style={{ color: '#0C756F', fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.1rem', fontWeight: '600', marginBottom: '15px' }}>
                  <i className="bi bi-3-circle me-2"></i>{t.steps?.step3 || "Step 3: Available Functions & Examples"}
                </h6>
                <div className="alert alert-info" style={{ backgroundColor: 'rgba(23, 162, 184, 0.1)', border: '1px solid #17a2b8', borderRadius: '8px', marginBottom: '20px' }}>
                  <i className="bi bi-info-circle me-2"></i>
                  <strong style={{ color: '#0C756F' }}>{t.common?.availableFunctions || "Available Functions:"}</strong> <code>min()</code>, <code>max()</code>, <code>abs()</code>, <code>round()</code>
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <div className="card h-100 shadow-sm" style={{ border: '2px solid #28a745', borderRadius: '12px' }}>
                      <div className="card-header" style={{ backgroundColor: '#28a745', color: 'white', borderRadius: '10px 10px 0 0' }}>
                        <h6 className="mb-0" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                          <i className="bi bi-chevron-down me-2"></i>min(a, b) - Smaller Value
                        </h6>
                </div>
                <div className="card-body">
                        <p style={{ color: '#2d3748', fontSize: '0.9rem', marginBottom: '15px' }}>
                          <strong>{t.common?.purpose || "Purpose:"}</strong> {t.common?.returnsSmallerOfTwoValuesCapping || "Returns the smaller of two values. Perfect for \"capping\" calculations."}
                        </p>

                        <div className="mb-3">
                          <h6 style={{ color: '#0C756F', fontSize: '0.95rem', marginBottom: '10px' }}>{t.common?.example1VacationDaysCap || "Example 1: Vacation Days Cap"}</h6>
                          <div className="bg-light p-2 rounded mb-2">
                            <code style={{ fontSize: '0.85rem' }}>min(payslip.vacation_days_taken, 14)</code>
                          </div>
                          <ul style={{ fontSize: '0.85rem', color: '#2d3748', paddingLeft: '20px' }}>
                            <li>{t.common?.took20DaysReturns14CappedAtEntitlement || "Took 20 days → returns 14 (capped at entitlement)"}</li>
                            <li>{t.common?.took10DaysReturns10ActualDaysTaken || "Took 10 days → returns 10 (actual days taken)"}</li>
                  </ul>
                </div>

                        <div className="mb-3">
                          <h6 style={{ color: '#0C756F', fontSize: '0.95rem', marginBottom: '10px' }}>{t.common?.example2MaximumDailyRate || "Example 2: Maximum Daily Rate"}</h6>
                          <div className="bg-light p-2 rounded mb-2">
                            <code style={{ fontSize: '0.85rem' }}>{t.common?.minContractDailyRateComma300 || "min(contract.daily_rate, 300)"}</code>
              </div>
                          <ul style={{ fontSize: '0.85rem', color: '#2d3748', paddingLeft: '20px' }}>
                            <li>{t.common?.dailyRate350Returns300Capped || "Daily rate ₪350 → returns 300 (capped)"}</li>
                            <li>{t.common?.dailyRate250Returns250ActualRate || "Daily rate ₪250 → returns 250 (actual rate)"}</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="card h-100 shadow-sm" style={{ border: '2px solid #dc3545', borderRadius: '12px' }}>
                      <div className="card-header" style={{ backgroundColor: '#dc3545', color: 'white', borderRadius: '10px 10px 0 0' }}>
                        <h6 className="mb-0" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                          <i className="bi bi-chevron-up me-2"></i>max(a, b) - {t.common?.largerValue || "Larger Value"}
                        </h6>
                      </div>
                      <div className="card-body">
                        <p style={{ color: '#2d3748', fontSize: '0.9rem', marginBottom: '15px' }}>
                          <strong>{t.common?.purpose || "Purpose:"}</strong> {t.common?.returnsLargerOfTwoValuesExtended || "Returns the larger of two values. Great for ensuring minimums or handling negative numbers."}
                        </p>

                        <div className="mb-3">
                          <h6 style={{ color: '#0C756F', fontSize: '0.95rem', marginBottom: '10px' }}>{t.common?.example1MinimumVacationPay || "Example 1: Minimum Vacation Pay"}</h6>
                          <div className="bg-light p-2 rounded mb-2">
                            <code style={{ fontSize: '0.85rem' }}>{t.common?.maxContractDailyRateTimesPayslipVacationDaysTakenComma0 || "max(contract.daily_rate * payslip.vacation_days_taken, 0)"}</code>
                          </div>
                          <ul style={{ fontSize: '0.85rem', color: '#2d3748', paddingLeft: '20px' }}>
                            <li>{t.common?.calculated200NegativeResultMax200Comma0Equals200 || "Calculated: ₪200, negative result → max(200, 0) = 200"}</li>
                            <li>{t.common?.calculatedMinus50NegativeResultMaxMinus50Comma0Equals0 || "Calculated: -₪50, negative result → max(-50, 0) = 0"}</li>
                          </ul>
                        </div>

                        <div className="mb-3">
                          <h6 style={{ color: '#0C756F', fontSize: '0.95rem', marginBottom: '10px' }}>{t.common?.example2ServiceYearsMinimum || "Example 2: Service Years Minimum"}</h6>
                          <div className="bg-light p-2 rounded mb-2">
                            <code style={{ fontSize: '0.85rem' }}>max(employee.years_of_service, 1)</code>
                          </div>
                          <ul style={{ fontSize: '0.85rem', color: '#2d3748', paddingLeft: '20px' }}>
                            <li>{t.common?.service05YearsMax05Comma1Equals1Minimum1Year || "Service: 0.5 years → max(0.5, 1) = 1 (minimum 1 year)"}</li>
                            <li>{t.common?.service3YearsMax3Comma1Equals3ActualService || "Service: 3 years → max(3, 1) = 3 (actual service)"}</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <div className="card h-100 shadow-sm" style={{ border: '2px solid #ffc107', borderRadius: '12px' }}>
                      <div className="card-header" style={{ backgroundColor: '#ffc107', color: '#0F0F14', borderRadius: '10px 10px 0 0' }}>
                        <h6 className="mb-0" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                          <i className="bi bi-plus-slash-minus me-2"></i>abs(number) - Absolute Value
                        </h6>
                </div>
                <div className="card-body">
                        <p style={{ color: '#2d3748', fontSize: '0.9rem', marginBottom: '15px' }}>
                          <strong>{t.common?.purpose || "Purpose:"}</strong> {t.common?.removesNegativeSigns || "Removes negative signs. Ensures amounts are always positive."}
                        </p>

                        <div className="mb-3">
                          <h6 style={{ color: '#0C756F', fontSize: '0.95rem', marginBottom: '10px' }}>{t.common?.example1VacationPayDifference || "Example 1: Vacation Pay Difference"}</h6>
                          <div className="bg-light p-2 rounded mb-2">
                            <code style={{ fontSize: '0.85rem' }}>{t.common?.absPayslipVacationPayMinusContractDailyRateTimesPayslipVacationDaysTaken || "abs(payslip.vacation_pay - contract.daily_rate * payslip.vacation_days_taken)"}</code>
                          </div>
                          <ul style={{ fontSize: '0.85rem', color: '#2d3748', paddingLeft: '20px' }}>
                            <li>{t.common?.paid100Owed120Abs100Minus120EqualsAbsMinus20Equals20 || "Paid ₪100, owed ₪120 → abs(100-120) = abs(-20) = 20"}</li>
                            <li>{t.common?.paid130Owed120Abs130Minus120EqualsAbs10Equals10 || "Paid ₪130, owed ₪120 → abs(130-120) = abs(10) = 10"}</li>
                          </ul>
                        </div>

                        <div className="mb-3">
                          <h6 style={{ color: '#0C756F', fontSize: '0.95rem', marginBottom: '10px' }}>{t.common?.example2ServiceYearsDifference || "Example 2: Service Years Difference"}</h6>
                          <div className="bg-light p-2 rounded mb-2">
                            <code style={{ fontSize: '0.85rem' }}>abs(employee.years_of_service - 5)</code>
                          </div>
                          <ul style={{ fontSize: '0.85rem', color: '#2d3748', paddingLeft: '20px' }}>
                            <li>{t.common?.service3YearsAbs3Minus5EqualsAbsMinus2Equals2 || "Service: 3 years → abs(3-5) = abs(-2) = 2"}</li>
                            <li>{t.common?.service7YearsAbs7Minus5EqualsAbs2Equals2 || "Service: 7 years → abs(7-5) = abs(2) = 2"}</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="card h-100 shadow-sm" style={{ border: '2px solid #6f42c1', borderRadius: '12px' }}>
                      <div className="card-header" style={{ backgroundColor: '#6f42c1', color: 'white', borderRadius: '10px 10px 0 0' }}>
                        <h6 className="mb-0" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                          <i className="bi bi-hash me-2"></i>round(number) - Round to Whole Number
                        </h6>
                    </div>
                    <div className="card-body">
                        <p style={{ color: '#2d3748', fontSize: '0.9rem', marginBottom: '15px' }}>
                          <strong>{t.common?.purpose || "Purpose:"}</strong> {t.common?.roundsDecimalNumbers || "Rounds decimal numbers to the nearest whole number for clean money calculations."}
                        </p>

                        <div className="mb-3">
                          <h6 style={{ color: '#0C756F', fontSize: '0.95rem', marginBottom: '10px' }}>{t.common?.example1DailyRateCalculation || "Example 1: Daily Rate Calculation"}</h6>
                          <div className="bg-light p-2 rounded mb-2">
                            <code style={{ fontSize: '0.85rem' }}>{t.common?.roundContractHourlyRateTimes8 || "round(contract.hourly_rate * 8)"}</code>
                          </div>
                          <ul style={{ fontSize: '0.85rem', color: '#2d3748', paddingLeft: '20px' }}>
                            <li>{t.common?.hourly2950Times8Equals23600Round23600Equals236 || "Hourly ₪29.50 → 29.50 × 8 = 236.00 → round(236.00) = 236"}</li>
                            <li>{t.common?.hourly3025Times8Equals24200Round24200Equals242 || "Hourly ₪30.25 → 30.25 × 8 = 242.00 → round(242.00) = 242"}</li>
                          </ul>
                        </div>

                        <div className="mb-3">
                          <h6 style={{ color: '#0C756F', fontSize: '0.95rem', marginBottom: '10px' }}>{t.common?.example2TotalVacationPay || "Example 2: Total Vacation Pay"}</h6>
                          <div className="bg-light p-2 rounded mb-2">
                            <code style={{ fontSize: '0.85rem' }}>{t.common?.roundContractDailyRateTimesPayslipVacationDaysTaken || "round(contract.daily_rate * payslip.vacation_days_taken)"}</code>
                          </div>
                          <ul style={{ fontSize: '0.85rem', color: '#2d3748', paddingLeft: '20px' }}>
                            <li>{t.common?.daily240Times5DaysEquals120000Round120000Equals1200 || "Daily ₪240 × 5 days = 1200.00 → round(1200.00) = 1200"}</li>
                            <li>{t.common?.daily24550Times3DaysEquals73650Round73650Equals737 || "Daily ₪245.50 × 3 days = 736.50 → round(736.50) = 737"}</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Function Usage Tips */}
                <div className="alert alert-warning" style={{ backgroundColor: 'rgba(255, 193, 7, 0.1)', border: '1px solid #ffc107', borderRadius: '8px' }}>
                  <i className="bi bi-lightbulb me-2"></i>
                  <strong style={{ color: '#0C756F' }}>{t.common?.functionTipsForVacationPay || "Function Tips for Vacation Pay:"}</strong>
                  <ul className="mb-0 mt-2" style={{ color: '#2d3748', fontSize: '0.9rem' }}>
                    <li><strong>min()</strong> {t.common?.minCapsVacationDaysToLegalEntitlement || "caps vacation days to legal entitlement"}</li>
                    <li><strong>max()</strong> {t.common?.maxEnsuresMinimumPayAndPreventsNegativeResults || "ensures minimum pay and prevents negative results"}</li>
                    <li><strong>abs()</strong> {t.common?.absHandlesPayDifferencesRegardlessOfOverUnderPayment || "handles pay differences regardless of over/under payment"}</li>
                    <li><strong>round()</strong> {t.common?.roundGivesCleanWholeNumbersForDailyRatesAndTotals || "gives clean whole numbers for daily rates and totals"}</li>
                    <li><em>{t.common?.useConditionalLogicEmployeeYearsOfServiceLessThan5 || "Use conditional logic: employee.years_of_service < 5 ? 14 : 16"}</em></li>
                  </ul>
                </div>
              </div>

              <div className="mb-4">
                <h6 style={{ color: '#0C756F', fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.1rem', fontWeight: '600', marginBottom: '15px' }}>
                  <i className="bi bi-4-circle-fill me-2"></i>{t.steps?.step4 || "Step 4: Building the Rule"} - {t.common?.basicVacationPay || "Basic Vacation Pay"}
                </h6>
                <div className="card" style={{ backgroundColor: 'rgba(40, 167, 69, 0.1)', border: '2px solid #28a745' }}>
                  <div className="card-body">
                    <h6 style={{ color: '#0C756F' }}>{t.common?.whatWeWantToCheck || "What we want to check:"}</h6>
                    <p style={{ color: '#2d3748', fontSize: '0.95rem' }}>
                      {t.common?.didEmployeeGetPaidRegularDailyRateForVacation || "Did the employee get paid their regular daily rate for each vacation day taken?"}
                    </p>

                    <div className="row mt-3">
                      <div className="col-md-6">
                        <h6 style={{ color: '#0C756F', fontSize: '1rem' }}>{t.common?.conditionWhenToCheck || "Condition (When to check):"}</h6>
                        <code style={{ backgroundColor: '#f8f9fa', padding: '8px', borderRadius: '4px', display: 'block', fontSize: '0.9rem' }}>
                          payslip.vacation_days_taken &gt; 0
                        </code>
                        <p style={{ fontSize: '0.85rem', color: '#2d3748', marginTop: '5px' }}>
                          <em>{t.common?.translationIfEmployeeTookVacationDays || "Translation: \"If the employee took any vacation days\""}</em>
                        </p>
                      </div>
                      <div className="col-md-6">
                        <h6 style={{ color: '#0C756F', fontSize: '1rem' }}>{t.common?.amountOwedFormula || "Amount Owed Formula:"}</h6>
                        <code style={{ backgroundColor: '#f8f9fa', padding: '8px', borderRadius: '4px', display: 'block', fontSize: '0.9rem' }}>
                          {t.common?.maxContractDailyRateTimesPayslipVacationDaysTakenMinusPayslipVacationPayComma0 || "max((contract.daily_rate * payslip.vacation_days_taken) - payslip.vacation_pay, 0)"}
                        </code>
                      </div>
                    </div>

                    <div className="mt-3">
                      <h6 style={{ color: '#0C756F' }}>{t.common?.howFormulaWorks || "How the formula works:"}</h6>
                      <div className="bg-light p-3 rounded">
                        <strong style={{ color: '#0C756F' }}>{t.common?.part1 || "Part 1:"}</strong> <code>{t.common?.contractDailyRateTimesPayslipVacationDaysTaken || "contract.daily_rate * payslip.vacation_days_taken"}</code><br/>
                        <small>{t.common?.requiredVacationPayDailyRateTimesVacationDays || "Required vacation pay: Daily rate × vacation days taken = Total owed"}</small><br/><br/>

                        <strong style={{ color: '#0C756F' }}>{t.common?.part2 || "Part 2:"}</strong> <code>{t.common?.contractDailyRateTimesPayslipVacationDaysTakenMinusPayslipVacationPay || "(contract.daily_rate * payslip.vacation_days_taken) - payslip.vacation_pay"}</code><br/>
                        <small>{t.common?.requiredPayMinusActualPayEqualsShortfall || "Required pay minus actual pay = Shortfall amount"}</small><br/><br/>

                        <strong style={{ color: '#0C756F' }}>{t.common?.part3 || "Part 3:"}</strong> <code>max(..., 0)</code><br/>
                        <small>{t.common?.ensuresWeOnlyGetPositiveAmounts || "Ensures we only get positive amounts (no negative results if overpaid)"}</small><br/><br/>

                        <strong style={{ color: '#0C756F' }}>{t.common?.final || "Final:"}</strong> <code>{t.common?.shortfallAmountEqualsAmountOwedToEmployee || "Shortfall amount = Amount owed to employee"}</code>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h6 style={{ color: '#0C756F', fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.1rem', fontWeight: '600', marginBottom: '15px' }}>
                  <i className="bi bi-5-circle me-2"></i>{t.steps?.step5 || "Step 5: Building the Rule"} - {t.common?.vacationEntitlementCheck || "Vacation Entitlement Check"}
                </h6>
                <div className="card" style={{ backgroundColor: 'rgba(220, 53, 69, 0.1)', border: '2px solid #dc3545' }}>
                  <div className="card-body">
                    <h6 style={{ color: '#0C756F' }}>{t.common?.whatWeWantToCheck || "What we want to check:"}</h6>
                    <p style={{ color: '#2d3748', fontSize: '0.95rem' }}>
                      {t.common?.didEmployeeTakeMoreVacationDaysThanEntitled || "Did the employee take more vacation days than they're entitled to based on their years of service?"}
                    </p>

                    <div className="row mt-3">
                      <div className="col-md-6">
                        <h6 style={{ color: '#0C756F', fontSize: '1rem' }}>{t.common?.conditionWhenToCheck || "Condition (When to check):"}</h6>
                        <code style={{ backgroundColor: '#f8f9fa', padding: '8px', borderRadius: '4px', display: 'block', fontSize: '0.9rem' }}>
                          payslip.vacation_days_taken &gt; 0
                        </code>
                        <p style={{ fontSize: '0.85rem', color: '#2d3748', marginTop: '5px' }}>
                          <em>{t.common?.translationIfEmployeeTookVacationDays || "Translation: \"If the employee took any vacation days\""}</em>
                        </p>
                      </div>
                      <div className="col-md-6">
                        <h6 style={{ color: '#0C756F', fontSize: '1rem' }}>{t.common?.amountOwedFormula || "Amount Owed Formula:"}</h6>
                        <code style={{ backgroundColor: '#f8f9fa', padding: '8px', borderRadius: '4px', display: 'block', fontSize: '0.9rem' }}>
                          {t.common?.maxContractDailyRateTimesMinPayslipVacationDaysTakenComma14MinusPayslipVacationPayComma0 || "max((contract.daily_rate * min(payslip.vacation_days_taken, 14)) - payslip.vacation_pay, 0)"}
                        </code>
                      </div>
                    </div>

                    <div className="mt-3">
                      <h6 style={{ color: '#0C756F' }}>{t.common?.howFormulaWorks || "How the formula works:"}</h6>
                      <div className="bg-light p-3 rounded">
                        <strong style={{ color: '#0C756F' }}>{t.common?.part1 || "Part 1:"}</strong> <code>min(payslip.vacation_days_taken, 14)</code><br/>
                        <small>{t.common?.eligibleDaysEitherActualDaysOrEntitlement || "Eligible days: Either actual days taken OR 14 (entitlement for years 1-4), whichever is smaller"}</small><br/><br/>

                        <strong style={{ color: '#0C756F' }}>{t.common?.part2 || "Part 2:"}</strong> <code>{t.common?.contractDailyRateTimesMinPayslipVacationDaysTakenComma14 || "contract.daily_rate * min(payslip.vacation_days_taken, 14)"}</code><br/>
                        <small>{t.common?.requiredPayDailyRateTimesEligibleDays || "Required pay: Daily rate × eligible days = Total owed for eligible days"}</small><br/><br/>

                        <strong style={{ color: '#0C756F' }}>{t.common?.part3 || "Part 3:"}</strong> <code>max((required_pay) - payslip.vacation_pay, 0)</code><br/>
                        <small>Required pay minus actual pay = Shortfall (minimum 0)</small><br/><br/>

                        <strong style={{ color: '#0C756F' }}>{t.common?.final || "Final:"}</strong> <code>{t.common?.shortfallEqualsAmountOwedForEligibleVacationDays || "Shortfall = Amount owed for eligible vacation days"}</code>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h6 style={{ color: '#0C756F', fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.1rem', fontWeight: '600', marginBottom: '15px' }}>
                  <i className="bi bi-6-circle me-2"></i>{t.steps?.step6 || "Step 6: Real Example with Numbers"}
                </h6>
                <div className="card" style={{ backgroundColor: 'white', border: '2px solid #FDCF6F' }}>
                  <div className="card-body">
                    <h6 style={{ color: '#0C756F' }}>{t.common?.employeeScenario || "Employee Scenario:"}</h6>
                      <div className="row">
                        <div className="col-md-6">
                        <ul style={{ color: '#2d3748', fontSize: '0.95rem' }}>
                          <li><strong>{t.common?.yearsOfService3YearsEntitledTo14Days || "Years of service: 3 years (entitled to 14 days)"}</strong></li>
                          <li><strong>{t.common?.vacationDaysTaken5Days || "Vacation days taken: 5 days"}</strong></li>
                          <li><strong>{t.common?.contractDailyRate24000 || "Contract daily rate: ₪240.00"}</strong></li>
                          <li><strong>{t.common?.actuallyPaidForVacation100000 || "Actually paid for vacation: ₪1,000.00"}</strong></li>
                        </ul>
                        </div>
                        <div className="col-md-6">
                        <div className="alert alert-warning" style={{ backgroundColor: 'rgba(255, 193, 7, 0.1)', border: '1px solid #ffc107' }}>
                          <strong>{t.common?.problem || "Problem:"}</strong> {t.common?.problemEmployeeShouldGet240Times5Equals1200ForVacationButOnlyGot1000 || "Employee should get ₪240 × 5 = ₪1,200 for vacation, but only got ₪1,000"}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3">
                      <h6 style={{ color: '#0C756F' }}>{t.common?.completeCalculation || "Complete Calculation:"}</h6>
                      <div className="bg-light p-3 rounded">
                        <div className="row">
                          <div className="col-md-6">
                            <strong>1. {t.common?.requiredVacationPay || "Required vacation pay:"}</strong><br/>
                            <code>{t.common?.contractDailyRateTimesPayslipVacationDaysTaken || "contract.daily_rate * payslip.vacation_days_taken"}</code><br/>
                            <code>240.00 * 5 = 1,200.00</code><br/>
                            <small>{t.common?.shouldGet240PerDayFor5Days || "Should get ₪240 per day for 5 days"}</small>
                  </div>
                          <div className="col-md-6">
                            <strong>2. {t.common?.shortfallCalculation || "Shortfall calculation:"}</strong><br/>
                            <code>1,200.00 - payslip.vacation_pay</code><br/>
                            <code>1,200.00 - 1,000.00 = 200.00</code><br/>
                            <small>{t.common?.underpaidBy20000 || "Underpaid by ₪200.00"}</small>
                </div>
              </div>
                        <hr/>
                        <div className="row">
                          <div className="col-md-6">
                            <strong>3. {t.common?.finalAmountOwed || "Final amount owed:"}</strong><br/>
                            <code>max(200.00, 0) = 200.00</code><br/>
                            <small>{t.common?.ensurePositiveResult || "Ensure positive result"}</small>
                          </div>
                          <div className="col-md-6">
                            <strong>4. {t.common?.result || "Result:"}</strong><br/>
                            <span style={{ color: '#dc3545', fontWeight: 'bold' }}>{t.common?.owes200ForVacationPay || "Owes ₪200.00 for vacation pay"}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h6 style={{ color: '#0C756F', fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.1rem', fontWeight: '600', marginBottom: '15px' }}>
                  <i className="bi bi-7-circle me-2"></i>{t.steps?.step7 || "Step 7: Complete Rule Setup"}
                </h6>
                <div className="card" style={{ backgroundColor: 'rgba(0, 123, 255, 0.1)', border: '2px solid #007bff' }}>
                  <div className="card-body">
                    <h6 style={{ color: '#0C756F' }}>{t.common?.createRulesForDifferentServicePeriods || "Create Rules for Different Service Periods:"}</h6>

                    <div className="row mb-4">
                      <div className="col-md-6">
                        <div className="card" style={{ backgroundColor: 'rgba(40, 167, 69, 0.1)', border: '2px solid #28a745' }}>
                          <div className="card-header" style={{ backgroundColor: '#28a745', color: 'white' }}>
                            <strong>{t.common?.rule1Years1to4Days || "Rule 1: Years 1-4 (14 days)"}</strong>
                          </div>
                          <div className="card-body">
                            <strong>{t.common?.ruleName || "Rule Name:"}</strong> {t.common?.vacationPayYears1to4Days || "Vacation Pay - Years 1-4 (14 days)"}<br/>
                            <strong>{t.common?.lawReference || "Law Reference:"}</strong> {t.common?.israeliLaborLawVacationPayRegulations || "Israeli Labor Law - Vacation Pay Regulations"}<br/>
                            <strong>{t.common?.description || "Description:"}</strong> {t.common?.employeesWith1to4YearsServiceEntitledTo14Days || "Employees with 1-4 years service entitled to 14 vacation days per year"}<br/>
                            <strong>{t.common?.effectiveDates || "Effective Dates:"}</strong> {t.common?.currentDateRange || "Current date range"}<br/><br/>

                          <strong>{t.common?.condition || "Condition:"}</strong><br/>
                            <code style={{ backgroundColor: '#f8f9fa', padding: '4px', borderRadius: '3px', display: 'block', fontSize: '0.85rem' }}>
                              employee.years_of_service &gt;= 1 AND employee.years_of_service &lt; 5 AND payslip.vacation_days_taken &gt; 0
                            </code>
                            <strong>{t.common?.amountOwed || "Amount Owed:"}</strong><br/>
                            <code style={{ backgroundColor: '#f8f9fa', padding: '4px', borderRadius: '3px', display: 'block', fontSize: '0.85rem' }}>
                              {t.common?.maxContractDailyRateTimesMinPayslipVacationDaysTakenComma14MinusPayslipVacationPayComma0 || "max((contract.daily_rate * min(payslip.vacation_days_taken, 14)) - payslip.vacation_pay, 0)"}
                            </code>
                            <strong>{t.common?.violationMessage || "Violation Message:"}</strong><br/>
                            <small>&quot;{t.common?.underpaidVacationPayYears1to4 || "Underpaid vacation pay for years 1-4"}&quot;</small>
                        </div>
                        </div>
                      </div>

                        <div className="col-md-6">
                        <div className="card" style={{ backgroundColor: 'rgba(220, 53, 69, 0.1)', border: '2px solid #dc3545' }}>
                          <div className="card-header" style={{ backgroundColor: '#dc3545', color: 'white' }}>
                            <strong>{t.common?.rule2Years5to9Days || "Rule 2: Years 5-9 (16 days)"}</strong>
                          </div>
                          <div className="card-body">
                            <strong>{t.common?.ruleName || "Rule Name:"}</strong> {t.common?.vacationPayYears5to9Days || "Vacation Pay - Years 5-9 (16 days)"}<br/>
                            <strong>{t.common?.lawReference || "Law Reference:"}</strong> {t.common?.israeliLaborLawVacationPayRegulations || "Israeli Labor Law - Vacation Pay Regulations"}<br/>
                            <strong>{t.common?.description || "Description:"}</strong> {t.common?.employeesWith5to9YearsServiceEntitledTo16Days || "Employees with 5-9 years service entitled to 16 vacation days per year"}<br/>
                            <strong>{t.common?.effectiveDates || "Effective Dates:"}</strong> {t.common?.currentDateRange || "Current date range"}<br/><br/>

                            <strong>{t.common?.condition || "Condition:"}</strong><br/>
                            <code style={{ backgroundColor: '#f8f9fa', padding: '4px', borderRadius: '3px', display: 'block', fontSize: '0.85rem' }}>
                              employee.years_of_service &gt;= 5 AND employee.years_of_service &lt; 10 AND payslip.vacation_days_taken &gt; 0
                            </code>
                          <strong>{t.common?.amountOwed || "Amount Owed:"}</strong><br/>
                            <code style={{ backgroundColor: '#f8f9fa', padding: '4px', borderRadius: '3px', display: 'block', fontSize: '0.85rem' }}>
                              {t.common?.maxContractDailyRateTimesMinPayslipVacationDaysTakenComma16MinusPayslipVacationPayComma0 || "max((contract.daily_rate * min(payslip.vacation_days_taken, 16)) - payslip.vacation_pay, 0)"}
                            </code>
                            <strong>{t.common?.violationMessage || "Violation Message:"}</strong><br/>
                            <small>&quot;{t.common?.underpaidVacationPayYears5to9 || "Underpaid vacation pay for years 5-9"}&quot;</small>
                        </div>
                      </div>
                      </div>
                    </div>

                    <div className="alert alert-info" style={{ backgroundColor: 'rgba(23, 162, 184, 0.1)', border: '1px solid #17a2b8' }}>
                      <i className="bi bi-info-circle me-2"></i>
                      <strong>{t.common?.important || "Important:"}</strong> {t.common?.createSeparateRulesForEachServicePeriodSystemWillEvaluateAppropriateRuleBasedOnEmployeeYearsOfService || "Create separate rules for each service period (1-4, 5-9, 10-14, 15-19, 20+). The system will evaluate the appropriate rule based on the employee's years of service."}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="alert alert-success" style={{ backgroundColor: 'rgba(12, 117, 111, 0.1)', border: '1px solid #0C756F', borderRadius: '8px' }}>
            <i className="bi bi-lightbulb me-2"></i>
            <strong style={{ color: '#0C756F' }}>Key Takeaways:</strong>
            <ul className="mb-0 mt-2" style={{ color: '#2d3748', fontSize: '0.9rem' }}>
              <li><strong>{t.common?.alwaysTestYourRule || "Always test your rule using the \"Test Rule\" button above with sample data"}</strong></li>
              <li><strong>{t.common?.breakComplexLawsIntoSimpleRules || "Break complex laws into simple rules - one rule per overtime tier"}</strong></li>
              <li><strong>{t.common?.useFunctionsStrategically || "Use functions strategically - min() prevents overpayment, max() handles negative numbers"}</strong></li>
              <li><strong>{t.common?.thinkInTermsOfShouldGetVsActuallyGot || "Think in terms of \"should get vs actually got\" - that's the core of every calculation"}</strong></li>
              <li><strong>{t.common?.startSimple || "Start simple - create basic rules first, then add complexity as you learn"}</strong></li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}