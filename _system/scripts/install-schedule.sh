#!/usr/bin/env bash
# Symlink LaunchAgent plist and load it (macOS).
set -euo pipefail

ROOT="/Users/andriyseredyuk/Documents/Obsidian Vault/Lexery/_system"
PLIST_SRC="${ROOT}/com.lexery.wiki-maintenance.plist"
LA_DIR="${HOME}/Library/LaunchAgents"
LA_DEST="${LA_DIR}/com.lexery.wiki-maintenance.plist"

if [[ ! -f "${PLIST_SRC}" ]]; then
  echo "ERROR: plist not found at ${PLIST_SRC}" >&2
  exit 1
fi

mkdir -p "${LA_DIR}"
launchctl unload "${LA_DEST}" 2>/dev/null || true
ln -sf "${PLIST_SRC}" "${LA_DEST}"
launchctl load "${LA_DEST}"
echo "Installed and loaded: ${LA_DEST}"
echo "Note: plist invokes /usr/local/bin/node — adjust ProgramArguments if your Node binary lives elsewhere (e.g. Homebrew on Apple Silicon)."
