import { describe, expect, it } from 'vitest'

import { calculateEstimate, type EstimateInputs } from './estimator'

const baseInputs: EstimateInputs = {
  federalIncomeTax: 0,
  stateAndLocalTax: 0,
  payrollTax: 0,
  propertyTax: 0,
  salesAndExciseTax: 0,
  otherFees: 0,
  healthcareSupport: 0,
  housingSupport: 0,
  cashBenefits: 0,
  educationSupport: 0,
  justiceSystemCost: 0,
  infrastructureShare: 0,
  emergencyAndPublicHealth: 0,
  otherPublicServices: 0,
}

describe('calculateEstimate', () => {
  it('calculates a net public cost from contributions and costs', () => {
    const result = calculateEstimate({
      ...baseInputs,
      federalIncomeTax: 12000,
      payrollTax: 5500,
      salesAndExciseTax: 1800,
      healthcareSupport: 9000,
      housingSupport: 2500,
      infrastructureShare: 3200,
      emergencyAndPublicHealth: 700,
    })

    expect(result.totalContributions).toBe(19300)
    expect(result.totalCosts).toBe(15400)
    expect(result.netImpact).toBe(-3900)
    expect(result.costCoverageRatio).toBeCloseTo(1.2532, 4)
    expect(result.validationIssues).toEqual([])
  })

  it('treats invalid values as zero while returning validation issues', () => {
    const result = calculateEstimate({
      ...baseInputs,
      federalIncomeTax: Number.NaN,
      payrollTax: -50,
      healthcareSupport: 2500,
    })

    expect(result.totalContributions).toBe(0)
    expect(result.totalCosts).toBe(2500)
    expect(result.netImpact).toBe(2500)
    expect(result.validationIssues).toEqual([
      { field: 'federalIncomeTax', reason: 'not-a-number' },
      { field: 'payrollTax', reason: 'negative' },
    ])
  })

  it('returns no coverage ratio when no public costs are modeled', () => {
    const result = calculateEstimate({
      ...baseInputs,
      federalIncomeTax: 1000,
    })

    expect(result.totalCosts).toBe(0)
    expect(result.totalContributions).toBe(1000)
    expect(result.costCoverageRatio).toBeNull()
  })
})
