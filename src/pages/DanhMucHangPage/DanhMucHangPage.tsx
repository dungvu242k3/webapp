import { clsx } from 'clsx';
import {
  Bell,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Edit,
  Folder,
  HelpCircle,
  Home,
  Image as ImageIcon,
  LayoutGrid, List,
  Package,
  Pin,
  Plus,
  Search,
  Trash2, X
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import type { DanhMucHangFormData } from './components/DanhMucHangDialog';
import DanhMucHangDialog from './components/DanhMucHangDialog';

export interface DanhMucHang {
  id: string;
  ma_hang: string | null;
  ten_hang: string;
  dvt_chinh: string;
  dvt_phu: string | null;
  ty_trong: number | null;
  gia_nhap: number | null;
  gia_ban: number | null;
  ghi_chu: string | null;
  hinh_anh: string | null;
  trang_thai: string;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
}

const DanhMucHangPage: React.FC = () => {
  const navigate = useNavigate();

  const [data, setData] = useState<DanhMucHang[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedDvt, setSelectedDvt] = useState<string[]>([]);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [currentTab, setCurrentTab] = useState<'all' | 'pinned'>('all');
  const [currentTime, setCurrentTime] = useState(new Date());

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDialogClosing, setIsDialogClosing] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingItem, setEditingItem] = useState<DanhMucHang | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchData = async () => {
    try {
      const { data: result, error } = await supabase
        .from('danh_muc_hang')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setData(result || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData: DanhMucHangFormData) => {
    try {
      const payload = {
        ma_hang: formData.ma_hang || null,
        ten_hang: formData.ten_hang,
        dvt_chinh: formData.dvt_chinh,
        dvt_phu: formData.dvt_phu || null,
        ty_trong: formData.ty_trong ? parseFloat(formData.ty_trong) : null,
        gia_nhap: formData.gia_nhap ? parseInt(formData.gia_nhap) : null,
        gia_ban: formData.gia_ban ? parseInt(formData.gia_ban) : null,
        ghi_chu: formData.ghi_chu || null,
        hinh_anh: formData.hinh_anh || null,
        updated_at: new Date().toISOString(),
      };

      if (isEditMode && editingItem) {
        const { error } = await supabase
          .from('danh_muc_hang')
          .update(payload)
          .eq('id', editingItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('danh_muc_hang')
          .insert([payload]);
        if (error) throw error;
      }

      closeDialog();
      fetchData();
    } catch (error) {
      console.error('Error saving:', error);
      alert('Có lỗi xảy ra khi lưu!');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Xác nhận xóa hàng hóa này?')) return;
    try {
      const { error } = await supabase
        .from('danh_muc_hang')
        .delete()
        .eq('id', id);
      if (error) throw error;
      fetchData();
    } catch (error) {
      console.error('Error deleting:', error);
      alert('Có lỗi xảy ra khi xóa!');
    }
  };

  const handleTogglePin = async (item: DanhMucHang) => {
    try {
      const { error } = await supabase
        .from('danh_muc_hang')
        .update({ is_pinned: !item.is_pinned, updated_at: new Date().toISOString() })
        .eq('id', item.id);
      if (error) throw error;
      fetchData();
    } catch (error) {
      console.error('Error toggling pin:', error);
    }
  };

  const openEditDialog = (item: DanhMucHang) => {
    setEditingItem(item);
    setIsEditMode(true);
    setIsDialogOpen(true);
    setIsDialogClosing(false);
  };

  const openAddDialog = () => {
    setEditingItem(null);
    setIsEditMode(false);
    setIsDialogOpen(true);
    setIsDialogClosing(false);
  };

  const closeDialog = () => {
    setIsDialogClosing(true);
    setTimeout(() => {
      setIsDialogOpen(false);
      setIsDialogClosing(false);
      setEditingItem(null);
      setIsEditMode(false);
    }, 300);
  };

  const toggleDropdown = (id: string) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  const uniqueDvt = [...new Set(data.map(item => item.dvt_chinh).filter(Boolean))];
  const statusOptions = ['Đang hoạt động', 'Tạm khóa'];

  const filteredData = data.filter(item => {
    const matchSearch = searchQuery === '' ||
      item.ten_hang.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.ma_hang && item.ma_hang.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.ghi_chu && item.ghi_chu.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchDvt = selectedDvt.length === 0 || selectedDvt.includes(item.dvt_chinh);
    const matchStatus = selectedStatuses.length === 0 || selectedStatuses.includes(item.trang_thai);
    const matchTab = currentTab === 'all' || (currentTab === 'pinned' && item.is_pinned);

    return matchSearch && matchDvt && matchStatus && matchTab;
  });

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(filteredData.map(item => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const toggleSelectItem = (id: string) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const formatCurrency = (value: number | null) => {
    if (value === null) return '—';
    return new Intl.NumberFormat('vi-VN').format(value);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!e.target || !(e.target as Element).closest('.dropdown-container')) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);



  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('vi-VN', { hour12: false });
  };

  const formatDate = (date: Date) => {
    const days = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    const dayName = days[date.getDay()];
    return `${dayName}, ${date.toLocaleDateString('vi-VN')}`;
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] font-display text-slate-700 w-full overflow-y-auto">
      {/* 1. Header Matching Sample */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-full mx-auto px-4 h-[60px] flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center justify-center size-8 bg-slate-100 rounded border border-slate-200 cursor-pointer hover:bg-slate-200 transition-colors">
              <span className="material-symbols-outlined text-slate-600 text-xl font-bold flex items-center justify-center">
                <LayoutGrid size={18} />
              </span>
            </div>
            <nav className="flex items-center gap-3 text-[13px]">
              <div className="flex items-center gap-2">
                <Home size={16} className="text-black" />
                <button onClick={() => navigate('/')} className="text-black hover:text-blue-600 font-bold transition-colors">Trang chủ</button>
              </div>
              <ChevronRight size={14} className="text-black" />
              <span className="bg-[#2563eb] text-white px-2.5 py-0.5 rounded-md font-medium text-[13px]">Danh mục hàng</span>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-4 py-1.5 border border-slate-200 rounded-full text-[13px] bg-white">
              <div className="flex items-center gap-2 pr-3 border-r border-slate-200">
                <Clock size={16} className="text-black" />
                <span className="font-bold text-black tabular-nums">{formatTime(currentTime)}</span>
              </div>
              <div className="flex items-center gap-2 pl-1">
                <Calendar size={16} className="text-black" />
                <span className="text-black font-bold">{formatDate(currentTime)}</span>
              </div>
            </div>
            <button className="relative p-2 text-black hover:text-blue-600 transition-colors">
              <Bell size={24} />
              <span className="absolute top-1.5 right-1.5 size-4 bg-[#2563eb] text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">4</span>
            </button>
            <div className="flex items-center gap-3 ml-2 border-l border-slate-100 pl-4">
              <div className="size-9 rounded-full bg-yellow-400 flex items-center justify-center text-white font-bold text-sm relative">
                ND
                <span className="absolute bottom-0 right-0 size-2.5 bg-green-500 rounded-full border-2 border-white"></span>
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <p className="text-[13px] font-bold text-black leading-tight">Lê Minh Công</p>
                <p className="text-[11px] text-slate-900 leading-tight font-bold"> Admin</p>
              </div>
              <ChevronDown size={16} className="text-black ml-1" />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-full mx-auto p-4 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
        {/* 2. Tabs Styling Sample */}
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentTab('all')}
            className={clsx(
              "flex items-center gap-2 px-4 py-2 font-medium text-[13px] rounded-t-lg transition-all",
              currentTab === 'all'
                ? "bg-white border border-slate-200 border-b-0 text-[#2563eb] relative after:absolute after:-bottom-px after:left-0 after:right-0 after:h-[2px] after:bg-[#2563eb]"
                : "text-slate-500 hover:text-slate-700 bg-transparent"
            )}
          >
            <Folder size={18} /> Tất cả hàng hóa ({data.length})
          </button>
          <button
            onClick={() => setCurrentTab('pinned')}
            className={clsx(
              "flex items-center gap-2 px-4 py-2 font-medium text-[13px] rounded-t-lg transition-all",
              currentTab === 'pinned'
                ? "bg-white border border-slate-200 border-b-0 text-[#2563eb] relative after:absolute after:-bottom-px after:left-0 after:right-0 after:h-[2px] after:bg-[#2563eb]"
                : "text-slate-500 hover:text-slate-700 bg-transparent"
            )}
          >
            <Pin size={18} /> Đã ghim ({data.filter(d => d.is_pinned).length})
          </button>
        </div>

        {/* 3. Toolbar / Filters Sample Style */}
        <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 overflow-x-auto custom-scrollbar no-scrollbar">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded text-[13px] text-black hover:bg-slate-50 transition-colors whitespace-nowrap bg-white font-bold shadow-sm"
            >
              <ChevronLeft size={18} className="text-black" /> Quay lại
            </button>

            <div className="relative w-full max-w-[300px] shrink-0">
              <Search size={18} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-black" />
              <input
                type="text"
                className="w-full pl-9 pr-4 py-1.5 border border-slate-200 rounded text-[13px] focus:ring-1 focus:ring-[#2563eb] focus:border-[#2563eb] outline-none placeholder-slate-400 transition-all shadow-sm"
                placeholder="Tìm kiếm theo tên, mã..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <div className="relative dropdown-container">
                <button
                  onClick={(e) => { e.stopPropagation(); toggleDropdown('dvt'); }}
                  className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded text-[13px] text-slate-500 min-w-[120px] justify-between bg-white hover:bg-slate-50 transition-colors shadow-sm font-medium"
                >
                  <div className="flex items-center gap-2">
                    <List size={18} /> Đơn vị tính
                    {selectedDvt.length > 0 && <span className="bg-[#2563eb] text-white text-[10px] size-4 rounded-full flex items-center justify-center">{selectedDvt.length}</span>}
                  </div>
                  <ChevronDown size={16} />
                </button>
                {activeDropdown === 'dvt' && (
                  <div className="absolute top-full left-0 z-50 mt-1 w-[280px] bg-white border border-slate-200 rounded-lg shadow-xl animate-in fade-in zoom-in-95 duration-150 overflow-hidden">
                    <div className="px-3 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                      <label className="flex items-center gap-2 font-bold text-[#2563eb] text-[13px] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedDvt.length === uniqueDvt.length && uniqueDvt.length > 0}
                          onChange={(e) => setSelectedDvt(e.target.checked ? [...uniqueDvt] : [])}
                          className="rounded border-slate-300 text-[#2563eb] size-4"
                        /> Chọn tất cả
                      </label>
                      <button onClick={() => setSelectedDvt([])} className="text-[11px] text-red-500 hover:underline font-bold">Xoá chọn</button>
                    </div>
                    <ul className="py-1 text-[13px] text-slate-600 max-h-[200px] overflow-y-auto custom-scrollbar">
                      {uniqueDvt.map(dvt => (
                        <li key={dvt} className="px-3 py-2 hover:bg-slate-50 cursor-pointer flex items-center gap-2 font-medium" onClick={() => {
                          setSelectedDvt(prev => prev.includes(dvt) ? prev.filter(i => i !== dvt) : [...prev, dvt]);
                        }}>
                          <input type="checkbox" checked={selectedDvt.includes(dvt)} readOnly className="rounded border-slate-300 text-[#2563eb] size-4 pointer-events-none" /> {dvt}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="relative dropdown-container">
                <button
                  onClick={(e) => { e.stopPropagation(); toggleDropdown('status'); }}
                  className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded text-[13px] text-slate-500 min-w-[140px] justify-between bg-white hover:bg-slate-50 transition-colors shadow-sm font-medium"
                >
                  <div className="flex items-center gap-2">
                    <HelpCircle size={18} /> Trạng thái
                    {selectedStatuses.length > 0 && <span className="bg-[#2563eb] text-white text-[10px] size-4 rounded-full flex items-center justify-center">{selectedStatuses.length}</span>}
                  </div>
                  <ChevronDown size={16} />
                </button>
                {activeDropdown === 'status' && (
                  <div className="absolute top-full left-0 z-50 mt-1 w-[200px] bg-white border border-slate-200 rounded-lg shadow-xl animate-in fade-in zoom-in-95 duration-150 overflow-hidden">
                    <div className="px-3 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                      <label className="flex items-center gap-2 font-bold text-[#2563eb] text-[13px] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedStatuses.length === statusOptions.length}
                          onChange={(e) => setSelectedStatuses(e.target.checked ? [...statusOptions] : [])}
                          className="rounded border-slate-300 text-[#2563eb] size-4"
                        /> Chọn tất cả
                      </label>
                      <button onClick={() => setSelectedStatuses([])} className="text-[11px] text-red-500 hover:underline font-bold">Xoá chọn</button>
                    </div>
                    <ul className="py-1 text-[13px] text-slate-600">
                      {statusOptions.map(status => (
                        <li key={status} className="px-3 py-2 hover:bg-slate-50 cursor-pointer flex items-center gap-2 font-medium" onClick={() => {
                          setSelectedStatuses(prev => prev.includes(status) ? prev.filter(i => i !== status) : [...prev, status]);
                        }}>
                          <input type="checkbox" checked={selectedStatuses.includes(status)} readOnly className="rounded border-slate-300 text-[#2563eb] size-4 pointer-events-none" /> {status}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-1.5 border border-slate-200 rounded text-slate-500 hover:bg-slate-50 shadow-sm transition-colors"><List size={20} /></button>
            <button
              onClick={openAddDialog}
              className="bg-[#2563eb] hover:bg-blue-700 text-white px-5 py-1.5 rounded flex items-center gap-2 text-[14px] font-bold shadow-md shadow-blue-500/20 active:scale-95 transition-all"
            >
              <Plus size={20} /> Thêm
            </button>
          </div>
        </div>

        {/* 4. Table Styling Sample */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-[12px] font-bold uppercase tracking-wider">
                  <th className="px-4 py-3 w-10 text-center sticky left-0 bg-slate-50 z-10">
                    <input
                      type="checkbox"
                      checked={selectedItems.length === filteredData.length && filteredData.length > 0}
                      onChange={(e) => toggleSelectAll(e.target.checked)}
                      className="rounded border-slate-300 text-[#2563eb] size-4"
                    />
                  </th>
                  <th className="px-4 py-3 font-bold w-32 min-w-[120px]">Mã hàng</th>
                  <th className="px-4 py-3 font-bold min-w-[200px]">Tên hàng</th>
                  <th className="px-4 py-3 font-bold w-32 min-w-[120px] text-center">ĐVT chính</th>
                  <th className="px-4 py-3 font-bold w-32 min-w-[120px] text-center">ĐVT phụ</th>
                  <th className="px-4 py-3 font-bold w-28 min-w-[100px] text-center">Tỷ trọng</th>
                  <th className="px-4 py-3 font-bold w-36 min-w-[130px] text-right">Giá nhập</th>
                  <th className="px-4 py-3 font-bold w-36 min-w-[130px] text-right">Giá bán</th>
                  <th className="pl-10 pr-2 py-3 font-bold min-w-[220px]">Ghi chú</th>
                  <th className="pl-2 pr-4 py-3 font-bold w-28 min-w-[110px] text-center">Hình ảnh</th>
                  <th className="px-4 py-3 text-center font-bold w-32 min-w-[120px]">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[13px]">
                {loading ? (
                  <tr>
                    <td colSpan={11} className="px-4 py-12 text-center text-slate-400">Đang tải dữ liệu...</td>
                  </tr>
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="px-4 py-12 text-center text-slate-400">
                      <div className="flex flex-col items-center gap-2">
                        <Package size={40} className="text-slate-200" />
                        <p className="font-medium">Không có dữ liệu</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="px-4 py-4 text-center sticky left-0 bg-white group-hover:bg-slate-50 transition-colors z-10">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item.id)}
                          onChange={() => toggleSelectItem(item.id)}
                          className="rounded border-slate-300 text-[#2563eb] size-4"
                        />
                      </td>
                      <td className="pl-6 pr-4 py-4 text-[13.5px] text-black font-bold font-mono tracking-tight">
                        {item.ma_hang || '—'}
                      </td>
                      <td className="px-4 py-4 text-[13.5px] text-black font-bold">
                        {item.ten_hang}
                      </td>
                      <td className="px-4 py-4 text-[13.5px] text-black font-medium text-center">
                        {item.dvt_chinh}
                      </td>
                      <td className="px-4 py-4 text-[13.5px] text-black font-medium text-center">
                        {item.dvt_phu || '—'}
                      </td>
                      <td className="px-4 py-4 text-center text-black font-bold tabular-nums w-28 min-w-[100px]">
                        {item.ty_trong ?? '—'}
                      </td>
                      <td className="px-4 py-4 text-right font-bold text-[#d97706] tabular-nums w-36 min-w-[130px]">
                        {formatCurrency(item.gia_nhap)}
                      </td>
                      <td className="px-4 py-4 text-right font-extrabold text-[#2563eb] tabular-nums w-36 min-w-[130px]">
                        {formatCurrency(item.gia_ban)}
                      </td>
                      <td className="pl-12 pr-4 py-4 text-black font-medium truncate min-w-[220px]">
                        {item.ghi_chu || '—'}
                      </td>
                      <td className="pl-2 pr-4 py-4 text-center w-28 min-w-[110px]">
                        {item.hinh_anh ? (
                          <button
                            onClick={() => setPreviewImage(item.hinh_anh)}
                            className="w-10 h-10 rounded-lg border border-slate-200 overflow-hidden hover:border-[#2563eb] transition-all hover:scale-105 mx-auto bg-white shadow-sm"
                          >
                            <img src={item.hinh_anh} alt={item.ten_hang} className="w-full h-full object-cover" />
                          </button>
                        ) : (
                          <div className="w-10 h-10 rounded-lg border border-slate-100 bg-slate-50 flex items-center justify-center mx-auto">
                            <ImageIcon size={16} className="text-slate-300" />
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-center gap-4">
                          <button
                            onClick={() => handleTogglePin(item)}
                            className={clsx(
                              'transition-all duration-300 hover:scale-110',
                              item.is_pinned ? 'text-amber-500' : 'text-black hover:text-amber-500'
                            )}
                            title={item.is_pinned ? 'Bỏ ghim' : 'Ghim'}
                          >
                            <Pin size={18} className="text-black" fill={item.is_pinned ? "currentColor" : "none"} />
                          </button>
                          <button
                            onClick={() => openEditDialog(item)}
                            className="text-black hover:text-[#2563eb] transition-all hover:scale-110"
                            title="Sửa"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="text-black hover:text-red-500 transition-all hover:scale-110"
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
              <span className="font-bold text-black">{selectedItems.length}</span>/Tổng:<span className="font-bold text-black">{filteredData.length}</span>
            </div>
          </div>
        </div>
      </main>

      {previewImage && (
        <div
          className="fixed inset-0 z-9999 bg-black/80 flex items-center justify-center p-8 animate-in fade-in duration-200 backdrop-blur-sm"
          onClick={() => setPreviewImage(null)}
        >
          <button
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
            onClick={() => setPreviewImage(null)}
          >
            <X size={24} />
          </button>
          <img
            src={previewImage}
            alt="Preview"
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <DanhMucHangDialog
        isOpen={isDialogOpen}
        isClosing={isDialogClosing}
        isEditMode={isEditMode}
        onClose={closeDialog}
        onSubmit={handleSubmit}
        initialData={editingItem ? {
          ma_hang: editingItem.ma_hang || '',
          ten_hang: editingItem.ten_hang,
          dvt_chinh: editingItem.dvt_chinh,
          dvt_phu: editingItem.dvt_phu || '',
          ty_trong: editingItem.ty_trong?.toString() || '',
          gia_nhap: editingItem.gia_nhap?.toString() || '',
          gia_ban: editingItem.gia_ban?.toString() || '',
          ghi_chu: editingItem.ghi_chu || '',
          hinh_anh: editingItem.hinh_anh || '',
        } : null}
      />
    </div>
  );
};

export default DanhMucHangPage;
