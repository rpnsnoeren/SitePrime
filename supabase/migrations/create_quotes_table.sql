create table if not exists public.quotes (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Stap 1: Basisinformatie
  company_name text not null,
  industry text,
  desired_domain text,
  custom_industry text,
  
  -- Stap 2: Doel
  primary_goal text,
  secondary_goals text[],
  
  -- Stap 3: Doelgroep
  target_age_range text,
  geographic_focus text,
  
  -- Stap 4: Functionaliteiten
  features text[],
  
  -- Stap 5: Design
  colorscheme text,
  style text,
  website_examples text,
  
  -- Stap 6: Inhoud
  number_of_pages text,
  has_own_content boolean default false,
  needs_content_support boolean default false,
  
  -- Stap 7: SEO
  seo_requirements text[],
  
  -- Stap 8: Budget & Timeline
  budget text,
  deadline text,
  
  -- Stap 9: Onderhoud
  maintenance_contract boolean default false,
  needs_training boolean default false,
  
  -- Stap 10: Contact
  contact_person text not null,
  email text not null,
  phone text not null,
  status text default 'PENDING'
);

-- Voeg RLS policies toe
alter table public.quotes enable row level security;

create policy "Quotes zijn leesbaar voor ingelogde gebruikers"
  on public.quotes for select
  using ( auth.role() = 'authenticated' );

create policy "Iedereen kan quotes aanmaken"
  on public.quotes for insert
  with check ( true ); 