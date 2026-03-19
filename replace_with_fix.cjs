const fs = require('fs');
const path = require('path');

const base = 'src/pages';
const pairs = [
  'DoiXePage/components/DoiXeDialog',
  'DonViVanChuyenPage/components/DonViVanChuyenDialog',
  'DuAnPage/components/DuAnDialog',
  'LoaiKhoPage/components/LoaiKhoDialog',
  'LocTonKhoPage/components/LocTonKhoDialog',
  'NhanSuPage/components/NhanSuDialog',
  'NhapHangChiTietPage/components/NhapHangChiTietDialog',
  'NhapHangPage/components/NhapHangDialog',
  'PhanQuyenPage/components/PhanQuyenDialog',
  'ThanhToanNhapPage/components/ThanhToanNhapDialog',
  'ThanhToanXuatPage/components/ThanhToanXuatDialog',
  'XuatHangChiTietPage/components/XuatHangChiTietDialog'
];

for (const p of pairs) {
  const orig = path.join(base, p + '.tsx');
  const fix = path.join(base, p + '_fix.tsx');
  
  if (fs.existsSync(fix)) {
    const fixContent = fs.readFileSync(fix, 'utf8');
    fs.writeFileSync(orig, fixContent, 'utf8');
    fs.unlinkSync(fix);
    console.log('Replaced: ' + orig);
  } else {
    console.log('Fix file not found: ' + fix);
  }
}

// Also check NhaCungCapDialog - it was previously patched but might be broken
const nhaCungCap = 'src/pages/NhaCungCapPage/components/NhaCungCapDialog.tsx';
if (fs.existsSync(nhaCungCap)) {
  const content = fs.readFileSync(nhaCungCap, 'utf8');
  if (content.includes('createPortal')) {
    console.log('NhaCungCapDialog already has createPortal');
  } else {
    console.log('NhaCungCapDialog MISSING createPortal');
  }
}

// Check for XuatHangDialog
const xuatHang = 'src/pages/XuatHangPage/components/XuatHangDialog.tsx';
if (fs.existsSync(xuatHang)) {
  const content = fs.readFileSync(xuatHang, 'utf8');
  if (content.includes('createPortal')) {
    console.log('XuatHangDialog already has createPortal');
  } else {
    console.log('XuatHangDialog MISSING createPortal - needs fix');
  }
}

console.log('DONE');
