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

let log = '';
for(let f of files){
    if(!fs.existsSync(f)) continue;
    let content = fs.readFileSync(f, 'utf8');
    
    if(content.includes('createPortal(')) continue;

    if(content.includes("import React, { useState, useEffect } from 'react';")) {
        content = content.replace("import React, { useState, useEffect } from 'react';", "import React, { useState, useEffect } from 'react';\nimport { createPortal } from 'react-dom';");
    } else if(content.includes("import React, { useState } from 'react';")) {
        content = content.replace("import React, { useState } from 'react';", "import React, { useState } from 'react';\nimport { createPortal } from 'react-dom';");
    }

    // Replace the return
    if (content.includes('className="fixed')) {
       let pieces = content.split('className="fixed');
       let before = pieces[0];
       let lastReturnIndex = before.lastIndexOf('return');
       if (lastReturnIndex !== -1) {
           before = before.substring(0, lastReturnIndex) + "return createPortal(\n    <div " + before.substring(lastReturnIndex + 6 + 1); // remove return (
       }
       content = before + 'className="fixed' + pieces[1];
       
       // Replace the end
       let closingMatch = content.match(/export default/);
       if (closingMatch) {
          let parts = content.split('export default');
          let beforeExport = parts[0];
          let lastBracketsMatches = beforeExport.match(/<\/div>\s*\);\s*};\s*$/);
          
          if (lastBracketsMatches) {
             let newBeforeExport = beforeExport.replace(/<\/div>\s*\);\s*};\s*$/, "</div>,\n    document.body\n  );\n};\n\n");
             content = newBeforeExport + 'export default' + parts[1];
             fs.writeFileSync(f, content, 'utf8');
             log += 'SUCCESS: ' + f + '\n';
          } else {
             log += 'FAILED BRACKETS: ' + f + '\n';
          }
       } else {
          log += 'NO EXPORT DEFAULT: ' + f + '\n';
       }
    } else {
       log += 'NO CLASSNAME FIXED: ' + f + '\n';
    }
}
fs.writeFileSync('patch3_log.txt', log, 'utf8');
