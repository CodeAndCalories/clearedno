-- Allow public reads on city_suggestions so the suggest-city page
-- can display top-requested cities and their vote counts.
--
-- Previously only service_role could SELECT from this table.
-- Now anon and authenticated roles can read (SELECT only).

CREATE POLICY "Allow public reads" ON city_suggestions
  FOR SELECT USING (true);
