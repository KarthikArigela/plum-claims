import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  return NextResponse.json(
    {
      message: `Claim ${id} retrieval not yet implemented. Results are stored client-side in sessionStorage.`,
      claimId: id
    },
    { status: 404 }
  )
}