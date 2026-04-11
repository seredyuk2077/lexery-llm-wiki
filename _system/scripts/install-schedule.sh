#!/usr/bin/env bash
# Symlink LaunchAgent plist and load it (macOS).
# Runs while you are logged in: once at login (RunAtLoad) and every StartInterval seconds (~1h) while the Mac is awake.
set -euo pipefail

ROOT="__PATH_LEXERY_MONOREPO__/LLM Wiki/_system"
PLIST_SRC="${ROOT}/com.lexery.wiki-maintenance.plist"
WRAPPER="${ROOT}/scripts/run-maintenance-launchd.sh"
LA_DIR="${HOME}/Library/LaunchAgents"
LA_DEST="${LA_DIR}/com.lexery.wiki-maintenance.plist"

if [[ ! -f "${PLIST_SRC}" ]]; then
  echo "ERROR: plist not found at ${PLIST_SRC}" >&2
  exit 1
fi

if [[ ! -f "${WRAPPER}" ]]; then
  echo "ERROR: wrapper not found at ${WRAPPER}" >&2
  exit 1
fi

chmod +x "${WRAPPER}"

mkdir -p "${ROOT}/logs"
mkdir -p "${LA_DIR}"
launchctl unload "${LA_DEST}" 2>/dev/null || true
ln -sf "${PLIST_SRC}" "${LA_DEST}"
launchctl load "${LA_DEST}"
echo "Installed and loaded: ${LA_DEST}"
echo ""
echo "Behavior: maintenance runs at login and about every 1 hour while the laptop is awake (no cloud hosting)."
echo "Logs: ${ROOT}/logs/launchd-stdout.log and launchd-stderr.log"
echo ""
echo "Optional: put secrets in ~/.lexery-wiki-env (not committed), e.g. export FOO=bar — sourced by the wrapper."
echo "For GitHub PR sync: brew install gh && gh auth login"
