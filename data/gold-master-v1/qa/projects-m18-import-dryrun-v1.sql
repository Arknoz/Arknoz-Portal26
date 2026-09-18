begin;

-- ============================================================
-- ARKNOZ GOLD MASTER PROJECT IMPORT V1
-- TRANSACTIONAL DRY RUN ONLY
-- THIS FILE MUST END IN ROLLBACK
-- ============================================================

create temporary table _arknoz_project_import_meta (
    entity_id uuid not null,
    fact_id uuid not null,
    publication_disposition text not null,
    promotion_eligible boolean not null,
    hold_reason text
) on commit drop;


do $arknoz$
declare
    v_package jsonb := '{"standard":"ARKNOZ-GOLD-MASTER-V1","package":"PROJECTS-M18-IMPORT-V1","generated_from":"projects-source-pack-v2.json","rules":{"database_write_performed":false,"all_new_facts_enter_as_candidate":true,"held_facts_may_not_be_promoted":true,"entity_publication_is_not_authorized":true,"media_publication_is_not_authorized":true},"records":[{"entity":{"entity_type":"project","slug":"sydney-opera-house","canonical_path":"/projects/sydney-opera-house","title":"Sydney Opera House","geography_label":"Sydney, Australia","geography_slug":"australia/sydney","project_parent":"Buildings","intended_content_status":"draft","intended_verification_status":"unverified"},"sources":[{"source_key":"sydney-opera-house-official","label":"Sydney Opera House ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â Our Story","organisation":"Sydney Opera House","url":"https://www.sydneyoperahouse.com/our-story","source_type":"official","independent":false,"last_checked_at":"2026-09-18"},{"source_key":"unesco-sydney-opera-house","label":"Sydney Opera House ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â World Heritage record","organisation":"UNESCO World Heritage Centre","url":"https://whc.unesco.org/en/list/166","source_type":"institutional","independent":true,"last_checked_at":"2026-09-18"},{"source_key":"mhnsw-sydney-opera-house-history","label":"Sydney Opera House construction began â€” 2 March 1959","organisation":"Museums of History NSW","url":"https://mhnsw.au/stories/on-this-day/2-march-1959/","source_type":"independent","independent":true,"last_checked_at":"2026-09-18"},{"source_key":"mhnsw-sydney-opera-house-opening","label":"Sydney Opera House officially opened â€” 20 October 1973","organisation":"Museums of History NSW","url":"https://mhnsw.au/stories/on-this-day/20-october-1973/","source_type":"independent","independent":true,"last_checked_at":"2026-09-18"}],"facts":[{"fact_key":"architect","label":"Architect","value":"JÃƒÆ’Ã‚Â¸rn Utzon","unit":null,"origin_type":"source_extract","fact_status":"candidate","publication_disposition":"independent_evidence_ready","promotion_eligible":true,"hold_reason":null,"evidence":[{"source_key":"sydney-opera-house-official","support_type":"supporting","is_independent":false,"evidence_locator":"Our story Ã¢â‚¬â€ introduction: designed by Danish architect JÃƒÂ¸rn Utzon"},{"source_key":"unesco-sydney-opera-house","support_type":"supporting","is_independent":true,"evidence_locator":"Outstanding Universal Value Ã¢â‚¬â€ Utzon original design concept"}]},{"fact_key":"construction_started","label":"Construction started","value":"1959-03-02","unit":null,"origin_type":"source_extract","fact_status":"candidate","publication_disposition":"independent_evidence_ready","promotion_eligible":true,"hold_reason":null,"evidence":[{"source_key":"sydney-opera-house-official","support_type":"supporting","is_independent":false,"evidence_locator":"Our story \u003e Construction begins Ã¢â‚¬â€ ceremony marking construction start on 2 March 1959"},{"source_key":"mhnsw-sydney-opera-house-history","support_type":"supporting","is_independent":true,"evidence_locator":"Page title and opening paragraph â€” work officially began on Stage 1 on 2 March 1959."}]},{"fact_key":"opened_year","label":"Opened","value":1973,"unit":null,"origin_type":"source_extract","fact_status":"candidate","publication_disposition":"independent_evidence_ready","promotion_eligible":true,"hold_reason":null,"evidence":[{"source_key":"sydney-opera-house-official","support_type":"supporting","is_independent":false,"evidence_locator":"Our story Ã¢â‚¬â€ Opera House opened its doors in 1973"},{"source_key":"mhnsw-sydney-opera-house-opening","support_type":"supporting","is_independent":true,"evidence_locator":"Page title and opening paragraph â€” Sydney Opera House officially opened on 20 October 1973."}]},{"fact_key":"world_heritage_inscription_year","label":"World Heritage inscription","value":2007,"unit":null,"origin_type":"source_extract","fact_status":"candidate","publication_disposition":"independent_evidence_ready","promotion_eligible":true,"hold_reason":null,"evidence":[{"source_key":"unesco-sydney-opera-house","support_type":"supporting","is_independent":true,"evidence_locator":"World Heritage property metadata Ã¢â‚¬â€ Date of Inscription: 2007"}]},{"fact_key":"world_heritage_criterion","label":"World Heritage criterion","value":"i","unit":null,"origin_type":"source_extract","fact_status":"candidate","publication_disposition":"independent_evidence_ready","promotion_eligible":true,"hold_reason":null,"evidence":[{"source_key":"unesco-sydney-opera-house","support_type":"supporting","is_independent":true,"evidence_locator":"World Heritage property metadata / Outstanding Universal Value Ã¢â‚¬â€ Criterion (i)"}]}]},{"entity":{"entity_type":"project","slug":"elizabeth-line","canonical_path":"/projects/elizabeth-line","title":"Elizabeth Line","geography_label":"London, United Kingdom","geography_slug":"united-kingdom/london","project_parent":"Transport","intended_content_status":"draft","intended_verification_status":"unverified"},"sources":[{"source_key":"tfl-elizabeth-line","label":"Elizabeth line ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â Transport for London","organisation":"Transport for London","url":"https://tfl-newsroom.prgloo.com/news/tfl-press-release-elizabeth-line-to-open-on-24-may-2022","source_type":"official","independent":false,"last_checked_at":"2026-09-18"},{"source_key":"arup-crossrail-elizabeth-line","label":"Crossrail / Elizabeth Line","organisation":"Arup","url":"https://www.arup.com/projects/crossrail-elizabeth-line-tunnelling-design/","source_type":"project_partner","independent":false,"last_checked_at":"2026-09-18"},{"source_key":"orr-elizabeth-line-opening","label":"ORR confirms green light for Elizabeth line opening","organisation":"Office of Rail and Road","url":"https://www.orr.gov.uk/search-news/orr-confirms-green-light-elizabeth-line-opening","source_type":"independent","independent":true,"last_checked_at":"2026-09-18"},{"source_key":"ice-crossrail","label":"Crossrail: Transforming London\u0027s Rail Network","organisation":"Institution of Civil Engineers","url":"https://www.ice.org.uk/what-is-civil-engineering/infrastructure-projects/crossrail","source_type":"independent","independent":true,"last_checked_at":"2026-09-18"}],"facts":[{"fact_key":"revenue_service_opened","label":"Revenue service opened","value":"2022-05-24","unit":null,"origin_type":"source_extract","fact_status":"candidate","publication_disposition":"independent_evidence_ready","promotion_eligible":true,"hold_reason":null,"evidence":[{"source_key":"tfl-elizabeth-line","support_type":"supporting","is_independent":false,"evidence_locator":"TfL press release Ã¢â‚¬â€ Elizabeth line to open on Tuesday 24 May 2022"},{"source_key":"orr-elizabeth-line-opening","support_type":"supporting","is_independent":true,"evidence_locator":"ORR press release dated 13 May 2022 â€” opening scheduled for Tuesday 24 May 2022."}]},{"fact_key":"new_tunnel_length_km","label":"New tunnel length","value":42,"unit":"km","origin_type":"source_extract","fact_status":"candidate","publication_disposition":"independent_evidence_ready","promotion_eligible":true,"hold_reason":null,"evidence":[{"source_key":"arup-crossrail-elizabeth-line","support_type":"supporting","is_independent":false,"evidence_locator":"Project overview Ã¢â‚¬â€ Arup/Atkins JV designed 42 km of new tunnels"},{"source_key":"ice-crossrail","support_type":"supporting","is_independent":true,"evidence_locator":"How the tunnels were dug and infrastructure placed â€” 42km of new tunnels under London."}]},{"fact_key":"western_connections","label":"Western connections","value":["Reading","Heathrow"],"unit":null,"origin_type":"source_extract","fact_status":"candidate","publication_disposition":"independent_evidence_ready","promotion_eligible":true,"hold_reason":null,"evidence":[{"source_key":"arup-crossrail-elizabeth-line","support_type":"supporting","is_independent":false,"evidence_locator":"Project overview Ã¢â‚¬â€ service from Reading and Heathrow in the west"},{"source_key":"orr-elizabeth-line-opening","support_type":"supporting","is_independent":true,"evidence_locator":"Notes to Editors â€” route described from Reading and Heathrow in the west."}]},{"fact_key":"eastern_connections","label":"Eastern connections","value":["Shenfield","Abbey Wood"],"unit":null,"origin_type":"source_extract","fact_status":"candidate","publication_disposition":"independent_evidence_ready","promotion_eligible":true,"hold_reason":null,"evidence":[{"source_key":"arup-crossrail-elizabeth-line","support_type":"supporting","is_independent":false,"evidence_locator":"Project overview Ã¢â‚¬â€ reaches Shenfield and Abbey Wood in the east"},{"source_key":"orr-elizabeth-line-opening","support_type":"supporting","is_independent":true,"evidence_locator":"Notes to Editors â€” route described through to Shenfield and Abbey Wood in the east."}]},{"fact_key":"central_london_rail_capacity_increase","label":"Central London rail capacity increase","value":10,"unit":"percent","origin_type":"source_extract","fact_status":"candidate","publication_disposition":"independent_evidence_ready","promotion_eligible":true,"hold_reason":null,"evidence":[{"source_key":"arup-crossrail-elizabeth-line","support_type":"supporting","is_independent":false,"evidence_locator":"Project overview Ã¢â‚¬â€ increased central London rail capacity by 10%"},{"source_key":"ice-crossrail","support_type":"supporting","is_independent":true,"evidence_locator":"Difference the Elizabeth line has made â€” London\u0027s rail capacity increased by 10%."}]}]},{"entity":{"entity_type":"project","slug":"high-line-new-york","canonical_path":"/projects/high-line-new-york","title":"High Line","geography_label":"New York, United States","geography_slug":"united-states/new-york","project_parent":"Landscape \u0026 Public Realm","intended_content_status":"draft","intended_verification_status":"unverified"},"sources":[{"source_key":"field-operations-high-line","label":"High Line project record","organisation":"Field Operations","url":"https://www.fieldoperations.net/project/high-line","source_type":"project_team","independent":false,"last_checked_at":"2026-09-18"},{"source_key":"nyc-high-line","label":"The High Line ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â New York City record","organisation":"City of New York","url":"https://www.nyc.gov/site/mopd/resources/nyc-parks.page","source_type":"government","independent":false,"last_checked_at":"2026-09-18"},{"source_key":"laf-high-line","label":"High Line â€” Landscape Performance Series","organisation":"Landscape Architecture Foundation","url":"https://www.landscapeperformance.org/case-study-briefs/high-line","source_type":"independent","independent":true,"last_checked_at":"2026-09-18"},{"source_key":"asla-high-line","label":"The High Line, Section 1 â€” ASLA","organisation":"American Society of Landscape Architects","url":"https://www.asla.org/awards-events-main-landing/honors-awards/pro-student-awards/2010-professional-awards/173","source_type":"independent","independent":true,"last_checked_at":"2026-09-18"}],"facts":[{"fact_key":"project_type","label":"Project type","value":"Elevated linear park and public realm","unit":null,"origin_type":"source_extract","fact_status":"candidate","publication_disposition":"independent_evidence_ready","promotion_eligible":true,"hold_reason":null,"evidence":[{"source_key":"field-operations-high-line","support_type":"supporting","is_independent":false,"evidence_locator":"Project overview Ã¢â‚¬â€ elevated rail structure reclaimed as public landscape"},{"source_key":"nyc-high-line","support_type":"supporting","is_independent":false,"evidence_locator":"Parks \u003e The Highline Ã¢â‚¬â€ New York City linear park on elevated former rail spur"},{"source_key":"laf-high-line","support_type":"supporting","is_independent":true,"evidence_locator":"At a Glance and case-study introduction â€” Park/Open space; elevated railway reclaimed as public open space."}]},{"fact_key":"length_miles","label":"Length","value":1.45,"unit":"miles","origin_type":"source_extract","fact_status":"candidate","publication_disposition":"independent_evidence_ready","promotion_eligible":true,"hold_reason":null,"evidence":[{"source_key":"field-operations-high-line","support_type":"supporting","is_independent":false,"evidence_locator":"Project metadata \u003e Size Ã¢â‚¬â€ 1.45 miles long"},{"source_key":"nyc-high-line","support_type":"supporting","is_independent":false,"evidence_locator":"Parks \u003e The Highline Ã¢â‚¬â€ 1.45 mile long linear park"},{"source_key":"laf-high-line","support_type":"supporting","is_independent":true,"evidence_locator":"At a Glance \u003e Size â€” 7.43 acres (1.45 miles long)."}]},{"fact_key":"area_acres","label":"Area","value":7.43,"unit":"acres","origin_type":"source_extract","fact_status":"candidate","publication_disposition":"independent_evidence_ready","promotion_eligible":true,"hold_reason":null,"evidence":[{"source_key":"field-operations-high-line","support_type":"supporting","is_independent":false,"evidence_locator":"Project metadata \u003e Size Ã¢â‚¬â€ 7.43 acres"},{"source_key":"laf-high-line","support_type":"supporting","is_independent":true,"evidence_locator":"At a Glance \u003e Size â€” 7.43 acres (1.45 miles long)."}]},{"fact_key":"project_lead","label":"Project lead","value":"Field Operations","unit":null,"origin_type":"source_extract","fact_status":"candidate","publication_disposition":"independent_evidence_ready","promotion_eligible":true,"hold_reason":null,"evidence":[{"source_key":"field-operations-high-line","support_type":"supporting","is_independent":false,"evidence_locator":"Project overview / Role Ã¢â‚¬â€ Field Operations identified as Project Lead"},{"source_key":"asla-high-line","support_type":"supporting","is_independent":true,"evidence_locator":"ASLA project credits â€” James Corner Field Operations identified as project lead."}]},{"fact_key":"design_collaborators","label":"Design collaborators","value":["Diller Scofidio + Renfro","Piet Oudolf"],"unit":null,"origin_type":"source_extract","fact_status":"candidate","publication_disposition":"independent_evidence_ready","promotion_eligible":true,"hold_reason":null,"evidence":[{"source_key":"field-operations-high-line","support_type":"supporting","is_independent":false,"evidence_locator":"Project overview Ã¢â‚¬â€ collaboration with Diller Scofidio + Renfro and Piet Oudolf"},{"source_key":"laf-high-line","support_type":"supporting","is_independent":true,"evidence_locator":"At a Glance \u003e Designer â€” James Corner Field Operations; Diller Scofidio + Renfro; Piet Oudolf."},{"source_key":"asla-high-line","support_type":"supporting","is_independent":true,"evidence_locator":"At a Glance \u003e Designer â€” James Corner Field Operations; Diller Scofidio + Renfro; Piet Oudolf."}]},{"fact_key":"first_section_opened","label":"First section opened","value":"2009-06","unit":null,"origin_type":"source_extract","fact_status":"candidate","publication_disposition":"independent_evidence_ready","promotion_eligible":true,"hold_reason":null,"evidence":[{"source_key":"field-operations-high-line","support_type":"supporting","is_independent":false,"evidence_locator":"Project metadata \u003e Year Ã¢â‚¬â€ June 2009 (Section 1)"},{"source_key":"laf-high-line","support_type":"supporting","is_independent":true,"evidence_locator":"At a Glance \u003e Completion Date â€” Section 1: 2009."}]}]},{"entity":{"entity_type":"project","slug":"noor-ouarzazate-solar-complex","canonical_path":"/projects/noor-ouarzazate-solar-complex","title":"Noor Ouarzazate Solar Complex","geography_label":"Ouarzazate, Morocco","geography_slug":"morocco/ouarzazate","project_parent":"Industrial \u0026 Energy","intended_content_status":"draft","intended_verification_status":"unverified"},"sources":[{"source_key":"world-bank-noor-overview","label":"Noor Ouarzazate Solar Complex project documentation","organisation":"World Bank Group","url":"https://ppp.worldbank.org/sites/default/files/2022-02/MoroccoNoorQuarzazateSolar_WBG_AfDB_EIB.pdf","source_type":"institutional","independent":false,"last_checked_at":"2026-09-18"},{"source_key":"world-bank-noor-results","label":"Morocco Noor Solar Power Project ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â implementation results","organisation":"World Bank","url":"https://documents.worldbank.org/en/publication/documents-reports/documentdetail/099032625151032430","source_type":"institutional","independent":false,"last_checked_at":"2026-09-18"},{"source_key":"guardian-noor-2016","label":"Morocco switches on first phase of Ouarzazate solar plant","organisation":"The Guardian","url":"https://www.theguardian.com/environment/2016/feb/04/morocco-to-switch-on-first-phase-of-worlds-largest-solar-plant","source_type":"independent","independent":true,"last_checked_at":"2026-09-18"}],"facts":[{"fact_key":"project_type","label":"Project type","value":"Solar power complex","unit":null,"origin_type":"source_extract","fact_status":"candidate","publication_disposition":"independent_evidence_ready","promotion_eligible":true,"hold_reason":null,"evidence":[{"source_key":"world-bank-noor-overview","support_type":"supporting","is_independent":false,"evidence_locator":"Project Description Ã¢â‚¬â€ solar complex using CSP and photovoltaic technologies"},{"source_key":"guardian-noor-2016","support_type":"supporting","is_independent":true,"evidence_locator":"Article headline and introduction describe the Ouarzazate development as a solar power plant / solar complex."}]},{"fact_key":"overall_capacity_mw","label":"Overall planned complex capacity","value":580,"unit":"MW","origin_type":"source_extract","fact_status":"candidate","publication_disposition":"independent_evidence_ready","promotion_eligible":true,"hold_reason":null,"evidence":[{"source_key":"world-bank-noor-overview","support_type":"supporting","is_independent":false,"evidence_locator":"Project Description Ã¢â‚¬â€ complex generation capacity stated as 580 MW"},{"source_key":"guardian-noor-2016","support_type":"supporting","is_independent":true,"evidence_locator":"Article introduction â€” first phase contributes toward an ultimate 580 MW capacity."}]},{"fact_key":"noor_i_capacity_mw","label":"Noor I capacity","value":160,"unit":"MW","origin_type":"source_extract","fact_status":"candidate","publication_disposition":"independent_evidence_ready","promotion_eligible":true,"hold_reason":null,"evidence":[{"source_key":"world-bank-noor-overview","support_type":"supporting","is_independent":false,"evidence_locator":"Project Description Ã¢â‚¬â€ Noor I generates 160 MW"},{"source_key":"guardian-noor-2016","support_type":"supporting","is_independent":true,"evidence_locator":"Article introduction â€” Noor 1 / first section provides 160 MW."}]},{"fact_key":"noor_i_opened","label":"Noor I opened","value":"2016-02","unit":null,"origin_type":"source_extract","fact_status":"candidate","publication_disposition":"independent_evidence_ready","promotion_eligible":true,"hold_reason":null,"evidence":[{"source_key":"world-bank-noor-overview","support_type":"supporting","is_independent":false,"evidence_locator":"Project Description Ã¢â‚¬â€ Noor I commissioned in February 2016"},{"source_key":"guardian-noor-2016","support_type":"supporting","is_independent":true,"evidence_locator":"Article dated 4 February 2016 â€” first phase being switched on/opened that day."}]},{"fact_key":"csp_complex_operational_since","label":"Three-plant CSP complex fully operational since","value":"2018-10","unit":null,"origin_type":"source_extract","fact_status":"candidate","publication_disposition":"hold","promotion_eligible":false,"hold_reason":"Exact October 2018 operational-since precision is source-backed but lacks independent fact-level corroboration for Gold Master publication.","evidence":[{"source_key":"world-bank-noor-results","support_type":"supporting","is_independent":false,"evidence_locator":"Implementation Completion and Results Report, paragraph 26 Ã¢â‚¬â€ three plants fully operational by October 2018"}]}]}]}'::jsonb;

    v_record jsonb;
    v_source jsonb;
    v_fact jsonb;
    v_evidence jsonb;
    v_source_object jsonb;

    v_entity_id uuid;
    v_source_id uuid;
    v_fact_id uuid;
begin

    for v_record in
        select value
        from jsonb_array_elements(v_package->'records')
    loop

        -- ----------------------------------------------------
        -- ENTITY
        -- Draft and unverified only.
        -- ----------------------------------------------------

        insert into public.entities (
            entity_type,
            slug,
            canonical_path,
            title,
            summary,
            geography_label,
            geography_slug,
            content_status,
            verification_status,
            detail,
            is_featured,
            sort_rank,
            last_verified_at,
            published_at
        )
        values (
            v_record->'entity'->>'entity_type',
            v_record->'entity'->>'slug',
            v_record->'entity'->>'canonical_path',
            v_record->'entity'->>'title',
            'Gold Master research candidate; not published.',
            v_record->'entity'->>'geography_label',
            v_record->'entity'->>'geography_slug',
            'draft',
            'unverified',
            jsonb_build_object(
                'project_parent',
                v_record->'entity'->>'project_parent',
                'gold_master_standard',
                'ARKNOZ-GOLD-MASTER-V1'
            ),
            false,
            0,
            null,
            null
        )
        returning id into v_entity_id;


        -- ----------------------------------------------------
        -- SOURCES
        -- ----------------------------------------------------

        for v_source in
            select value
            from jsonb_array_elements(v_record->'sources')
        loop

            insert into public.entity_sources (
                entity_id,
                label,
                organisation,
                url,
                source_type,
                last_checked_at
            )
            values (
                v_entity_id,
                v_source->>'label',
                v_source->>'organisation',
                v_source->>'url',
                v_source->>'source_type',
                nullif(
                    v_source->>'last_checked_at',
                    ''
                )::timestamptz
            );

        end loop;


        -- ----------------------------------------------------
        -- FACTS
        -- Every new M18 fact enters as candidate.
        -- ----------------------------------------------------

        for v_fact in
            select value
            from jsonb_array_elements(v_record->'facts')
        loop

            if v_fact->>'fact_status' <> 'candidate' then
                raise exception
                    'Dry-run blocked: fact % for % is not candidate',
                    v_fact->>'fact_key',
                    v_record->'entity'->>'slug';
            end if;


            insert into public.entity_facts (
                entity_id,
                fact_key,
                label,
                value,
                unit,
                origin_type,
                fact_status
            )
            values (
                v_entity_id,
                v_fact->>'fact_key',
                v_fact->>'label',
                v_fact->'value',
                nullif(v_fact->>'unit', ''),
                v_fact->>'origin_type',
                'candidate'
            )
            returning id into v_fact_id;


            insert into _arknoz_project_import_meta (
                entity_id,
                fact_id,
                publication_disposition,
                promotion_eligible,
                hold_reason
            )
            values (
                v_entity_id,
                v_fact_id,
                v_fact->>'publication_disposition',
                coalesce(
                    (v_fact->>'promotion_eligible')::boolean,
                    false
                ),
                nullif(v_fact->>'hold_reason', '')
            );


            -- ------------------------------------------------
            -- FACT <-> SOURCE EVIDENCE
            -- ------------------------------------------------

            for v_evidence in
                select value
                from jsonb_array_elements(v_fact->'evidence')
            loop

                select s.value
                into v_source_object
                from jsonb_array_elements(
                    v_record->'sources'
                ) as s(value)
                where s.value->>'source_key'
                    = v_evidence->>'source_key'
                limit 1;


                if v_source_object is null then
                    raise exception
                        'Evidence source key % not found for fact %',
                        v_evidence->>'source_key',
                        v_fact->>'fact_key';
                end if;


                select es.id
                into v_source_id
                from public.entity_sources es
                where es.entity_id = v_entity_id
                  and es.url = v_source_object->>'url'
                limit 1;


                if v_source_id is null then
                    raise exception
                        'Database source not found for evidence key %',
                        v_evidence->>'source_key';
                end if;


                insert into public.entity_fact_sources (
                    fact_id,
                    source_id,
                    support_type,
                    is_independent,
                    evidence_locator,
                    evidence_excerpt
                )
                values (
                    v_fact_id,
                    v_source_id,
                    v_evidence->>'support_type',
                    (v_evidence->>'is_independent')::boolean,
                    v_evidence->>'evidence_locator',
                    null
                );

            end loop;

        end loop;

    end loop;

end
$arknoz$;


-- ============================================================
-- HARD DATABASE QA
-- ============================================================

do $arknoz_check$
declare
    v_projects integer;
    v_sources integer;
    v_facts integer;
    v_evidence integer;
    v_candidates integer;
    v_eligible integer;
    v_held integer;
    v_held_but_eligible integer;
    v_without_evidence integer;
    v_eligible_without_independent integer;
    v_draft_unverified integer;
begin

    select count(distinct entity_id)
    into v_projects
    from _arknoz_project_import_meta;


    select count(*)
    into v_sources
    from public.entity_sources
    where entity_id in (
        select distinct entity_id
        from _arknoz_project_import_meta
    );


    select count(*)
    into v_facts
    from public.entity_facts
    where id in (
        select fact_id
        from _arknoz_project_import_meta
    );


    select count(*)
    into v_evidence
    from public.entity_fact_sources
    where fact_id in (
        select fact_id
        from _arknoz_project_import_meta
    );


    select count(*)
    into v_candidates
    from public.entity_facts
    where id in (
        select fact_id
        from _arknoz_project_import_meta
    )
      and fact_status = 'candidate';


    select count(*)
    into v_eligible
    from _arknoz_project_import_meta
    where promotion_eligible = true;


    select count(*)
    into v_held
    from _arknoz_project_import_meta
    where publication_disposition = 'hold';


    select count(*)
    into v_held_but_eligible
    from _arknoz_project_import_meta
    where publication_disposition = 'hold'
      and promotion_eligible = true;


    select count(*)
    into v_without_evidence
    from _arknoz_project_import_meta m
    where not exists (
        select 1
        from public.entity_fact_sources efs
        where efs.fact_id = m.fact_id
    );


    select count(*)
    into v_eligible_without_independent
    from _arknoz_project_import_meta m
    where m.promotion_eligible = true
      and not exists (
          select 1
          from public.entity_fact_sources efs
          where efs.fact_id = m.fact_id
            and efs.is_independent = true
            and efs.support_type in (
                'supporting',
                'corroborating'
            )
      );


    select count(*)
    into v_draft_unverified
    from public.entities e
    where e.id in (
        select distinct entity_id
        from _arknoz_project_import_meta
    )
      and e.content_status = 'draft'
      and e.verification_status = 'unverified'
      and e.published_at is null;


    if v_projects <> 4 then
        raise exception
            'QA FAILED: projects expected 4, got %',
            v_projects;
    end if;


    if v_sources <> 15 then
        raise exception
            'QA FAILED: sources expected 15, got %',
            v_sources;
    end if;


    if v_facts <> 21 then
        raise exception
            'QA FAILED: facts expected 21, got %',
            v_facts;
    end if;


    if v_evidence <> 42 then
        raise exception
            'QA FAILED: evidence expected 42, got %',
            v_evidence;
    end if;


    if v_candidates <> 21 then
        raise exception
            'QA FAILED: every fact did not remain candidate';
    end if;


    if v_eligible <> 20 then
        raise exception
            'QA FAILED: eligible expected 20, got %',
            v_eligible;
    end if;


    if v_held <> 1 then
        raise exception
            'QA FAILED: held expected 1, got %',
            v_held;
    end if;


    if v_held_but_eligible <> 0 then
        raise exception
            'QA FAILED: held fact became promotion eligible';
    end if;


    if v_without_evidence <> 0 then
        raise exception
            'QA FAILED: % facts have no evidence',
            v_without_evidence;
    end if;


    if v_eligible_without_independent <> 0 then
        raise exception
            'QA FAILED: % eligible facts lack independent evidence',
            v_eligible_without_independent;
    end if;


    if v_draft_unverified <> 4 then
        raise exception
            'QA FAILED: all project entities are not draft/unverified';
    end if;

end
$arknoz_check$;


-- ============================================================
-- VISIBLE DRY-RUN RESULT
-- ============================================================

select
    count(distinct m.entity_id) as projects,

    (
        select count(*)
        from public.entity_sources s
        where s.entity_id in (
            select distinct entity_id
            from _arknoz_project_import_meta
        )
    ) as sources,

    (
        select count(*)
        from public.entity_facts f
        where f.id in (
            select fact_id
            from _arknoz_project_import_meta
        )
    ) as facts,

    (
        select count(*)
        from public.entity_fact_sources efs
        where efs.fact_id in (
            select fact_id
            from _arknoz_project_import_meta
        )
    ) as evidence_links,

    (
        select count(*)
        from public.entity_facts f
        where f.id in (
            select fact_id
            from _arknoz_project_import_meta
        )
          and f.fact_status = 'candidate'
    ) as candidate_facts,

    (
        select count(*)
        from _arknoz_project_import_meta
        where promotion_eligible = true
    ) as promotion_eligible,

    (
        select count(*)
        from _arknoz_project_import_meta
        where publication_disposition = 'hold'
    ) as held_facts,

    (
        select count(*)
        from _arknoz_project_import_meta
        where publication_disposition = 'hold'
          and promotion_eligible = true
    ) as held_but_eligible

from _arknoz_project_import_meta m;


select
    e.title as project,
    f.fact_key,
    f.fact_status,
    m.publication_disposition,
    m.promotion_eligible
from _arknoz_project_import_meta m
join public.entity_facts f
  on f.id = m.fact_id
join public.entities e
  on e.id = m.entity_id
where m.publication_disposition = 'hold';


rollback;