import os

REPLACEMENTS = [
    ("argumento_xpto", "novos_argumentos_qwerty"),
]

def process_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except (UnicodeDecodeError, IsADirectoryError, FileNotFoundError):
        return
    
    new_content = content
    for old, new in REPLACEMENTS:
        new_content = new_content.replace(old, new)
        
    if content != new_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated content in {filepath}")

for root, dirs, files in os.walk('.'):
    if '.git' in dirs:
        dirs.remove('.git')
    for file in files:
        if file == 'replace.py': continue
        process_file(os.path.join(root, file))
