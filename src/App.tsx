import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import ModulePage from './pages/ModulePage';
import AIPage from './pages/AIPage';
import CopyrightPage from './pages/CopyrightPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import CandidatesPage from './pages/CandidatesPage';
import DanhMucHangPage from './pages/DanhMucHangPage';
import CongNoPage from './pages/CongNoPage';
import CongNoBanPage from './pages/CongNoBanPage';
import DoiXePage from './pages/DoiXePage';
import DuAnPage from './pages/DuAnPage';
import PhanQuyenPage from './pages/PhanQuyenPage';
import NhanSuPage from './pages/NhanSuPage';
import NhapHangPage from './pages/NhapHangPage';
import NhapHangChiTietPage from './pages/NhapHangChiTietPage';
import LocTonKhoPage from './pages/LocTonKhoPage';
import ThanhToanNhapPage from './pages/ThanhToanNhapPage';
import ThanhToanXuatPage from './pages/ThanhToanXuatPage';
import DonViVanChuyenPage from './pages/DonViVanChuyenPage';
import XuatHangPage from './pages/XuatHangPage';
import XuatHangChiTietPage from './pages/XuatHangChiTietPage';
import LoaiKhoPage from './pages/LoaiKhoPage';
import NhaCungCapPage from './pages/NhaCungCapPage';
import DiaChiMuaPage from './pages/DiaChiMuaPage';
import DiaChiGiaoPage from './pages/DiaChiGiaoPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/danh-muc-hang" element={<DanhMucHangPage />} />
          <Route path="/cong-no" element={<CongNoPage />} />
          <Route path="/cong-no-ban" element={<CongNoBanPage />} />
          <Route path="/doi-xe" element={<DoiXePage />} />
          <Route path="/du-an" element={<DuAnPage />} />
          <Route path="/phan-quyen" element={<PhanQuyenPage />} />
          <Route path="/nhan-su" element={<NhanSuPage />} />
          <Route path="/nhap-hang" element={<NhapHangPage />} />
          <Route path="/nhap-hang-ct" element={<NhapHangChiTietPage />} />
          <Route path="/loc-ton-kho" element={<LocTonKhoPage />} />
          <Route path="/thanh-toan-nhap" element={<ThanhToanNhapPage />} />
          <Route path="/thanh-toan-xuat" element={<ThanhToanXuatPage />} />
          <Route path="/don-vi-van-chuyen" element={<DonViVanChuyenPage />} />
          <Route path="/xuat-hang" element={<XuatHangPage />} />
          <Route path="/xuat-hang-ct" element={<XuatHangChiTietPage />} />
          <Route path="/loai-kho" element={<LoaiKhoPage />} />
          <Route path="/nha-cung-cap" element={<NhaCungCapPage />} />
          <Route path="/dia-chi-mua" element={<DiaChiMuaPage />} />
          <Route path="/dia-chi-giao" element={<DiaChiGiaoPage />} />
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/ho-so" element={<ProfilePage />} />
          <Route path="/hanh-chinh" element={<ModulePage />} />

          <Route path="/nhan-su" element={<ModulePage />} />
          <Route path="/nhan-su/ung-vien" element={<CandidatesPage />} />
          <Route path="/kinh-doanh" element={<ModulePage />} />
          <Route path="/marketing" element={<ModulePage />} />
          <Route path="/tai-chinh" element={<ModulePage />} />
          <Route path="/mua-hang" element={<ModulePage />} />
          <Route path="/kho-van" element={<ModulePage />} />
          <Route path="/dieu-hanh" element={<ModulePage />} />
          <Route path="/he-thong" element={<ModulePage />} />
          <Route path="/tro-ly-ai" element={<AIPage />} />
          <Route path="/ban-quyen" element={<CopyrightPage />} />
          <Route path="/cai-dat" element={<SettingsPage />} />
          
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
