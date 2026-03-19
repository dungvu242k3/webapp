-- Create the loai_kho table
CREATE TABLE IF NOT EXISTS public.loai_kho (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    ma_loai_kho TEXT NOT NULL UNIQUE, -- ID
    ten_kho TEXT NOT NULL, -- Tên Kho
    is_pinned BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.loai_kho ENABLE ROW LEVEL SECURITY;

-- Allow public access (Read/Write) - Adjust for production
CREATE POLICY "Allow public access to loai_kho" ON public.loai_kho
    FOR ALL
    USING (true)
    WITH CHECK (true);
