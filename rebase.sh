#!/bin/bash

# ============================================
# Publish script for fernan.dev - Rebase Version
# ============================================
# Usage: ./rebase.sh
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
echo -e "${BLUE}  fernan.dev - Rebase and Push${NC}"
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

# Check if there are uncommitted changes
if ! git diff-index --quiet HEAD --; then
    echo -e "${YELLOW}⚠️  You have uncommitted changes.${NC}"
    echo ""
    git status --short
    echo ""
    read -p "Do you want to commit them first? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        read -p "Enter commit message: " message
        git add -A
        git commit -m "$message"
    fi
fi

# Pull with rebase
echo -e "${YELLOW}Pulling latest changes from remote (rebase)...${NC}"
git pull --rebase origin main

if [ $? -ne 0 ]; then
    echo ""
    echo -e "${RED}============================================${NC}"
    echo -e "${RED}  ❌ Failed to rebase${NC}"
    echo -e "${RED}============================================${NC}"
    echo ""
    echo "Resolve conflicts and run:"
    echo "  git rebase --continue"
    echo "  git push origin main"
    echo ""
    rm -f "$ASKPASS_SCRIPT"
    exit 1
fi

# Push to GitHub
echo ""
echo -e "${YELLOW}Pushing to GitHub...${NC}"
git push origin main

if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Failed to push to GitHub${NC}"
    rm -f "$ASKPASS_SCRIPT"
    exit 1
fi

# Cleanup
rm -f "$ASKPASS_SCRIPT"

echo ""
echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}  Successfully rebased and pushed!${NC}"
echo -e "${GREEN}============================================${NC}"
echo ""
echo "View your changes at:"
echo "  https://github.com/fernangz/fernan.dev/commits/main"
echo ""
echo "Website: https://fernan.dev/"
echo ""
