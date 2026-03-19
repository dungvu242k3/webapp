-- Create the doi_xe table
CREATE TABLE IF NOT EXISTS public.doi_xe (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    bien_so_xe TEXT NOT NULL,
    ten_tai_xe TEXT NOT NULL,
    so_dien_thoai TEXT,
    trong_tai DECIMAL(10, 2), -- In tons
    tinh_trang TEXT DEFAULT 'Đang đợi',
    is_pinned BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.doi_xe ENABLE ROW LEVEL SECURITY;

-- Allow public access (Read/Write) - Adjust for production
CREATE POLICY "Allow public access to doi_xe" ON public.doi_xe
    FOR ALL
    USING (true)
    WITH CHECK (true);
