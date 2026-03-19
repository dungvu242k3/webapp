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
  ArrowLeft,
  Edit2,
  Trash2,
  FileSpreadsheet,
  Hash,
  Package,
  Activity
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import { supabase } from '../../lib/supabase';
import XuatHangChiTietDialog from './components/XuatHangChiTietDialog';

interface XuatHangChiTietData {
  id: string;
  ma_ct: string;
  id_ref: string;
  ma_hang: string;
  kho: string;
  hanh_dong: string;
  loai_nhap_so: string;
  ty_trong: number;
  so_luong_tan: number;
  so_luong_m3: number;
  su_dung_ton_tu: string;
  don_gia: number;
  xuat_hang?: {
    ma_xuat: string;
  };
}

const XuatHangChiTietPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [data, setData] = useState<XuatHangChiTietData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<XuatHangChiTietData | null>(null);
  const [currentTab, setCurrentTab] = useState<'all'>('all');
  const [issues, setIssues] = useState<any[]>([]);

  const fetchDetails = async () => {
    setLoading(true);
    try {
      const { data: res, error } = await supabase
        .from('xuat_hang_chi_tiet')
        .select(`
          *,
          xuat_hang (
            ma_xuat
          )
        `)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setData(res || []);
    } catch (err) {
      console.error('Lỗi khi tải chi tiết xuất:', err);
    } finally {
      setLoading(false);
    }

    // Lấy danh sách phiếu xuất để làm dữ liệu dropdown trong Dialog
    try {
      const { data: issuesData, error: issuesError } = await supabase
        .from('xuat_hang')
        .select('id, ma_xuat')
        .order('created_at', { ascending: false });
      if (issuesError) throw issuesError;
      setIssues(issuesData || []);
    } catch (err) {
      console.error('Lỗi tải danh sách phiếu xuất:', err);
    }
  };

  useEffect(() => {
    fetchDetails();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa dòng chi tiết này?')) return;
    try {
      const { error } = await supabase.from('xuat_hang_chi_tiet').delete().eq('id', id);
      if (error) throw error;
      fetchDetails();
    } catch (err) {
      console.error('Lỗi khi xóa:', err);
      alert('Không thể xóa bản ghi này');
    }
  };

  const handleEdit = (item: XuatHangChiTietData) => {
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
    item.ma_ct.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.ma_hang.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.xuat_hang?.ma_xuat && item.xuat_hang.ma_xuat.toLowerCase().includes(searchTerm.toLowerCase()))
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
              <span className="bg-[#2563eb] text-white px-2.5 py-0.5 rounded-md font-medium text-[13px]">Xuất hàng CT</span>
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
            <FileSpreadsheet size={18} /> Xuất hàng CT
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
                placeholder="Tìm mã CT, sản phẩm, phiếu xuất..."
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
              className="bg-linear-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white px-5 py-2 rounded-xl flex items-center gap-2.5 text-[14px] font-bold transition-all active:scale-95 shadow-lg shadow-cyan-500/20 group"
            >
              <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" /> 
              Thêm chi tiết mới
            </button>
          </div>
        </div>

        {/* Data Table Matching Template */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden text-[13px]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1400px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-[11px] font-bold uppercase tracking-wider">
                  <th className="px-4 py-3 w-10 text-center">
                    <input className="rounded border-slate-300 text-[#2563eb] size-4" type="checkbox"/>
                  </th>
                  <th className="px-4 py-3 w-[150px]">ID</th>
                  <th className="px-4 py-3">ID Ref</th>
                  <th className="px-4 py-3">Mã Hàng</th>
                  <th className="px-4 py-3">Kho</th>
                  <th className="px-4 py-3">Hành động</th>
                  <th className="px-4 py-3">Loại nhập số</th>
                  <th className="px-4 py-3 text-right">Tỷ Trọng (Lưu)</th>
                  <th className="px-4 py-3 text-right">Số Lượng (Tấn)</th>
                  <th className="px-4 py-3 text-right">Số Lượng (m3)</th>
                  <th className="px-4 py-3 text-center">Sử dụng tồn từ ?</th>
                  <th className="px-4 py-3 text-right">Đơn giá (VND)</th>
                  <th className="px-4 py-3 text-center w-[120px]">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-400 font-medium italic">Đang tải chi tiết vật tư...</td>
                  </tr>
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-400 font-medium italic">Chưa có dòng chi tiết nào</td>
                  </tr>
                ) : (
                  filteredData.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group text-[11px]">
                      <td className="px-4 py-4 text-center">
                        <input className="rounded border-slate-300 text-[#2563eb] size-4" type="checkbox"/>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5 text-slate-900 font-bold uppercase tabular-nums">
                          <Hash size={12} className="text-cyan-500" /> {item.ma_ct}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1 text-[11px] text-slate-500 font-mono font-bold">
                           {item.xuat_hang?.ma_xuat || 'N/A'}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5 text-slate-900 font-bold uppercase">
                          <Package size={14} className="text-slate-400" /> {item.ma_hang || '—'}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-bold text-slate-700 tabular-nums uppercase">{item.kho || '—'}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5 text-slate-500 font-medium italic">
                          <Activity size={12} className="text-slate-400" /> {item.hanh_dong || '—'}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase">{item.loai_nhap_so || '—'}</span>
                      </td>
                      <td className="px-4 py-4 text-right font-bold tabular-nums text-slate-600">
                        {item.ty_trong || 0}
                      </td>
                      <td className="px-4 py-4 text-right font-bold tabular-nums text-cyan-600">
                        {item.so_luong_tan?.toLocaleString() || 0}
                      </td>
                      <td className="px-4 py-4 text-right font-bold tabular-nums text-blue-600">
                        {item.so_luong_m3?.toLocaleString() || 0}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className="text-slate-500 font-medium italic tabular-nums">{item.su_dung_ton_tu || '—'}</span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="text-slate-900 font-bold tabular-nums italic">
                          {formatCurrency(item.don_gia)}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-center gap-4">
                          <button 
                            onClick={() => handleEdit(item)}
                            className="text-[#2563eb] hover:text-blue-700 transition-all hover:scale-110"
                            title="Chỉnh sửa"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button 
                            onClick={() => handleDelete(item.id)}
                            className="text-red-500 hover:text-red-700 transition-all hover:scale-110"
                            title="Xóa"
                          >
                            <Trash2 size={18} />
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

      <XuatHangChiTietDialog 
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        initialData={selectedItem}
        onSuccess={fetchDetails}
        issues={issues}
      />
    </div>
  );
};

export default XuatHangChiTietPage;
