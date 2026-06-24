"""
Fix Thai encoding by reading the file's raw bytes through cp874 codec first,
then writing back as correct UTF-8.

The file was saved as cp874 (Thai Windows) but treated as UTF-8, creating mojibake.
Fix: read raw bytes, decode as cp874, write as UTF-8.
"""
import sys

path = r'C:\Users\Vivobook\OneDrive\Desktop\PORTFOILIO\portfolio-pooh\src\components\Private.tsx'

with open(path, 'rb') as f:
    raw = f.read()

# Strip BOM if present
if raw[:3] == b'\xef\xbb\xbf':
    raw = raw[3:]
    print("BOM stripped")

print(f"Raw bytes size: {len(raw)}")
print(f"First bytes: {' '.join(f'{b:02X}' for b in raw[:6])}")

# The file content has chars from both ASCII and Thai-range mixed
# The Thai strings are garbled because each UTF-8 byte of original Thai 
# was converted to a Unicode char using cp874 mapping

# Step 1: The current file is valid UTF-8, but contains wrong Unicode chars
# for the Thai text portions. 

# The issue is complex: the file has MIXED content:
# - Correct ASCII (JSX code, class names, etc.)  - these bytes are OK
# - Garbled Thai text (each original UTF-8 byte stored as cp874 codepoint as UTF-8)

# The key insight: when a byte X was in the original file's Thai section,
# it got converted to Unicode char via cp874[X], then that Unicode char
# was stored as its UTF-8 encoding in the current file.

# For ASCII bytes (0x00-0x7F), cp874[X] = Unicode(X), so no change.
# For high bytes (0x80+), cp874[X] = some Unicode char (Thai or special).

# To reverse: for each CURRENT Unicode char, if cp874 can encode it back to a byte,
# use that byte. Otherwise keep as UTF-8.

# Build cp874 reverse table: Unicode codepoint -> byte
cp874_to_byte = {}
for b in range(256):
    try:
        ch = bytes([b]).decode('cp874', errors='strict')
        cp = ord(ch)
        cp874_to_byte[cp] = b
    except (UnicodeDecodeError, Exception):
        pass

print(f"cp874 table has {len(cp874_to_byte)} entries")

# Current file decoded as UTF-8
content = raw.decode('utf-8', errors='replace')

# Convert: for Thai-range chars and special chars that are cp874-encodable,
# get the original byte. Then re-interpret as UTF-8.
original_bytes = bytearray()
for ch in content:
    cp = ord(ch)
    if cp in cp874_to_byte:
        original_bytes.append(cp874_to_byte[cp])
    elif cp == 0xFFFD:
        # Replacement char - skip or use ?
        original_bytes.append(0x3F)  # '?'
    else:
        # Char not in cp874 - this shouldn't happen for our case
        # but if it does, keep as UTF-8
        original_bytes.extend(ch.encode('utf-8'))

print(f"Original bytes length: {len(original_bytes)}")
print(f"First bytes: {' '.join(f'{b:02X}' for b in original_bytes[:6])}")

# Now decode these bytes as UTF-8 to get the correct text
try:
    fixed_content = original_bytes.decode('utf-8')
    print("UTF-8 decode: SUCCESS")
except UnicodeDecodeError as e:
    print(f"UTF-8 decode failed at position {e.start}: {e}")
    # Try with error handling
    fixed_content = original_bytes.decode('utf-8', errors='replace')
    print("Used replacement chars for invalid sequences")

print(f"Fixed content size: {len(fixed_content.encode('utf-8'))} bytes")

# Check result
idx = fixed_content.find('Pok')
if idx >= 0:
    sys.stdout.buffer.write(f"Pokemon: {fixed_content[idx:idx+12]!r}\n".encode('utf-8'))

# Find first Thai char
for i, c in enumerate(fixed_content):
    if '\u0e00' <= c <= '\u0e7f':
        sample = fixed_content[max(0,i-5):i+40]
        sys.stdout.buffer.write(f"First Thai at {i}: {sample!r}\n".encode('utf-8'))
        break

thai_count = sum(1 for c in fixed_content if '\u0e00' <= c <= '\u0e7f')
print(f"Thai chars in fixed: {thai_count}")
