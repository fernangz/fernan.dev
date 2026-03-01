#!/bin/bash

# ============================================
# Publish script for fernan.dev - Restore Version
# ============================================
# Usage: ./restore.sh
# WARNING: This will discard all local changes and reset to origin/main
# ============================================

# Configuration
REPO_DIR="$(cd "$(dirname "$0")" && pwd)"
SSH_KEY="$REPO_DIR/github.key"
PASSPHRASE_FILE="$REPO_DIR/github.passphrase"

# Git user configuration
GIT_USER_NAME="nai"
GIT_USER_EMAIL="nai@fernan.dev"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print header
echo ""
echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}  fernan.dev - Restore from Remote${NC}"
echo -e "${BLUE}============================================${NC}"
echo ""

# Check if required files exist
if [ ! -f "$SSH_KEY" ]; then
    echo -e "${RED}Error: SSH key not found at $SSH_KEY${NC}"
    exit 1
fi

if [ ! -f "$PASSPHRASE_FILE" ]; then
    echo -e "${RED}Error: Passphrase file not found at $PASSPHRASE_FILE${NC}"
    exit 1
fi

# Read passphrase
PASSPHRASE=$(cat "$PASSPHRASE_FILE")

# Create temporary askpass script
ASKPASS_SCRIPT=$(mktemp)
echo "#!/bin/bash" > "$ASKPASS_SCRIPT"
echo "echo \"$PASSPHRASE\"" >> "$ASKPASS_SCRIPT"
chmod +x "$ASKPASS_SCRIPT"

# Set up SSH environment
export GIT_SSH_COMMAND="ssh -i $SSH_KEY -o IdentitiesOnly=yes"
export SSH_ASKPASS="$ASKPASS_SCRIPT"
export SSH_ASKPASS_REQUIRE=force

# Change to repo directory
cd "$REPO_DIR" || exit 1

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo -e "${RED}Error: Not a git repository.${NC}"
    rm -f "$ASKPASS_SCRIPT"
    exit 1
fi

# Set git user config
git config user.name "$GIT_USER_NAME"
git config user.email "$GIT_USER_EMAIL"

# Show current status
echo -e "${YELLOW}Current Git Status:${NC}"
git status --short
echo ""

# Count changes
CHANGED_FILES=$(git status --short | wc -l | tr -d ' ')

if [ "$CHANGED_FILES" -gt 0 ]; then
    echo -e "${RED}⚠️  WARNING: You have $CHANGED_FILES file(s) with local changes.${NC}"
    echo ""
    echo -e "${RED}This will DISCARD all local changes and reset to origin/main${NC}"
    echo ""
    read -p "Are you sure you want to continue? (type 'YES' to confirm) " -r
    echo
    if [[ ! $REPLY =~ ^YES$ ]]; then
        echo -e "${YELLOW}Operation cancelled.${NC}"
        rm -f "$ASKPASS_SCRIPT"
        exit 0
    fi
    
    # Stash local changes (in case user wants to recover them later)
    echo -e "${YELLOW}Stashing local changes...${NC}"
    git stash push -m "Auto-stash before restore $(date +%Y-%m-%d_%H-%M-%S)"
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Local changes stashed. You can recover them with: git stash pop${NC}"
    else
        echo -e "${YELLOW}⚠️  No changes to stash.${NC}"
    fi
fi

# Fetch latest from remote
echo ""
echo -e "${YELLOW}Fetching latest changes from remote...${NC}"
git fetch origin main

if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Failed to fetch from remote${NC}"
    rm -f "$ASKPASS_SCRIPT"
    exit 1
fi

# Reset to origin/main
echo ""
echo -e "${YELLOW}Resetting to origin/main...${NC}"
git reset --hard origin/main

if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Failed to reset to origin/main${NC}"
    rm -f "$ASKPASS_SCRIPT"
    exit 1
fi

# Clean untracked files (optional - ask user)
echo ""
UNTRACKED=$(git ls-files --others --exclude-standard | wc -l | tr -d ' ')
if [ "$UNTRACKED" -gt 0 ]; then
    echo -e "${YELLOW}Found $UNTRACKED untracked file(s):${NC}"
    git ls-files --others --exclude-standard
    echo ""
    read -p "Do you want to remove untracked files? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${YELLOW}Cleaning untracked files...${NC}"
        git clean -fd
    fi
fi

# Cleanup
rm -f "$ASKPASS_SCRIPT"

echo ""
echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}  Successfully restored to origin/main!${NC}"
echo -e "${GREEN}============================================${NC}"
echo ""
echo "Current commit:"
git log --oneline -1
echo ""
echo "If you need to recover stashed changes:"
echo "  git stash list"
echo "  git stash show -p stash@{0}"
echo "  git stash pop"
echo ""
echo "Website: https://fernan.dev/"
echo ""
