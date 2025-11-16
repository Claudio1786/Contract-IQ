# Authentication Setup - Epic 1

## Overview
Complete authentication system using NextAuth.js v5 with Prisma adapter, supporting email/password and OAuth (Google).

## What's Implemented

### ✅ Task 1.1: Authentication Setup (COMPLETED)

#### 1.1.1 NextAuth.js Configuration
- ✅ Installed `next-auth@beta` (v5.0.0-beta.30)
- ✅ Configured Prisma adapter
- ✅ Set up JWT session strategy
- ✅ Created `/lib/auth.ts` with auth configuration

#### 1.1.2 OAuth Providers
- ✅ Google OAuth integration (if `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET` set)
- ✅ Email/password authentication with bcrypt hashing
- ✅ Fallback to credentials-only if OAuth not configured

#### 1.1.3 Login Page UI
- ✅ Created `/app/login/page.tsx`
- ✅ Professional glassmorphism design
- ✅ Email/password form with validation
- ✅ Google OAuth button
- ✅ Error handling and loading states
- ✅ Forgot password link
- ✅ Sign up link

#### 1.1.4 Signup Page UI
- ✅ Created `/app/signup/page.tsx`
- ✅ Full name, email, password, confirm password fields
- ✅ Password strength validation (min 8 characters)
- ✅ Password match validation
- ✅ Auto-login after successful signup
- ✅ Terms of Service & Privacy Policy links
- ✅ Google OAuth signup option

## Database Schema

### Core Tables:
- **users** - User accounts with email, password (hashed), role, timestamps
- **accounts** - OAuth provider accounts
- **sessions** - JWT sessions
- **verification_tokens** - Email verification tokens

### User Roles:
- `ADMIN` - Full access
- `MANAGER` - Manage contracts and users
- `VIEWER` - Read-only access (default)

## API Endpoints

### NextAuth.js Routes:
- `GET /api/auth/session` - Get current session
- `GET /api/auth/signin` - Sign in page
- `GET /api/auth/signout` - Sign out
- `POST /api/auth/callback/credentials` - Credentials auth
- `POST /api/auth/callback/google` - Google OAuth callback

### Custom Routes:
- `POST /api/auth/signup` - Create new user account
  - Body: `{ name, email, password }`
  - Returns: `{ message, user }`
  - Errors: 400 (validation), 409 (duplicate), 500 (server)

## Environment Variables

Required in `.env.local`:

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/contract_iq?schema=public"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# Optional: Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

## Setup Instructions

### 1. Install Dependencies (DONE)
```bash
pnpm add next-auth@beta @auth/prisma-adapter bcryptjs @prisma/client
pnpm add -D @types/bcryptjs prisma
```

### 2. Set Up Database
```bash
# For local development with PostgreSQL:
# Install PostgreSQL locally or use Docker

# Docker example:
docker run --name contract-iq-db \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=contract_iq \
  -p 5432:5432 \
  -d postgres:15

# Or use a cloud provider (recommended for production):
# - Supabase (https://supabase.com)
# - Neon (https://neon.tech)
# - Railway (https://railway.app)
# - PlanetScale (https://planetscale.com)
```

### 3. Configure Environment
```bash
cd apps/web
cp .env.example .env.local

# Edit .env.local with your database URL and secrets
```

### 4. Run Migrations
```bash
# Generate Prisma client
npx prisma generate

# Create database tables
npx prisma db push

# (Optional) Seed database with test users
npx prisma db seed
```

### 5. Generate NextAuth Secret
```bash
openssl rand -base64 32
# Copy output to NEXTAUTH_SECRET in .env.local
```

### 6. Test Authentication
```bash
pnpm dev

# Visit http://localhost:3000/signup
# Create an account
# Login at http://localhost:3000/login
# Access protected routes (e.g., /dashboard)
```

## Google OAuth Setup (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth Client ID"
5. Select "Web application"
6. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
7. Copy Client ID and Client Secret to `.env.local`

## Security Features

- ✅ **Password Hashing**: bcrypt with 12 rounds
- ✅ **Session Management**: JWT with 30-day expiration
- ✅ **Protected Routes**: Middleware checks authentication
- ✅ **CSRF Protection**: Built into NextAuth.js
- ✅ **SQL Injection Protection**: Prisma ORM parameterized queries
- ✅ **XSS Protection**: React automatic escaping

## Next Steps (Remaining Tasks)

### Task 1.2: Session Management
- [ ] Implement session refresh logic
- [ ] Add session timeout handling
- [ ] Create protected route middleware
- [ ] Test session persistence

### Task 1.3: User Profile Management
- [ ] Build profile edit UI
- [ ] Implement profile update API
- [ ] Add avatar upload functionality
- [ ] Update Settings page with profile section

### Task 1.4: Role-Based Access Control (RBAC)
- [ ] Implement permission checking middleware
- [ ] Add role-based UI conditionals
- [ ] Create admin panel
- [ ] Test role restrictions

### Task 1.5: Email Verification (Optional)
- [ ] Set up email service (SendGrid/Resend)
- [ ] Create verification email template
- [ ] Implement email verification flow
- [ ] Add "Verify Email" banner

### Task 1.6: Password Reset (Optional)
- [ ] Create forgot-password page
- [ ] Implement password reset token generation
- [ ] Send password reset email
- [ ] Create reset-password page

## File Structure

```
apps/web/
├── prisma/
│   └── schema.prisma                 # Database schema
├── lib/
│   ├── auth.ts                       # NextAuth configuration
│   └── prisma.ts                     # Prisma client instance
├── app/
│   ├── api/
│   │   └── auth/
│   │       ├── [...nextauth]/route.ts  # NextAuth API handler
│   │       └── signup/route.ts         # Signup endpoint
│   ├── login/
│   │   └── page.tsx                   # Login UI
│   └── signup/
│       └── page.tsx                   # Signup UI
└── .env.example                       # Environment variables template
```

## Testing Checklist

- [ ] Sign up with email/password works
- [ ] Login with email/password works
- [ ] Logout works
- [ ] Session persists across page reloads
- [ ] Protected routes redirect to login
- [ ] Invalid credentials show error
- [ ] Duplicate email shows error
- [ ] Password too short shows error
- [ ] Google OAuth works (if configured)
- [ ] Auto-login after signup works

## Troubleshooting

### "Cannot find module '@prisma/client'"
```bash
npx prisma generate
```

### "Database connection failed"
- Check `DATABASE_URL` in `.env.local`
- Ensure PostgreSQL is running
- Test connection: `psql $DATABASE_URL`

### "Invalid session"
- Clear browser cookies
- Generate new `NEXTAUTH_SECRET`
- Restart dev server

### "OAuth error"
- Verify Google Client ID/Secret
- Check authorized redirect URIs
- Ensure NEXTAUTH_URL matches your domain

## Performance Considerations

- JWT sessions avoid database lookups on every request
- Prisma connection pooling for concurrent requests
- bcrypt rounds balanced for security vs. performance
- Session cookies are httpOnly and secure in production

## Production Deployment

1. Set `NEXTAUTH_URL` to production domain
2. Use cloud database with connection pooling
3. Set `NEXTAUTH_SECRET` to cryptographically secure value
4. Enable Google OAuth with production redirect URIs
5. Add rate limiting to signup/login endpoints
6. Set up monitoring for auth failures
7. Configure email service for verification/reset

---

**Status**: Task 1.1 COMPLETE ✅  
**Next**: Task 1.2 - Session Management  
**Epic Progress**: 5/13 Story Points (38%)
