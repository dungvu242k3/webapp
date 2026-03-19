-- Create the nha_cung_cap table
CREATE TABLE IF NOT EXISTS public.nha_cung_cap (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    ma_ncc TEXT NOT NULL UNIQUE, -- Mã NCC
    ten_ncc TEXT NOT NULL, -- Tên NCC
    stk_ncc TEXT, -- Số TK NCC
    ma_ngan_hang_ncc TEXT, -- Mã Ngân Hàng NCC
    dia_chi TEXT, -- Địa chỉ
    sdt TEXT, -- SĐT
    is_pinned BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.nha_cung_cap ENABLE ROW LEVEL SECURITY;

-- Allow public access (Read/Write) - Adjust for production
CREATE POLICY "Allow public access to nha_cung_cap" ON public.nha_cung_cap
    FOR ALL
    USING (true)
    WITH CHECK (true);
