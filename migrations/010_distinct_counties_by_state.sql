-- Fixes the Ohio county 404s on /leads/roofing/[state]/[county].
--
-- The page derived a state's distinct county list from a 500-row sample.
-- Ohio holds ~285k rows across 87 counties, so the sample only ever surfaced
-- 18 of them; the other 67 failed to resolve and were served (and cached, via
-- ISR) as 404s despite having lead data.

-- (state, county, event_date desc) serves both the skip scan below
-- (leading-edge prefix) and the "recent events for this county" ordering,
-- which previously seq-scanned the whole table and sorted.
create index if not exists roofing_leads_state_county_event_date_idx
  on public.roofing_leads (state, county, event_date desc);

-- Loose index scan ("skip scan"): visits one index entry per distinct county
-- rather than every row for the state. Returns ALL counties, uncapped.
-- ~1160ms -> ~60ms for Ohio.
create or replace function public.distinct_counties_by_state(state_abbrev text)
returns table (county text)
language sql
stable
security definer
set search_path = public
as $$
  with recursive walk as (
    (
      select min(rl.county) as county
      from roofing_leads rl
      where rl.state = state_abbrev
    )
    union all
    select (
      select min(rl.county)
      from roofing_leads rl
      where rl.state = state_abbrev
        and rl.county > walk.county
    )
    from walk
    where walk.county is not null
  )
  select walk.county from walk where walk.county is not null;
$$;

-- Only the server-side admin client calls this.
revoke execute on function public.distinct_counties_by_state(text) from public, anon, authenticated;
grant  execute on function public.distinct_counties_by_state(text) to service_role;
