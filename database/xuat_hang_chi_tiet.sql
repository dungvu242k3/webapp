-- Create the xuat_hang_chi_tiet table
CREATE TABLE IF NOT EXISTS public.xuat_hang_chi_tiet (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    ma_ct TEXT NOT NULL, -- The user-provided ID
    id_ref UUID REFERENCES public.xuat_hang(id) ON DELETE CASCADE, -- Reference to the main goods issue
    ma_hang TEXT, -- Mã Hàng
    kho TEXT, -- Kho
    hanh_dong TEXT, -- Hành động
    loai_nhap_so TEXT, -- Loại nhập số
    ty_trong DECIMAL(10, 4) DEFAULT 1, -- Tỷ Trọng (Lưu)
    so_luong_tan DECIMAL(15, 3) DEFAULT 0, -- Số Lượng (Tấn)
    so_luong_m3 DECIMAL(15, 3) DEFAULT 0, -- Số Lượng (m3)
    su_dung_ton_tu TEXT, -- Sử dụng tồn từ ?
    don_gia DECIMAL(15, 2) DEFAULT 0, -- Đơn giá (VND)
    is_pinned BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.xuat_hang_chi_tiet ENABLE ROW LEVEL SECURITY;

-- Allow public access (Read/Write) - Adjust for production
CREATE POLICY "Allow public access to xuat_hang_chi_tiet" ON public.xuat_hang_chi_tiet
    FOR ALL
    USING (true)
    WITH CHECK (true);
