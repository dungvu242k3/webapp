import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  ChevronRight, 
  Wallet,
  Hash,
  Link,
  DollarSign,
  AlertCircle,
  Plus
} from 'lucide-react';
import { clsx } from 'clsx';
import { supabase } from '../../../lib/supabase';

interface ThanhToanNhapDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: any;
}

const ThanhToanNhapDialog: React.FC<ThanhToanNhapDialogProps> = ({ isOpen, onClose, onSuccess, initialData }) => {
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

  const fetchReceipts = async () => {
    const { data: res } = await supabase.from('nhap_hang').select('id, so_phieu').order('created_at', { ascending: false });
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
      ma_thanh_toan: formData.get('ma_thanh_toan') as string,
      id_ref: formData.get('id_ref') as string,
      so_tien: parseFloat(formData.get('so_tien') as string) || 0,
    };

    try {
      if (initialData?.id) {
        const { error } = await supabase
          .from('thanh_toan_nhap')
          .update(data)
          .eq('id', initialData.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('thanh_toan_nhap')
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
          "relative w-full max-w-[500px] bg-white shadow-2xl rounded-2xl flex flex-col max-h-[90vh] overflow-hidden transition-all duration-300",
          isClosing ? "modal-out" : "modal-in"
        )}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-white sticky top-0 z-10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 shadow-sm">
              <Wallet size={22} />
            </div>
            <div>
              <h2 className="text-[17px] font-bold text-slate-900 leading-tight">
                {initialData ? 'Cập nhật thanh toán' : 'Ghi nhận thanh toán mới'}
              </h2>
              <p className="text-[11px] text-slate-500 font-medium tracking-tight">Đối soát và chi trả tiền hàng cho nhà cung cấp</p>
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
        <form id="paynhap-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto no-scrollbar bg-[#f8fafc]/50">
          <div className="p-6 space-y-6">
            {error && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-[13px] animate-in fade-in slide-in-from-top-2">
                <AlertCircle size={18} />
                <span className="font-medium">{error}</span>
              </div>
            )}

            <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm space-y-5">
              <div className="flex items-center gap-2 mb-2">
                <div className="size-6 rounded-md bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                  <Hash size={14} />
                </div>
                <h3 className="text-[12px] font-bold text-emerald-600 uppercase tracking-wider">Chứng từ thanh toán</h3>
              </div>

              <div className="grid grid-cols-1 gap-5">
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
                    <Hash size={14} className="text-slate-400" /> ID Thanh toán <span className="text-red-500 font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    name="ma_thanh_toan"
                    required
                    defaultValue={initialData?.ma_thanh_toan || ''}
                    placeholder="Mã chứng từ chi..."
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all placeholder-slate-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
                    <Link size={14} className="text-slate-400" /> Liên kết Phiếu Nhập (REF) <span className="text-red-500 font-bold">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="id_ref"
                      required
                      defaultValue={initialData?.id_ref || ''}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all appearance-none cursor-pointer"
                    >
                      <option value="">Chọn phiếu nhập liên quan...</option>
                      {receipts.map(r => (
                        <option key={r.id} value={r.id}>{r.so_phieu}</option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <ChevronRight size={18} className="rotate-90" />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
                    <DollarSign size={14} className="text-slate-400" /> Số Tiền (VND) <span className="text-red-500 font-bold">*</span>
                  </label>
                  <input
                    type="number"
                    name="so_tien"
                    required
                    defaultValue={initialData?.so_tien || 0}
                    placeholder="0"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all placeholder-slate-400 font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
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
            form="paynhap-form"
            disabled={loading}
            className="px-8 py-2.5 bg-emerald-600 text-white rounded-xl text-[14px] font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-500/20 flex items-center gap-2.5 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={20} />
            {loading ? 'Đang lưu...' : initialData ? 'Cập nhật' : 'Xác nhận chi'} 
            <ChevronRight size={20} className="ml-0.5" />
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ThanhToanNhapDialog;
