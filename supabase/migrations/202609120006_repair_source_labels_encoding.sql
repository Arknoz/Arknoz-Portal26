begin;

update public.entity_sources
set
  label = replace(
    label,
    chr(226) || chr(8364) || chr(8221),
    chr(8212)
  )
where label like
  '%' || chr(226) || chr(8364) || chr(8221) || '%';

do $$
declare
  remaining integer;
begin
  select count(*)
  into remaining
  from public.entity_sources
  where label like
    '%' || chr(226) || chr(8364) || chr(8221) || '%';

  if remaining <> 0 then
    raise exception
      'Source-label encoding repair incomplete: % rows remain',
      remaining;
  end if;
end
$$;

commit;