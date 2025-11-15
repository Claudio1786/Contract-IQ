import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

// Validate required environment variables
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REDIRECT_URI) {
  console.warn('Gmail OAuth credentials not configured');
}

const oauth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI
);

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  if (!code) {
    // Generate authorization URL
    const scopes = [
      'https://www.googleapis.com/auth/gmail.readonly',
      'https://www.googleapis.com/auth/gmail.modify',
      'profile',
      'email'
    ];

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      state: state || 'default',
      prompt: 'consent'
    });

    return NextResponse.json({ authUrl });
  }

  try {
    // Exchange code for tokens
    const { tokens } = await oauth2Client.getAccessToken(code);
    oauth2Client.setCredentials(tokens);

    // Get user info
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const { data: userInfo } = await oauth2.userinfo.get();

    // Store tokens securely (in production, use encrypted database)
    const userTokens = {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expiry_date: tokens.expiry_date,
      email: userInfo.email,
      name: userInfo.name
    };

    // In production, encrypt and store in database
    console.log('Gmail OAuth successful for:', userInfo.email);

    return NextResponse.redirect(new URL('/negotiations?auth=success', request.url));
  } catch (error) {
    console.error('Gmail OAuth error:', error);
    return NextResponse.redirect(new URL('/negotiations?auth=error', request.url));
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'disconnect') {
      // Revoke tokens
      try {
        await oauth2Client.revokeCredentials();
        return NextResponse.json({ success: true });
      } catch (error) {
        console.error('Error revoking Gmail access:', error);
        return NextResponse.json({ error: 'Failed to disconnect' }, { status: 500 });
      }
    }

    if (action === 'status') {
      // Check connection status
      // In production, check database for valid tokens
      return NextResponse.json({ 
        connected: false, // TODO: Check actual connection status
        email: null 
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Gmail auth API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}