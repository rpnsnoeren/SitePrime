CREATE TABLE IF NOT EXISTS freelancers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    expertise TEXT NOT NULL,
    experience TEXT NOT NULL,
    rate TEXT NOT NULL,
    status TEXT NOT NULL,
    availability TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
