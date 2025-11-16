# 🧪 Contract IQ - Comprehensive QA Test Plan

**Date**: November 16, 2025  
**Version**: 1.0  
**Tested By**: Droid AI  
**Completion**: Epic 1-5 (102/128 SP - 80%)

---

## 📋 Executive Summary

This QA plan covers all implemented features across Epic 1-5:
- ✅ Epic 1: Authentication & User Management (13 SP)
- ✅ Epic 2: Database & Data Layer (21 SP)
- ✅ Epic 3: Contract Upload & Processing (21 SP)
- ✅ Epic 4: AI Analysis Engine (34 SP)
- ✅ Epic 5: Chat Functionality (13 SP)

---

## 🔐 Epic 1: Authentication & User Management

### Test 1.1: User Registration
**Objective**: Verify new users can register successfully

**Steps**:
1. Navigate to `/signup`
2. Enter valid email: `test@contractiq.com`
3. Enter valid name: `Test User`
4. Enter password: `TestPass123!`
5. Click "Sign Up"

**Expected Result**:
- ✅ User account created in database
- ✅ Redirected to dashboard
- ✅ Session active

**Status**: ⏳ PENDING MANUAL TEST

---

### Test 1.2: User Login
**Objective**: Verify existing users can log in

**Steps**:
1. Navigate to `/login`
2. Enter test credentials:
   - Email: `admin@contractiq.com`
   - Password: `admin123`
3. Click "Sign In"

**Expected Result**:
- ✅ Successful authentication
- ✅ Redirected to dashboard
- ✅ Session cookie set

**Status**: ⏳ PENDING MANUAL TEST

---

### Test 1.3: Protected Routes
**Objective**: Verify unauthenticated users cannot access protected pages

**Steps**:
1. Log out or clear cookies
2. Try accessing `/dashboard`
3. Try accessing `/contracts`
4. Try accessing `/chat`

**Expected Result**:
- ✅ Redirected to `/login` for all protected routes
- ✅ No data exposed

**Status**: ⏳ PENDING MANUAL TEST

---

### Test 1.4: Session Management
**Objective**: Verify sessions persist and expire correctly

**Steps**:
1. Log in successfully
2. Refresh page
3. Close browser and reopen
4. Check if still logged in

**Expected Result**:
- ✅ Session persists across page refreshes
- ✅ Session persists across browser sessions (30 days)

**Status**: ⏳ PENDING MANUAL TEST

---

### Test 1.5: Profile Management
**Objective**: Verify users can update their profile

**Steps**:
1. Log in
2. Access profile settings
3. Update name to `Updated Name`
4. Update email to `updated@contractiq.com`
5. Save changes

**Expected Result**:
- ✅ Profile updated in database
- ✅ Changes reflected in UI
- ✅ Success message displayed

**Status**: ⏳ PENDING MANUAL TEST

---

## 💾 Epic 2: Database & Data Layer

### Test 2.1: Database Connection
**Objective**: Verify database connection works

**Command**:
```bash
cd apps/web
pnpm db:generate
```

**Expected Result**:
- ✅ Prisma client generated successfully
- ✅ No connection errors

**Status**: ⏳ PENDING

---

### Test 2.2: Database Migration
**Objective**: Verify schema can be pushed to database

**Command**:
```bash
pnpm db:push
```

**Expected Result**:
- ✅ All tables created
- ✅ Relations established
- ✅ No errors

**Status**: ⏳ PENDING

---

### Test 2.3: Seed Data
**Objective**: Verify seed script populates test data

**Command**:
```bash
pnpm db:seed
```

**Expected Result**:
- ✅ 3 test users created
- ✅ 3 sample contracts created
- ✅ 2 sample analyses created
- ✅ 8 tags created
- ✅ 3 notifications created

**Status**: ⏳ PENDING

---

### Test 2.4: Database Queries
**Objective**: Verify helper functions work correctly

**Test Queries**:
```typescript
// Test user stats
const stats = await getUserStats(userId);

// Test contract search
const contracts = await findContractsByUser(userId, { status: 'ANALYZED' });

// Test pagination
const paginated = await paginate(prisma.contract, { userId }, { page: 1, pageSize: 10 });
```

**Expected Result**:
- ✅ Stats calculated correctly
- ✅ Filters work properly
- ✅ Pagination returns correct results

**Status**: ⏳ PENDING

---

## 📄 Epic 3: Contract Upload & Processing

### Test 3.1: File Upload - Valid PDF
**Objective**: Upload a valid PDF contract

**Steps**:
1. Log in
2. Navigate to Contracts Library
3. Click "Upload New Contracts"
4. Drag and drop a PDF file (or browse)
5. Enter title: "Test Contract"
6. Click "Upload"

**Expected Result**:
- ✅ File uploaded successfully
- ✅ Progress bar shows 0-100%
- ✅ File saved to `public/uploads/{userId}/`
- ✅ Database record created
- ✅ Status: PROCESSING
- ✅ Success message displayed

**Status**: ⏳ PENDING MANUAL TEST

---

### Test 3.2: File Upload - Valid DOCX
**Objective**: Upload a valid DOCX contract

**Steps**:
1. Upload a .docx file
2. Verify parsing

**Expected Result**:
- ✅ DOCX parsed successfully
- ✅ Text extracted
- ✅ Word count calculated

**Status**: ⏳ PENDING MANUAL TEST

---

### Test 3.3: File Upload - Invalid File Type
**Objective**: Verify invalid files are rejected

**Steps**:
1. Try uploading a .jpg image
2. Try uploading a .xlsx spreadsheet

**Expected Result**:
- ✅ Error message: "Invalid file type"
- ✅ Upload blocked
- ✅ No database record created

**Status**: ⏳ PENDING MANUAL TEST

---

### Test 3.4: File Upload - Oversized File
**Objective**: Verify files over 50MB are rejected

**Steps**:
1. Try uploading a 60MB PDF file

**Expected Result**:
- ✅ Error message: "File size exceeds maximum of 50MB"
- ✅ Upload blocked

**Status**: ⏳ PENDING MANUAL TEST

---

### Test 3.5: Document Parsing - PDF
**Objective**: Verify PDF text extraction

**Steps**:
1. Upload a sample PDF contract
2. Check extracted text in database

**Expected Result**:
- ✅ Text extracted correctly
- ✅ Word count > 0
- ✅ Character count > 0
- ✅ Page count detected

**Status**: ⏳ PENDING MANUAL TEST

---

### Test 3.6: Document Parsing - DOCX
**Objective**: Verify DOCX text extraction

**Steps**:
1. Upload a sample DOCX contract
2. Check extracted text in database

**Expected Result**:
- ✅ Text extracted correctly
- ✅ Formatting preserved reasonably

**Status**: ⏳ PENDING MANUAL TEST

---

### Test 3.7: Upload Modal UX
**Objective**: Verify upload modal works smoothly

**Steps**:
1. Click upload button
2. Drag file over drop zone
3. Verify visual feedback
4. Drop file
5. Verify file preview
6. Click cancel

**Expected Result**:
- ✅ Modal opens with animation
- ✅ Drag hover state visible
- ✅ File preview shows name and size
- ✅ Cancel closes modal
- ✅ No file uploaded

**Status**: ⏳ PENDING MANUAL TEST

---

## 🤖 Epic 4: AI Analysis Engine

### Test 4.1: Risk Assessment - High Risk
**Objective**: Verify high-risk contracts are identified

**Test Contract**: Contract with:
- Auto-renewal clause
- No termination clause
- Unlimited liability

**Expected Result**:
- ✅ Risk Level: HIGH
- ✅ Risk Score: 70-100
- ✅ Liability risks identified
- ✅ Termination risks flagged
- ✅ Auto-renewal detected

**Status**: ⏳ PENDING MANUAL TEST

---

### Test 4.2: Risk Assessment - Low Risk
**Objective**: Verify low-risk contracts are identified

**Test Contract**: Contract with:
- Clear termination clause
- No auto-renewal
- Limited liability

**Expected Result**:
- ✅ Risk Level: LOW
- ✅ Risk Score: 0-40
- ✅ Minimal risks identified

**Status**: ⏳ PENDING MANUAL TEST

---

### Test 4.3: Cost Analysis
**Objective**: Verify cost extraction works

**Test Contract**: Contract with "$100,000 annual fee"

**Expected Result**:
- ✅ Detected Value: 100000
- ✅ Payment terms extracted
- ✅ Price escalation detected (if present)

**Status**: ⏳ PENDING MANUAL TEST

---

### Test 4.4: Key Terms Extraction
**Objective**: Verify key terms are extracted

**Test Contract**: Salesforce Enterprise Agreement

**Expected Result**:
- ✅ Vendor: "Salesforce"
- ✅ Start date extracted
- ✅ End date extracted
- ✅ Auto-renewal detected
- ✅ Key terms array populated

**Status**: ⏳ PENDING MANUAL TEST

---

### Test 4.5: Compliance Checking
**Objective**: Verify compliance issues are identified

**Test Contract**: Short contract (< 1000 words)

**Expected Result**:
- ✅ Compliance issues: "Contract appears incomplete"
- ✅ Missing clauses identified
- ✅ Recommendations provided

**Status**: ⏳ PENDING MANUAL TEST

---

### Test 4.6: Auto-Analysis on Upload
**Objective**: Verify analysis triggers automatically

**Steps**:
1. Upload a new contract
2. Wait for parsing to complete
3. Check if analysis starts automatically

**Expected Result**:
- ✅ Analysis triggered in background
- ✅ Notification created when complete
- ✅ Contract status: ANALYZED

**Status**: ⏳ PENDING MANUAL TEST

---

### Test 4.7: Analysis API - GET
**Objective**: Verify getting existing analysis

**API Call**:
```bash
GET /api/contracts/{id}/analyze
```

**Expected Result**:
- ✅ Returns analysis if exists
- ✅ Returns "not analyzed" if not

**Status**: ⏳ PENDING API TEST

---

### Test 4.8: Analysis API - POST
**Objective**: Verify manual analysis trigger

**API Call**:
```bash
POST /api/contracts/{id}/analyze
```

**Expected Result**:
- ✅ Analysis performed
- ✅ Results saved to database
- ✅ Notification created

**Status**: ⏳ PENDING API TEST

---

### Test 4.9: AI Fallback - No API Key
**Objective**: Verify stub analysis when Gemini unavailable

**Steps**:
1. Remove GEMINI_API_KEY from environment
2. Upload a contract
3. Trigger analysis

**Expected Result**:
- ✅ Stub analysis generated
- ✅ Model: "stub-fallback"
- ✅ Heuristic-based results
- ✅ No errors

**Status**: ⏳ PENDING TEST

---

### Test 4.10: AI Fallback - Invalid Response
**Objective**: Verify fallback when AI returns invalid JSON

**Expected Result**:
- ✅ Error caught gracefully
- ✅ Falls back to stub analysis
- ✅ User receives result

**Status**: ⏳ PENDING TEST

---

## 💬 Epic 5: Chat Functionality

### Test 5.1: New Conversation
**Objective**: Verify starting a new chat

**Steps**:
1. Navigate to Chat page
2. Type message: "What is a liability clause?"
3. Send message

**Expected Result**:
- ✅ Conversation created in database
- ✅ User message saved
- ✅ AI response generated
- ✅ Assistant message saved
- ✅ Conversation title set to first message

**Status**: ⏳ PENDING MANUAL TEST

---

### Test 5.2: Conversation History
**Objective**: Verify message history is preserved

**Steps**:
1. Start a conversation
2. Send 3-4 messages
3. Refresh page
4. Check if messages are still there

**Expected Result**:
- ✅ All messages preserved
- ✅ Order maintained (chronological)
- ✅ No messages lost

**Status**: ⏳ PENDING MANUAL TEST

---

### Test 5.3: Contract-Specific Chat
**Objective**: Verify chat with contract context

**Steps**:
1. Click "Analyze" on a contract
2. Ask: "What are the main risks?"
3. Check AI response

**Expected Result**:
- ✅ Contract context included in prompt
- ✅ AI response references specific contract
- ✅ Relevant analysis data included

**Status**: ⏳ PENDING MANUAL TEST

---

### Test 5.4: Chat API - POST
**Objective**: Verify sending a chat message via API

**API Call**:
```bash
POST /api/chat
Body: {
  "message": "Explain auto-renewal clauses",
  "conversationId": null,
  "contractId": null
}
```

**Expected Result**:
- ✅ New conversation created
- ✅ User message saved
- ✅ AI response generated
- ✅ Both messages returned

**Status**: ⏳ PENDING API TEST

---

### Test 5.5: Chat API - GET Conversations
**Objective**: Verify getting conversation list

**API Call**:
```bash
GET /api/chat
```

**Expected Result**:
- ✅ Returns user's conversations
- ✅ Sorted by most recent
- ✅ Includes last message
- ✅ Includes message count

**Status**: ⏳ PENDING API TEST

---

### Test 5.6: Chat API - GET Specific Conversation
**Objective**: Verify getting full conversation

**API Call**:
```bash
GET /api/chat?conversationId={id}
```

**Expected Result**:
- ✅ Returns full conversation
- ✅ All messages included
- ✅ Chronological order

**Status**: ⏳ PENDING API TEST

---

### Test 5.7: AI Response - General Questions
**Objective**: Verify AI handles general contract questions

**Test Messages**:
- "What is a force majeure clause?"
- "How long should I keep contracts?"
- "What is indemnification?"

**Expected Result**:
- ✅ Relevant, helpful responses
- ✅ Legal disclaimers included

**Status**: ⏳ PENDING MANUAL TEST

---

### Test 5.8: AI Response - Risk Questions
**Objective**: Verify AI handles risk-related questions

**Test Message**: "What are the biggest risks in SaaS contracts?"

**Expected Result**:
- ✅ Response mentions liability, termination, auto-renewal, payment
- ✅ Well-structured response

**Status**: ⏳ PENDING MANUAL TEST

---

### Test 5.9: Stub Response - No AI
**Objective**: Verify chat works without AI

**Steps**:
1. Remove GEMINI_API_KEY
2. Send message: "What are contract risks?"

**Expected Result**:
- ✅ Stub response generated
- ✅ Topic-appropriate response
- ✅ No errors

**Status**: ⏳ PENDING TEST

---

### Test 5.10: Error Handling
**Objective**: Verify graceful error handling

**Steps**:
1. Cause an error (e.g., invalid contract ID)
2. Send chat message

**Expected Result**:
- ✅ Error caught
- ✅ Polite error message returned
- ✅ No crash
- ✅ User can continue chatting

**Status**: ⏳ PENDING TEST

---

## 🔄 Integration Tests

### Test INT-1: Upload → Parse → Analyze → Chat Flow
**Objective**: Verify complete end-to-end workflow

**Steps**:
1. Upload a new PDF contract
2. Wait for parsing to complete
3. Wait for analysis to complete
4. Open chat for that contract
5. Ask: "Summarize the main risks"

**Expected Result**:
- ✅ Contract uploaded successfully
- ✅ Text extracted
- ✅ Analysis completed
- ✅ Chat includes contract context
- ✅ AI response mentions actual risks from analysis

**Status**: ⏳ PENDING MANUAL TEST

---

### Test INT-2: User Isolation
**Objective**: Verify users only see their own data

**Steps**:
1. Create User A and upload contract
2. Create User B
3. Try to access User A's contract as User B

**Expected Result**:
- ✅ User B cannot see User A's contracts
- ✅ API returns 404 or 403
- ✅ No data leakage

**Status**: ⏳ PENDING MANUAL TEST

---

### Test INT-3: Notification System
**Objective**: Verify notifications are created

**Steps**:
1. Upload a contract
2. Wait for analysis to complete
3. Check notifications

**Expected Result**:
- ✅ Notification created
- ✅ Type: CONTRACT_ANALYZED
- ✅ Correct message and link
- ✅ Unread by default

**Status**: ⏳ PENDING MANUAL TEST

---

## 🎯 Performance Tests

### Test PERF-1: Large File Upload
**Objective**: Verify 50MB file uploads smoothly

**Steps**:
1. Upload a 45MB PDF
2. Monitor upload progress
3. Verify parsing completes

**Expected Result**:
- ✅ Upload completes without timeout
- ✅ Progress bar updates smoothly
- ✅ Parsing completes (may take longer)

**Status**: ⏳ PENDING TEST

---

### Test PERF-2: Concurrent Analysis
**Objective**: Verify multiple analyses can run

**Steps**:
1. Upload 3 contracts simultaneously
2. Verify all get analyzed

**Expected Result**:
- ✅ All 3 contracts analyzed
- ✅ No conflicts
- ✅ Reasonable completion time

**Status**: ⏳ PENDING TEST

---

### Test PERF-3: Database Query Performance
**Objective**: Verify queries are optimized

**Steps**:
1. Seed database with 100 contracts
2. Query contracts with filters
3. Check response time

**Expected Result**:
- ✅ Response time < 500ms
- ✅ Pagination works correctly
- ✅ No N+1 queries

**Status**: ⏳ PENDING TEST

---

## 🛡️ Security Tests

### Test SEC-1: SQL Injection
**Objective**: Verify inputs are sanitized

**Steps**:
1. Try injecting SQL in search: `'; DROP TABLE users; --`
2. Try in file names

**Expected Result**:
- ✅ No SQL injection possible
- ✅ Prisma parameterizes queries
- ✅ No errors

**Status**: ⏳ PENDING TEST

---

### Test SEC-2: XSS Protection
**Objective**: Verify script injection is prevented

**Steps**:
1. Upload contract with title: `<script>alert('XSS')</script>`
2. Send chat message with script tags

**Expected Result**:
- ✅ Script tags escaped
- ✅ No alert displayed
- ✅ Content rendered safely

**Status**: ⏳ PENDING TEST

---

### Test SEC-3: File Path Traversal
**Objective**: Verify file paths are sanitized

**Steps**:
1. Try uploading file with name: `../../etc/passwd`

**Expected Result**:
- ✅ Path sanitized
- ✅ File saved in correct directory
- ✅ No traversal possible

**Status**: ⏳ PENDING TEST

---

### Test SEC-4: Authentication Bypass
**Objective**: Verify API endpoints are protected

**Steps**:
1. Clear cookies
2. Try API calls without authentication

**Expected Result**:
- ✅ All protected endpoints return 401
- ✅ No data returned

**Status**: ⏳ PENDING TEST

---

## 📊 Test Summary Template

```
Total Tests: 60
✅ Passed: 0
❌ Failed: 0
⏳ Pending: 60
🔄 In Progress: 0

Pass Rate: 0% (pending execution)
```

---

## 🚀 Running Tests

### Prerequisites
```bash
# 1. Set up database
docker run --name contract-iq-db \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=contract_iq \
  -p 5432:5432 -d postgres:15

# 2. Configure environment
cd apps/web
cp .env.example .env.local
# Edit .env.local with DATABASE_URL and API keys

# 3. Initialize database
pnpm db:generate
pnpm db:push
pnpm db:seed

# 4. Start development server
pnpm dev
```

### Manual Testing
1. Open http://localhost:3000
2. Follow test steps in each section
3. Document results
4. Report issues

### API Testing
```bash
# Use Postman, Insomnia, or curl
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123","name":"Test"}'
```

---

## 📝 Issue Reporting Template

```markdown
## Issue: [Brief Description]

**Test ID**: TEST-X.X  
**Severity**: Critical | High | Medium | Low  
**Environment**: Development | Production  

**Steps to Reproduce**:
1. Step 1
2. Step 2
3. Step 3

**Expected Behavior**:
What should happen

**Actual Behavior**:
What actually happened

**Screenshots**: (if applicable)

**Additional Context**:
Any other relevant information
```

---

## ✅ Sign-Off

**Prepared By**: Droid AI  
**Date**: November 16, 2025  
**Status**: Ready for Execution  

**Notes**: All epics 1-5 have been implemented with comprehensive features and error handling. This test plan ensures all functionality works as intended before production deployment.
