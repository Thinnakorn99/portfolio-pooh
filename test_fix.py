"""Test fix function on garbled Thai text from original git file"""

def fix_string(s):
    """Convert garbled Thai chars (cp874 interpreted as UTF-8) back to correct text"""
    cp874_byte_to_char = {}
    for b in range(256):
        try:
            ch = bytes([b]).decode('cp874')
            cp874_byte_to_char[ord(ch)] = b
        except:
            pass
    
    result = bytearray()
    for c in s:
        cp = ord(c)
        if cp in cp874_byte_to_char:
            result.append(cp874_byte_to_char[cp])
        elif cp <= 0x7F:
            # ASCII - keep as-is
            result.append(cp)
        else:
            # Non-cp874, non-ASCII char - encode as UTF-8 bytes
            result.extend(c.encode('utf-8'))
    
    try:
        return result.decode('utf-8')
    except UnicodeDecodeError as e:
        # Try to handle partial decode
        return s

import sys

# Test garbled strings from the git version of the file
test_cases = [
    '\u0e40\u0e19\u0e40\u0e18\u0e01\u0e40\u0e19\u0e40\u0e18\u0e2a\u0e32\u0e21\u0e32\u0e23\u0e16',  # garbled ไม่สามารถ
    '\u0e40\u0e19\u0e23\u0e40\u0e19\u0e23\u0e40\u0e18\u0e2d\u0e32',  # some string
]

for g in test_cases:
    f = fix_string(g)
    sys.stdout.buffer.write(f'Garbled: {g!r}\nFixed:   {f!r}\n\n'.encode('utf-8'))

# Now test with the FULL original file
orig_path = r'C:\Users\Vivobook\OneDrive\Desktop\PORTFOILIO\portfolio-pooh\Private_original.tsx'
with open(orig_path, 'r', encoding='utf-8') as fp:
    orig = fp.read()

# Fix the whole file
fixed = fix_string(orig)
sys.stdout.buffer.write(f'Original size: {len(orig.encode("utf-8"))} bytes\n'.encode('utf-8'))
sys.stdout.buffer.write(f'Fixed size: {len(fixed.encode("utf-8"))} bytes\n'.encode('utf-8'))

# Show first 200 chars around Thai text  
idx = fixed.find("'Pok")
if idx >= 0:
    sys.stdout.buffer.write(f'Around Pokemon: {fixed[idx:idx+15]!r}\n'.encode('utf-8'))

# Find first Thai char in fixed
for i, c in enumerate(fixed):
    if '\u0e00' <= c <= '\u0e7f':
        sample = fixed[max(0,i-10):i+50]
        sys.stdout.buffer.write(f'First Thai at {i}: {sample!r}\n'.encode('utf-8'))
        break
