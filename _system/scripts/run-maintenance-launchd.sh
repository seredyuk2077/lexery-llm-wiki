#!/usr/bin/env bash
# LaunchAgent entrypoint: sane PATH for Homebrew (Apple Silicon + Intel), optional secrets from ~/.lexery-wiki-env
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VAULT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:${HOME}/.nix-profile/bin:${PATH}"

if [[ -f "${HOME}/.lexery-wiki-env" ]]; then
  set -a
  # shellcheck disable=SC1090
  source "${HOME}/.lexery-wiki-env"
  set +a
fi

NODE="$(command -v node || true)"
if [[ -z "${NODE}" ]]; then
  echo "ERROR: node not found. Install Node (e.g. brew install node) or add it to PATH in run-maintenance-launchd.sh" >&2
  exit 1
fi

cd "${VAULT_ROOT}"
exec "${NODE}" "${SCRIPT_DIR}/run-maintenance.mjs"
