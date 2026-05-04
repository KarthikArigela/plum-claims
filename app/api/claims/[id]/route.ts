import { NextRequest, NextResponse } from 'next/server'

// This endpoint is a placeholder for future claim retrieval by ID.
// Currently the results page reads from sessionStorage on the client.
// In production, claim results would be stored in a database and retrieved here.
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  return NextResponse.json(
    { 
      message: `Claim ${params.id} retrieval not yet implemented. Results are stored client-side in sessionStorage.`,
      claimId: params.id 
    },
    { status: 404 }
  )
}