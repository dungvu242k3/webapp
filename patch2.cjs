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
    
    if(content.includes('createPortal(')) {
        console.log('Already patched: ' + f);
        continue;
    }

    // 1. Add import
    if(content.includes("import React, { useState, useEffect } from 'react';")) {
        content = content.replace("import React, { useState, useEffect } from 'react';", "import React, { useState, useEffect } from 'react';\nimport { createPortal } from 'react-dom';");
    } else if(content.includes("import React, { useState } from 'react';")) {
        content = content.replace("import React, { useState } from 'react';", "import React, { useState } from 'react';\nimport { createPortal } from 'react-dom';");
    } else {
        content = "import { createPortal } from 'react-dom';\n" + content;
    }

    // 2. Replace the main return wrapper
    // We look for `  return (` followed by `<div className="fixed ` 
    content = content.replace(/return\s*\(\s*<div\s+className="fixed/g, "return createPortal(\n    <div className=\"fixed");

    // 3. Replace the ending
    const match = content.match(/export default ([a-zA-Z0-9_]+);/);
    if (match) {
        const componentName = match[1];
        // The closing div is before `  );`
        // `    </div>`
        // `  );`
        // `};`
        const replacement = `    </div>,\n    document.body\n  );\n};\n\nexport default ${componentName};`;
        const endRegex = new RegExp(`    <\\/div>\\s*\\);\\s*\\};\\s*export default ${componentName};`);
        if (endRegex.test(content)) {
            content = content.replace(endRegex, replacement);
            fs.writeFileSync(f, content, 'utf8');
            console.log('Successfully patched: ' + f);
        } else {
            console.log('Failed to match end pattern in: ' + f);
            // Some components might have `export default React.memo(Name);` but we assume `export default Name;` is used.
        }
    } else {
        console.log('Failed to match export default in: ' + f);
    }
}
