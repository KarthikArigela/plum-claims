import { NextRequest, NextResponse } from 'next/server';
import { processClaimPipeline } from '@/lib/pipeline';
import { ClaimSubmission, UploadedDocument } from '@/lib/types/claim.types';
import { randomUUID } from 'crypto';

/**
 * POST /api/claims
 *
 * Accepts a multipart/form-data request with:
 *   - claimData: JSON string containing claim metadata (memberId, policyId, etc.)
 *   - documents[]: one or more files (images or PDFs)
 *
 * Converts each uploaded file to base64, constructs UploadedDocument objects with type 'UNKNOWN'
 * (document type will be auto-detected by DocumentVerifier via Claude's vision API),
 * then feeds the full ClaimSubmission into the processing pipeline.
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // ── Parse claim metadata ─────────────────────────────────────────
    const claimDataRaw = formData.get('claimData');
    if (!claimDataRaw || typeof claimDataRaw !== 'string') {
      return NextResponse.json(
        { error: 'Missing required field: claimData (JSON string)' },
        { status: 400 }
      );
    }

    let claimMeta: Omit<ClaimSubmission, 'documents'>;
    try {
      claimMeta = JSON.parse(claimDataRaw);
    } catch {
      return NextResponse.json(
        { error: 'claimData must be valid JSON' },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!claimMeta.memberId || !claimMeta.policyId || !claimMeta.claimCategory ||
      !claimMeta.treatmentDate || claimMeta.claimedAmount == null) {
      return NextResponse.json(
        { error: 'Missing required claim fields: memberId, policyId, claimCategory, treatmentDate, claimedAmount' },
        { status: 400 }
      );
    }

    // ── Parse uploaded files ─────────────────────────────────────────
    const files = formData.getAll('documents') as File[];

    if (files.length === 0) {
      return NextResponse.json(
        { error: 'At least one document file is required' },
        { status: 400 }
      );
    }

    // Convert each file to base64 — this is the ONLY place file→base64 happens
    const documents: UploadedDocument[] = await Promise.all(
      files.map(async (file, index) => {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64Data = buffer.toString('base64');

        const mimeType = file.type || 'application/octet-stream';

        // Validate MIME type — only images and PDFs
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
        if (!allowedMimeTypes.includes(mimeType)) {
          throw new Error(
            `Unsupported file type: ${mimeType} for file "${file.name}". ` +
            `Accepted types: JPEG, PNG, WebP, PDF.`
          );
        }

        return {
          id: `doc_${randomUUID().slice(0, 8)}`,
          type: 'UNKNOWN',       // Will be auto-detected by DocumentVerifier
          content: '',          // @deprecated — kept for backward compat
          base64Data,
          mimeType,
          fileName: file.name || `document_${index + 1}`,
        };
      })
    );

    // ── Assemble full ClaimSubmission and run pipeline ────────────────
    const claimId = `CLM-${Date.now()}-${randomUUID().slice(0, 6)}`;
    const submission: ClaimSubmission = {
      ...claimMeta,
      documents,
      submissionDate: new Date().toISOString(),
    };

    const result = await processClaimPipeline(submission, claimId);

    return NextResponse.json(result, { status: 200 });

  } catch (err) {
    console.error('[POST /api/claims] Error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

// Also support JSON-only submissions (no file upload) for testing
// The caller is responsible for providing base64Data in each document
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.memberId || !body.documents || !Array.isArray(body.documents)) {
      return NextResponse.json(
        { error: 'Missing required fields: memberId, documents[]' },
        { status: 400 }
      );
    }

    const claimId = `CLM-${Date.now()}-${randomUUID().slice(0, 6)}`;
    const submission: ClaimSubmission = {
      ...body,
      submissionDate: body.submissionDate || new Date().toISOString(),
    };

    const result = await processClaimPipeline(submission, claimId);
    return NextResponse.json(result, { status: 200 });

  } catch (err) {
    console.error('[PUT /api/claims] Error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
