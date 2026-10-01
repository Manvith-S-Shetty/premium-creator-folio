create type message_status as enum(
    'unread',
    'read',
    'replied',
    'archived'
);
create table public.messages (
    id uuid primary key default gen_random_uuid(),

    name text not null,

    email text not null,

    subject text not null,

    message text not null,

    status message_status not null default 'unread',

    created_at timestamptz default now(),

    updated_at timestamptz default now()
);
create or replace function update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
    new.updated_at=now();
    return new;
end;
$$;

create trigger update_messages_updated_at
before update on public.messages
for each row
execute function update_updated_at_column();

alter table public.messages
enable row level security;

create policy "Anyone can submit a contact message"
on public.messages
for insert
to anon
with check (true);

create policy "Authenticated users can read messages"
on public.messages
for select
to authenticated
using (true);

create policy "Authenticated users can update messages"
on public.messages
for update
to authenticated
using (true)
with check (true);

create policy "Authenticated users can delete messages"
on public.messages
for delete
to authenticated
using (true);