import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  ChevronRight, 
  Plus, 
  AlertCircle, 
  Download,
  Calendar,
  User,
  Hash,
  FileText,
  Warehouse,
  Briefcase,
  MapPin,
  Truck,
  DollarSign,
  ImageIcon
} from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { clsx } from 'clsx';

interface NhapHangDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: any;
}

const NhapHangDialog = ({ isOpen, onClose, onSuccess, initialData }: NhapHangDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
      setError(null);
    }
  }, [isOpen]);

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
      id_nhap: formData.get('id_nhap'),
      so_phieu: formData.get('so_phieu'),
      ngay_gio: formData.get('ngay_gio'),
      nhan_vien_nhap: formData.get('nhan_vien_nhap'),
      ma_du_an: formData.get('ma_du_an'),
      ma_kho: formData.get('ma_kho'),
      ma_ncc: formData.get('ma_ncc'),
      ma_dia_chi_mua: formData.get('ma_dia_chi_mua'),
      ma_xe_mua: formData.get('ma_xe_mua'),
      ma_dvvc_mua: formData.get('ma_dvvc_mua'),
      phi_van_chuyen: parseFloat(formData.get('phi_van_chuyen') as string) || 0,
      hinh_anh: formData.get('hinh_anh'),
      ghi_chu: formData.get('ghi_chu'),
    };

    try {
      if (initialData) {
        const { error: updateError } = await supabase
          .from('receipts')
          .update(data)
          .eq('id', initialData.id);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('receipts')
          .insert([data]);
        if (insertError) throw insertError;
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
      <div 
        className={clsx(
          "absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300",
          isClosing ? "opacity-0" : "opacity-100"
        )}
        onClick={handleClose}
      />

      <div 
        className={clsx(
          "relative w-full max-w-[900px] bg-white shadow-2xl rounded-2xl flex flex-col max-h-[90vh] overflow-hidden transition-all duration-300",
          isClosing ? "modal-out" : "modal-in"
        )}
      >
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 shadow-sm">
              <Download size={22} />
            </div>
            <div>
              <h2 className="text-[17px] font-bold text-slate-900 leading-tight">
                {initialData ? 'Cập nhật phiếu nhập kho' : 'Khởi tạo phiếu nhập kho mới'}
              </h2>
              <p className="text-[11px] text-slate-500 font-medium tracking-tight">Vui lòng khai báo thông tin vận chuyển và đơn vị cung ứng</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-red-600 transition-all font-bold"
          >
            <X size={22} />
          </button>
        </div>

        <form id="nhaphang-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto no-scrollbar bg-[#f8fafc]/50">
          <div className="p-6 space-y-6">
            {error && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-[13px] animate-in fade-in slide-in-from-top-2">
                <AlertCircle size={18} />
                <span className="font-medium">{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm space-y-5">
                <div className="flex items-center gap-2 mb-2">
                  <div className="size-6 rounded-md bg-blue-500/10 flex items-center justify-center text-blue-600">
                    <Hash size={14} />
                  </div>
                  <h3 className="text-[12px] font-bold text-blue-600 uppercase tracking-wider">Thông tin định danh</h3>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
                      <Hash size={14} className="text-slate-400" /> ID Nhập <span className="text-red-500">*</span>
                    </label>
                    <input type="text" name="id_nhap" required defaultValue={initialData?.id_nhap || ''} placeholder="ID Nhập..." className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-bold text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder-slate-400" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
                      <FileText size={14} className="text-slate-400" /> Số Phiếu <span className="text-red-500">*</span>
                    </label>
                    <input type="text" name="so_phieu" required defaultValue={initialData?.so_phieu || ''} placeholder="Số phiếu..." className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-bold text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder-slate-400" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
                        <Calendar size={14} className="text-slate-400" /> Ngày Giờ Nhập
                      </label>
                      <input type="datetime-local" name="ngay_gio" defaultValue={initialData?.ngay_gio ? new Date(initialData.ngay_gio).toISOString().slice(0, 16) : ''} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-bold text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
                    </div>

                    <div className="space-y-1.5">
                      <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
                        <User size={14} className="text-slate-400" /> Nhân Viên <span className="text-red-500">*</span>
                      </label>
                      <input type="text" name="nhan_vien_nhap" required defaultValue={initialData?.nhan_vien_nhap || ''} placeholder="Tên nhân viên..." className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-bold text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder-slate-400" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm space-y-5">
                <div className="flex items-center gap-2 mb-2">
                  <div className="size-6 rounded-md bg-blue-500/10 flex items-center justify-center text-blue-600">
                    <Briefcase size={14} />
                  </div>
                  <h3 className="text-[12px] font-bold text-blue-600 uppercase tracking-wider">Đối tác & Địa điểm</h3>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
                        <Briefcase size={14} className="text-slate-400" /> Mã Dự Án <span className="text-red-500">*</span>
                      </label>
                      <input type="text" name="ma_du_an" required defaultValue={initialData?.ma_du_an || ''} placeholder="Mã dự án..." className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-bold text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder-slate-400" />
                    </div>

                    <div className="space-y-1.5">
                      <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
                        <Warehouse size={14} className="text-slate-400" /> Mã Kho <span className="text-red-500">*</span>
                      </label>
                      <input type="text" name="ma_kho" required defaultValue={initialData?.ma_kho || ''} placeholder="Mã kho..." className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-bold text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder-slate-400" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
                      <User size={14} className="text-slate-400" /> Mã Nhà Cung Cấp <span className="text-red-500">*</span>
                    </label>
                    <input type="text" name="ma_ncc" required defaultValue={initialData?.ma_ncc || ''} placeholder="Mã nhà cung cấp..." className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-bold text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder-slate-400" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
                      <MapPin size={14} className="text-slate-400" /> Mã Địa Chỉ Mua
                    </label>
                    <input type="text" name="ma_dia_chi_mua" defaultValue={initialData?.ma_dia_chi_mua || ''} placeholder="Mã địa chỉ chi tiết..." className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-bold text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder-slate-400" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm space-y-5 md:col-span-2">
                <div className="flex items-center gap-2 mb-2">
                  <div className="size-6 rounded-md bg-blue-500/10 flex items-center justify-center text-blue-600">
                    <Truck size={14} />
                  </div>
                  <h3 className="text-[12px] font-bold text-blue-600 uppercase tracking-wider">Thông tin vận chuyển & Chi phí</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
                      <Truck size={14} className="text-slate-400" /> Mã Xe Vận Chuyển
                    </label>
                    <input type="text" name="ma_xe_mua" defaultValue={initialData?.ma_xe_mua || ''} placeholder="Biển số xe..." className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-bold text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder-slate-400" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
                      <Truck size={14} className="text-slate-400" /> Đơn Vị Vận Chuyển
                    </label>
                    <input type="text" name="ma_dvvc_mua" defaultValue={initialData?.ma_dvvc_mua || ''} placeholder="Tên đơn vị VC..." className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-bold text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder-slate-400" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
                      <DollarSign size={14} className="text-slate-400" /> Phí Vận Chuyển
                    </label>
                    <div className="relative">
                      <input type="number" name="phi_van_chuyen" defaultValue={initialData?.phi_van_chuyen || 0} placeholder="0" className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-bold text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-[14px]">₫</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
                      <ImageIcon size={14} className="text-slate-400" /> Hình Ảnh Chứng Từ (URL)
                    </label>
                    <input type="text" name="hinh_anh" defaultValue={initialData?.hinh_anh || ''} placeholder="Dán link ảnh tại đây..." className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-bold text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder-slate-400" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
                      <FileText size={14} className="text-slate-400" /> Ghi Chú Phân Phối
                    </label>
                    <textarea name="ghi_chu" rows={1} defaultValue={initialData?.ghi_chu || ''} placeholder="Nhập ghi chú thêm..." className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-bold text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none placeholder-slate-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>

        <div className="px-6 py-4 border-t border-slate-200 bg-white flex items-center justify-between sticky bottom-0 z-10 shrink-0">
          <button type="button" onClick={handleClose} className="px-6 py-2.5 border border-slate-200 rounded-xl text-[14px] font-bold text-slate-600 hover:bg-slate-50 transition-all active:scale-95">
            Hủy bỏ
          </button>
          <button type="submit" form="nhaphang-form" disabled={loading} className="px-10 py-2.5 bg-blue-600 text-white rounded-xl text-[14px] font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/20 flex items-center gap-2.5 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
            <Plus size={20} />
            {loading ? 'Đang xử lý...' : initialData ? 'Cập nhật phiếu' : 'Bắt đầu khởi tạo'} <ChevronRight size={20} className="ml-0.5" />
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default NhapHangDialog;
