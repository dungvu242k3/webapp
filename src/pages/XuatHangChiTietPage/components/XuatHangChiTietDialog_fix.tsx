import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  ChevronRight, 
  Plus, 
  AlertCircle, 
  Hash,
  Link,
  Package,
  Warehouse,
  Scale,
  Activity,
  Box,
  Database,
  DollarSign
} from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { clsx } from 'clsx';

interface XuatHangChiTietDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  issues: any[];
  initialData?: any;
}

const XuatHangChiTietDialog = ({ isOpen, onClose, onSuccess, issues, initialData }: XuatHangChiTietDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [tyTrong, setTyTrong] = useState(initialData?.ty_trong || 0);

  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
      setError(null);
      setTyTrong(initialData?.ty_trong || 0);
    }
  }, [isOpen, initialData]);

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
      ma_ct: formData.get('ma_ct'),
      id_ref: formData.get('id_ref'),
      ma_hang: formData.get('ma_hang'),
      kho: formData.get('kho'),
      hanh_dong: formData.get('hanh_dong'),
      ty_trong: parseFloat(formData.get('ty_trong') as string) || 0,
      so_luong_tan: parseFloat(formData.get('so_luong_tan') as string) || 0,
      so_luong_m3: parseFloat(formData.get('so_luong_m3') as string) || 0,
      su_dung_ton_tu: formData.get('su_dung_ton_tu'),
      don_gia: parseFloat(formData.get('don_gia') as string) || 0,
    };

    try {
      if (initialData) {
        const { error: updateError } = await supabase
          .from('issue_items')
          .update(data)
          .eq('id', initialData.id);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('issue_items')
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
          "relative w-full max-w-[850px] bg-white shadow-2xl rounded-2xl flex flex-col max-h-[90vh] overflow-hidden transition-all duration-300",
          isClosing ? "modal-out" : "modal-in"
        )}
      >
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-600 shadow-sm">
              <Package size={22} />
            </div>
            <div>
              <h2 className="text-[17px] font-bold text-slate-900 leading-tight">
                {initialData ? 'Cập nhật chi tiết xuất hàng' : 'Thêm mặt hàng vào phiếu xuất'}
              </h2>
              <p className="text-[11px] text-slate-500 font-medium tracking-tight">Khai báo khối lượng, quy cách và đơn giá xuất hàng</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-red-600 transition-all font-bold"
          >
            <X size={22} />
          </button>
        </div>

        <form id="xuathangct-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto no-scrollbar bg-[#f8fafc]/50">
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
                  <div className="size-6 rounded-md bg-cyan-500/10 flex items-center justify-center text-cyan-600">
                    <Hash size={14} />
                  </div>
                  <h3 className="text-[12px] font-bold text-cyan-600 uppercase tracking-wider">Thông tin định danh</h3>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
                      <Hash size={14} className="text-slate-400" /> ID Chi tiết <span className="text-red-500 font-bold">*</span>
                    </label>
                    <input type="text" name="ma_ct" required defaultValue={initialData?.ma_ct || ''} placeholder="Mã dòng chi tiết..." className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-bold text-slate-900 focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all placeholder-slate-400" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
                      <Link size={14} className="text-slate-400" /> Liên kết Phiếu Xuất <span className="text-red-500 font-bold">*</span>
                    </label>
                    <div className="relative">
                      <select name="id_ref" required defaultValue={initialData?.id_ref || ''} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-bold text-slate-900 focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all appearance-none cursor-pointer">
                        <option value="">Chọn phiếu xuất...</option>
                        {issues.map(i => <option key={i.id} value={i.id}>{i.ma_xuat}</option>)}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <ChevronRight size={18} className="rotate-90" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
                        <Package size={14} className="text-slate-400" /> Mã Hàng
                      </label>
                      <input type="text" name="ma_hang" defaultValue={initialData?.ma_hang || ''} placeholder="Mã SP..." className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-bold text-slate-900 focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all placeholder-slate-400" />
                    </div>

                    <div className="space-y-1.5">
                      <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
                        <Warehouse size={14} className="text-slate-400" /> Kho xuất
                      </label>
                      <input type="text" name="kho" defaultValue={initialData?.kho || ''} placeholder="Kho..." className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-bold text-slate-900 focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all placeholder-slate-400" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm space-y-5">
                <div className="flex items-center gap-2 mb-2">
                  <div className="size-6 rounded-md bg-cyan-500/10 flex items-center justify-center text-cyan-600">
                    <Scale size={14} />
                  </div>
                  <h3 className="text-[12px] font-bold text-cyan-600 uppercase tracking-wider">Khối lượng & Đơn giá</h3>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
                        <Activity size={14} className="text-slate-400" /> Hành động
                      </label>
                      <input type="text" name="hanh_dong" defaultValue={initialData?.hanh_dong || ''} placeholder="Lý do xuất..." className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-bold text-slate-900 focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all placeholder-slate-400" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
                        <Scale size={14} className="text-slate-400" /> Tỷ Trọng
                      </label>
                      <input type="number" step="0.0001" name="ty_trong" value={tyTrong} onChange={(e) => setTyTrong(parseFloat(e.target.value) || 0)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-bold text-slate-900 focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
                        <Box size={14} className="text-slate-400" /> Số Lượng (Tấn)
                      </label>
                      <input type="number" step="0.001" name="so_luong_tan" defaultValue={initialData?.so_luong_tan || 0} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-bold text-slate-900 focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
                        <Box size={14} className="text-slate-400" /> Số Lượng (m3)
                      </label>
                      <input type="number" step="0.001" name="so_luong_m3" defaultValue={initialData?.so_luong_m3 || 0} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-bold text-slate-900 focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
                        <Database size={14} className="text-slate-400" /> Sử dụng tồn từ
                      </label>
                      <input type="text" name="su_dung_ton_tu" defaultValue={initialData?.su_dung_ton_tu || ''} placeholder="Lô/Ngày..." className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-bold text-slate-900 focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all placeholder-slate-400" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
                        <DollarSign size={14} className="text-slate-400" /> Đơn giá (VND)
                      </label>
                      <div className="relative">
                        <input type="number" name="don_gia" defaultValue={initialData?.don_gia || 0} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-bold text-cyan-600 focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all" />
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-[14px]">₫</span>
                      </div>
                    </div>
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
            form="xuathangct-form"
            disabled={loading}
            className="px-8 py-2.5 bg-cyan-600 text-white rounded-xl text-[14px] font-bold hover:bg-cyan-700 shadow-lg shadow-cyan-500/20 flex items-center gap-2.5 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={20} />
            {loading ? 'Đang lưu...' : initialData ? 'Cập nhật' : 'Hoàn tất dòng hàng'}
            <ChevronRight size={20} className="ml-0.5" />
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default XuatHangChiTietDialog;
