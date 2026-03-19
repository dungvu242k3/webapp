-- Create the cong_no_ban table
CREATE TABLE IF NOT EXISTS public.cong_no_ban (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    id_ref TEXT NOT NULL,
    so_tien DECIMAL(15, 2) NOT NULL DEFAULT 0,
    thoi_gian TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    ghi_chu TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.cong_no_ban ENABLE ROW LEVEL SECURITY;

-- Allow public access (Read/Write) - Adjust for production
CREATE POLICY "Allow public access to cong_no_ban" ON public.cong_no_ban
    FOR ALL
    USING (true)
    WITH CHECK (true);
