-- Create the dia_chi_mua table
CREATE TABLE IF NOT EXISTS public.dia_chi_mua (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    ma_dia_chi_mua TEXT NOT NULL UNIQUE, -- ID
    dia_chi_mua TEXT NOT NULL, -- Địa Chỉ Mua
    is_pinned BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.dia_chi_mua ENABLE ROW LEVEL SECURITY;

-- Allow public access (Read/Write) - Adjust for production
CREATE POLICY "Allow public access to dia_chi_mua" ON public.dia_chi_mua
    FOR ALL
    USING (true)
    WITH CHECK (true);
