create table if not exists public.trial_scores (
  id bigint generated always as identity primary key,
  knight_name text not null check (char_length(btrim(knight_name)) between 1 and 24),
  score integer not null check (score >= 0),
  correct_answers integer not null check (correct_answers between 0 and 5),
  hits_taken integer not null check (hits_taken between 0 and 10),
  result text not null check (result in ('victory', 'defeat')),
  math_level smallint not null check (math_level between 1 and 10),
  attack_difficulty text not null check (attack_difficulty in ('easy', 'medium', 'hard')),
  created_at timestamptz not null default now(),
  constraint trial_scores_score_matches_run check (
    score = greatest(
      0,
      correct_answers * 100 - hits_taken * 25
        + case when result = 'victory' then 500 else 0 end
    )
  )
);

alter table public.trial_scores enable row level security;

drop policy if exists "Anyone can view public trial scores" on public.trial_scores;
create policy "Anyone can view public trial scores"
  on public.trial_scores
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Anyone can submit a trial score" on public.trial_scores;
create policy "Anyone can submit a trial score"
  on public.trial_scores
  for insert
  to anon, authenticated
  with check (
    char_length(btrim(knight_name)) between 1 and 24
    and score >= 0
    and correct_answers between 0 and 5
    and hits_taken between 0 and 10
    and result in ('victory', 'defeat')
    and math_level between 1 and 10
    and attack_difficulty in ('easy', 'medium', 'hard')
    and score = greatest(
      0,
      correct_answers * 100 - hits_taken * 25
        + case when result = 'victory' then 500 else 0 end
    )
  );

revoke all on public.trial_scores from anon, authenticated;
revoke all on sequence public.trial_scores_id_seq from anon, authenticated;
grant select, insert on public.trial_scores to anon, authenticated;
grant usage, select on sequence public.trial_scores_id_seq to anon, authenticated;
