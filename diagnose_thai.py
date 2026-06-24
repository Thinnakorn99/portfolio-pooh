"""
Direct string replacement for garbled Thai text in Private.tsx.
Maps each garbled sequence to the correct Thai text.
"""

path = r'C:\Users\Vivobook\OneDrive\Desktop\PORTFOILIO\portfolio-pooh\src\components\Private.tsx'

with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

print("Current size:", len(content.encode('utf-8')), "bytes")
print("First 300 chars of line 46 area:")
idx = content.find("showToast('")
print(repr(content[idx:idx+100]))
print()

# Find all unique Thai-looking sequences to identify what needs fixing
import re

# Find all sequences of chars in the garbled Thai range or mixed
thai_strings = re.findall(r"'[^']*[\u0e00-\u0e7f][^']*'", content)
print(f"Found {len(thai_strings)} strings with Thai chars")
for i, s in enumerate(thai_strings[:30]):
    print(f"  [{i}]: {repr(s)}")
