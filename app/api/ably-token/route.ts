import { NextResponse } from 'next/server';
import Ably from 'ably';

export async function GET() {
  const apiKey = process.env.ABLY_API_KEY;
  
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Ably API key not configured' },
      { status: 500 }
    );
  }

  try {
    const client = new Ably.Rest(apiKey);
    const tokenRequest = await client.auth.createTokenRequest({
      capability: { '*': ['publish', 'subscribe', 'presence'] },
    });
    
    return NextResponse.json(tokenRequest);
  } catch (error) {
    console.error('Ably token error:', error);
    return NextResponse.json(
      { error: 'Failed to generate token' },
      { status: 500 }
    );
  }
}
