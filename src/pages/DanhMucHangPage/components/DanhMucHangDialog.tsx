import React from 'react';
import { createPortal } from 'react-dom';
import { X, Package, FileEdit, FileText, Tag, Layers, Scale, DollarSign, Image as ImageIcon, MessageSquare, ChevronRight, Plus } from 'lucide-react';
import { clsx } from 'clsx';

export interface DanhMucHangFormData {
  ma_hang: string;
  ten_hang: string;
  dvt_chinh: string;
  dvt_phu: string;
  ty_trong: string;
  gia_nhap: string;
  gia_ban: string;
  ghi_chu: string;
  hinh_anh: string;
}

interface Props {
  isOpen: boolean;
  isClosing: boolean;
  isEditMode: boolean;
  onClose: () => void;
  onSubmit: (data: DanhMucHangFormData) => void;
  initialData?: DanhMucHangFormData | null;
}

const DanhMucHangDialog: React.FC<Props> = ({
  isOpen,
  isClosing,
  isEditMode,
  onClose,
  onSubmit,
  initialData,
}) => {
  if (!isOpen && !isClosing) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onSubmit({
      ma_hang: formData.get('ma_hang') as string || '',
      ten_hang: formData.get('ten_hang') as string || '',
      dvt_chinh: formData.get('dvt_chinh') as string || '',
      dvt_phu: formData.get('dvt_phu') as string || '',
      ty_trong: formData.get('ty_trong') as string || '',
      gia_nhap: formData.get('gia_nhap') as string || '',
      gia_ban: formData.get('gia_ban') as string || '',
      ghi_chu: formData.get('ghi_chu') as string || '',
      hinh_anh: formData.get('hinh_anh') as string || '',
    });
  };

  return createPortal(
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 sm:p-6">
      <div
        className={clsx(
          'fixed inset-0 bg-black/40 backdrop-blur-sm transition-all duration-350 ease-out',
          isClosing ? 'opacity-0' : 'animate-in fade-in duration-300'
        )}
        onClick={onClose}
      />
      <div
        className={clsx(
          'relative w-full max-w-[800px] bg-[#f0f2f5] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden rounded-2xl border border-slate-200',
          isClosing ? 'modal-out' : 'modal-in'
        )}
      >
        {/* Header matching sample */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-white sticky top-0 z-10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 shadow-sm">
              {isEditMode ? <FileEdit size={22} /> : <FileText size={22} />}
            </div>
            <div>
              <h2 className="text-[17px] font-bold text-slate-900 leading-tight">
                {isEditMode ? 'Cập nhật thông tin hàng hóa' : 'Thêm hàng hóa mới'}
              </h2>
              <p className="text-[11px] text-slate-500 font-medium tracking-tight">Vui lòng điền đầy đủ các thông tin có dấu (*)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-red-600 transition-all font-bold"
          >
            <X size={22} />
          </button>
        </div>

        {/* Scrollable Form Area */}
        <form id="danhmuchang-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto no-scrollbar bg-[#f8fafc]/50">
          <div className="p-6 space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm space-y-5">
              <div className="flex items-center gap-2 mb-2">
                <div className="size-6 rounded-md bg-amber-500/10 flex items-center justify-center text-amber-600">
                  <Package size={14} />
                </div>
                <h3 className="text-[12px] font-bold text-amber-600 uppercase tracking-wider">Thông tin cơ bản</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
                    <Tag size={14} className="text-slate-400" /> Mã hàng
                  </label>
                  <input
                    type="text"
                    name="ma_hang"
                    defaultValue={initialData?.ma_hang || ''}
                    placeholder="Nhập mã hàng..."
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-bold text-slate-900 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all placeholder-slate-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
                    <FileText size={14} className="text-slate-400" /> Tên hàng <span className="text-red-500 font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    name="ten_hang"
                    required
                    defaultValue={initialData?.ten_hang || ''}
                    placeholder="Nhập tên sản phẩm..."
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-bold text-slate-900 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all placeholder-slate-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
                    <Layers size={14} className="text-slate-400" /> ĐVT Chính <span className="text-red-500 font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    name="dvt_chinh"
                    required
                    defaultValue={initialData?.dvt_chinh || ''}
                    placeholder="Cái, Tấn, Kg..."
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-bold text-slate-900 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all placeholder-slate-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
                    <Layers size={14} className="text-slate-400" /> ĐVT Phụ
                  </label>
                  <input
                    type="text"
                    name="dvt_phu"
                    defaultValue={initialData?.dvt_phu || ''}
                    placeholder="m³, Lít..."
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-bold text-slate-900 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all placeholder-slate-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
                    <Scale size={14} className="text-slate-400" /> Tỷ trọng (Hệ số)
                  </label>
                  <input
                    type="number"
                    name="ty_trong"
                    step="0.01"
                    defaultValue={initialData?.ty_trong || ''}
                    placeholder="VD: 1.5"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-bold text-slate-900 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all placeholder-slate-400"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm space-y-5">
              <div className="flex items-center gap-2 mb-2">
                <div className="size-6 rounded-md bg-amber-500/10 flex items-center justify-center text-amber-600">
                  <DollarSign size={14} />
                </div>
                <h3 className="text-[12px] font-bold text-amber-600 uppercase tracking-wider">Thông tin giá</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
                    Giá nhập (VNĐ)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="gia_nhap"
                      defaultValue={initialData?.gia_nhap || ''}
                      placeholder="0"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-bold text-slate-900 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all font-mono"
                    />
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₫</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
                    Giá bán (VNĐ)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="gia_ban"
                      defaultValue={initialData?.gia_ban || ''}
                      placeholder="0"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-bold text-blue-600 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all font-mono"
                    />
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₫</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm space-y-5">
              <div className="flex items-center gap-2 mb-2">
                <div className="size-6 rounded-md bg-amber-500/10 flex items-center justify-center text-amber-600">
                  <MessageSquare size={14} />
                </div>
                <h3 className="text-[12px] font-bold text-amber-600 uppercase tracking-wider">Mô tả & Hình ảnh</h3>
              </div>
              <div className="space-y-5">
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
                    Ghi chú chi tiết
                  </label>
                  <textarea
                    name="ghi_chu"
                    rows={2}
                    defaultValue={initialData?.ghi_chu || ''}
                    placeholder="Mô tả sản phẩm..."
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-bold text-slate-900 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all resize-none placeholder-slate-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
                    Hình ảnh (URL)
                  </label>
                  <div className="relative">
                    <ImageIcon size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      name="hinh_anh"
                      defaultValue={initialData?.hinh_anh || ''}
                      placeholder="URL hình ảnh..."
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-bold text-slate-900 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all placeholder-slate-400"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Footer matching sample */}
        <div className="px-6 py-4 bg-white border-t border-slate-200 shrink-0 flex items-center justify-between sticky bottom-0 z-10">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 border border-slate-200 rounded-xl text-[14px] font-bold text-slate-600 hover:bg-slate-50 transition-all active:scale-95"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            form="danhmuchang-form"
            className="px-8 py-2.5 bg-amber-600 text-white rounded-xl text-[14px] font-bold hover:bg-amber-700 shadow-lg shadow-amber-500/20 flex items-center gap-2.5 active:scale-95 transition-all"
          >
            <Plus size={20} />
            {isEditMode ? 'Cập nhật' : 'Thêm hàng hóa'} <ChevronRight size={20} className="ml-0.5" />
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default DanhMucHangDialog;
