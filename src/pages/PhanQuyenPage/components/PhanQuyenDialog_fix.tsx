import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  ChevronRight, 
  ShieldCheck,
  Hash,
  Mail,
  User,
  Shield,
  Briefcase,
  AlertCircle,
  Plus
} from 'lucide-react';
import { clsx } from 'clsx';
import { supabase } from '../../../lib/supabase';

interface PhanQuyenDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: any;
}

const PhanQuyenDialog: React.FC<PhanQuyenDialogProps> = ({ isOpen, onClose, onSuccess, initialData }) => {
  const [isClosing, setIsClosing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) setIsClosing(false);
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
      id_phan_quyen: formData.get('id_phan_quyen') as string,
      email_nhan_vien: formData.get('email_nhan_vien') as string,
      ten_nhan_vien: formData.get('ten_nhan_vien') as string,
      vai_tro: formData.get('vai_tro') as string,
      ma_du_an_duoc_xem: formData.get('ma_du_an_duoc_xem') as string,
    };

    try {
      if (initialData?.id) {
        const { error } = await supabase
          .from('phan_quyen')
          .update(data)
          .eq('id', initialData.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('phan_quyen')
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
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-white sticky top-0 z-10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-600 shadow-sm">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h2 className="text-[17px] font-bold text-slate-900 leading-tight">
                {initialData ? 'Cập nhật phân quyền' : 'Thiết lập quyền mới'}
              </h2>
              <p className="text-[11px] text-slate-500 font-medium tracking-tight">Vui lòng chỉ định vai trò và mã dự án được phép truy cập</p>
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
        <form id="phanquyen-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto no-scrollbar bg-[#f8fafc]/50">
          <div className="p-6 space-y-6">
            {error && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-[13px] animate-in fade-in slide-in-from-top-2">
                <AlertCircle size={18} />
                <span className="font-medium">{error}</span>
              </div>
            )}

            <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm space-y-5">
              <div className="flex items-center gap-2 mb-2">
                <div className="size-6 rounded-md bg-red-500/10 flex items-center justify-center text-red-600">
                  <Hash size={14} />
                </div>
                <h3 className="text-[12px] font-bold text-red-600 uppercase tracking-wider">Thông tin tài khoản</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5 md:col-span-2">
                  <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
                    <Hash size={14} className="text-slate-400" /> ID Phân Quyền <span className="text-red-500 font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    name="id_phan_quyen"
                    required
                    defaultValue={initialData?.id_phan_quyen || ''}
                    placeholder="Mã định danh quyền (VD: PQ001)..."
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-bold text-slate-900 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all placeholder-slate-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
                    <Mail size={14} className="text-slate-400" /> Email Nhân Viên <span className="text-red-500 font-bold">*</span>
                  </label>
                  <input
                    type="email"
                    name="email_nhan_vien"
                    required
                    defaultValue={initialData?.email_nhan_vien || ''}
                    placeholder="example@company.com"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-bold text-slate-900 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all placeholder-slate-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
                    <User size={14} className="text-slate-400" /> Tên Nhân Viên <span className="text-red-500 font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    name="ten_nhan_vien"
                    required
                    defaultValue={initialData?.ten_nhan_vien || ''}
                    placeholder="Họ và tên..."
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-bold text-slate-900 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all placeholder-slate-400"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm space-y-5">
              <div className="flex items-center gap-2 mb-2">
                <div className="size-6 rounded-md bg-red-500/10 flex items-center justify-center text-red-600">
                  <Shield size={14} />
                </div>
                <h3 className="text-[12px] font-bold text-red-600 uppercase tracking-wider">Cấu hình vai trò</h3>
              </div>

              <div className="grid grid-cols-1 gap-5">
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
                    <Shield size={14} className="text-slate-400" /> Vai Trò <span className="text-red-500 font-bold">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="vai_tro"
                      required
                      defaultValue={initialData?.vai_tro || ''}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-bold text-slate-900 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all appearance-none cursor-pointer"
                    >
                      <option value="">Chọn vai trò...</option>
                      <option value="Admin">Admin</option>
                      <option value="Manager">Quản lý</option>
                      <option value="Editor">Biên tập viên</option>
                      <option value="Viewer">Người xem</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <ChevronRight size={18} className="rotate-90" />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
                    <Briefcase size={14} className="text-slate-400" /> Mã Dự Án Được Xem
                  </label>
                  <textarea
                    name="ma_du_an_duoc_xem"
                    rows={2}
                    defaultValue={initialData?.ma_du_an_duoc_xem || ''}
                    placeholder="Mã dự án (cách nhau bởi dấu phẩy)..."
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-bold text-slate-900 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all resize-none placeholder-slate-400"
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
            form="phanquyen-form"
            disabled={loading}
            className="px-8 py-2.5 bg-red-600 text-white rounded-xl text-[14px] font-bold hover:bg-red-700 shadow-lg shadow-red-500/20 flex items-center gap-2.5 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={20} />
            {loading ? 'Đang lưu...' : initialData ? 'Cập nhật' : 'Thiết lập quyền'} 
            <ChevronRight size={20} className="ml-0.5" />
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default PhanQuyenDialog;
