import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  ChevronRight, 
  Plus, 
  AlertCircle, 
  Package,
  Link,
  Warehouse,
  Activity,
  Scale,
  Hash,
  Box,
  DollarSign,
  FileText
} from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { clsx } from 'clsx';

interface NhapHangChiTietDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  receipts: any[];
  initialData?: any;
}

const NhapHangChiTietDialog = ({ isOpen, onClose, onSuccess, receipts, initialData }: NhapHangChiTietDialogProps) => {
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
      id_ref: formData.get('id_ref'),
      ma_hang: formData.get('ma_hang'),
      kho: formData.get('kho'),
      hanh_dong: formData.get('hanh_dong'),
      loai_nhap_so: formData.get('loai_nhap_so'),
      ty_trong_luu: parseFloat(formData.get('ty_trong_luu') as string) || 0,
      so_luong_tan: parseFloat(formData.get('so_luong_tan') as string) || 0,
      so_luong_m3: parseFloat(formData.get('so_luong_m3') as string) || 0,
      don_gia_vnd: parseFloat(formData.get('don_gia_vnd') as string) || 0,
    };

    try {
      if (initialData) {
        const { error: updateError } = await supabase
          .from('nhap_hang_chi_tiet')
          .update(data)
          .eq('id', initialData.id);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('nhap_hang_chi_tiet')
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
          "relative w-full max-w-[800px] bg-white shadow-2xl rounded-2xl flex flex-col max-h-[90vh] overflow-hidden transition-all duration-300",
          isClosing ? "modal-out" : "modal-in"
        )}
      >
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 shadow-sm">
              <FileText size={22} />
            </div>
            <div>
              <h2 className="text-[17px] font-bold text-slate-900 leading-tight">
                {initialData ? 'Cập nhật chi tiết mặt hàng' : 'Thêm mặt hàng vào phiếu nhập'}
              </h2>
              <p className="text-[11px] text-slate-500 font-medium tracking-tight">Khai báo khối lượng, quy cách và đơn giá nhập hàng</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-red-600 transition-all"
          >
            <X size={22} />
          </button>
        </div>

        <form id="nhaphangct-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto no-scrollbar bg-[#f8fafc]/50">
          <div className="p-6 space-y-6">
            {error && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-[13px] animate-in fade-in slide-in-from-top-2">
                <AlertCircle size={18} />
                <span className="font-medium">{error}</span>
              </div>
            )}

            <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm space-y-5">
              <div className="flex items-center gap-2 mb-2">
                <div className="size-6 rounded-md bg-indigo-500/10 flex items-center justify-center text-indigo-600">
                  <Package size={14} />
                </div>
                <h3 className="text-[12px] font-bold text-indigo-600 uppercase tracking-wider">Thông tin hàng hóa</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
                    <Link size={14} className="text-slate-400" /> ID Ref (Phiếu nhập) <span className="text-red-500 font-bold">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="id_ref"
                      required
                      defaultValue={initialData?.id_ref || ''}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all appearance-none cursor-pointer"
                    >
                      <option value="">Chọn phiếu nhập...</option>
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
                    <Package size={14} className="text-slate-400" /> Mã Hàng <span className="text-red-500 font-bold">*</span>
                  </label>
                  <input type="text" name="ma_hang" required defaultValue={initialData?.ma_hang || ''} placeholder="Mã hàng hóa..." className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder-slate-400" />
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
                    <Warehouse size={14} className="text-slate-400" /> Kho <span className="text-red-500 font-bold">*</span>
                  </label>
                  <input type="text" name="kho" required defaultValue={initialData?.kho || ''} placeholder="Tên/Mã kho..." className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder-slate-400" />
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
                    <Activity size={14} className="text-slate-400" /> Hành động
                  </label>
                  <input type="text" name="hanh_dong" defaultValue={initialData?.hanh_dong || ''} placeholder="Nhập hành động..." className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder-slate-400" />
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm space-y-5">
              <div className="flex items-center gap-2 mb-2">
                <div className="size-6 rounded-md bg-indigo-500/10 flex items-center justify-center text-indigo-600">
                  <Scale size={14} />
                </div>
                <h3 className="text-[12px] font-bold text-indigo-600 uppercase tracking-wider">Khối lượng & Đơn giá</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
                    <Hash size={14} className="text-slate-400" /> Loại nhập số
                  </label>
                  <input type="text" name="loai_nhap_so" defaultValue={initialData?.loai_nhap_so || ''} placeholder="VD: Tấn, m3..." className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder-slate-400" />
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
                    <Scale size={14} className="text-slate-400" /> Tỷ Trọng (Lưu)
                  </label>
                  <input type="number" step="0.0001" name="ty_trong_luu" defaultValue={initialData?.ty_trong_luu || 0} placeholder="0.0000" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder-slate-400" />
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
                    <Box size={14} className="text-slate-400" /> Số Lượng (Tấn)
                  </label>
                  <input type="number" step="0.001" name="so_luong_tan" defaultValue={initialData?.so_luong_tan || 0} placeholder="0.000" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder-slate-400" />
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
                    <Box size={14} className="text-slate-400" /> Số Lượng (m3)
                  </label>
                  <input type="number" step="0.001" name="so_luong_m3" defaultValue={initialData?.so_luong_m3 || 0} placeholder="0.000" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder-slate-400" />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
                    <DollarSign size={14} className="text-slate-400" /> Đơn giá (VND)
                  </label>
                  <div className="relative">
                    <input type="number" name="don_gia_vnd" defaultValue={initialData?.don_gia_vnd || 0} placeholder="0" className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-bold text-indigo-600 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder-slate-400" />
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-[14px]">₫</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>

        <div className="px-6 py-4 border-t border-slate-200 bg-white flex items-center justify-between sticky bottom-0 z-10 shrink-0">
          <button
            type="button"
            onClick={handleClose}
            className="px-6 py-2.5 border border-slate-200 rounded-xl text-[14px] font-bold text-slate-600 hover:bg-slate-50 transition-all active:scale-95"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            form="nhaphangct-form"
            disabled={loading}
            className="px-8 py-2.5 bg-indigo-600 text-white rounded-xl text-[14px] font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 flex items-center gap-2.5 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={20} />
            {loading ? 'Đang lưu...' : initialData ? 'Cập nhật' : 'Thêm chi tiết'} 
            <ChevronRight size={20} className="ml-0.5" />
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default NhapHangChiTietDialog;
