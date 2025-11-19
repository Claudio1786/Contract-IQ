# Contract IQ - Quick Start (25 Minutes)

## 🚀 Step 1: Database Setup (15 min)

Choose ONE option:

### Option A: Cloud Database (Easiest - Recommended)
1. Go to https://neon.tech (or supabase.com)
2. Create free account
3. Create new project called "contract-iq"
4. Copy the connection string (looks like: `postgresql://user:pass@host.neon.tech/dbname`)

### Option B: Local PostgreSQL
```bash
createdb contract_iq
```

### Option C: Docker
```bash
docker run --name contract-iq-db \
  -e POSTGRES_PASSWORD=yourpassword \
  -e POSTGRES_DB=contract_iq \
  -p 5432:5432 -d postgres:15
```

---

## 🔐 Step 2: Configure Environment (5 min)

Edit `apps/web/.env.local` with your credentials:

```bash
# 1. Your database URL from Step 1
DATABASE_URL="postgresql://..."

# 2. Generate a secret: openssl rand -base64 32
NEXTAUTH_SECRET="paste-your-generated-secret-here"

# 3. Get from https://platform.openai.com/api-keys
OPENAI_API_KEY="sk-proj-your-openai-key-here"
```

---

## ⚡ Step 3: Initialize Database (2 min)

```bash
# Create all database tables
pnpm --filter @contract-iq/web prisma db push
```

**Expected**: "Your database is now in sync with your Prisma schema."

---

## 📊 Step 4: Load Sample Data (2 min - Optional)

```bash
cd apps/web
npx tsx scripts/seed-customers.ts
```

**Expected**: 10 customer contracts loaded ($2.27M total ACV)

---

## 🎬 Step 5: Start the App (1 min)

```bash
# From project root
pnpm --filter @contract-iq/web dev
```

Open: http://localhost:3000

---

## ✅ Verification

You should see:
- ✅ Dashboard with customer contracts
- ✅ Total ACV: $2.3M
- ✅ 10 contracts in Contracts Library
- ✅ Risk scores (HIGH/MEDIUM/LOW)

---

## 🆘 Troubleshooting

**Database connection error?**
```bash
# Test connection
cd apps/web
npx prisma studio
```

**Missing dependencies?**
```bash
pnpm install
```

**Need detailed help?**
Read `SETUP-GUIDE.md` for complete instructions.

---

## 🎯 What Works Now

✅ **Core Features** (No API key needed):
- Dashboard with real data
- Contracts Library
- Manual contract entry
- Risk scoring

🔑 **AI Features** (Requires OpenAI key):
- AI Chat
- Account Intelligence Briefs
- Risk analysis recommendations

---

**Time**: ~25 minutes total  
**Difficulty**: Easy (mostly copy-paste)  
**Result**: Fully functional demo with 10 sample contracts
