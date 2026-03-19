import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

import { 
  X, 
  ChevronRight, 
  MapPin,
  Hash,
  AlertCircle,
  Plus
} from 'lucide-react';
import { clsx } from 'clsx';
import { supabase } from '../../../lib/supabase';

interface DiaChiMuaDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: any;
}

const DiaChiMuaDialog: React.FC<DiaChiMuaDialogProps> = ({ isOpen, onClose, onSuccess, initialData }) => {
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
      ma_dia_chi_mua: formData.get('ma_dia_chi_mua') as string,
      dia_chi_mua: formData.get('dia_chi_mua') as string,
    };

    try {
      if (initialData?.id) {
        const { error } = await supabase
          .from('dia_chi_mua')
          .update(data)
          .eq('id', initialData.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('dia_chi_mua')
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
      <div className={clsx("relative w-full max-w-[500px] bg-white shadow-2xl rounded-2xl flex flex-col transition-all duration-300", isClosing ? "modal-out" : "modal-in")}>
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-600">
              <MapPin size={22} />
            </div>
            <div>
              <h2 className="text-[17px] font-bold text-black leading-tight">{initialData ? 'Cập nhật địa chỉ mua' : 'Thêm địa chỉ mua mới'}</h2>
              <p className="text-[11px] text-slate-900 font-medium">Khai báo thông tin địa điểm thu mua và giao dịch hàng hóa</p>
            </div>
          </div>
          <button onClick={handleClose} className="p-2 hover:bg-slate-100 rounded-full text-black hover:text-red-600 transition-all font-bold"><X size={22} /></button>
        </div>

        <form id="diachimua-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto no-scrollbar bg-[#f8fafc]/50">
          <div className="p-6 space-y-6">
            {error && <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-[13px] animate-in fade-in slide-in-from-top-2"><AlertCircle size={18} /><span className="font-medium">{error}</span></div>}
            
            <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm space-y-5">
              <div className="flex items-center gap-2 mb-2">
                <div className="size-6 rounded-md bg-orange-500/10 flex items-center justify-center text-orange-600">
                  <MapPin size={14} />
                </div>
                <h3 className="text-[12px] font-bold text-orange-600 uppercase tracking-wider">Thông tin địa chỉ</h3>
              </div>

              <div className="grid grid-cols-1 gap-5">
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
                    <Hash size={14} className="text-slate-400" /> ID Định danh <span className="text-red-500 font-bold">*</span>
                  </label>
                  <input 
                    type="text" 
                    name="ma_dia_chi_mua" 
                    required 
                    defaultValue={initialData?.ma_dia_chi_mua || ''} 
                    placeholder="Mã định danh địa chỉ..." 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-bold text-slate-900 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all placeholder-slate-400" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
                    <MapPin size={14} className="text-slate-400" /> Địa chỉ chi tiết <span className="text-red-500 font-bold">*</span>
                  </label>
                  <input 
                    type="text" 
                    name="dia_chi_mua" 
                    required 
                    defaultValue={initialData?.dia_chi_mua || ''} 
                    placeholder="Tên đường, phường/xã, quận/huyện..." 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-bold text-slate-900 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all placeholder-slate-400" 
                  />
                </div>
              </div>
            </div>
          </div>
        </form>

        <div className="px-6 py-4 border-t border-slate-200 bg-white flex items-center justify-between sticky bottom-0 z-10 shrink-0">
          <button type="button" onClick={handleClose} className="px-6 py-2.5 border border-slate-200 rounded-xl text-[14px] font-bold text-slate-600 hover:bg-slate-50 transition-all active:scale-95">Hủy bỏ</button>
          <button type="submit" form="diachimua-form" disabled={loading} className="px-8 py-2.5 bg-orange-600 text-white rounded-xl text-[14px] font-bold hover:bg-orange-700 shadow-lg shadow-orange-500/20 flex items-center gap-2.5 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
            <Plus size={20} />
            {loading ? 'Đang lưu...' : initialData ? 'Cập nhật' : 'Tạo địa chỉ'} <ChevronRight size={20} className="ml-0.5" />
          </button>
        </div>
      </div>
    </div>,
    document.body
  );

};

export default DiaChiMuaDialog;
