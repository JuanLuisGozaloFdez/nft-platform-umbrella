#!/usr/bin/env python3
import os
import re
from pathlib import Path

# Text to add
WORKFLOW_DISPATCH = """  workflow_dispatch:
    inputs:
      debug_enabled:
        type: boolean
        description: 'Run the build with tmate debugging enabled'
        required: false
        default: false
"""

def update_workflow(filepath):
    """Add workflow_dispatch trigger if not present"""
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Check if already has workflow_dispatch
    if 'workflow_dispatch:' in content:
        return False  # Already present
    
    # Find the "on:" section and add workflow_dispatch
    # Replace "on:\n  push:" with "on:\n  push:" and then insert after pull_request section
    
    # Strategy: find last path-based trigger (pull_request paths) and add workflow_dispatch after
    lines = content.split('\n')
    insert_index = -1
    
    for i, line in enumerate(lines):
        # Look for the end of pull_request paths section
        if 'pull_request:' in line:
            # Find the next job or env section
            for j in range(i+1, len(lines)):
                if lines[j].startswith('env:') or lines[j].startswith('jobs:'):
                    insert_index = j
                    break
                elif lines[j].startswith('  ') and not lines[j].startswith('    '):
                    insert_index = j
                    break
            if insert_index > 0:
                break
    
    if insert_index > 0:
        lines.insert(insert_index, WORKFLOW_DISPATCH.rstrip('\n'))
        with open(filepath, 'w') as f:
            f.write('\n'.join(lines))
        return True
    
    return False

# Find all workflow files
base_dir = Path('/home/jlg/nft')
workflow_files = list(base_dir.glob('**/workflows/backend-ci.yml'))

print("Updating workflows with workflow_dispatch trigger...\n")

updated = 0
for workflow in sorted(workflow_files):
    service_name = workflow.parent.parent.parent.name
    if update_workflow(str(workflow)):
        print(f"✅ {service_name}: workflow_dispatch added")
        updated += 1
    else:
        print(f"ℹ️  {service_name}: already has workflow_dispatch")

print(f"\n✅ Updated {updated} workflows")
