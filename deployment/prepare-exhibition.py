from hashlib import sha256
import json
from pathlib import Path
import re
import sys

root = Path(__file__).resolve().parent
if len(sys.argv) == 3 and sys.argv[1] == '--verify':
    source = Path(sys.argv[2])
    destination = None
elif len(sys.argv) == 2:
    source = root / 'print-parts'
    destination = Path(sys.argv[1])
    destination.mkdir(parents=True, exist_ok=True)
else:
    raise SystemExit('Usage: prepare-exhibition.py DEST or --verify PDF_DIRECTORY')

for name, expected in json.loads((root / 'print-manifest.json').read_text()).items():
    if not re.fullmatch(r'[A-Za-z0-9-]+\.pdf', name):
        raise SystemExit(f'Invalid PDF name: {name}')
    if destination:
        parts = sorted((source / name).glob('*.bin'))
        if not parts or [p.name for p in parts] != [f'{i:03d}.bin' for i in range(len(parts))]:
            raise SystemExit(f'Missing or unordered parts for {name}')
        file = destination / name
        with file.open('wb') as handle:
            for part in parts:
                handle.write(part.read_bytes())
    else:
        file = source / name
    payload = file.read_bytes()
    if len(payload) != expected['size'] or sha256(payload).hexdigest() != expected['sha256']:
        raise SystemExit(f'Checksum mismatch: {name}')
    print(f'{name}: {len(payload)} bytes, SHA-256 verified')
