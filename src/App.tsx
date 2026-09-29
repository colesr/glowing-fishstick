import { useState } from 'react'
import './App.css'
import {
  calculateEstimate,
  costFields,
  contributionFields,
  type EstimateFieldKey,
  type EstimateInputs,
} from './lib/estimator'

type FormValues = Record<EstimateFieldKey, string>

const allFields = [...contributionFields, ...costFields]

const initialValues = allFields.reduce<FormValues>((values, field) => {
  values[field.key] = '0'
  return values
}, {} as FormValues)

function parseCurrencyInput(value: string): number {
  const normalized = value.replaceAll(',', '').trim()

  if (normalized === '') {
    return 0
  }

  const parsed = Number(normalized)
  return Number.isFinite(parsed) ? parsed : Number.NaN
}

function buildEstimateInputs(values: FormValues): EstimateInputs {
  return allFields.reduce<EstimateInputs>((inputs, field) => {
    inputs[field.key] = parseCurrencyInput(values[field.key])
    return inputs
  }, {} as EstimateInputs)
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

function App() {
  const [values, setValues] = useState<FormValues>(initialValues)
  const inputs = buildEstimateInputs(values)
  const estimate = calculateEstimate(inputs)

  function handleFieldChange(key: EstimateFieldKey, value: string) {
    setValues((current) => ({
      ...current,
      [key]: value,
    }))
  }

  const hasInvalidFields = estimate.validationIssues.length > 0

  const netLabel =
    estimate.netImpact > 0
      ? 'Estimated annual net public cost'
      : estimate.netImpact < 0
        ? 'Estimated annual net fiscal contribution'
        : 'Estimated annual break-even impact'

  return (
    <main className="app-shell">
      <section className="hero-panel">
        <p className="eyebrow">Transparent public-cost estimator</p>
        <h1>Estimate a person&apos;s annual public cost or contribution.</h1>
        <p className="intro">
          This app totals user-supplied public spending categories and subtracts
          user-supplied taxes and fees. It is a budgeting aid, not a statement of
          a person&apos;s value.
        </p>
        <div className="formula-card">
          <p className="formula-title">Modeled formula</p>
          <p className="formula">
            Net impact = total public costs &minus; total taxes and fees paid
          </p>
        </div>
      </section>

      <section className="results-grid" aria-label="Estimate summary">
        <article className="result-card accent">
          <p className="result-label">{netLabel}</p>
          <p className="result-value">{formatCurrency(Math.abs(estimate.netImpact))}</p>
          <p className="result-caption">
            {estimate.netImpact > 0
              ? 'Positive values mean modeled costs exceed contributions.'
              : estimate.netImpact < 0
                ? 'Negative net cost means modeled contributions exceed costs.'
                : 'Costs and contributions are equal in the current model.'}
          </p>
        </article>
        <article className="result-card">
          <p className="result-label">Modeled annual public costs</p>
          <p className="result-value">{formatCurrency(estimate.totalCosts)}</p>
          <p className="result-caption">
            Direct benefits, shared services, and justice or emergency spending.
          </p>
        </article>
        <article className="result-card">
          <p className="result-label">Modeled annual taxes and fees paid</p>
          <p className="result-value">{formatCurrency(estimate.totalContributions)}</p>
          <p className="result-caption">
            Taxes and public fees the person already contributes back.
          </p>
        </article>
      </section>

      {hasInvalidFields ? (
        <section className="warning-banner" aria-live="polite">
          Enter zero or a positive number in every field. Invalid values are ignored
          in the estimate until corrected.
        </section>
      ) : null}

      <section className="content-grid">
        <form className="estimator-form">
          <div className="form-section">
            <div className="section-heading">
              <h2>Taxes and fees paid</h2>
              <p>
                Enter annual amounts this person pays into public systems. Use
                household-attributed values when the expense is shared.
              </p>
            </div>
            <div className="field-grid">
              {contributionFields.map((field) => (
                <label key={field.key} className="field-card">
                  <span className="field-label">{field.label}</span>
                  <span className="field-hint">{field.hint}</span>
                  <div className="currency-input">
                    <span aria-hidden="true">$</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      inputMode="decimal"
                      value={values[field.key]}
                      onChange={(event) =>
                        handleFieldChange(field.key, event.target.value)
                      }
                      aria-describedby={`${field.key}-hint`}
                    />
                  </div>
                  <span className="sr-only" id={`${field.key}-hint`}>
                    {field.hint}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-section">
            <div className="section-heading">
              <h2>Public costs and support</h2>
              <p>
                Enter annualized costs funded by the public that are attributable
                to this person or their household.
              </p>
            </div>
            <div className="field-grid">
              {costFields.map((field) => (
                <label key={field.key} className="field-card">
                  <span className="field-label">{field.label}</span>
                  <span className="field-hint">{field.hint}</span>
                  <div className="currency-input">
                    <span aria-hidden="true">$</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      inputMode="decimal"
                      value={values[field.key]}
                      onChange={(event) =>
                        handleFieldChange(field.key, event.target.value)
                      }
                      aria-describedby={`${field.key}-hint`}
                    />
                  </div>
                  <span className="sr-only" id={`${field.key}-hint`}>
                    {field.hint}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </form>

        <aside className="sidebar">
          <div className="sidebar-card">
            <h2>How to use this</h2>
            <ol>
              <li>Gather annual tax and fee amounts paid by the person.</li>
              <li>Estimate annual public spending attributable to them.</li>
              <li>Review the totals and refine any category that feels too broad.</li>
            </ol>
          </div>
          <div className="sidebar-card">
            <h2>What this does not do</h2>
            <ul>
              <li>Infer costs from demographics or protected traits.</li>
              <li>Claim to measure human worth or social value.</li>
              <li>Capture every second-order economic effect.</li>
            </ul>
          </div>
          <div className="sidebar-card breakdown-card">
            <h2>Breakdown</h2>
            <dl>
              <div>
                <dt>Total public costs</dt>
                <dd>{formatCurrency(estimate.totalCosts)}</dd>
              </div>
              <div>
                <dt>Total taxes and fees</dt>
                <dd>{formatCurrency(estimate.totalContributions)}</dd>
              </div>
              <div>
                <dt>Net impact</dt>
                <dd>{formatCurrency(estimate.netImpact)}</dd>
              </div>
              <div>
                <dt>Cost coverage ratio</dt>
                <dd>
                  {estimate.costCoverageRatio === null
                    ? 'N/A'
                    : `${(estimate.costCoverageRatio * 100).toFixed(1)}%`}
                </dd>
              </div>
            </dl>
          </div>
        </aside>
      </section>
    </main>
  )
}

export default App
