-- Create the phan_quyen table
CREATE TABLE IF NOT EXISTS public.phan_quyen (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    id_phan_quyen TEXT NOT NULL,
    email_nhan_vien TEXT NOT NULL,
    ten_nhan_vien TEXT NOT NULL,
    vai_tro TEXT NOT NULL,
    ma_du_an_duoc_xem TEXT, -- Can be a comma-separated list or JSON
    is_pinned BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.phan_quyen ENABLE ROW LEVEL SECURITY;

-- Allow public access (Read/Write) - Adjust for production
CREATE POLICY "Allow public access to phan_quyen" ON public.phan_quyen
    FOR ALL
    USING (true)
    WITH CHECK (true);
