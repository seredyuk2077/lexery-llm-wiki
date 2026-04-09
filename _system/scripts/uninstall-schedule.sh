#!/usr/bin/env bash
# Unload LaunchAgent and remove the symlink from ~/Library/LaunchAgents.
set -euo pipefail

LA_DEST="${HOME}/Library/LaunchAgents/com.lexery.wiki-maintenance.plist"

launchctl unload "${LA_DEST}" 2>/dev/null || true
rm -f "${LA_DEST}"
echo "Unloaded and removed: ${LA_DEST}"
