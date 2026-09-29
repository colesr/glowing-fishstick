const contributionFields = [
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

const costFields = [
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

const allFields = [...contributionFields, ...costFields]

const state = Object.fromEntries(allFields.map((field) => [field.key, '0']))

const contributionFieldsRoot = document.getElementById('contribution-fields')
const costFieldsRoot = document.getElementById('cost-fields')
const warningBanner = document.getElementById('warning-banner')
const netLabel = document.getElementById('net-label')
const netValue = document.getElementById('net-value')
const netCaption = document.getElementById('net-caption')
const costsValue = document.getElementById('costs-value')
const contributionsValue = document.getElementById('contributions-value')
const breakdownCosts = document.getElementById('breakdown-costs')
const breakdownContributions = document.getElementById('breakdown-contributions')
const breakdownNet = document.getElementById('breakdown-net')
const breakdownRatio = document.getElementById('breakdown-ratio')

function parseCurrencyInput(value) {
  const normalized = value.replaceAll(',', '').trim()

  if (normalized === '') {
    return 0
  }

  const parsed = Number(normalized)
  return Number.isFinite(parsed) ? parsed : Number.NaN
}

function sumFields(inputs, fields) {
  return fields.reduce((total, field) => total + inputs[field.key], 0)
}

function validateInputs(inputs) {
  return Object.entries(inputs).reduce((issues, [field, value]) => {
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

function calculateEstimate(inputs) {
  const validationIssues = validateInputs(inputs)
  const normalizedInputs = { ...inputs }

  validationIssues.forEach((issue) => {
    normalizedInputs[issue.field] = 0
  })

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

function buildInputs() {
  return allFields.reduce((inputs, field) => {
    inputs[field.key] = parseCurrencyInput(state[field.key])
    return inputs
  }, {})
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

function createFieldCard(field) {
  const label = document.createElement('label')
  label.className = 'field-card'

  const title = document.createElement('span')
  title.className = 'field-label'
  title.textContent = field.label

  const hint = document.createElement('span')
  hint.className = 'field-hint'
  hint.textContent = field.hint

  const inputWrap = document.createElement('div')
  inputWrap.className = 'currency-input'

  const currency = document.createElement('span')
  currency.setAttribute('aria-hidden', 'true')
  currency.textContent = '$'

  const input = document.createElement('input')
  input.type = 'number'
  input.min = '0'
  input.step = '0.01'
  input.inputMode = 'decimal'
  input.value = state[field.key]
  input.setAttribute('aria-label', field.label)
  input.addEventListener('input', (event) => {
    state[field.key] = event.target.value
    render()
  })

  inputWrap.append(currency, input)
  label.append(title, hint, inputWrap)

  return label
}

function renderFields() {
  contributionFieldsRoot.replaceChildren(
    ...contributionFields.map(createFieldCard),
  )
  costFieldsRoot.replaceChildren(...costFields.map(createFieldCard))
}

function render() {
  const estimate = calculateEstimate(buildInputs())
  const hasInvalidFields = estimate.validationIssues.length > 0

  if (estimate.netImpact > 0) {
    netLabel.textContent = 'Estimated annual net public cost'
    netCaption.textContent =
      'Positive values mean modeled costs exceed contributions.'
  } else if (estimate.netImpact < 0) {
    netLabel.textContent = 'Estimated annual net fiscal contribution'
    netCaption.textContent =
      'Negative net cost means modeled contributions exceed costs.'
  } else {
    netLabel.textContent = 'Estimated annual break-even impact'
    netCaption.textContent =
      'Costs and contributions are equal in the current model.'
  }

  netValue.textContent = formatCurrency(Math.abs(estimate.netImpact))
  costsValue.textContent = formatCurrency(estimate.totalCosts)
  contributionsValue.textContent = formatCurrency(estimate.totalContributions)
  breakdownCosts.textContent = formatCurrency(estimate.totalCosts)
  breakdownContributions.textContent = formatCurrency(estimate.totalContributions)
  breakdownNet.textContent = formatCurrency(estimate.netImpact)
  breakdownRatio.textContent =
    estimate.costCoverageRatio === null
      ? 'N/A'
      : `${(estimate.costCoverageRatio * 100).toFixed(1)}%`

  warningBanner.classList.toggle('hidden', !hasInvalidFields)
}

renderFields()
render()
