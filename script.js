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

const presets = {
  balanced: {
    federalIncomeTax: '7200',
    stateAndLocalTax: '2200',
    payrollTax: '4100',
    propertyTax: '1800',
    salesAndExciseTax: '1300',
    otherFees: '250',
    healthcareSupport: '2300',
    housingSupport: '0',
    cashBenefits: '0',
    educationSupport: '1800',
    justiceSystemCost: '150',
    infrastructureShare: '2600',
    emergencyAndPublicHealth: '650',
    otherPublicServices: '325',
  },
  contributor: {
    federalIncomeTax: '22000',
    stateAndLocalTax: '6500',
    payrollTax: '8200',
    propertyTax: '4200',
    salesAndExciseTax: '3100',
    otherFees: '650',
    healthcareSupport: '1800',
    housingSupport: '0',
    cashBenefits: '0',
    educationSupport: '600',
    justiceSystemCost: '0',
    infrastructureShare: '2800',
    emergencyAndPublicHealth: '450',
    otherPublicServices: '250',
  },
  support: {
    federalIncomeTax: '350',
    stateAndLocalTax: '120',
    payrollTax: '260',
    propertyTax: '0',
    salesAndExciseTax: '520',
    otherFees: '0',
    healthcareSupport: '5400',
    housingSupport: '4200',
    cashBenefits: '3100',
    educationSupport: '2500',
    justiceSystemCost: '380',
    infrastructureShare: '1700',
    emergencyAndPublicHealth: '900',
    otherPublicServices: '800',
  },
  services: {
    federalIncomeTax: '4600',
    stateAndLocalTax: '1500',
    payrollTax: '2800',
    propertyTax: '900',
    salesAndExciseTax: '980',
    otherFees: '120',
    healthcareSupport: '2600',
    housingSupport: '800',
    cashBenefits: '400',
    educationSupport: '1200',
    justiceSystemCost: '1200',
    infrastructureShare: '5100',
    emergencyAndPublicHealth: '2200',
    otherPublicServices: '1450',
  },
}

const allFields = [...contributionFields, ...costFields]
const allFieldKeys = allFields.map((field) => field.key)
const defaultValues = Object.fromEntries(allFieldKeys.map((key) => [key, '0']))
const defaultOptions = {
  theme: 'dark',
  accent: 'ocean',
  motion: 'playful',
  glass: true,
  spotlight: true,
  ambient: true,
  counters: true,
  tilt: true,
  compact: false,
  confetti: true,
  pulse: true,
}
const storageKeys = {
  options: 'public-cost-estimator-options',
  values: 'public-cost-estimator-values',
}

const state = {
  values: loadStoredValues(),
  options: loadStoredOptions(),
  counterFrame: null,
  lastNetImpact: 0,
}

const contributionFieldsRoot = document.getElementById('contribution-fields')
const costFieldsRoot = document.getElementById('cost-fields')
const sparkField = document.getElementById('spark-field')
const optionsPanel = document.getElementById('options-panel')
const optionsToggle = document.getElementById('options-toggle')
const themeToggle = document.getElementById('theme-toggle')
const warningBanner = document.getElementById('warning-banner')
const mainResultCard = document.getElementById('main-result-card')

const summaryElements = {
  netLabel: document.getElementById('net-label'),
  netValue: document.getElementById('net-value'),
  netCaption: document.getElementById('net-caption'),
  costsValue: document.getElementById('costs-value'),
  contributionsValue: document.getElementById('contributions-value'),
  breakdownCosts: document.getElementById('breakdown-costs'),
  breakdownContributions: document.getElementById('breakdown-contributions'),
  breakdownNet: document.getElementById('breakdown-net'),
  breakdownRatio: document.getElementById('breakdown-ratio'),
  moodLabel: document.getElementById('mood-label'),
  activeCount: document.getElementById('active-count'),
  paletteLabel: document.getElementById('palette-label'),
  motionLabel: document.getElementById('motion-label'),
}

const optionControls = {
  themeSelect: document.getElementById('theme-select'),
  accentSelect: document.getElementById('accent-select'),
  motionSelect: document.getElementById('motion-select'),
  glassToggle: document.getElementById('glass-toggle'),
  spotlightToggle: document.getElementById('spotlight-toggle'),
  ambientToggle: document.getElementById('ambient-toggle'),
  counterToggle: document.getElementById('counter-toggle'),
  tiltToggle: document.getElementById('tilt-toggle'),
  compactToggle: document.getElementById('compact-toggle'),
  confettiToggle: document.getElementById('confetti-toggle'),
  pulseToggle: document.getElementById('pulse-toggle'),
  resetOptions: document.getElementById('reset-options'),
  resetInputs: document.getElementById('reset-inputs'),
}

function loadStoredOptions() {
  const stored = localStorage.getItem(storageKeys.options)

  if (!stored) {
    return { ...defaultOptions }
  }

  const parsed = JSON.parse(stored)
  return { ...defaultOptions, ...parsed }
}

function loadStoredValues() {
  const stored = localStorage.getItem(storageKeys.values)

  if (!stored) {
    return { ...defaultValues }
  }

  const parsed = JSON.parse(stored)
  return { ...defaultValues, ...parsed }
}

function saveOptions() {
  localStorage.setItem(storageKeys.options, JSON.stringify(state.options))
}

function saveValues() {
  localStorage.setItem(storageKeys.values, JSON.stringify(state.values))
}

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
    activeCount: Object.values(normalizedInputs).filter((value) => value > 0).length,
  }
}

function buildInputs() {
  return allFields.reduce((inputs, field) => {
    inputs[field.key] = parseCurrencyInput(state.values[field.key])
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

function animateNumber(element, target, formatter) {
  const finalText = formatter(target)

  if (!state.options.counters) {
    element.textContent = finalText
    element.dataset.value = String(target)
    return
  }

  const start = Number(element.dataset.value ?? '0')
  const startTime = performance.now()
  const duration = state.options.motion === 'turbo' ? 300 : state.options.motion === 'calm' ? 700 : 500

  const frame = (currentTime) => {
    const progress = Math.min((currentTime - startTime) / duration, 1)
    const eased = 1 - Math.pow(1 - progress, 3)
    const currentValue = start + (target - start) * eased
    element.textContent = formatter(currentValue)

    if (progress < 1) {
      requestAnimationFrame(frame)
      return
    }

    element.textContent = finalText
    element.dataset.value = String(target)
  }

  requestAnimationFrame(frame)
}

function createFieldCard(field) {
  const label = document.createElement('label')
  label.className = 'field-card tilt-surface'
  label.dataset.fieldKey = field.key

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
  input.value = state.values[field.key]
  input.setAttribute('aria-label', field.label)
  input.addEventListener('input', (event) => {
    state.values[field.key] = event.target.value
    saveValues()
    maybePulseCard(label)
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

function maybePulseCard(card) {
  if (!state.options.pulse) {
    return
  }

  card.classList.remove('is-pulsing')
  void card.offsetWidth
  card.classList.add('is-pulsing')
}

function createSparkles() {
  sparkField.replaceChildren()

  for (let index = 0; index < 18; index += 1) {
    const spark = document.createElement('span')
    spark.className = 'spark'
    spark.style.left = `${Math.random() * 100}%`
    spark.style.top = `${Math.random() * 100}%`
    spark.style.animationDelay = `${Math.random() * 6}s`
    spark.style.animationDuration = `${4 + Math.random() * 6}s`
    sparkField.append(spark)
  }
}

function toggleOptionsPanel() {
  const isOpen = !optionsPanel.classList.contains('hidden')
  optionsPanel.classList.toggle('hidden', isOpen)
  optionsToggle.setAttribute('aria-expanded', String(!isOpen))
}

function syncOptionControls() {
  optionControls.themeSelect.value = state.options.theme
  optionControls.accentSelect.value = state.options.accent
  optionControls.motionSelect.value = state.options.motion
  optionControls.glassToggle.checked = state.options.glass
  optionControls.spotlightToggle.checked = state.options.spotlight
  optionControls.ambientToggle.checked = state.options.ambient
  optionControls.counterToggle.checked = state.options.counters
  optionControls.tiltToggle.checked = state.options.tilt
  optionControls.compactToggle.checked = state.options.compact
  optionControls.confettiToggle.checked = state.options.confetti
  optionControls.pulseToggle.checked = state.options.pulse
}

function applyOptions() {
  document.body.dataset.theme = state.options.theme
  document.body.dataset.accent = state.options.accent
  document.body.dataset.motion = state.options.motion
  document.body.dataset.glass = state.options.glass ? 'on' : 'off'
  document.body.dataset.spotlight = state.options.spotlight ? 'on' : 'off'
  document.body.dataset.ambient = state.options.ambient ? 'on' : 'off'
  document.body.dataset.tilt = state.options.tilt ? 'on' : 'off'
  document.body.dataset.density = state.options.compact ? 'compact' : 'cozy'

  summaryElements.paletteLabel.textContent =
    state.options.accent.charAt(0).toUpperCase() + state.options.accent.slice(1)
  summaryElements.motionLabel.textContent =
    state.options.motion.charAt(0).toUpperCase() + state.options.motion.slice(1)

  themeToggle.textContent =
    state.options.theme === 'dark' ? 'Toggle light mode' : 'Toggle dark mode'
  themeToggle.setAttribute('aria-pressed', String(state.options.theme === 'light'))

  saveOptions()
  syncOptionControls()
}

function updateMood(netImpact) {
  if (netImpact > 0) {
    summaryElements.moodLabel.textContent = 'Cost-heavy'
    return
  }

  if (netImpact < 0) {
    summaryElements.moodLabel.textContent = 'Contribution-rich'
    return
  }

  summaryElements.moodLabel.textContent = 'Break-even'
}

function maybeCelebrate(netImpact) {
  if (!state.options.confetti || !(netImpact < 0 && state.lastNetImpact >= 0)) {
    state.lastNetImpact = netImpact
    return
  }

  mainResultCard.classList.remove('celebrate')
  void mainResultCard.offsetWidth
  mainResultCard.classList.add('celebrate')
  state.lastNetImpact = netImpact
}

function render() {
  const estimate = calculateEstimate(buildInputs())
  const hasInvalidFields = estimate.validationIssues.length > 0

  if (estimate.netImpact > 0) {
    summaryElements.netLabel.textContent = 'Estimated annual net public cost'
    summaryElements.netCaption.textContent =
      'Positive values mean modeled costs exceed contributions.'
  } else if (estimate.netImpact < 0) {
    summaryElements.netLabel.textContent =
      'Estimated annual net fiscal contribution'
    summaryElements.netCaption.textContent =
      'Negative net cost means modeled contributions exceed costs.'
  } else {
    summaryElements.netLabel.textContent = 'Estimated annual break-even impact'
    summaryElements.netCaption.textContent =
      'Costs and contributions are equal in the current model.'
  }

  animateNumber(summaryElements.netValue, Math.abs(estimate.netImpact), formatCurrency)
  animateNumber(summaryElements.costsValue, estimate.totalCosts, formatCurrency)
  animateNumber(
    summaryElements.contributionsValue,
    estimate.totalContributions,
    formatCurrency,
  )
  animateNumber(summaryElements.breakdownCosts, estimate.totalCosts, formatCurrency)
  animateNumber(
    summaryElements.breakdownContributions,
    estimate.totalContributions,
    formatCurrency,
  )
  animateNumber(summaryElements.breakdownNet, estimate.netImpact, formatCurrency)
  summaryElements.breakdownRatio.textContent =
    estimate.costCoverageRatio === null
      ? 'N/A'
      : `${(estimate.costCoverageRatio * 100).toFixed(1)}%`

  summaryElements.activeCount.textContent = String(estimate.activeCount)
  warningBanner.classList.toggle('hidden', !hasInvalidFields)
  updateMood(estimate.netImpact)
  maybeCelebrate(estimate.netImpact)
}

function applyPreset(presetName) {
  const preset = presets[presetName]

  if (!preset) {
    return
  }

  state.values = { ...defaultValues, ...preset }
  saveValues()
  renderFields()
  render()
}

function resetInputs() {
  state.values = { ...defaultValues }
  saveValues()
  renderFields()
  render()
}

function resetOptions() {
  state.options = { ...defaultOptions }
  applyOptions()
  render()
}

function bindOptionControls() {
  optionsToggle.addEventListener('click', toggleOptionsPanel)
  themeToggle.addEventListener('click', () => {
    state.options.theme = state.options.theme === 'dark' ? 'light' : 'dark'
    applyOptions()
    render()
  })

  optionControls.themeSelect.addEventListener('change', (event) => {
    state.options.theme = event.target.value
    applyOptions()
    render()
  })
  optionControls.accentSelect.addEventListener('change', (event) => {
    state.options.accent = event.target.value
    applyOptions()
  })
  optionControls.motionSelect.addEventListener('change', (event) => {
    state.options.motion = event.target.value
    applyOptions()
  })
  optionControls.glassToggle.addEventListener('change', (event) => {
    state.options.glass = event.target.checked
    applyOptions()
  })
  optionControls.spotlightToggle.addEventListener('change', (event) => {
    state.options.spotlight = event.target.checked
    applyOptions()
  })
  optionControls.ambientToggle.addEventListener('change', (event) => {
    state.options.ambient = event.target.checked
    applyOptions()
  })
  optionControls.counterToggle.addEventListener('change', (event) => {
    state.options.counters = event.target.checked
    applyOptions()
    render()
  })
  optionControls.tiltToggle.addEventListener('change', (event) => {
    state.options.tilt = event.target.checked
    applyOptions()
  })
  optionControls.compactToggle.addEventListener('change', (event) => {
    state.options.compact = event.target.checked
    applyOptions()
  })
  optionControls.confettiToggle.addEventListener('change', (event) => {
    state.options.confetti = event.target.checked
    applyOptions()
  })
  optionControls.pulseToggle.addEventListener('change', (event) => {
    state.options.pulse = event.target.checked
    applyOptions()
  })
  optionControls.resetInputs.addEventListener('click', resetInputs)
  optionControls.resetOptions.addEventListener('click', resetOptions)

  document.querySelectorAll('[data-preset]').forEach((button) => {
    button.addEventListener('click', () => {
      applyPreset(button.dataset.preset)
    })
  })
}

function initialize() {
  createSparkles()
  renderFields()
  bindOptionControls()
  applyOptions()
  render()
}

initialize()
