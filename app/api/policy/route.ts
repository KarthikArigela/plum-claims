import { NextResponse } from 'next/server'
import { loadPolicy } from '@/lib/policy/policyLoader'

export async function GET() {
  const policy = loadPolicy()

  const members = policy.members.map(m => ({
    id: m.member_id,
    name: m.name,
    relationship: m.relationship,
  }))

  const categories = Object.keys(policy.opd_categories).map(key => ({
    id: key.toUpperCase(),
    label: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' '),
  }))

  const documentTypes = Array.from(new Set(
    Object.values(policy.document_requirements)
      .flatMap(r => [...r.required, ...r.optional])
  ))

  return NextResponse.json({ members, categories, documentTypes })
}