#!/usr/bin/env bash
set -euo pipefail

# rebuild.sh for lerna/lerna
# Runs on existing source tree (no clone).
# Current directory should be the docusaurus root (website/).
# Monorepo: installs root workspace deps from parent dir, then installs website deps and builds.

echo "=== rebuild.sh: lerna/lerna ==="

# --- Node version: require Node 22+ ---
NODE_22_PATH="/opt/hostedtoolcache/node/22.22.1/x64/bin"
if [ -d "$NODE_22_PATH" ]; then
    export PATH="$NODE_22_PATH:$PATH"
fi

NODE_MAJOR=$(node --version 2>/dev/null | sed 's/v//' | cut -d. -f1 || echo "0")
echo "Current Node version: $(node --version 2>/dev/null || echo 'not found')"
if [ "$NODE_MAJOR" -lt "22" ]; then
    echo "Trying to find Node 22 in hostedtoolcache..."
    HOSTED_NODE=$(ls /opt/hostedtoolcache/node/ 2>/dev/null | grep '^22\.' | tail -1)
    if [ -n "$HOSTED_NODE" ]; then
        export PATH="/opt/hostedtoolcache/node/$HOSTED_NODE/x64/bin:$PATH"
    fi
    NODE_MAJOR=$(node --version 2>/dev/null | sed 's/v//' | cut -d. -f1 || echo "0")
    if [ "$NODE_MAJOR" -lt "22" ]; then
        echo "ERROR: Need Node 22+ but have $(node --version 2>/dev/null || echo 'not found')."
        exit 1
    fi
fi
echo "Node version: $(node --version)"
echo "npm version: $(npm --version)"

# --- Install root workspace dependencies (from parent dir) ---
echo "Installing root workspace dependencies..."
(cd .. && npm install)

# --- Install website dependencies ---
echo "Installing website dependencies..."
npm install

# --- Build ---
echo "Building Docusaurus site..."
npm run build

echo "[DONE] Build complete."
