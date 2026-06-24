"""
Rebuild Private.tsx with correct Thai text.
Takes the current (partially broken) file and applies correct Thai string replacements.
Uses Unicode code points directly to avoid any encoding issues.
"""

path = r'C:\Users\Vivobook\OneDrive\Desktop\PORTFOILIO\portfolio-pooh\src\components\Private.tsx'

# Read current file
with open(path, 'rb') as f:
    raw = f.read()

# Strip BOM if present
if raw[:3] == b'\xef\xbb\xbf':
    raw = raw[3:]

content = raw.decode('utf-8', errors='replace')

# Thai string replacement map
# Key: any pattern that appears (garbled or partially fixed)  
# Value: correct Thai string
# Using Python Unicode escape sequences for correct Thai

replacements = [
    # Toast messages
    ('\u0e40\u0e19\u0e21\u0e40\u0e19\u0e2a\u0e32\u0e21\u0e32\u0e23\u0e16\u0e14\u0e36\u0e07\u0e02\u0e49\u0e2d\u0e21\u0e39\u0e25\u0e01\u0e32\u0e23\u0e4c\u0e14\u0e2d\u0e2d\u0e01\u0e08\u0e32\u0e01\u0e10\u0e32\u0e19\u0e02\u0e49\u0e2d\u0e21\u0e39\u0e25\u0e44\u0e14\u0e49',
     '\u0e44\u0e21\u0e48\u0e2a\u0e32\u0e21\u0e32\u0e23\u0e16\u0e14\u0e36\u0e07\u0e02\u0e49\u0e2d\u0e21\u0e39\u0e25\u0e01\u0e32\u0e23\u0e4c\u0e14\u0e2d\u0e2d\u0e01\u0e08\u0e32\u0e01\u0e10\u0e32\u0e19\u0e02\u0e49\u0e2d\u0e21\u0e39\u0e25\u0e44\u0e14\u0e49'),
]

# Better approach: read the file content and apply regex-based fix
import re
import sys

# The problem is complex - let's identify each unique Thai-containing string in the file
# and provide correct replacements

# Build the full correct file by identifying and replacing all garbled Thai strings
# We'll use a comprehensive replacement dictionary

# Garbled -> Correct mapping (built from context analysis)
THAI_MAP = {
    # Toast errors/info messages
    '\u0e40\u0e19\u0e21\u0e40\u0e19\u0e2a\u0e32\u0e21\u0e32\u0e23\u0e16\u0e14\u0e36\u0e07\u0e02\u0e49\u0e2d\u0e21\u0e39\u0e25\u0e01\u0e32\u0e23\u0e4c\u0e14\u0e40\u0e19\u0e40\u0e14\u0e40\u0e19\u0e40\u0e18\u0e32\u0e18\u0e40\u0e19\u0e2d\u0e21\u0e39\u0e25\u0e40\u0e25\u0e32\u0e18': '\u0e44\u0e21\u0e48\u0e2a\u0e32\u0e21\u0e32\u0e23\u0e16\u0e14\u0e36\u0e07\u0e02\u0e49\u0e2d\u0e21\u0e39\u0e25\u0e01\u0e32\u0e23\u0e4c\u0e14\u0e2d\u0e2d\u0e01\u0e08\u0e32\u0e01\u0e10\u0e32\u0e19\u0e02\u0e49\u0e2d\u0e21\u0e39\u0e25\u0e44\u0e14\u0e49',
}

# Print current Thai strings found in the file for analysis
thai_pattern = re.compile(r'[\u0e00-\u0e7f\x80-\x9f]+')
matches = [(m.start(), m.group()) for m in thai_pattern.finditer(content)]
sys.stdout.buffer.write(f'Found {len(matches)} Thai/garbled sequences\n'.encode('utf-8'))
for start, m in matches[:20]:
    # Show context  
    ctx_start = max(0, start-20)
    ctx_end = min(len(content), start+len(m)+20)
    ctx = content[ctx_start:ctx_end]
    sys.stdout.buffer.write(f'  at {start}: {m!r}\n'.encode('utf-8'))
