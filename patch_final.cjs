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
  'src/pages/XuatHangPage/components/XuatHangDialog.tsx',
  'src/pages/NhaCungCapPage/components/NhaCungCapDialog.tsx',
  'src/pages/CongNoPage/components/CongNoDialog.tsx',
  'src/pages/CongNoBanPage/components/CongNoBanDialog.tsx',
  'src/pages/DiaChiMuaPage/components/DiaChiMuaDialog.tsx',
  'src/pages/DiaChiGiaoPage/components/DiaChiGiaoDialog.tsx'
];

let log = '';

for (const f of files) {
  if (!fs.existsSync(f)) {
    log += `SKIP (not found): ${f}\n`;
    continue;
  }

  // Read as latin1 to preserve all byte sequences intact without utf-8 validation limits
  let content = fs.readFileSync(f, 'latin1');

  if (content.includes('createPortal')) {
    log += `SKIP (already patched): ${f}\n`;
    continue;
  }

  if (content.includes("import React, { useState, useEffect } from 'react';")) {
    content = content.replace("import React, { useState, useEffect } from 'react';", "import React, { useState, useEffect } from 'react';\nimport { createPortal } from 'react-dom';");
  } else if (content.includes("import React, { useState } from 'react';")) {
    content = content.replace("import React, { useState } from 'react';", "import React, { useState } from 'react';\nimport { createPortal } from 'react-dom';");
  } else if (content.includes("import React from 'react';")) {
    content = content.replace("import React from 'react';", "import React from 'react';\nimport { createPortal } from 'react-dom';");
  } else {
    // Inject right after any import from 'react'
    content = content.replace(/(import .*? from 'react';)/, "$1\nimport { createPortal } from 'react-dom';\n");
  }

  // The crucial part: add the start wrapper
  let foundStart = false;
  content = content.replace(/return\s*\(\s*<div\s+className="fixed/, () => {
    foundStart = true;
    return `return createPortal(\n    <div className="fixed`;
  });

  if (!foundStart) {
    log += `FAILED (start pattern not found): ${f}\n`;
    continue;
  }

  // The crucial part: add the end wrapper, carefully matching the final export line
  let foundEnd = false;
  content = content.replace(/<\/div>\s*\);\s*};\s*export default\s+([a-zA-Z0-9_]+);/, (match, p1) => {
    foundEnd = true;
    return `    </div>,\n    document.body\n  );\n};\n\nexport default ${p1};`;
  });

  if (!foundEnd) {
    log += `FAILED (end pattern not found): ${f}\n`;
    continue;
  }

  fs.writeFileSync(f, content, 'latin1');
  log += `SUCCESS: ${f}\n`;
}

fs.writeFileSync('patch_node_log.txt', log, 'utf8');
