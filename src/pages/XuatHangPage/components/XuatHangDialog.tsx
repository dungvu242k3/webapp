import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  ChevronRight,
  Upload,
  Hash,
  Link,
  Briefcase,
  User,
  Warehouse,
  MapPin,
  Truck,
  Globe,
  DollarSign,
  FileText,
  Image as ImageIcon,
  Calendar,
  AlertCircle,
  Plus
} from 'lucide-react';
import { clsx } from 'clsx';
import { supabase } from '../../../lib/supabase';

interface XuatHangDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: any;
}

const XuatHangDialog: React.FC<XuatHangDialogProps> = ({ isOpen, onClose, onSuccess, initialData }) => {
  const [isClosing, setIsClosing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [receipts, setReceipts] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
      fetchReceipts();
    }
  }, [isOpen]);

  const generateRandomId = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'XH-';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const [generatedId, setGeneratedId] = useState('');

  useEffect(() => {
    if (isOpen && !initialData) {
      setGeneratedId(generateRandomId());
    }
  }, [isOpen, initialData]);

  const fetchReceipts = async () => {
    const { data: res } = await supabase.from('nhap_hang').select('id, id_nhap').order('created_at', { ascending: false });
    setReceipts(res || []);
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      ma_xuat: formData.get('ma_xuat') as string,
      id_nhap_ref: formData.get('id_nhap_ref') as string || null,
      ma_du_an: formData.get('ma_du_an') as string,
      khach_hang: formData.get('khach_hang') as string,
      ma_kho: formData.get('ma_kho') as string,
      ma_dia_chi_ban: formData.get('ma_dia_chi_ban') as string,
      ma_xe_xuat: formData.get('ma_xe_xuat') as string,
      ma_dvvc_xuat: formData.get('ma_dvvc_xuat') as string,
      phi_van_chuyen: parseFloat(formData.get('phi_van_chuyen') as string) || 0,
      ghi_chu: formData.get('ghi_chu') as string,
      hinh_anh: formData.get('hinh_anh') as string,
      nhan_vien_xuat: formData.get('nhan_vien_xuat') as string,
      ngay_gio: formData.get('ngay_gio') as string || new Date().toISOString(),
    };

    try {
      if (initialData?.id) {
        const { error } = await supabase
          .from('xuat_hang')
          .update(data)
          .eq('id', initialData.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('xuat_hang')
          .insert([data]);
        if (error) throw error;
      }
      onSuccess();
      handleClose();
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra khi lưu dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen && !isClosing) return null;

  return createPortal(
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className={clsx(
          "absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300",
          isClosing ? "opacity-0" : "opacity-100"
        )}
        onClick={handleClose}
      />

      {/* Dialog Content */}
      <div 
        className={clsx(
          "relative w-full max-w-[900px] bg-white shadow-2xl rounded-2xl flex flex-col max-h-[95vh] overflow-hidden transition-all duration-300",
          isClosing ? "modal-out" : "modal-in"
        )}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 shadow-sm">
              <Upload size={22} />
            </div>
            <div>
              <h2 className="text-[17px] font-bold text-slate-900 leading-tight">
                {initialData ? 'Cập nhật phiếu xuất hàng' : 'Lập phiếu xuất hàng mới'}
              </h2>
              <p className="text-[11px] text-slate-500 font-medium tracking-tight">Bản kê chi tiết hàng hóa xuất kho và vận chuyển</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-red-600 transition-all font-bold"
          >
            <X size={22} />
          </button>
        </div>

        {/* Body */}
        <form id="xuathang-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto no-scrollbar bg-[#f8fafc]/50">
          <div className="p-6 space-y-6">
            {error && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-[13px] animate-in fade-in slide-in-from-top-2">
                <AlertCircle size={18} />
                <span className="font-medium">{error}</span>
              </div>
            )}

            <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm space-y-5">
              <div className="flex items-center gap-2 mb-2">
                <div className="size-6 rounded-md bg-blue-500/10 flex items-center justify-center text-blue-600">
                  <Hash size={14} />
                </div>
                <h3 className="text-[12px] font-bold text-blue-600 uppercase tracking-wider">Thông tin chung</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
                    <Hash size={14} className="text-slate-400" /> ID Xuất <span className="text-red-500 font-bold">*</span>
                  </label>
                  <input 
                    type="text" 
                    name="ma_xuat" 
                    readOnly
                    required 
                    value={initialData?.ma_xuat || generatedId} 
                    placeholder="ID tự động sinh..." 
                    className="w-full px-4 py-2 bg-slate-100 border border-slate-200 rounded-xl text-[14px] font-bold text-slate-500 focus:ring-0 focus:border-slate-200 outline-none transition-all cursor-not-allowed" 
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
                    <Link size={14} className="text-slate-400" /> ID Nhập REF
                  </label>
                  <div className="relative">
                    <select name="id_nhap_ref" defaultValue={initialData?.id_nhap_ref || ''} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-bold text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer">
                      <option value="">Không liên kết</option>
                      {receipts.map(r => (
                        <option key={r.id} value={r.id}>{r.id_nhap}</option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <ChevronRight size={18} className="rotate-90" />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
                    <Briefcase size={14} className="text-slate-400" /> Mã Dự Án
                  </label>
                  <input type="text" name="ma_du_an" defaultValue={initialData?.ma_du_an || ''} placeholder="Mã dự án..." className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-bold text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder-slate-400" />
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
                    <User size={14} className="text-slate-400" /> Khách hàng
                  </label>
                  <input type="text" name="khach_hang" defaultValue={initialData?.khach_hang || ''} placeholder="Tên khách hàng..." className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-bold text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder-slate-400" />
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
                    <Warehouse size={14} className="text-slate-400" /> Mã Kho
                  </label>
                  <input type="text" name="ma_kho" defaultValue={initialData?.ma_kho || ''} placeholder="Mã kho xuất..." className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-bold text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder-slate-400" />
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
                    <MapPin size={14} className="text-slate-400" /> Mã Địa Chỉ Bán
                  </label>
                  <input type="text" name="ma_dia_chi_ban" defaultValue={initialData?.ma_dia_chi_ban || ''} placeholder="Mã địa chỉ..." className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-bold text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder-slate-400" />
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm space-y-5">
              <div className="flex items-center gap-2 mb-2">
                <div className="size-6 rounded-md bg-blue-500/10 flex items-center justify-center text-blue-600">
                  <Truck size={14} />
                </div>
                <h3 className="text-[12px] font-bold text-blue-600 uppercase tracking-wider">Thông tin vận chuyển</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
                    <Truck size={14} className="text-slate-400" /> Mã Xe Xuất
                  </label>
                  <input type="text" name="ma_xe_xuat" defaultValue={initialData?.ma_xe_xuat || ''} placeholder="BKS xe..." className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-bold text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder-slate-400" />
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
                    <Globe size={14} className="text-slate-400" /> Mã DVVC Xuất
                  </label>
                  <input type="text" name="ma_dvvc_xuat" defaultValue={initialData?.ma_dvvc_xuat || ''} placeholder="Mã đơn vị vận tải..." className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-bold text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder-slate-400" />
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
                    <DollarSign size={14} className="text-slate-400" /> Phí Vận Chuyển
                  </label>
                  <input type="number" name="phi_van_chuyen" defaultValue={initialData?.phi_van_chuyen || 0} placeholder="0" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-bold text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder-slate-400 font-mono" />
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm space-y-5">
              <div className="flex items-center gap-2 mb-2">
                <div className="size-6 rounded-md bg-blue-500/10 flex items-center justify-center text-blue-600">
                  <FileText size={14} />
                </div>
                <h3 className="text-[12px] font-bold text-blue-600 uppercase tracking-wider">Chi tiết thực hiện</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
                    <User size={14} className="text-slate-400" /> Nhân Viên Xuất
                  </label>
                  <input type="text" name="nhan_vien_xuat" defaultValue={initialData?.nhan_vien_xuat || ''} placeholder="Tên nhân viên..." className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-bold text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder-slate-400" />
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
                    <Calendar size={14} className="text-slate-400" /> Ngày Giờ
                  </label>
                  <input type="datetime-local" name="ngay_gio" defaultValue={initialData?.ngay_gio ? new Date(initialData.ngay_gio).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16)} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-bold text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all cursor-pointer" />
                </div>

                <div className="space-y-1.5 md:col-span-1 lg:col-span-1">
                   <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
                    <ImageIcon size={14} className="text-slate-400" /> Hình Ảnh (URL)
                  </label>
                  <input type="text" name="hinh_anh" defaultValue={initialData?.hinh_anh || ''} placeholder="URL hình ảnh..." className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-bold text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder-slate-400" />
                </div>

                <div className="space-y-1.5 md:col-span-2 lg:col-span-3">
                  <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
                    <FileText size={14} className="text-slate-400" /> Ghi Chú
                  </label>
                  <textarea name="ghi_chu" rows={2} defaultValue={initialData?.ghi_chu || ''} placeholder="Thông tin bổ sung..." className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-bold text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder-slate-400 resize-none" />
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-white flex items-center justify-between sticky bottom-0 z-10">
          <button
            type="button"
            onClick={handleClose}
            className="px-6 py-2.5 border border-slate-200 rounded-xl text-[14px] font-bold text-slate-600 hover:bg-slate-50 transition-all active:scale-95"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            form="xuathang-form"
            disabled={loading}
            className="px-8 py-2.5 bg-blue-600 text-white rounded-xl text-[14px] font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/20 flex items-center gap-2.5 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={20} />
            {loading ? 'Đang lưu...' : initialData ? 'Cập nhật' : 'Tạo phiếu xuất'} 
            <ChevronRight size={20} className="ml-0.5" />
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default XuatHangDialog;
