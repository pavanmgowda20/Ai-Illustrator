import { NextResponse } from 'next/server';

export async function GET() {
  const hasOpenAI = !!process.env.OPENAI_API_KEY;
  const hasGrok = !!process.env.GROK_API_KEY || !!process.env.XAI_API_KEY;
  const hasGroq = !!process.env.GROQ_API_KEY;
  const hasCustom = !!process.env.CUSTOM_API_KEY;

  let defaultProvider = 'openai';
  if (hasGroq) {
    defaultProvider = 'groq';
  } else if (hasGrok) {
    defaultProvider = 'grok';
  } else if (hasCustom) {
    defaultProvider = 'custom';
  }

  return NextResponse.json({
    hasDefaultKey: hasOpenAI || hasGrok || hasGroq || hasCustom,
    defaultProvider
  });
}
