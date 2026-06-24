import sys

path = r'C:\Users\Vivobook\OneDrive\Desktop\PORTFOILIO\portfolio-pooh\src\components\Private.tsx'
with open(path, 'rb') as f:
    raw = f.read()

content = raw.decode('utf-8')

result = []
i = 0
while i < len(content):
    c = content[i]
    if 0x0E00 <= ord(c) <= 0x0E7F:
        # Collect consecutive Thai chars and try to decode as UTF-8 via cp874
        thai_bytes = bytearray()
        j = i
        while j < len(content) and 0x0E00 <= ord(content[j]) <= 0x0E7F:
            try:
                b = content[j].encode('cp874')
                thai_bytes.extend(b)
            except Exception:
                break
            j += 1
        # Try to decode collected bytes as UTF-8
        try:
            fixed_str = thai_bytes.decode('utf-8')
            result.append(fixed_str)
            i = j
        except UnicodeDecodeError:
            result.append(c)
            i += 1
    else:
        result.append(c)
        i += 1

fixed = ''.join(result)

# Save without BOM
with open(path, 'wb') as f:
    f.write(fixed.encode('utf-8'))

print('Done! File saved.')
print('File size:', len(fixed.encode('utf-8')), 'bytes')

# Quick sanity checks  
idx = fixed.find('Pok')
print('Pokemon area:', repr(fixed[idx:idx+12]))

# Find first Thai char
for k, ch in enumerate(fixed):
    if 0x0E00 <= ord(ch) <= 0x0E7F:
        sample = fixed[max(0,k-5):k+30]
        sys.stdout.buffer.write(('First Thai at ' + str(k) + ': ' + repr(sample) + '\n').encode('utf-8'))
        break

thai_count = sum(1 for c in fixed if 0x0E00 <= ord(c) <= 0x0E7F)
print('Thai chars remaining:', thai_count)
