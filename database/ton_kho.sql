-- Create the ton_kho table
CREATE TABLE IF NOT EXISTS public.ton_kho (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    ma_ton_kho TEXT NOT NULL, -- The user-provided ID
    kho TEXT NOT NULL,
    san_pham TEXT NOT NULL,
    is_pinned BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.ton_kho ENABLE ROW LEVEL SECURITY;

-- Allow public access (Read/Write) - Adjust for production
CREATE POLICY "Allow public access to ton_kho" ON public.ton_kho
    FOR ALL
    USING (true)
    WITH CHECK (true);
