import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  ChevronRight, 
  Truck,
  User,
  Phone,
  Scale,
  Activity,
  AlertCircle,
  Plus
} from 'lucide-react';
import { clsx } from 'clsx';
import { supabase } from '../../../lib/supabase';

interface DoiXeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: any;
}

const DoiXeDialog: React.FC<DoiXeDialogProps> = ({ isOpen, onClose, onSuccess, initialData }) => {
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
      bien_so_xe: formData.get('bien_so_xe') as string,
      ten_tai_xe: formData.get('ten_tai_xe') as string,
      so_dien_thoai: formData.get('so_dien_thoai') as string,
      trong_tai: Number(formData.get('trong_tai')),
      tinh_trang: formData.get('tinh_trang') as string,
    };

    try {
      if (initialData?.id) {
        const { error } = await supabase
          .from('doi_xe')
          .update(data)
          .eq('id', initialData.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('doi_xe')
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
            <div className="size-10 rounded-xl bg-slate-500/10 flex items-center justify-center text-slate-600 shadow-sm">
              <Truck size={22} />
            </div>
            <div>
              <h2 className="text-[17px] font-bold text-slate-900 leading-tight">
                {initialData ? 'Cập nhật thông tin xe' : 'Thêm xe vào danh bạ'}
              </h2>
              <p className="text-[11px] text-slate-500 font-medium tracking-tight">Vui lòng khai báo biển số và thông tin tài xế điều khiển</p>
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
        <form id="doixe-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto no-scrollbar bg-[#f8fafc]/50">
          <div className="p-6 space-y-6">
            {error && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-[13px] animate-in fade-in slide-in-from-top-2">
                <AlertCircle size={18} />
                <span className="font-medium">{error}</span>
              </div>
            )}

            <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm space-y-5">
              <div className="flex items-center gap-2 mb-2">
                <div className="size-6 rounded-md bg-slate-500/10 flex items-center justify-center text-slate-600">
                  <Truck size={14} />
                </div>
                <h3 className="text-[12px] font-bold text-slate-600 uppercase tracking-wider">Thông tin phương tiện</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
                    <Truck size={14} className="text-slate-400" /> Biển Số Xe <span className="text-red-500 font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    name="bien_so_xe"
                    required
                    defaultValue={initialData?.bien_so_xe || ''}
                    placeholder="VD: 29A-123.45"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-bold text-slate-900 focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 outline-none transition-all placeholder-slate-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
                    <Scale size={14} className="text-slate-400" /> Trọng Tải (Tấn)
                  </label>
                  <input
                    type="number"
                    name="trong_tai"
                    step="0.1"
                    defaultValue={initialData?.trong_tai || ''}
                    placeholder="VD: 3.5"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-bold text-slate-900 focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 outline-none transition-all placeholder-slate-400"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm space-y-5">
              <div className="flex items-center gap-2 mb-2">
                <div className="size-6 rounded-md bg-slate-500/10 flex items-center justify-center text-slate-600">
                  <User size={14} />
                </div>
                <h3 className="text-[12px] font-bold text-slate-600 uppercase tracking-wider">Thông tin tài xế</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5 md:col-span-2">
                  <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
                    <User size={14} className="text-slate-400" /> Tên Tài Xế <span className="text-red-500 font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    name="ten_tai_xe"
                    required
                    defaultValue={initialData?.ten_tai_xe || ''}
                    placeholder="Nhập họ và tên tài xế..."
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-bold text-slate-900 focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 outline-none transition-all placeholder-slate-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
                    <Phone size={14} className="text-slate-400" /> Số Điện Thoại
                  </label>
                  <input
                    type="text"
                    name="so_dien_thoai"
                    defaultValue={initialData?.so_dien_thoai || ''}
                    placeholder="09xx.xxx.xxx"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-bold text-slate-900 focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 outline-none transition-all placeholder-slate-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
                    <Activity size={14} className="text-slate-400" /> Tình Trạng
                  </label>
                  <div className="relative">
                    <select
                      name="tinh_trang"
                      defaultValue={initialData?.tinh_trang || 'Đang đợi'}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-bold text-slate-900 focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 outline-none transition-all appearance-none cursor-pointer"
                    >
                      <option value="Đang đợi">Đang đợi</option>
                      <option value="Đang xếp hàng">Đang xếp hàng</option>
                      <option value="Đang lấy hàng">Đang lấy hàng</option>
                      <option value="Đã hoàn tất">Đã hoàn tất</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <ChevronRight size={18} className="rotate-90" />
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
            form="doixe-form"
            disabled={loading}
            className="px-8 py-2.5 bg-slate-700 text-white rounded-xl text-[14px] font-bold hover:bg-slate-800 shadow-lg shadow-slate-500/20 flex items-center gap-2.5 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={20} />
            {loading ? 'Đang lưu...' : initialData ? 'Cập nhật' : 'Thêm phương tiện'} 
            <ChevronRight size={20} className="ml-0.5" />
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default DoiXeDialog;
