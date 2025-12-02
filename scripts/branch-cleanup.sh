#!/bin/bash

# Contract IQ Branch Cleanup Script
# Version: 1.0
# Purpose: Automate branch cleanup and maintenance

echo "🧹 Contract IQ Branch Cleanup Script"
echo "====================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Ensure we're on main or develop
CURRENT_BRANCH=$(git branch --show-current)
if [[ "$CURRENT_BRANCH" != "main" && "$CURRENT_BRANCH" != "develop" ]]; then
    print_warning "Currently on branch: $CURRENT_BRANCH"
    echo "Switching to main branch for cleanup..."
    git checkout main
fi

# Fetch latest changes
echo ""
echo "📡 Fetching latest changes from remote..."
git fetch --all --prune

# Show current branch status
echo ""
echo "📊 Current Branch Status:"
echo "------------------------"
TOTAL_BRANCHES=$(git branch -a | wc -l)
LOCAL_BRANCHES=$(git branch | wc -l)
REMOTE_BRANCHES=$(git branch -r | wc -l)

echo "Total branches: $TOTAL_BRANCHES"
echo "Local branches: $LOCAL_BRANCHES"
echo "Remote branches: $REMOTE_BRANCHES"

# List merged branches
echo ""
echo "🔍 Analyzing merged branches..."
MERGED_BRANCHES=$(git branch --merged main | grep -v "\*\|main\|develop")

if [ -z "$MERGED_BRANCHES" ]; then
    print_success "No merged branches to delete"
else
    echo "Found merged branches:"
    echo "$MERGED_BRANCHES"
    
    read -p "Delete these merged branches? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "$MERGED_BRANCHES" | xargs -n 1 git branch -d
        print_success "Merged branches deleted"
    fi
fi

# Check for stale branches
echo ""
echo "🕰️  Checking for stale branches (>30 days old)..."
STALE_BRANCHES=""

for branch in $(git for-each-ref --format='%(refname:short)' refs/heads/ | grep -v "main\|develop"); do
    LAST_COMMIT=$(git log -1 --format='%ci' $branch)
    DAYS_OLD=$(( ( $(date +%s) - $(date -d "$LAST_COMMIT" +%s) ) / 86400 ))
    
    if [ $DAYS_OLD -gt 30 ]; then
        STALE_BRANCHES="$STALE_BRANCHES\n$branch (${DAYS_OLD} days old)"
    fi
done

if [ -z "$STALE_BRANCHES" ]; then
    print_success "No stale branches found"
else
    echo -e "Found stale branches:$STALE_BRANCHES"
    print_warning "Consider reviewing or deleting these branches"
fi

# Check for branches with no remote
echo ""
echo "🔗 Checking for local branches with no remote..."
ORPHAN_BRANCHES=$(git branch -vv | grep ': gone]' | grep -v "\*" | awk '{ print $1 }')

if [ -z "$ORPHAN_BRANCHES" ]; then
    print_success "No orphaned branches found"
else
    echo "Found orphaned branches (remote deleted):"
    echo "$ORPHAN_BRANCHES"
    
    read -p "Delete these orphaned branches? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "$ORPHAN_BRANCHES" | xargs -n 1 git branch -D
        print_success "Orphaned branches deleted"
    fi
fi

# Remote branch cleanup
echo ""
echo "🌐 Remote branches that may need cleanup:"
MERGED_REMOTE=$(git branch -r --merged main | grep -v "main\|develop\|HEAD")

if [ -z "$MERGED_REMOTE" ]; then
    print_success "No merged remote branches found"
else
    echo "$MERGED_REMOTE"
    print_warning "To delete remote branches, use: git push origin --delete <branch-name>"
fi

# Summary
echo ""
echo "📈 Cleanup Summary:"
echo "==================="
NEW_TOTAL=$(git branch -a | wc -l)
BRANCHES_REMOVED=$((TOTAL_BRANCHES - NEW_TOTAL))

if [ $BRANCHES_REMOVED -gt 0 ]; then
    print_success "Removed $BRANCHES_REMOVED branches"
else
    print_success "No branches removed"
fi

echo ""
echo "Current status:"
echo "- Local branches: $(git branch | wc -l)"
echo "- Remote branches: $(git branch -r | wc -l)"

echo ""
print_success "Branch cleanup complete!"

# Offer to create a new feature branch
echo ""
read -p "Would you like to create a new feature branch? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    read -p "Enter branch name (without prefix): " BRANCH_NAME
    read -p "Branch type (feature/fix/docs/chore): " BRANCH_TYPE
    
    git checkout develop
    git pull origin develop
    git checkout -b "$BRANCH_TYPE/$BRANCH_NAME"
    
    print_success "Created and switched to $BRANCH_TYPE/$BRANCH_NAME"
fi