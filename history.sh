#!/bin/bash

# ============================================
# fernan.dev - Git History Viewer
# ============================================
# Usage: ./history.sh [options]
#
# Options:
#   -n <number>  Limit to N commits (default: 20)
#   -a           Show all commits
#   -s           Show short/stat format
#   -h           Show this help
# ============================================

# Configuration
REPO_DIR="$(cd "$(dirname "$0")" && pwd)"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m' # No Color

# Default options
LIMIT=20
FORMAT="full"
SHOW_STATS=false

# Parse command line arguments
while getopts "n:ash" opt; do
    case $opt in
        n)
            LIMIT=$OPTARG
            ;;
        a)
            LIMIT=0
            ;;
        s)
            SHOW_STATS=true
            ;;
        h)
            echo "Usage: ./history.sh [options]"
            echo ""
            echo "Options:"
            echo "  -n <number>  Limit to N commits (default: 20)"
            echo "  -a           Show all commits"
            echo "  -s           Show short/stat format"
            echo "  -h           Show this help"
            exit 0
            ;;
        \?)
            echo "Invalid option: -$OPTARG"
            exit 1
            ;;
    esac
done

# Change to repo directory
cd "$REPO_DIR" || exit 1

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo -e "${RED}Error: Not a git repository.${NC}"
    exit 1
fi

# Print header
echo ""
echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}  fernan.dev - Git Commit History${NC}"
echo -e "${BLUE}============================================${NC}"
echo ""

# Get total commit count
TOTAL_COMMITS=$(git rev-list --count HEAD)

echo -e "${CYAN}Total commits: ${TOTAL_COMMITS}${NC}"
echo ""

# Display commits based on format
if [ "$SHOW_STATS" = true ]; then
    # Short format with stats
    echo -e "${YELLOW}Recent commits (with file changes):${NC}"
    echo ""
    
    if [ "$LIMIT" -eq 0 ]; then
        git log --pretty=format:"%h - %ad | %an%n%s%n%b" --date=format:"%Y-%m-%d %H:%M" --stat
    else
        git log -n "$LIMIT" --pretty=format:"%h - %ad | %an%n%s%n%b" --date=format:"%Y-%m-%d %H:%M" --stat
    fi
else
    # Full format
    echo -e "${YELLOW}Recent commits:${NC}"
    echo ""
    
    if [ "$LIMIT" -eq 0 ]; then
        git log --pretty=format:"%h | %ad | %an%n%s%n" --date=format:"%Y-%m-%d %H:%M:%S"
    else
        git log -n "$LIMIT" --pretty=format:"%h | %ad | %an%n%s%n" --date=format:"%Y-%m-%d %H:%M:%S"
    fi
fi

echo ""
echo -e "${BLUE}============================================${NC}"
echo ""

# Show last commit details if requested
if [ "$LIMIT" -eq 1 ] && [ "$SHOW_STATS" = false ]; then
    echo -e "${YELLOW}Latest commit details:${NC}"
    echo ""
    git show --stat HEAD
    echo ""
fi

# Footer
echo -e "${CYAN}Tip: Use ./history.sh -h for options${NC}"
echo ""
