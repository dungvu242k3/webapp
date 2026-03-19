@echo off
echo Starting replacement...

copy /Y "src\pages\DoiXePage\components\DoiXeDialog_fix.tsx" "src\pages\DoiXePage\components\DoiXeDialog.tsx"
echo Done: DoiXeDialog

copy /Y "src\pages\DonViVanChuyenPage\components\DonViVanChuyenDialog_fix.tsx" "src\pages\DonViVanChuyenPage\components\DonViVanChuyenDialog.tsx"
echo Done: DonViVanChuyenDialog

copy /Y "src\pages\DuAnPage\components\DuAnDialog_fix.tsx" "src\pages\DuAnPage\components\DuAnDialog.tsx"
echo Done: DuAnDialog

copy /Y "src\pages\LoaiKhoPage\components\LoaiKhoDialog_fix.tsx" "src\pages\LoaiKhoPage\components\LoaiKhoDialog.tsx"
echo Done: LoaiKhoDialog

copy /Y "src\pages\LocTonKhoPage\components\LocTonKhoDialog_fix.tsx" "src\pages\LocTonKhoPage\components\LocTonKhoDialog.tsx"
echo Done: LocTonKhoDialog

copy /Y "src\pages\NhanSuPage\components\NhanSuDialog_fix.tsx" "src\pages\NhanSuPage\components\NhanSuDialog.tsx"
echo Done: NhanSuDialog

copy /Y "src\pages\NhapHangChiTietPage\components\NhapHangChiTietDialog_fix.tsx" "src\pages\NhapHangChiTietPage\components\NhapHangChiTietDialog.tsx"
echo Done: NhapHangChiTietDialog

copy /Y "src\pages\NhapHangPage\components\NhapHangDialog_fix.tsx" "src\pages\NhapHangPage\components\NhapHangDialog.tsx"
echo Done: NhapHangDialog

copy /Y "src\pages\PhanQuyenPage\components\PhanQuyenDialog_fix.tsx" "src\pages\PhanQuyenPage\components\PhanQuyenDialog.tsx"
echo Done: PhanQuyenDialog

copy /Y "src\pages\ThanhToanNhapPage\components\ThanhToanNhapDialog_fix.tsx" "src\pages\ThanhToanNhapPage\components\ThanhToanNhapDialog.tsx"
echo Done: ThanhToanNhapDialog

copy /Y "src\pages\ThanhToanXuatPage\components\ThanhToanXuatDialog_fix.tsx" "src\pages\ThanhToanXuatPage\components\ThanhToanXuatDialog.tsx"
echo Done: ThanhToanXuatDialog

copy /Y "src\pages\XuatHangChiTietPage\components\XuatHangChiTietDialog_fix.tsx" "src\pages\XuatHangChiTietPage\components\XuatHangChiTietDialog.tsx"
echo Done: XuatHangChiTietDialog

echo ALL DONE
