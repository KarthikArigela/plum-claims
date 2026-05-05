import { NextResponse } from 'next/server'
import { loadPolicy } from '@/lib/policy/policyLoader'

export async function GET() {
  const policy = loadPolicy()

  const members = policy.members.map(m => ({
    id: m.member_id,
    name: m.name,
    relationship: m.relationship,
  }))

  const categories = Object.keys(policy.opd_categories).map(key => {
    const categoryKey = key.toUpperCase()
    const requirements = policy.document_requirements[categoryKey]
    return {
      id: categoryKey,
      label: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' '),
      required: requirements?.required || [],
      optional: requirements?.optional || [],
    }
  })

  const documentTypes = Array.from(new Set(
    Object.values(policy.document_requirements)
      .flatMap(r => [...r.required, ...r.optional])
  ))

  const documentDescriptions: Record<string, string> = {
    PRESCRIPTION: "Doctor's prescription or referral letter",
    HOSPITAL_BILL: "Hospital or clinic bill/invoice",
    LAB_REPORT: "Lab test report with patient name and date",
    DIAGNOSTIC_REPORT: "Diagnostic test report (X-ray, ultrasound, etc.)",
    PHARMACY_BILL: "Pharmacy receipt for medications",
    DISCHARGE_SUMMARY: "Hospital discharge summary",
    DENTAL_REPORT: "Dental procedure report or receipt",
  }

  return NextResponse.json({ members, categories, documentTypes, documentDescriptions })
}