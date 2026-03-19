-- Create the nhap_hang_chi_tiet table
CREATE TABLE IF NOT EXISTS public.nhap_hang_chi_tiet (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    id_ref UUID REFERENCES public.nhap_hang(id) ON DELETE CASCADE, -- Reference to the main receipt
    ma_hang TEXT NOT NULL,
    kho TEXT NOT NULL,
    hanh_dong TEXT,
    loai_nhap_so TEXT,
    ty_trong_luu DECIMAL(10, 4) DEFAULT 0,
    so_luong_tan DECIMAL(15, 3) DEFAULT 0,
    so_luong_m3 DECIMAL(15, 3) DEFAULT 0,
    don_gia_vnd DECIMAL(15, 2) DEFAULT 0,
    is_pinned BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.nhap_hang_chi_tiet ENABLE ROW LEVEL SECURITY;

-- Allow public access (Read/Write) - Adjust for production
CREATE POLICY "Allow public access to nhap_hang_chi_tiet" ON public.nhap_hang_chi_tiet
    FOR ALL
    USING (true)
    WITH CHECK (true);
