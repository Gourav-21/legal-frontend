import { NextResponse } from 'next/server';

// GET /api/dynamic-params-sections - List available parameter sections
export async function GET() {
  try {
    const sections = ['payslip', 'attendance', 'contract', 'employee'];
    return NextResponse.json({ sections });
  } catch (error) {
    console.error('Error fetching sections:', error);
    return NextResponse.json(
      { detail: 'Failed to fetch sections' },
      { status: 500 }
    );
  }
}