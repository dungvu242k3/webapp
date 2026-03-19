import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

import { 
  X, 
  ChevronRight, 
  Building2,
  Hash,
  CreditCard,
  Banknote,
  MapPin,
  Phone,
  AlertCircle,
  Plus
} from 'lucide-react';
import { clsx } from 'clsx';
import { supabase } from '../../../lib/supabase';

interface NhaCungCapDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: any;
}

const NhaCungCapDialog: React.FC<NhaCungCapDialogProps> = ({ isOpen, onClose, onSuccess, initialData }) => {
  const [isClosing, setIsClosing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 300);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      ma_ncc: formData.get('ma_ncc') as string,
      ten_ncc: formData.get('ten_ncc') as string,
      stk_ncc: formData.get('stk_ncc') as string,
      ma_ngan_hang_ncc: formData.get('ma_ngan_hang_ncc') as string,
      dia_chi: formData.get('dia_chi') as string,
      sdt: formData.get('sdt') as string,
    };

    try {
      if (initialData?.id) {
        const { error } = await supabase
          .from('nha_cung_cap')
          .update(data)
          .eq('id', initialData.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('nha_cung_cap')
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
      <div className={clsx("absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300", isClosing ? "opacity-0" : "opacity-100")} onClick={handleClose} />
      <div className={clsx("relative w-full max-w-[700px] bg-white shadow-2xl rounded-2xl flex flex-col transition-all duration-300", isClosing ? "modal-out" : "modal-in")}>
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-600">
              <Building2 size={22} />
            </div>
            <div>
              <h2 className="text-[17px] font-bold text-black leading-tight">{initialData ? 'Cập nhật nhà cung cấp' : 'Thêm nhà cung cấp mới'}</h2>
              <p className="text-[11px] text-slate-900 font-medium">Khai báo thông tin đối tác cung ứng và tài khoản thanh toán</p>
            </div>
          </div>
          <button onClick={handleClose} className="p-2 hover:bg-slate-100 rounded-full text-black hover:text-red-600 transition-all font-bold"><X size={22} /></button>
        </div>

        <form id="nhacungcap-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto no-scrollbar bg-[#f8fafc]/50">
          <div className="p-6 space-y-6">
            {error && <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-[13px] animate-in fade-in slide-in-from-top-2"><AlertCircle size={18} /><span className="font-medium">{error}</span></div>}
            
            {/* Section 1: Basic Info */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm space-y-5">
              <div className="flex items-center gap-2 mb-2">
                <div className="size-6 rounded-md bg-teal-500/10 flex items-center justify-center text-teal-600">
                  <Building2 size={14} />
                </div>
                <h3 className="text-[12px] font-bold text-teal-600 uppercase tracking-wider">Thông tin đối tác</h3>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
                    <Hash size={14} className="text-slate-400" /> Mã NCC <span className="text-red-500 font-bold">*</span>
                  </label>
                  <input type="text" name="ma_ncc" required defaultValue={initialData?.ma_ncc || ''} placeholder="Mã định danh đối tác..." className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-bold text-slate-900 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all placeholder-slate-400" />
                </div>
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
                    <Building2 size={14} className="text-slate-400" /> Tên NCC <span className="text-red-500 font-bold">*</span>
                  </label>
                  <input type="text" name="ten_ncc" required defaultValue={initialData?.ten_ncc || ''} placeholder="Tên công ty/Cá nhân..." className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-bold text-slate-900 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all placeholder-slate-400" />
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
                    <CreditCard size={14} className="text-slate-400" /> Số TK NCC
                  </label>
                  <input type="text" name="stk_ncc" defaultValue={initialData?.stk_ncc || ''} placeholder="Số tài khoản ngân hàng..." className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-bold text-slate-900 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all placeholder-slate-400" />
                </div>
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
                    <Banknote size={14} className="text-slate-400" /> Mã Ngân Hàng
                  </label>
                  <input type="text" name="ma_ngan_hang_ncc" defaultValue={initialData?.ma_ngan_hang_ncc || ''} placeholder="Mã ngân hàng (Swift/Citibank)..." className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-bold text-slate-900 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all placeholder-slate-400" />
                </div>
              </div>
            </div>

            {/* Section 2: Contact */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm space-y-5">
              <div className="flex items-center gap-2 mb-2">
                <div className="size-6 rounded-md bg-teal-500/10 flex items-center justify-center text-teal-600">
                  <Phone size={14} />
                </div>
                <h3 className="text-[12px] font-bold text-teal-600 uppercase tracking-wider">Thông tin liên hệ</h3>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-1.5 col-span-2">
                  <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
                    <MapPin size={14} className="text-slate-400" /> Địa chỉ trụ sở
                  </label>
                  <input type="text" name="dia_chi" defaultValue={initialData?.dia_chi || ''} placeholder="Địa chỉ trụ sở/Giao dịch..." className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-bold text-slate-900 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all placeholder-slate-400" />
                </div>
                <div className="space-y-1.5 col-span-2">
                  <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
                    <Phone size={14} className="text-slate-400" /> Số điện thoại liên lạc
                  </label>
                  <input type="text" name="sdt" defaultValue={initialData?.sdt || ''} placeholder="Số điện thoại liên hệ..." className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-bold text-slate-900 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all placeholder-slate-400" />
                </div>
              </div>
            </div>
          </div>
        </form>

        <div className="px-6 py-4 border-t border-slate-200 bg-white flex items-center justify-between sticky bottom-0 z-10 shrink-0">
          <button type="button" onClick={handleClose} className="px-6 py-2.5 border border-slate-200 rounded-xl text-[14px] font-bold text-slate-600 hover:bg-slate-50 transition-all active:scale-95">Hủy bỏ</button>
          <button type="submit" form="nhacungcap-form" disabled={loading} className="px-8 py-2.5 bg-teal-600 text-white rounded-xl text-[14px] font-bold hover:bg-teal-700 shadow-lg shadow-teal-500/20 flex items-center gap-2.5 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
            <Plus size={20} />
            {loading ? 'Đang lưu...' : initialData ? 'Cập nhật' : 'Hoàn tất'} <ChevronRight size={20} className="ml-0.5" />
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default NhaCungCapDialog;

