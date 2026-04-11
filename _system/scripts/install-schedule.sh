#!/usr/bin/env bash
# Symlink LaunchAgent plist and load it (macOS).
# Runs while you are logged in: once at login (RunAtLoad) and every StartInterval seconds (~1h) while the Mac is awake.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
VAULT_ROOT="$(cd "${ROOT}/.." && pwd)"
PLIST_EXAMPLE="${ROOT}/com.lexery.wiki-maintenance.plist.example"
PLIST_OUT="${ROOT}/com.lexery.wiki-maintenance.plist"
WRAPPER="${ROOT}/scripts/run-maintenance-launchd.sh"
LA_DIR="${HOME}/Library/LaunchAgents"
LA_DEST="${LA_DIR}/com.lexery.wiki-maintenance.plist"

if [[ ! -f "${PLIST_EXAMPLE}" ]]; then
  echo "ERROR: plist example not found at ${PLIST_EXAMPLE}" >&2
  exit 1
fi

if [[ ! -f "${WRAPPER}" ]]; then
  echo "ERROR: wrapper not found at ${WRAPPER}" >&2
  exit 1
fi

chmod +x "${WRAPPER}"

mkdir -p "${ROOT}/logs"
mkdir -p "${LA_DIR}"

sed "s|__VAULT_ROOT__|${VAULT_ROOT}|g" "${PLIST_EXAMPLE}" > "${PLIST_OUT}"

launchctl unload "${LA_DEST}" 2>/dev/null || true
ln -sf "${PLIST_OUT}" "${LA_DEST}"
launchctl load "${LA_DEST}"
echo "Installed and loaded: ${LA_DEST}"
echo "Generated plist: ${PLIST_OUT}"
echo ""
echo "Behavior: maintenance runs at login and about every 1 hour while the laptop is awake (no cloud hosting)."
echo "Logs: ${ROOT}/logs/launchd-stdout.log and launchd-stderr.log"
echo ""
echo "Secrets: use ~/.lexery-wiki-env only (never commit). Example: export OPENROUTER_API_KEY=..."
echo "For GitHub PR sync: brew install gh && gh auth login"
