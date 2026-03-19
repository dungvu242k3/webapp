-- Create the don_vi_van_chuyen table
CREATE TABLE IF NOT EXISTS public.don_vi_van_chuyen (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    ma_dvvc TEXT NOT NULL, -- The user-provided ID
    ten_dvvc TEXT NOT NULL,
    is_pinned BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.don_vi_van_chuyen ENABLE ROW LEVEL SECURITY;

-- Allow public access (Read/Write) - Adjust for production
CREATE POLICY "Allow public access to don_vi_van_chuyen" ON public.don_vi_van_chuyen
    FOR ALL
    USING (true)
    WITH CHECK (true);
