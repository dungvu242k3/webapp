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
    if(fs.existsSync(f)){
        let c = fs.readFileSync(f);
        fs.writeFileSync(f, c.toString('utf8'), 'utf8');
        console.log('Fixed ' + f);
    }
}
