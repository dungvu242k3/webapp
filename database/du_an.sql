-- Create the du_an table
CREATE TABLE IF NOT EXISTS public.du_an (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    ma_du_an TEXT NOT NULL UNIQUE,
    ten_du_an TEXT NOT NULL,
    khach_hang TEXT,
    dia_chi TEXT,
    trang_thai TEXT DEFAULT 'Đang chạy',
    is_pinned BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.du_an ENABLE ROW LEVEL SECURITY;

-- Allow public access (Read/Write) - Adjust for production
CREATE POLICY "Allow public access to du_an" ON public.du_an
    FOR ALL
    USING (true)
    WITH CHECK (true);
