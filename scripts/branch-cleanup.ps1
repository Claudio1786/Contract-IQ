# Contract IQ Branch Cleanup Script (PowerShell)
# Version: 1.0
# Purpose: Automate branch cleanup and maintenance for Windows users

Write-Host "🧹 Contract IQ Branch Cleanup Script" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Function to print colored output
function Write-Success {
    param([string]$Message)
    Write-Host "✅ $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "⚠️  $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "❌ $Message" -ForegroundColor Red
}

# Ensure we're on main or develop
$currentBranch = git branch --show-current
if ($currentBranch -ne "main" -and $currentBranch -ne "develop") {
    Write-Warning "Currently on branch: $currentBranch"
    Write-Host "Switching to main branch for cleanup..."
    git checkout main
}

# Fetch latest changes
Write-Host ""
Write-Host "📡 Fetching latest changes from remote..." -ForegroundColor Cyan
git fetch --all --prune

# Show current branch status
Write-Host ""
Write-Host "📊 Current Branch Status:" -ForegroundColor Cyan
Write-Host "------------------------"

$totalBranches = (git branch -a).Count
$localBranches = (git branch).Count
$remoteBranches = (git branch -r).Count

Write-Host "Total branches: $totalBranches"
Write-Host "Local branches: $localBranches"
Write-Host "Remote branches: $remoteBranches"

# List merged branches
Write-Host ""
Write-Host "🔍 Analyzing merged branches..." -ForegroundColor Cyan

$mergedBranches = git branch --merged main | Where-Object { $_ -notmatch '\*|main|develop' } | ForEach-Object { $_.Trim() }

if ($mergedBranches.Count -eq 0) {
    Write-Success "No merged branches to delete"
}
else {
    Write-Host "Found merged branches:"
    $mergedBranches | ForEach-Object { Write-Host "  - $_" }
    
    $response = Read-Host "Delete these merged branches? (y/n)"
    if ($response -eq 'y' -or $response -eq 'Y') {
        $mergedBranches | ForEach-Object {
            git branch -d $_
        }
        Write-Success "Merged branches deleted"
    }
}

# Check for stale branches
Write-Host ""
Write-Host "🕰️  Checking for stale branches (>30 days old)..." -ForegroundColor Cyan

$staleBranches = @()
$branches = git for-each-ref --format='%(refname:short)' refs/heads/ | Where-Object { $_ -notmatch 'main|develop' }

foreach ($branch in $branches) {
    $lastCommit = git log -1 --format='%ci' $branch
    $lastCommitDate = [DateTime]::Parse($lastCommit)
    $daysOld = (New-TimeSpan -Start $lastCommitDate -End (Get-Date)).Days
    
    if ($daysOld -gt 30) {
        $staleBranches += "$branch ($daysOld days old)"
    }
}

if ($staleBranches.Count -eq 0) {
    Write-Success "No stale branches found"
}
else {
    Write-Host "Found stale branches:"
    $staleBranches | ForEach-Object { Write-Host "  - $_" -ForegroundColor Yellow }
    Write-Warning "Consider reviewing or deleting these branches"
}

# Check for branches with no remote
Write-Host ""
Write-Host "🔗 Checking for local branches with no remote..." -ForegroundColor Cyan

$orphanBranches = git branch -vv | Select-String ': gone]' | ForEach-Object {
    $_.Line.Trim().Split()[0]
}

if ($orphanBranches.Count -eq 0) {
    Write-Success "No orphaned branches found"
}
else {
    Write-Host "Found orphaned branches (remote deleted):"
    $orphanBranches | ForEach-Object { Write-Host "  - $_" }
    
    $response = Read-Host "Delete these orphaned branches? (y/n)"
    if ($response -eq 'y' -or $response -eq 'Y') {
        $orphanBranches | ForEach-Object {
            git branch -D $_
        }
        Write-Success "Orphaned branches deleted"
    }
}

# Remote branch cleanup
Write-Host ""
Write-Host "🌐 Remote branches that may need cleanup:" -ForegroundColor Cyan

$mergedRemote = git branch -r --merged main | Where-Object { $_ -notmatch 'main|develop|HEAD' } | ForEach-Object { $_.Trim() }

if ($mergedRemote.Count -eq 0) {
    Write-Success "No merged remote branches found"
}
else {
    $mergedRemote | ForEach-Object { Write-Host "  - $_" }
    Write-Warning "To delete remote branches, use: git push origin --delete <branch-name>"
}

# Summary
Write-Host ""
Write-Host "📈 Cleanup Summary:" -ForegroundColor Cyan
Write-Host "==================="

$newTotal = (git branch -a).Count
$branchesRemoved = $totalBranches - $newTotal

if ($branchesRemoved -gt 0) {
    Write-Success "Removed $branchesRemoved branches"
}
else {
    Write-Success "No branches removed"
}

Write-Host ""
Write-Host "Current status:"
Write-Host "- Local branches: $((git branch).Count)"
Write-Host "- Remote branches: $((git branch -r).Count)"

Write-Host ""
Write-Success "Branch cleanup complete!"

# Offer to create a new feature branch
Write-Host ""
$response = Read-Host "Would you like to create a new feature branch? (y/n)"

if ($response -eq 'y' -or $response -eq 'Y') {
    $branchName = Read-Host "Enter branch name (without prefix)"
    $branchType = Read-Host "Branch type (feature/fix/docs/chore)"
    
    git checkout develop
    git pull origin develop
    git checkout -b "$branchType/$branchName"
    
    Write-Success "Created and switched to $branchType/$branchName"
}