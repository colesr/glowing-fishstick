export type EstimateFieldKey =
  | 'federalIncomeTax'
  | 'stateAndLocalTax'
  | 'payrollTax'
  | 'propertyTax'
  | 'salesAndExciseTax'
  | 'otherFees'
  | 'healthcareSupport'
  | 'housingSupport'
  | 'cashBenefits'
  | 'educationSupport'
  | 'justiceSystemCost'
  | 'infrastructureShare'
  | 'emergencyAndPublicHealth'
  | 'otherPublicServices'

export type EstimateInputs = Record<EstimateFieldKey, number>

export type FieldDefinition = {
  key: EstimateFieldKey
  label: string
  hint: string
}

export const contributionFields: FieldDefinition[] = [
  {
    key: 'federalIncomeTax',
    label: 'Federal income tax',
    hint: 'Annual federal income tax attributed to this person.',
  },
  {
    key: 'stateAndLocalTax',
    label: 'State and local income tax',
    hint: 'Annual state or city income taxes paid.',
  },
  {
    key: 'payrollTax',
    label: 'Payroll taxes',
    hint: 'Social Security, Medicare, or similar payroll contributions.',
  },
  {
    key: 'propertyTax',
    label: 'Property tax share',
    hint: 'The person’s annual share of property taxes, direct or indirect.',
  },
  {
    key: 'salesAndExciseTax',
    label: 'Sales and excise taxes',
    hint: 'Estimated annual sales, fuel, tobacco, alcohol, or similar taxes.',
  },
  {
    key: 'otherFees',
    label: 'Other public fees',
    hint: 'Licenses, permits, tolls, fines, or other public payments.',
  },
]

export const costFields: FieldDefinition[] = [
  {
    key: 'healthcareSupport',
    label: 'Healthcare support',
    hint: 'Public healthcare subsidies, Medicaid, uncompensated-care support, or similar.',
  },
  {
    key: 'housingSupport',
    label: 'Housing support',
    hint: 'Housing vouchers, shelters, subsidized housing, or homelessness services.',
  },
  {
    key: 'cashBenefits',
    label: 'Cash and income support',
    hint: 'Unemployment, disability, cash assistance, food assistance, or similar.',
  },
  {
    key: 'educationSupport',
    label: 'Education or training support',
    hint: 'Public K-12, higher-ed subsidy, workforce training, or childcare support.',
  },
  {
    key: 'justiceSystemCost',
    label: 'Justice system costs',
    hint: 'Policing, courts, probation, incarceration, or legal aid spending.',
  },
  {
    key: 'infrastructureShare',
    label: 'Infrastructure and local services',
    hint: 'Roads, transit, sanitation, parks, and civic administration attributable to them.',
  },
  {
    key: 'emergencyAndPublicHealth',
    label: 'Emergency and public health costs',
    hint: 'EMS, fire response, outbreak response, inspections, or public-health programs.',
  },
  {
    key: 'otherPublicServices',
    label: 'Other public services',
    hint: 'Anything material that does not fit another modeled category.',
  },
]

type ValidationIssue = {
  field: EstimateFieldKey
  reason: 'not-a-number' | 'negative'
}

export type EstimateResult = {
  totalCosts: number
  totalContributions: number
  netImpact: number
  costCoverageRatio: number | null
  validationIssues: ValidationIssue[]
}

function sumFields(inputs: EstimateInputs, fields: FieldDefinition[]): number {
  return fields.reduce((total, field) => total + inputs[field.key], 0)
}

function validateInputs(inputs: EstimateInputs): ValidationIssue[] {
  return (Object.entries(inputs) as [EstimateFieldKey, number][])
    .reduce<ValidationIssue[]>((issues, [field, value]) => {
      if (!Number.isFinite(value)) {
        issues.push({ field, reason: 'not-a-number' })
        return issues
      }

      if (value < 0) {
        issues.push({ field, reason: 'negative' })
      }

      return issues
    }, [])
}

export function calculateEstimate(inputs: EstimateInputs): EstimateResult {
  const validationIssues = validateInputs(inputs)

  const normalizedInputs = { ...inputs }
  for (const issue of validationIssues) {
    normalizedInputs[issue.field] = 0
  }

  const totalCosts = sumFields(normalizedInputs, costFields)
  const totalContributions = sumFields(normalizedInputs, contributionFields)
  const netImpact = totalCosts - totalContributions

  return {
    totalCosts,
    totalContributions,
    netImpact,
    costCoverageRatio:
      totalCosts === 0 ? null : totalContributions / totalCosts,
    validationIssues,
  }
}
