-- Migration 009: Add digest_opted_out to profiles
-- Controls whether a user receives the Monday weekly digest email.
-- Default false (opted in) — users can toggle this in dashboard email preferences.

alter table profiles
  add column if not exists digest_opted_out boolean not null default false;
