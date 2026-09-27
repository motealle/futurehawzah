#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MANIFEST="$ROOT/gallery/versions.tsv"
TEMPLATE="$ROOT/gallery/index.template.html"
OUT="${1:-$ROOT/_t-build}"

rm -rf "$OUT"
mkdir -p "$OUT"

buttons=""
while IFS='|' read -r ver entry assets; do
  [[ -z "${ver:-}" || "$ver" =~ ^# ]] && continue
  src="$ROOT/fsinfo-static/$entry"
  [[ -f "$src" ]] || { echo "Missing entry: $src" >&2; exit 1; }

  dest="$OUT/$ver"
  mkdir -p "$dest"
  cp "$src" "$dest/index.html"

  if [[ -n "${assets:-}" ]]; then
    IFS=',' read -ra dirs <<< "$assets"
    for dir in "${dirs[@]}"; do
      [[ -d "$ROOT/fsinfo-static/$dir" ]] || { echo "Missing asset dir: $dir" >&2; exit 1; }
      cp -a "$ROOT/fsinfo-static/$dir" "$dest/"
    done
  fi
done < "$MANIFEST"

while IFS='|' read -r ver _entry _assets; do
  [[ -z "${ver:-}" || "$ver" =~ ^# ]] && continue
  label="$ver"
  cls="version"
  if [[ "$ver" == "09" ]]; then
    label="$ver (Live)"
    cls="version live"
  fi
  buttons+="<a class=\"$cls\" href=\"./$ver/\">$label</a>"$'\n'
done < <(sort -t'|' -k1,1nr "$MANIFEST")

python3 - "$TEMPLATE" "$OUT/index.html" "$buttons" <<'PY'
import sys
from pathlib import Path
template = Path(sys.argv[1]).read_text(encoding="utf-8")
buttons = sys.argv[3]
if "<!-- VERSION_BUTTONS -->" not in template:
    raise SystemExit("template marker missing")
Path(sys.argv[2]).write_text(template.replace("<!-- VERSION_BUTTONS -->", buttons), encoding="utf-8")
PY

expected="$(grep -Ev '^(#|$)' "$MANIFEST" | wc -l | tr -d ' ')"
actual="$(find "$OUT" -mindepth 2 -maxdepth 2 -name index.html | wc -l | tr -d ' ')"
[[ "$actual" == "$expected" ]] || { echo "Expected $expected snapshots, got $actual" >&2; exit 1; }

echo "Built /t gallery with $actual snapshots at $OUT"
