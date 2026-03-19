-- Create the nhap_hang table
CREATE TABLE IF NOT EXISTS public.nhap_hang (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    id_nhap TEXT NOT NULL,
    ma_du_an TEXT NOT NULL,
    ma_kho TEXT NOT NULL,
    ma_ncc TEXT NOT NULL,
    ma_dia_chi_mua TEXT,
    ma_xe_mua TEXT,
    ma_dvvc_mua TEXT,
    phi_van_chuyen DECIMAL(15, 2) DEFAULT 0,
    ghi_chu TEXT,
    hinh_anh TEXT, -- URL or path to image
    nhan_vien_nhap TEXT NOT NULL,
    ngay_gio TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    so_phieu TEXT NOT NULL,
    is_pinned BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.nhap_hang ENABLE ROW LEVEL SECURITY;

-- Allow public access (Read/Write) - Adjust for production
CREATE POLICY "Allow public access to nhap_hang" ON public.nhap_hang
    FOR ALL
    USING (true)
    WITH CHECK (true);
