import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Plus,
  Clock,
  Calendar,
  Menu,
  Home,
  ChevronRight,
  Bell,
  ChevronDown,
  Folder,
  ArrowLeft,
  Edit2,
  Trash2,
  Warehouse,
  Truck,
  User,
  Briefcase
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import { supabase } from '../../lib/supabase';
import NhapHangDialog from './components/NhapHangDialog';

interface NhapHangData {
  id: string;
  id_nhap: string;
  ma_du_an: string;
  ma_kho: string;
  ma_ncc: string;
  ma_dia_chi_mua: string;
  ma_xe_mua: string;
  ma_dvvc_mua: string;
  phi_van_chuyen: number;
  ghi_chu: string;
  hinh_anh: string;
  nhan_vien_nhap: string;
  ngay_gio: string;
  so_phieu: string;
}

const NhapHangPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [data, setData] = useState<NhapHangData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<NhapHangData | null>(null);
  const [currentTab, setCurrentTab] = useState<'all'>('all');

  const fetchNhapHang = async () => {
    setLoading(true);
    try {
      const { data: res, error } = await supabase
        .from('nhap_hang')
        .select('*')
        .order('ngay_gio', { ascending: false });
      if (error) throw error;
      setData(res || []);
    } catch (err) {
      console.error('Lỗi khi tải danh sách nhập hàng:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNhapHang();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa phiếu nhập này?')) return;
    try {
      const { error } = await supabase.from('nhap_hang').delete().eq('id', id);
      if (error) throw error;
      fetchNhapHang();
    } catch (err) {
      console.error('Lỗi khi xóa:', err);
      alert('Không thể xóa phiếu này');
    }
  };

  const handleEdit = (item: NhapHangData) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setSelectedItem(null);
    setIsDialogOpen(true);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('vi-VN', { hour12: false });
  };

  const formatDate = (date: Date) => {
    const days = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    const dayName = days[date.getDay()];
    return `${dayName}, ${date.toLocaleDateString('vi-VN')}`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const filteredData = data.filter(item => 
    item.so_phieu.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.ma_ncc.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.id_nhap.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.nhan_vien_nhap.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f1f5f9] font-display text-slate-700">
      {/* Header Matching Template */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-full mx-auto px-4 h-[60px] flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center justify-center size-8 bg-slate-100 rounded border border-slate-200 cursor-pointer hover:bg-slate-200 transition-colors">
              <Menu size={18} className="text-slate-600" />
            </div>
            <nav className="flex items-center gap-3 text-[13px]">
              <div className="flex items-center gap-2">
                <Home size={18} className="text-slate-400" />
                <button onClick={() => navigate('/')} className="text-slate-500 hover:text-[#2563eb] transition-colors">Trang chủ</button>
              </div>
              <ChevronRight size={14} className="text-slate-300" />
              <button className="text-slate-500 hover:text-[#2563eb] transition-colors">Quản lý kho</button>
              <ChevronRight size={14} className="text-slate-300" />
              <span className="bg-[#2563eb] text-white px-2.5 py-0.5 rounded-md font-medium text-[13px]">Nhập hàng</span>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-1.5 border border-slate-200 rounded-full text-[13px]">
              <div className="flex items-center gap-2 pr-3 border-r border-slate-200">
                <Clock size={18} className="text-slate-400" />
                <span className="font-medium text-slate-700">{formatTime(currentTime)}</span>
              </div>
              <div className="flex items-center gap-2 pl-1">
                <Calendar size={18} className="text-slate-400" />
                <span className="text-slate-500">{formatDate(currentTime)}</span>
              </div>
            </div>
            <button className="relative p-2 text-slate-400 hover:text-slate-600">
              <Bell size={24} />
              <span className="absolute top-1.5 right-1.5 size-4 bg-[#2563eb] text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">4</span>
            </button>
            <div className="flex items-center gap-3 ml-2">
              <div className="size-9 rounded-full bg-yellow-400 flex items-center justify-center text-white font-bold text-sm relative">
                ND
                <span className="absolute bottom-0 right-0 size-2.5 bg-green-500 rounded-full border-2 border-white"></span>
              </div>
              <div className="flex flex-col text-left">
                <p className="text-[13px] font-bold text-slate-900 leading-tight">Lê Minh Công</p>
                <p className="text-[11px] text-slate-500 leading-tight font-medium"> Admin</p>
              </div>
              <ChevronDown size={18} className="text-slate-400 ml-1" />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-full mx-auto p-4 space-y-4">
        {/* Tabs Matching Template */}
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentTab('all')}
            className={clsx(
              "flex items-center gap-2 px-4 py-2 font-medium text-[13px] rounded-t-lg transition-all",
              currentTab === 'all'
                ? "bg-white border border-slate-200 border-b-0 text-[#2563eb] relative after:absolute after:-bottom-px after:left-0 after:right-0 after:h-[2px] after:bg-[#2563eb]"
                : "text-slate-500 hover:text-slate-700 bg-transparent shadow-none border-none"
            )}
          >
            <Folder size={18} /> Nhật ký nhập hàng
          </button>
        </div>

        {/* Toolbar Matching Template */}
        <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded text-[13px] text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <ArrowLeft size={18} /> Quay lại
            </button>

            <div className="relative w-[300px]">
              <Search size={18} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                className="w-full pl-9 pr-4 py-1.5 border border-slate-200 rounded text-[13px] focus:ring-1 focus:ring-[#2563eb] focus:border-[#2563eb] outline-none placeholder-slate-400 transition-all font-medium text-slate-700 shadow-sm"
                placeholder="Tìm số phiếu, NCC, nhân viên..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-1.5 border border-slate-200 rounded text-slate-500 hover:bg-slate-50">
              <Menu size={20} />
            </button>
            <button
              onClick={handleAdd}
              className="bg-[#2563eb] hover:bg-[#2563eb]/90 text-white px-5 py-1.5 rounded flex items-center gap-2 text-[14px] font-semibold transition-all active:scale-95 shadow-lg shadow-blue-500/10"
            >
              <Plus size={20} /> Nhập hàng mới
            </button>
          </div>
        </div>

        {/* Data Table Matching Template */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden text-[13px]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1200px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-[11px] font-bold uppercase tracking-wider">
                  <th className="px-3 py-3 w-10 text-center">
                    <input className="rounded border-slate-300 text-[#2563eb] size-4" type="checkbox"/>
                  </th>
                  <th className="px-3 py-3 w-[120px]">Phiếu & ID</th>
                  <th className="px-3 py-3 w-[150px]">Dự án & Kho</th>
                  <th className="px-3 py-3 w-[150px]">Nhà cung cấp</th>
                  <th className="px-3 py-3 w-[180px]">Vận chuyển & Phí</th>
                  <th className="px-3 py-3">Ghi chú & Ảnh</th>
                  <th className="px-3 py-3 w-[150px]">Nhân sự & Thời gian</th>
                  <th className="px-3 py-3 text-center w-[100px]">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-slate-400 font-medium italic">Đang tải nhật ký nhập hàng...</td>
                  </tr>
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-slate-400 font-medium italic">Hiện chưa có dữ liệu nhập hàng</td>
                  </tr>
                ) : (
                  filteredData.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="px-3 py-4 text-center">
                        <input className="rounded border-slate-300 text-[#2563eb] size-4" type="checkbox"/>
                      </td>
                      <td className="px-3 py-4">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-slate-900 font-bold">{item.so_phieu}</span>
                          <span className="text-[10px] text-slate-400 font-mono tracking-tighter uppercase font-bold">{item.id_nhap}</span>
                        </div>
                      </td>
                      <td className="px-3 py-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1.5 text-slate-600 font-bold">
                            <Briefcase size={12} className="text-slate-400" /> {item.ma_du_an}
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-500 font-medium text-[11px]">
                            <Warehouse size={12} className="text-slate-400" /> {item.ma_kho}
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-4">
                        <div className="flex items-center gap-2 text-slate-700 font-bold">
                           <User size={14} className="text-slate-400" />
                           {item.ma_ncc}
                        </div>
                      </td>
                      <td className="px-3 py-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1.5 text-slate-600 text-[11px] font-bold italic">
                            <Truck size={12} className="text-slate-400" /> {item.ma_xe_mua || '—'}
                          </div>
                          <div className="text-[#2563eb] font-bold text-[12px] tabular-nums">
                            +{formatCurrency(item.phi_van_chuyen)}
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-4">
                        <div className="flex flex-col gap-1 max-w-[200px]">
                          <span className="text-slate-600 truncate font-medium italic" title={item.ghi_chu}>{item.ghi_chu || '(Không có ghi chú)'}</span>
                          {item.hinh_anh && (
                            <span className="text-[10px] text-blue-500 hover:underline cursor-pointer flex items-center gap-1 font-bold">
                              📷 Xem hình ảnh
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-4">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-slate-900 font-bold">{item.nhan_vien_nhap}</span>
                          <span className="text-[11px] text-slate-400 font-medium">
                            {new Date(item.ngay_gio).toLocaleString('vi-VN', { 
                              day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' 
                            })}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-4">
                        <div className="flex items-center justify-center gap-3">
                          <button 
                            onClick={() => handleEdit(item)}
                            className="text-[#2563eb] hover:text-blue-700 transition-all hover:scale-110"
                            title="Chỉnh sửa"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(item.id)}
                            className="text-red-500 hover:text-red-700 transition-all hover:scale-110"
                            title="Xóa"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 bg-white border-t border-slate-200 flex items-center justify-between text-[12px]">
            <div className="flex items-center gap-1.5 text-slate-500 font-medium">
              <span className="font-bold text-slate-700">{filteredData.length}</span>/Tổng:<span className="font-bold text-slate-700">{data.length}</span>
            </div>
          </div>
        </div>
      </main>

      <NhapHangDialog 
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        initialData={selectedItem}
        onSuccess={fetchNhapHang}
      />
    </div>
  );
};

export default NhapHangPage;
