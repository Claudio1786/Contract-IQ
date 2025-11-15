import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const hasGeminiKey = !!process.env.GEMINI_API_KEY;
    
    return NextResponse.json({
      success: true,
      environment: {
        hasGeminiKey,
        geminiKeyLength: process.env.GEMINI_API_KEY?.length || 0,
        nodeEnv: process.env.NODE_ENV,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}