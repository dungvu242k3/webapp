const fs = require('fs');
const files = [
    'src/pages/NhapHangPage/components/NhapHangDialog.tsx',
    'src/pages/NhapHangChiTietPage/components/NhapHangChiTietDialog.tsx',
    'src/pages/XuatHangChiTietPage/components/XuatHangChiTietDialog.tsx',
    'src/pages/DuAnPage/components/DuAnDialog.tsx',
    'src/pages/LoaiKhoPage/components/LoaiKhoDialog.tsx',
    'src/pages/DonViVanChuyenPage/components/DonViVanChuyenDialog.tsx',
    'src/pages/DoiXePage/components/DoiXeDialog.tsx',
    'src/pages/NhanSuPage/components/NhanSuDialog.tsx',
    'src/pages/PhanQuyenPage/components/PhanQuyenDialog.tsx',
    'src/pages/LocTonKhoPage/components/LocTonKhoDialog.tsx',
    'src/pages/ThanhToanNhapPage/components/ThanhToanNhapDialog.tsx',
    'src/pages/ThanhToanXuatPage/components/ThanhToanXuatDialog.tsx',
    'src/pages/XuatHangPage/components/XuatHangDialog.tsx'
];

for(let f of files){
    if(!fs.existsSync(f)) {
        console.log('File not found: ' + f);
        continue;
    }
    let content = fs.readFileSync(f, 'utf8');
    
    if(content.includes('createPortal')) {
        console.log('Already patched: ' + f);
        continue;
    }

    // 1. Add import
    content = content.replace("import React, { useState, useEffect } from 'react';", "import React, { useState, useEffect } from 'react';\nimport { createPortal } from 'react-dom';");

    // 2. Replace return ( with return createPortal(
    content = content.replace(/if\s*\(!isOpen && !isClosing\)\s*return null;\s*return\s*\(/g, "if (!isOpen && !isClosing) return null;\n\n  return createPortal(");

    // 3. Replace the ending
    const match = content.match(/export default ([a-zA-Z0-9_]+);/);
    if (match) {
        const componentName = match[1];
        const replacement = `    </div>,\n    document.body\n  );\n};\n\nexport default ${componentName};`;
        content = content.replace(new RegExp(`    <\\/div>\\s*\\);\\s*\\};\\s*export default ${componentName};`), replacement);
        
        fs.writeFileSync(f, content, 'utf8');
        console.log('Successfully patched: ' + f);
    } else {
        console.log('Failed to match export default in: ' + f);
    }
}
