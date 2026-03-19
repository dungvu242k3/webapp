-- Create the nhan_su table
CREATE TABLE IF NOT EXISTS public.nhan_su (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    ma_nhan_su TEXT NOT NULL, -- The user-provided ID
    ho_ten TEXT NOT NULL,
    email TEXT NOT NULL,
    is_pinned BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.nhan_su ENABLE ROW LEVEL SECURITY;

-- Allow public access (Read/Write) - Adjust for production
CREATE POLICY "Allow public access to nhan_su" ON public.nhan_su
    FOR ALL
    USING (true)
    WITH CHECK (true);
