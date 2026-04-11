#!/bin/bash
# DevCrew workspace status check — compact output for AI agent consumption.
# Exit 0 = initialized, Exit 1 = not initialized.

if [ ! -d "dev-crew" ] || [ ! -f "INSTRUCTIONS.md" ]; then
  echo "STATUS: NOT_INITIALIZED"
  echo "ACTION: Run /crew.init to create the workspace."
  exit 1
fi

echo "STATUS: INITIALIZED"

# Compact resume summary
if [ -f "dev-crew/resume.md" ]; then
  sed -n '/^---$/,/^---$/{ /^---$/d; p; }' dev-crew/resume.md 2>/dev/null
fi

# Open blockers count
if [ -f "dev-crew/blockers.md" ]; then
  OPEN=$(grep -c '^\## \[OPEN\]' dev-crew/blockers.md 2>/dev/null || echo 0)
  echo "open_blockers: $OPEN"
fi

exit 0
