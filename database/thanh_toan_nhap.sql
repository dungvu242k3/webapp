-- Create the thanh_toan_nhap table
CREATE TABLE IF NOT EXISTS public.thanh_toan_nhap (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    ma_thanh_toan TEXT NOT NULL, -- The user-provided ID
    id_ref UUID REFERENCES public.nhap_hang(id) ON DELETE CASCADE, -- Reference to the main receipt
    so_tien DECIMAL(15, 2) DEFAULT 0,
    is_pinned BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.thanh_toan_nhap ENABLE ROW LEVEL SECURITY;

-- Allow public access (Read/Write) - Adjust for production
CREATE POLICY "Allow public access to thanh_toan_nhap" ON public.thanh_toan_nhap
    FOR ALL
    USING (true)
    WITH CHECK (true);
