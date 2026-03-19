-- Create the danh_muc_hang table
CREATE TABLE IF NOT EXISTS public.danh_muc_hang (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    ma_hang TEXT UNIQUE,
    ten_hang TEXT NOT NULL,
    dvt_chinh TEXT NOT NULL,
    dvt_phu TEXT,
    ty_trong DECIMAL(10, 2),
    gia_nhap DECIMAL(15, 2),
    gia_ban DECIMAL(15, 2),
    ghi_chu TEXT,
    hinh_anh TEXT,
    trang_thai TEXT DEFAULT 'Đang hoạt động',
    is_pinned BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.danh_muc_hang ENABLE ROW LEVEL SECURITY;

-- Allow public access (Read/Write) - Adjust for production
CREATE POLICY "Allow public access to danh_muc_hang" ON public.danh_muc_hang
    FOR ALL
    USING (true)
    WITH CHECK (true);
