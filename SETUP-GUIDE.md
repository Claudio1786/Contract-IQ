# Contract IQ Setup Guide
## Complete Implementation Checklist

This guide will help you complete the setup of Contract IQ with OpenAI integration and PostgreSQL database.

---

## ✅ **Already Complete**

1. ✅ Database schema defined (`apps/web/prisma/schema.prisma`)
2. ✅ OpenAI SDK installed (`openai@^6.9.0`)
3. ✅ OpenAI client created (`apps/web/lib/openai-client.ts`)
4. ✅ AI prompts templates created (`apps/web/lib/ai-prompts.ts`)
5. ✅ Prisma client generated
6. ✅ Customer seed script ready (`apps/web/scripts/seed-customers.ts`)
7. ✅ All UI components customer-focused

---

## 🔧 **Setup Steps Required**

### Step 1: PostgreSQL Database Setup (15 minutes)

#### Option A: Using Local PostgreSQL
If you have PostgreSQL installed:

```bash
# Create the database
createdb contract_iq

# Or using psql
psql -U postgres
CREATE DATABASE contract_iq;
\q
```

#### Option B: Using Docker
If you prefer Docker:

```bash
docker run --name contract-iq-db \
  -e POSTGRES_PASSWORD=your_password \
  -e POSTGRES_DB=contract_iq \
  -p 5432:5432 \
  -d postgres:15
```

#### Option C: Using Cloud PostgreSQL
- **Supabase**: https://supabase.com (free tier available)
- **Neon**: https://neon.tech (free tier available)
- **Railway**: https://railway.app (free tier available)

---

### Step 2: Configure Environment Variables (5 minutes)

Edit `apps/web/.env.local` with your actual credentials:

```bash
# 1. DATABASE_URL
# Replace with your actual PostgreSQL connection string
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/contract_iq"
# For cloud databases, use their provided connection string

# 2. NEXTAUTH_SECRET
# Generate a secure secret (run this in terminal):
# openssl rand -base64 32
NEXTAUTH_SECRET="paste-generated-secret-here"

# 3. OPENAI_API_KEY
# Get from: https://platform.openai.com/api-keys
OPENAI_API_KEY="sk-proj-your-actual-openai-api-key"
```

**Important Notes:**
- ❗ Never commit `.env.local` to git (it's already in `.gitignore`)
- ❗ Keep your OpenAI API key secure
- ❗ Update the DATABASE_URL with your actual credentials

---

### Step 3: Initialize Database Schema (5 minutes)

Run these commands from the project root:

```bash
# Push the Prisma schema to create all database tables
pnpm --filter @contract-iq/web prisma db push

# Verify it worked - you should see 5 tables created:
# - Organization
# - User
# - Contract
# - RiskScore
# - SalesforceConnection
```

**Expected Output:**
```
Your database is now in sync with your Prisma schema.

✔ Generated Prisma Client
```

---

### Step 4: Seed Sample Customer Data (2 minutes)

Load 10 sample customer contracts ($2.27M total ACV):

```bash
# From project root
cd apps/web
npx tsx scripts/seed-customers.ts
```

**Expected Output:**
```
✅ TechScale Inc.                   | ✅ LOW      | ACV: $180,000
✅ GrowthCo Labs                     | ⚠️ HIGH     | ACV: $48,000
✅ DataFlow Analytics                | ✅ LOW      | ACV: $360,000
✅ InnovateTech Solutions            | ⚡ MEDIUM   | ACV: $72,000
✅ CloudFirst Corp                   | ✅ LOW      | ACV: $540,000
✅ AgileWorks Consulting             | ⚠️ HIGH     | ACV: $96,000
✅ NextGen Robotics                  | ✅ LOW      | ACV: $240,000
✅ HealthTech Partners               | ⚡ MEDIUM   | ACV: $144,000
✅ FinServe Global                   | ✅ LOW      | ACV: $480,000
✅ RetailOps Inc.                    | ⚡ MEDIUM   | ACV: $108,000

📊 PORTFOLIO SUMMARY
Total Customers: 10
Total ACV: $2,268,000
```

---

### Step 5: Test the Application (5 minutes)

```bash
# From project root
pnpm --filter @contract-iq/web dev

# Or
cd apps/web
npm run dev
```

Open http://localhost:3000

**Verify:**
- ✅ Dashboard shows 10 customer contracts
- ✅ Total ACV displays $2.27M
- ✅ Contracts Library shows real customer data
- ✅ Risk scores are calculated
- ✅ No errors in console

---

## 🎯 **What Works Now**

### ✅ Core Features
- **Dashboard**: Real customer data, KPIs, risk scoring
- **Contracts Library**: 10 sample customer contracts
- **Manual Contract Entry**: Form at `/app/admin/contracts/new`
- **Risk Scoring**: Automatic churn risk calculation
- **Customer-Focused UI**: 100% revenue intelligence terminology

### 🚧 Requires OpenAI API Key
These features will work once you add your OpenAI API key:
- **AI Chat**: Ask questions about contracts
- **Account Intelligence Briefs**: Generate renewal playbooks
- **Risk Analysis**: AI-powered churn prediction
- **Portfolio Insights**: Strategic recommendations

---

## 🐛 **Troubleshooting**

### Database Connection Errors

```bash
# Test your DATABASE_URL connection
cd apps/web
npx prisma studio
```

If Prisma Studio opens successfully, your database connection works.

### Missing Dependencies

```bash
# Reinstall all dependencies
pnpm install
```

### Prisma Client Errors

```bash
# Regenerate Prisma client
pnpm --filter @contract-iq/web prisma generate

# Reset database (⚠️ this deletes all data)
pnpm --filter @contract-iq/web prisma db push --force-reset
```

### OpenAI API Errors

Common issues:
- ❌ `OpenAI API key not configured` → Add `OPENAI_API_KEY` to `.env.local`
- ❌ `Incorrect API key` → Verify your key at https://platform.openai.com/api-keys
- ❌ `Insufficient quota` → Check your OpenAI billing at https://platform.openai.com/account/billing

---

## 📊 **Expected Results**

After completing all steps, you should see:

### Dashboard (`/`)
- Total Contract Value: **$2.3K** (10 contracts)
- High Risk Contracts: **2**
- Customer table with real data:
  - CloudFirst Corp - $540K ACV
  - FinServe Global - $480K ACV
  - DataFlow Analytics - $360K ACV
  - etc.

### Contracts Library (`/contracts`)
- 10 customer contract cards
- Risk levels: 5 LOW, 3 MEDIUM, 2 HIGH
- Real customer names and industries

### Analytics (`/analytics`)
- Revenue Intelligence Dashboard
- Portfolio breakdown by industry
- Renewal pipeline

---

## 🚀 **Next Steps**

1. **Test AI Features**: Try the AI Chat with your OpenAI key
2. **Generate Intelligence Briefs**: Click "Generate Intelligence Brief" on any contract
3. **Add More Contracts**: Use the manual entry form or API
4. **Customize**: Adjust risk scoring algorithm in `apps/web/app/api/contracts/create/route.ts`

---

## 📚 **Key Files Reference**

- **Database Schema**: `apps/web/prisma/schema.prisma`
- **OpenAI Integration**: `apps/web/lib/openai-client.ts`
- **AI Prompts**: `apps/web/lib/ai-prompts.ts`
- **Risk Scoring**: `apps/web/app/api/contracts/create/route.ts`
- **Seed Data**: `apps/web/scripts/seed-customers.ts`
- **Environment**: `apps/web/.env.local`

---

## ✅ **Verification Checklist**

- [ ] PostgreSQL database created
- [ ] `.env.local` configured with all 3 variables
- [ ] `prisma db push` completed successfully
- [ ] Seed script ran successfully (10 contracts loaded)
- [ ] Dev server starts without errors
- [ ] Dashboard shows real customer data
- [ ] Contracts Library displays 10 contracts
- [ ] OpenAI API key added (for AI features)

---

## 🆘 **Need Help?**

If you encounter any issues:

1. Check the browser console for errors
2. Check the terminal/server logs
3. Verify `.env.local` has no typos
4. Ensure PostgreSQL is running
5. Verify OpenAI API key is valid

**Estimated Total Time**: 30-45 minutes

---

**Status**: Ready for implementation! All code is in place, just needs configuration.
