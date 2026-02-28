#!/bin/bash

# ============================================
# Publish script for fernan.dev
# ============================================
# Usage: ./publish.sh ["commit message"]
# ============================================

# Configuration
REPO_DIR="$(cd "$(dirname "$0")" && pwd)"
SSH_KEY="$REPO_DIR/github.key"
PASSPHRASE_FILE="$REPO_DIR/github.passphrase"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print header
echo ""
echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}  fernan.dev - Publish to GitHub${NC}"
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

# Show current status
echo -e "${YELLOW}Current Git Status:${NC}"
git status --short
echo ""

# Stage all changes
echo -e "${YELLOW}Staging all changes...${NC}"
git add -A

# Remove .DS_Store files from staging
git reset HEAD .DS_Store 2>/dev/null
find . -name ".DS_Store" -delete

# Remove sensitive files from staging
git reset HEAD github.passphrase ssh_askpass.sh 2>/dev/null

# Show what will be committed
echo ""
echo -e "${YELLOW}Changes to be committed:${NC}"
git status --short
echo ""

# Check if there are changes to commit
if [ -z "$(git status --short)" ]; then
    echo -e "${GREEN}No changes to commit. Repository is up to date.${NC}"
    rm -f "$ASKPASS_SCRIPT"
    exit 0
fi

# Get commit message
if [ -n "$1" ]; then
    COMMIT_MSG="$1"
else
    read -p "Enter commit message: " COMMIT_MSG
fi

if [ -z "$COMMIT_MSG" ]; then
    COMMIT_MSG="Update website content"
fi

# Commit changes
echo ""
echo -e "${YELLOW}Committing changes...${NC}"
git commit -m "$COMMIT_MSG"

if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Failed to commit changes${NC}"
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
echo -e "${GREEN}  Successfully published to GitHub!${NC}"
echo -e "${GREEN}============================================${NC}"
echo ""
echo "View your changes at:"
echo "  https://github.com/fernangz/fernan.dev/commits/main"
echo ""
echo "Website: https://test.fernan.dev/"
echo ""
