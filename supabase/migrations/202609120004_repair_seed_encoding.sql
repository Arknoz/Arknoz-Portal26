begin;

update public.entities
set
  detail = replace(
    replace(
      replace(
        replace(
          detail::text,
          chr(226) || chr(8364) || chr(8220),
          chr(8211)
        ),
        chr(194) || chr(178),
        chr(178)
      ),
      chr(194) || chr(183),
      chr(183)
    ),
    chr(226) || chr(8218) || chr(8218),
    chr(8322)
  )::jsonb,
  updated_at = now()
where
  detail::text like '%' || chr(226) || chr(8364) || chr(8220) || '%'
  or detail::text like '%' || chr(194) || chr(178) || '%'
  or detail::text like '%' || chr(194) || chr(183) || '%'
  or detail::text like '%' || chr(226) || chr(8218) || chr(8218) || '%';

do $$
declare
  remaining integer;
begin
  select count(*)
  into remaining
  from public.entities
  where
    detail::text like '%' || chr(226) || chr(8364) || chr(8220) || '%'
    or detail::text like '%' || chr(194) || chr(178) || '%'
    or detail::text like '%' || chr(194) || chr(183) || '%'
    or detail::text like '%' || chr(226) || chr(8218) || chr(8218) || '%';

  if remaining <> 0 then
    raise exception 'Seed encoding repair incomplete: % rows remain', remaining;
  end if;
end
$$;

commit;