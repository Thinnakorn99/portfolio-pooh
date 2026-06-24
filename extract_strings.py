"""Extract all non-ASCII strings from Private.tsx for analysis"""
import sys, re

path = r'C:\Users\Vivobook\OneDrive\Desktop\PORTFOILIO\portfolio-pooh\src\components\Private.tsx'
with open(path, 'rb') as f:
    raw = f.read()
content = raw.decode('utf-8', errors='replace')

# Extract all quoted strings with non-ASCII chars
pattern = re.compile(r"'([^'\\\n]*[\u0080-\uffff\x80-\xff][^'\\\n]*)'")
strings_found = pattern.findall(content)
unique = list(set(strings_found))

sys.stdout.buffer.write(f'Unique non-ASCII strings: {len(unique)}\n'.encode('utf-8'))
for i, s in enumerate(sorted(unique)):
    sys.stdout.buffer.write(f'[{i:03d}] {s!r}\n'.encode('utf-8'))
