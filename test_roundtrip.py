"""
Final fix: Read Private.tsx raw bytes, convert through cp874 to get original bytes,
decode those as UTF-8. Handle the mixed control chars correctly.
"""
import sys

path = r'C:\Users\Vivobook\OneDrive\Desktop\PORTFOILIO\portfolio-pooh\src\components\Private.tsx'

with open(path, 'rb') as f:
    raw = f.read()

# Strip BOM if present
if raw[:3] == b'\xef\xbb\xbf':
    raw = raw[3:]

# The file was encoded as cp874 but saved as UTF-8, creating garbled text.
# To fix: re-read the raw bytes and interpret correctly.

# Current state: file has mixed content
# - ASCII code (JSX) - bytes 0x00-0x7F - CORRECT
# - Garbled Thai text - stored as UTF-8 sequences of Thai Unicode chars (0xE0 0xB8 0xXX patterns)
# - Partially fixed: some were fixed by previous script, some still garbled

# The correct approach: 
# Each Thai UTF-8 char in the file (3 bytes E0 Bx xx) represents ONE original byte.
# That original byte, decoded through cp874, gives us what's currently in the file.
# We need to go back: take each Thai Unicode char, encode as cp874 -> original byte.
# Then decode all bytes as UTF-8.

# But we also have control chars (0x80-0x9F) mixed in which represent 
# the values themselves (since cp874[0x80-0x9F] maps to their Unicode equivalents).

# Step 1: Convert current UTF-8 content back to "original bytes" using cp874 reverse
content_str = raw.decode('utf-8', errors='replace')

# Build cp874 reverse map: Unicode char -> original byte
# For codepoints 0x00-0x9F: direct mapping (char U+00xx -> byte 0xxx)
# For Thai chars U+0E01-U+0E5B: cp874 encoding
cp874_reverse = {}

# ASCII and C1 control chars: direct
for b in range(0xA0):
    try:
        ch = bytes([b]).decode('cp874')
        cp = ord(ch)
        cp874_reverse[cp] = b
    except:
        cp874_reverse[b] = b  # fallback

# Thai and other high bytes
for b in range(0xA0, 0x100):
    try:
        ch = bytes([b]).decode('cp874')
        cp = ord(ch)
        if cp not in cp874_reverse:
            cp874_reverse[cp] = b
    except:
        pass

original_bytes = bytearray()
for ch in content_str:
    cp = ord(ch)
    if cp in cp874_reverse:
        original_bytes.append(cp874_reverse[cp])
    else:
        # Char not encodable in cp874 - means it's a correctly placed char
        # (like é from previous fix, or other Unicode chars)
        original_bytes.extend(ch.encode('utf-8'))

# Now decode these bytes as UTF-8
try:
    fixed = original_bytes.decode('utf-8')
    sys.stdout.buffer.write(b'Full decode SUCCESS\n')
except UnicodeDecodeError as e:
    sys.stdout.buffer.write(f'Decode error at {e.start}: {e.reason}\n'.encode('utf-8'))
    # Find the problematic region
    sys.stdout.buffer.write(f'Bytes around error: {" ".join(f"{b:02X}" for b in original_bytes[max(0,e.start-3):e.start+10])}\n'.encode('utf-8'))
    fixed = original_bytes.decode('utf-8', errors='replace')

# Show result around known positions
idx = fixed.find('showToast')
if idx >= 0:
    sample = fixed[idx:idx+80]
    sys.stdout.buffer.write(f'Around showToast: {sample!r}\n'.encode('utf-8'))

thai_count = sum(1 for c in fixed if '\u0e00' <= c <= '\u0e7f')
sys.stdout.buffer.write(f'Thai chars in fixed: {thai_count}\n'.encode('utf-8'))
sys.stdout.buffer.write(f'Fixed size: {len(fixed.encode("utf-8"))} bytes\n'.encode('utf-8'))
