import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  ChevronRight, 
  Briefcase,
  Tag,
  Users,
  MapPin,
  Activity,
  AlertCircle,
  Plus
} from 'lucide-react';
import { clsx } from 'clsx';
import { supabase } from '../../../lib/supabase';

interface DuAnDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: any;
}

const DuAnDialog: React.FC<DuAnDialogProps> = ({ isOpen, onClose, onSuccess, initialData }) => {
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
      ma_du_an: formData.get('ma_du_an') as string,
      ten_du_an: formData.get('ten_du_an') as string,
      khach_hang: formData.get('khach_hang') as string,
      dia_chi: formData.get('dia_chi') as string,
      trang_thai: formData.get('trang_thai') as string,
    };

    try {
      if (initialData?.id) {
        const { error } = await supabase
          .from('du_an')
          .update(data)
          .eq('id', initialData.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('du_an')
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
            <div className="size-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-600 shadow-sm">
              <Briefcase size={22} />
            </div>
            <div>
              <h2 className="text-[17px] font-bold text-slate-900 leading-tight">
                {initialData ? 'Cập nhật thông tin dự án' : 'Khởi tạo dự án mới'}
              </h2>
              <p className="text-[11px] text-slate-500 font-medium tracking-tight">Vui lòng khai báo mã định danh và thông tin đối tác dự án</p>
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
        <form id="duan-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto no-scrollbar bg-[#f8fafc]/50">
          <div className="p-6 space-y-6">
            {error && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-[13px] animate-in fade-in slide-in-from-top-2">
                <AlertCircle size={18} />
                <span className="font-medium">{error}</span>
              </div>
            )}

            <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm space-y-5">
              <div className="flex items-center gap-2 mb-2">
                <div className="size-6 rounded-md bg-purple-500/10 flex items-center justify-center text-purple-600">
                  <Tag size={14} />
                </div>
                <h3 className="text-[12px] font-bold text-purple-600 uppercase tracking-wider">Thông tin dự án</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5 md:col-span-1">
                  <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
                    <Tag size={14} className="text-slate-400" /> Mã Dự Án <span className="text-red-500 font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    name="ma_du_an"
                    required
                    defaultValue={initialData?.ma_du_an || ''}
                    placeholder="Mã định danh..."
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-bold text-slate-900 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all placeholder-slate-400"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-1">
                  <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
                    <Activity size={14} className="text-slate-400" /> Trạng thái
                  </label>
                  <div className="relative">
                    <select
                      name="trang_thai"
                      defaultValue={initialData?.trang_thai || 'Đang triển khai'}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-bold text-slate-900 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all appearance-none cursor-pointer"
                    >
                      <option value="Đang triển khai">Đang triển khai</option>
                      <option value="Tạm dừng">Tạm dừng</option>
                      <option value="Đã hoàn thành">Đã hoàn thành</option>
                      <option value="Đã nghiệm thu">Đã nghiệm thu</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <ChevronRight size={18} className="rotate-90" />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
                    <Briefcase size={14} className="text-slate-400" /> Tên Dự Án <span className="text-red-500 font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    name="ten_du_an"
                    required
                    defaultValue={initialData?.ten_du_an || ''}
                    placeholder="Tên gọi chính thức của dự án..."
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-bold text-slate-900 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all placeholder-slate-400"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
                    <Users size={14} className="text-slate-400" /> Khách hàng / Chủ đầu tư
                  </label>
                  <input
                    type="text"
                    name="khach_hang"
                    defaultValue={initialData?.khach_hang || ''}
                    placeholder="Nhập tên đối tác quản lý dự án..."
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-bold text-slate-900 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all placeholder-slate-400"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
                    <MapPin size={14} className="text-slate-400" /> Địa chỉ triển khai
                  </label>
                  <input
                    type="text"
                    name="dia_chi"
                    defaultValue={initialData?.dia_chi || ''}
                    placeholder="Vị trí tọa lạc dự án..."
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-bold text-slate-900 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all placeholder-slate-400"
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
            form="duan-form"
            disabled={loading}
            className="px-10 py-2.5 bg-purple-600 text-white rounded-xl text-[14px] font-bold hover:bg-purple-700 shadow-lg shadow-purple-500/20 flex items-center gap-2.5 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={20} />
            {loading ? 'Đang lưu...' : initialData ? 'Cập nhật ngay' : 'Khởi tạo dự án'} 
            <ChevronRight size={20} className="ml-0.5" />
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default DuAnDialog;
