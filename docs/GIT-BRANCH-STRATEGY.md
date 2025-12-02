# Git Branch Management Strategy
## Contract IQ Repository Guidelines
### Version 1.0 | December 2024

---

## 🌳 Branch Naming Convention

### **Branch Types & Prefixes**

| Prefix | Purpose | Example |
|--------|---------|---------|
| `main` | Production-ready code | `main` |
| `develop` | Integration branch for features | `develop` |
| `feature/` | New features or enhancements | `feature/redline-analysis` |
| `fix/` | Bug fixes | `fix/upload-error` |
| `hotfix/` | Critical production fixes | `hotfix/security-patch` |
| `release/` | Release preparation | `release/v5.1` |
| `docs/` | Documentation only changes | `docs/api-reference` |
| `test/` | Testing or experimentation | `test/new-ai-model` |
| `refactor/` | Code refactoring | `refactor/database-queries` |
| `chore/` | Maintenance tasks | `chore/update-dependencies` |

### **Branch Naming Rules**

1. **Use lowercase**: `feature/contract-templates` ✅ not `Feature/Contract-Templates` ❌
2. **Use hyphens**: `fix/upload-error` ✅ not `fix/upload_error` ❌
3. **Be descriptive but concise**: `feature/redline-analysis` ✅ not `feature/new-feature-1` ❌
4. **Include ticket/issue number if applicable**: `feature/CIQ-123-template-library`
5. **No personal names**: `feature/user-authentication` ✅ not `feature/john-auth` ❌

---

## 🔄 Git Workflow (Git Flow)

### **Main Branches**

```
main (production)
  └── develop (integration)
       ├── feature/branch-1
       ├── feature/branch-2
       └── fix/branch-3
```

### **Workflow Steps**

1. **Start New Work**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature-name
   ```

2. **Regular Commits**
   ```bash
   git add .
   git commit -m "feat: add contract template selection"
   ```

3. **Keep Updated with Develop**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout feature/your-feature-name
   git rebase develop
   ```

4. **Create Pull Request**
   - Target: `develop` branch
   - Reviewers: At least 1 team member
   - Tests: Must pass
   - Description: Clear explanation of changes

5. **After Merge**
   ```bash
   git checkout develop
   git pull origin develop
   git branch -d feature/your-feature-name
   ```

---

## 🧹 Branch Cleanup Guidelines

### **When to Delete Branches**

1. **Immediately After Merge**: Once PR is merged to develop/main
2. **Abandoned Features**: After 30 days of inactivity
3. **Failed Experiments**: Once decision is made not to proceed
4. **Old Releases**: Keep only last 3 release branches

### **Cleanup Commands**

```bash
# Delete local merged branches
git branch --merged | grep -v "\*\|main\|develop" | xargs -n 1 git branch -d

# Delete remote tracking branches
git remote prune origin

# Delete specific remote branch
git push origin --delete feature/old-feature

# Clean up everything
git fetch --prune
git branch -vv | grep ': gone]' | grep -v "\*" | awk '{ print $1 }' | xargs -n 1 git branch -d
```

---

## 🛡️ Branch Protection Rules

### **Main Branch**
- ✅ Require pull request reviews (min 1)
- ✅ Dismiss stale PR approvals when new commits pushed
- ✅ Require status checks to pass
- ✅ Require branches to be up to date
- ✅ Restrict who can push to main
- ✅ No force pushes
- ✅ No branch deletion

### **Develop Branch**
- ✅ Require pull request reviews (min 1)
- ✅ Require status checks to pass
- ✅ No force pushes
- ✅ No branch deletion

---

## 📊 Branch Status Classification

### **Active Development** (Keep)
- Currently being worked on
- Has commits within last 7 days
- Has open PR

### **Under Review** (Keep)
- Has open PR
- Waiting for review/approval

### **Stale** (Review)
- No commits for 14-30 days
- No open PR
- May need merge or deletion

### **Abandoned** (Delete)
- No commits for >30 days
- No open PR
- Feature cancelled or complete

---

## 🏷️ Commit Message Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

### **Types**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style (formatting, semicolons, etc)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks
- `perf`: Performance improvements
- `ci`: CI/CD changes
- `build`: Build system changes

### **Examples**
```bash
feat(contracts): add template selection wizard
fix(upload): resolve PDF parsing error
docs(api): update authentication endpoints
chore(deps): update dependencies to latest versions
```

---

## 📋 Current Branch Audit (December 2024)

### **Branches to Delete** (Already Merged)
```bash
# These branches are merged and should be deleted
git branch -d docs/contract-iq
git branch -d feature/analytics-interactions
git branch -d feature/api-error-handling-retry-ui
git branch -d feature/app-screens-negotiation-overhaul
git branch -d feature/contracts-intelligence-briefs
git branch -d feature/gemini-2_5-flash-upgrade-env-fallback
git branch -d feature/gemini-stage0-restore
git branch -d feature/gemini-stage1-assisted-ops
git branch -d feature/intelligence-expansion
git branch -d feature/negotiation-core-functionality
git branch -d feature/repo-scaffolding
git branch -d feature/sports-athlete-markets
git branch -d feature/sports-contracts-future
git branch -d fix/chat-parity-standardization
git branch -d fix/contracts-html-parity
git branch -d fix/customer-contract-model-will-feedback
```

### **Branches to Review** (Not Merged)
- `docs/product-foundation` - Check if documentation is complete
- `docs/wireframes` - Check if wireframes are finalized
- `feature/epic-1-authentication` - Review authentication status
- `feature/landing-page-negotiation-pivot` - May be superseded by v5.0
- `feature/vercel-deploy-final` - Check if deployment is complete
- `fix/batch-1-landing-and-contracts` - Review if fixes were applied
- `fix/batch-2-unified-page-header` - Review if fixes were applied
- `fix/unified-header-styling` - Check if styling is complete
- `unified-design-system-nov-18` - Review design system status

---

## 🚀 Implementation Checklist

### **Immediate Actions**
1. [ ] Delete all merged local branches
2. [ ] Delete corresponding remote branches
3. [ ] Set up develop branch if not exists
4. [ ] Configure branch protection rules on GitHub
5. [ ] Update team on new conventions

### **Ongoing Maintenance**
- Weekly: Review and clean up merged branches
- Monthly: Audit stale branches
- Quarterly: Review branch protection rules

---

## 📚 Quick Reference

### **Daily Commands**
```bash
# Start new feature
git checkout -b feature/new-feature develop

# Update your branch
git fetch origin
git rebase origin/develop

# Clean up after merge
git checkout develop
git branch -d feature/completed-feature
git push origin --delete feature/completed-feature

# See branch status
git branch -vv

# Clean everything
git fetch --prune
git branch --merged | grep -v "\*\|main\|develop" | xargs -n 1 git branch -d
```

---

## 📝 Team Agreement

By following these guidelines, we ensure:
- ✅ Clean repository structure
- ✅ Easy navigation of branches
- ✅ Clear understanding of work in progress
- ✅ Reduced merge conflicts
- ✅ Better collaboration
- ✅ Consistent workflow

---

*Last Updated: December 2024*
*Version: 1.0*
*Status: Active*