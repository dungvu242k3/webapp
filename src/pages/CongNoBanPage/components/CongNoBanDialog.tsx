import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

import { 
  X, 
  ChevronRight, 
  Receipt,
  Tag,
  DollarSign,
  Clock,
  MessageSquare,
  AlertCircle,
  Plus
} from 'lucide-react';
import { clsx } from 'clsx';
import { supabase } from '../../../lib/supabase';

interface CongNoBanDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: any;
}

const CongNoBanDialog: React.FC<CongNoBanDialogProps> = ({ isOpen, onClose, onSuccess, initialData }) => {
  const [isClosing, setIsClosing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) setIsClosing(false);
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
      id_ref: formData.get('id_ref') as string,
      so_tien: Number(formData.get('so_tien')),
      ghi_chu: formData.get('ghi_chu') as string,
      thoi_gian: formData.get('thoi_gian') as string || new Date().toISOString(),
    };

    try {
      if (initialData?.id) {
        const { error } = await supabase
          .from('cong_no_ban')
          .update(data)
          .eq('id', initialData.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('cong_no_ban')
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
          "relative w-full max-w-[550px] bg-white shadow-2xl rounded-2xl flex flex-col max-h-[90vh] overflow-hidden transition-all duration-300",
          isClosing ? "modal-out" : "modal-in"
        )}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-600">
              <Receipt size={22} />
            </div>
            <div>
              <h2 className="text-[17px] font-bold text-black leading-tight">
                {initialData ? 'Cập nhật nợ bán' : 'Lập phiếu nợ bán'}
              </h2>
              <p className="text-[11px] text-slate-900 font-medium">Theo dõi khoản nợ của khách hàng</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-slate-100 rounded-full text-black hover:text-red-600 transition-all font-bold"
          >
            <X size={22} />
          </button>
        </div>

        {/* Body */}
        <form id="congnoban-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto no-scrollbar bg-[#f8fafc]/50">
          <div className="p-6 space-y-6">
            {error && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-[13px] animate-in fade-in slide-in-from-top-2">
                <AlertCircle size={18} />
                <span className="font-medium">{error}</span>
              </div>
            )}

            {/* Section 1: Basic Info */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm space-y-5">
              <div className="flex items-center gap-2 mb-2">
                <div className="size-6 rounded-md bg-orange-500/10 flex items-center justify-center text-orange-600">
                  <Receipt size={14} />
                </div>
                <h3 className="text-[12px] font-bold text-orange-600 uppercase tracking-wider">Thông tin phiếu nợ</h3>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-1.5 col-span-2">
                  <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
                    <Tag size={14} className="text-slate-400" /> Mã Đơn hàng / Khách hàng <span className="text-red-500 font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    name="id_ref"
                    required
                    defaultValue={initialData?.id_ref || ''}
                    placeholder="Nhập mã đơn hàng hoặc tên khách hàng..."
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-bold text-slate-900 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all placeholder-slate-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
                    <DollarSign size={14} className="text-slate-400" /> Số tiền phải thu <span className="text-red-500 font-bold">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="so_tien"
                      required
                      defaultValue={initialData?.so_tien || ''}
                      placeholder="0"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-bold text-slate-900 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all placeholder-slate-400"
                    />
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-[14px]">₫</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
                    <Clock size={14} className="text-slate-400" /> Thời gian bán
                  </label>
                  <input
                    type="datetime-local"
                    name="thoi_gian"
                    defaultValue={initialData?.thoi_gian ? new Date(initialData.thoi_gian).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-bold text-slate-900 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Details */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm space-y-5">
              <div className="flex items-center gap-2 mb-2">
                <div className="size-6 rounded-md bg-orange-500/10 flex items-center justify-center text-orange-600">
                  <MessageSquare size={14} />
                </div>
                <h3 className="text-[12px] font-bold text-orange-600 uppercase tracking-wider">Chi tiết giao dịch</h3>
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
                  <MessageSquare size={14} className="text-slate-400" /> Ghi chú kèm theo
                </label>
                <textarea
                  name="ghi_chu"
                  rows={3}
                  defaultValue={initialData?.ghi_chu || ''}
                  placeholder="Nhập thông tin sản phẩm hoặc khách hàng..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-bold text-slate-900 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all resize-none placeholder-slate-400"
                />
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
            form="congnoban-form"
            disabled={loading}
            className="px-8 py-2.5 bg-orange-500 text-white rounded-xl text-[14px] font-bold hover:bg-orange-600 shadow-lg shadow-orange-500/20 flex items-center gap-2.5 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={20} />
            {loading ? 'Đang lưu...' : initialData ? 'Cập nhật ngay' : 'Tạo phiếu nợ'} 
            <ChevronRight size={20} className="ml-0.5" />
          </button>
        </div>
      </div>
    </div>,
    document.body
  );

};

export default CongNoBanDialog;
