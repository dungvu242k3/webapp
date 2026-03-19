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
    log += `SKIP: ${f}\n`;
    continue;
  }
  let content = fs.readFileSync(f, 'utf8');
  
  // Replace `setTimeout(onClose, 300);`
  content = content.replace(/setTimeout\(\s*onClose\s*,\s*300\s*\);/g, "setTimeout(() => { onClose(); setIsClosing(false); }, 300);");
  
  // Also replace `setTimeout(() => onClose(), 300);` if it exists
  content = content.replace(/setTimeout\(\s*\(\)\s*=>\s*onClose\(\)\s*,\s*300\s*\);/g, "setTimeout(() => { onClose(); setIsClosing(false); }, 300);");

  fs.writeFileSync(f, content, 'utf8');
  log += `FIXED: ${f}\n`;
}

console.log(log);
fs.writeFileSync('fix_close_log.txt', log, 'utf8');
