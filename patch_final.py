import os
import re

files = [
    r'src\pages\NhapHangPage\components\NhapHangDialog.tsx',
    r'src\pages\NhapHangChiTietPage\components\NhapHangChiTietDialog.tsx',
    r'src\pages\XuatHangChiTietPage\components\XuatHangChiTietDialog.tsx',
    r'src\pages\DuAnPage\components\DuAnDialog.tsx',
    r'src\pages\LoaiKhoPage\components\LoaiKhoDialog.tsx',
    r'src\pages\DonViVanChuyenPage\components\DonViVanChuyenDialog.tsx',
    r'src\pages\DoiXePage\components\DoiXeDialog.tsx',
    r'src\pages\NhanSuPage\components\NhanSuDialog.tsx',
    r'src\pages\PhanQuyenPage\components\PhanQuyenDialog.tsx',
    r'src\pages\LocTonKhoPage\components\LocTonKhoDialog.tsx',
    r'src\pages\ThanhToanNhapPage\components\ThanhToanNhapDialog.tsx',
    r'src\pages\ThanhToanXuatPage\components\ThanhToanXuatDialog.tsx',
    r'src\pages\XuatHangPage\components\XuatHangDialog.tsx',
    r'src\pages\NhaCungCapPage\components\NhaCungCapDialog.tsx'
]

log = open("patch_py_log.txt", "w")

for f in files:
    if not os.path.exists(f):
        log.write(f"SKIP (not found): {f}\n")
        continue

    # Preserving arbitrary byte sequences precisely by using latin-1 mapping.
    with open(f, 'r', encoding='latin-1') as file:
        content = file.read()

    if 'createPortal' in content:
        log.write(f"SKIP (already patched): {f}\n")
        continue

    # Add import
    if "import React, { useState, useEffect } from 'react';" in content:
        content = content.replace("import React, { useState, useEffect } from 'react';", "import React, { useState, useEffect } from 'react';\nimport { createPortal } from 'react-dom';")
    elif "import React, { useState } from 'react';" in content:
        content = content.replace("import React, { useState } from 'react';", "import React, { useState } from 'react';\nimport { createPortal } from 'react-dom';")
    elif "import React from 'react';" in content:
        content = content.replace("import React from 'react';", "import React from 'react';\nimport { createPortal } from 'react-dom';")
    elif "import { useState" in content:
        content = re.sub(r'(import .*? from \'react\';)', r"\1\nimport { createPortal } from 'react-dom';", content, count=1)
    else:
        content = "import { createPortal } from 'react-dom';\n" + content

    # Add createPortal wrapper start
    new_content, count = re.subn(r'return\s*\(\s*<div\s+className="fixed', r'return createPortal(\n    <div className="fixed', content, count=1)
    if count == 0:
        log.write(f"FAILED (start pattern not found): {f}\n")
        continue
    content = new_content

    # Add createPortal wrapper end
    new_content, count = re.subn(r'</div>\s*\);\s*};\s*export default\s+([a-zA-Z0-9_]+);', r'</div>,\n    document.body\n  );\n};\n\nexport default \1;', content, count=1)
    if count == 0:
        log.write(f"FAILED (end pattern not found): {f}\n")
        continue
    content = new_content

    # Save
    with open(f, 'w', encoding='latin-1') as file:
        file.write(content)
        
    log.write(f"SUCCESS: {f}\n")

log.close()
