"""
Fix garbled Thai text in Private.tsx.
The garbled Thai chars were created by reading UTF-8 bytes as cp874 (Thai Windows encoding).
This script reverses the process: encodes each garbled Thai char back to cp874 byte, 
then decodes the collected bytes as UTF-8.
"""

path = r'C:\Users\Vivobook\OneDrive\Desktop\PORTFOILIO\portfolio-pooh\src\components\Private.tsx'

with open(path, 'rb') as f:
    raw = f.read()

content = raw.decode('utf-8')

# Build cp874 decode table: byte value -> Unicode codepoint
# For each byte 0x00-0xFF, decode through cp874 to get the Unicode char
cp874_byte_to_char = {}
for b in range(256):
    try:
        ch = bytes([b]).decode('cp874')
        cp874_byte_to_char[ord(ch)] = b
    except (UnicodeDecodeError, Exception):
        pass

def fix_thai_run(chars):
    """
    Given a run of Thai chars (U+0E00-U+0E7F), try to decode them as cp874-encoded UTF-8.
    If successful, return the decoded string. Otherwise return the original chars.
    """
    # Convert each Thai char back to its cp874 byte value
    byte_list = bytearray()
    for c in chars:
        cp = ord(c)
        if cp in cp874_byte_to_char:
            byte_list.append(cp874_byte_to_char[cp])
        else:
            # Can't convert this char through cp874
            return None
    
    # Try to decode the bytes as UTF-8
    try:
        result = byte_list.decode('utf-8')
        return result
    except UnicodeDecodeError:
        return None

# Process the content
result = []
i = 0
while i < len(content):
    c = content[i]
    if 0x0E00 <= ord(c) <= 0x0E7F:
        # Start of a Thai run - collect consecutive Thai chars
        j = i
        while j < len(content) and 0x0E00 <= ord(content[j]) <= 0x0E7F:
            j += 1
        
        thai_run = content[i:j]
        fixed = fix_thai_run(thai_run)
        
        if fixed is not None:
            # Successfully decoded - use fixed version
            result.append(fixed)
            i = j
        else:
            # Try smaller chunks - maybe some chars can be fixed, others can't
            # Try char by char
            k = i
            while k < j:
                # Try expanding window until we get a valid UTF-8 decode
                found = False
                for end in range(k+1, j+1):
                    chunk = content[k:end]
                    fixed_chunk = fix_thai_run(chunk)
                    if fixed_chunk is not None:
                        # Check if adding one more char would still work
                        if end < j:
                            next_chunk = content[k:end+1]
                            fixed_next = fix_thai_run(next_chunk)
                            if fixed_next is not None:
                                continue  # Try larger chunk
                        result.append(fixed_chunk)
                        k = end
                        found = True
                        break
                if not found:
                    # Keep original char
                    result.append(content[k])
                    k += 1
            i = j
    else:
        result.append(c)
        i += 1

fixed_content = ''.join(result)

# Save without BOM
with open(path, 'wb') as f:
    f.write(fixed_content.encode('utf-8'))

print('Done!')
print(f'Original size: {len(raw)} bytes')
print(f'Fixed size: {len(fixed_content.encode("utf-8"))} bytes')

# Sanity check - count remaining Thai chars
remaining_thai = sum(1 for c in fixed_content if 0x0E00 <= ord(c) <= 0x0E7F)
total_thai_before = sum(1 for c in content if 0x0E00 <= ord(c) <= 0x0E7F)
print(f'Thai chars before: {total_thai_before}')
print(f'Thai chars after: {remaining_thai}')
