-- Create the xuat_hang table
CREATE TABLE IF NOT EXISTS public.xuat_hang (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    ma_xuat TEXT NOT NULL, -- ID Xuất
    id_nhap_ref UUID REFERENCES public.nhap_hang(id), -- ID Nhập REF
    ma_du_an TEXT, -- Mã Dự Án
    khach_hang TEXT, -- Khách hàng
    ma_kho TEXT, -- Mã Kho
    ma_dia_chi_ban TEXT, -- Mã Địa Chỉ Bán
    ma_xe_xuat TEXT, -- Mã Xe Xuất
    ma_dvvc_xuat TEXT, -- Mã DVVC Xuất
    phi_van_chuyen DECIMAL(15, 2) DEFAULT 0, -- Phí Vận Chuyển
    ghi_chu TEXT, -- Ghi Chú
    hinh_anh TEXT, -- Hình Ảnh (URL/Path)
    nhan_vien_xuat TEXT, -- Nhân Viên Xuất
    ngay_gio TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()), -- Ngày Giờ
    is_pinned BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.xuat_hang ENABLE ROW LEVEL SECURITY;

-- Allow public access (Read/Write) - Adjust for production
CREATE POLICY "Allow public access to xuat_hang" ON public.xuat_hang
    FOR ALL
    USING (true)
    WITH CHECK (true);
