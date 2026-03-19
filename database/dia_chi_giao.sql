-- Create the dia_chi_giao table
CREATE TABLE IF NOT EXISTS public.dia_chi_giao (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    ma_dia_chi_giao TEXT NOT NULL UNIQUE, -- ID
    dia_chi_giao TEXT NOT NULL, -- Địa Chỉ Giao
    is_pinned BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.dia_chi_giao ENABLE ROW LEVEL SECURITY;

-- Allow public access (Read/Write) - Adjust for production
CREATE POLICY "Allow public access to dia_chi_giao" ON public.dia_chi_giao
    FOR ALL
    USING (true)
    WITH CHECK (true);
