"use client";

import { createClient } from "@/lib/supabase/client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import type {
  OrganisationKind,
  OrganisationModuleTemplate,
} from "@/lib/workspaces/organisation-module-definitions";


type Field = {
  id: string;
  label: string;
  type:
    | "text"
    | "textarea"
    | "url"
    | "email"
    | "number"
    | "date"
    | "select";

  required?: boolean;
  placeholder?: string;
  options?: string[];
};

type Section = {
  id: string;
  title: string;
  description: string;
  fields: Field[];
};


function profileSections(
  kind: OrganisationKind
): Section[] {
  const identityName =
    kind === "company"
      ? "Company"
      : kind === "university"
        ? "University"
        : "Institution";

  const typeOptions =
    kind === "company"
      ? [
          "Architecture practice",
          "Engineering consultancy",
          "Contractor",
          "Developer",
          "Manufacturer",
          "Supplier",
          "Professional consultancy",
          "Technology company",
          "Other",
        ]
      : kind === "university"
        ? [
            "University",
            "School",
            "Faculty",
            "College",
            "Research university",
            "Technical university",
            "Other",
          ]
        : [
            "Government body",
            "Research institution",
            "Professional body",
            "NGO",
            "Foundation",
            "Standards body",
            "International organisation",
            "Other",
          ];

  return [
    {
      id: "identity",
      title: `${identityName} Identity`,
      description:
        "Core public identity and organisation information.",

      fields: [
        {
          id: "display_name",
          label: `${identityName} name`,
          type: "text",
          required: true,
        },
        {
          id: "legal_name",
          label: "Legal / registered name",
          type: "text",
        },
        {
          id: "organisation_type",
          label: "Organisation type",
          type: "select",
          required: true,
          options: typeOptions,
        },
        {
          id: "founded_year",
          label: "Year founded",
          type: "number",
        },
        {
          id: "website",
          label: "Official website",
          type: "url",
          required: true,
        },
        {
          id: "country",
          label: "Primary country",
          type: "text",
          required: true,
        },
        {
          id: "headquarters",
          label:
            kind === "university"
              ? "Main campus / headquarters"
              : "Headquarters",
          type: "text",
          required: true,
        },
      ],
    },

    {
      id: "about",
      title: "About",
      description:
        "How the organisation describes itself publicly.",

      fields: [
        {
          id: "short_intro",
          label: "Short introduction",
          type: "textarea",
          required: true,
          placeholder:
            "A concise public introduction.",
        },
        {
          id: "full_overview",
          label: "Full overview",
          type: "textarea",
        },
        {
          id: "disciplines",
          label: "Disciplines / areas of work",
          type: "text",
          placeholder:
            "Comma separated",
        },
        {
          id: "sectors",
          label: "Sectors",
          type: "text",
          placeholder:
            "Comma separated",
        },
        {
          id: "markets",
          label:
            kind === "university"
              ? "Research / academic focus"
              : "Markets / geographic focus",
          type: "text",
        },
        {
          id: "languages",
          label: "Languages",
          type: "text",
        },
      ],
    },

    {
      id: "locations-contact",
      title: "Locations & Contact",
      description:
        "Public offices and official contact information.",

      fields: [
        {
          id: "office_locations",
          label:
            kind === "university"
              ? "Campuses / locations"
              : "Offices / locations",
          type: "textarea",
        },
        {
          id: "public_email",
          label: "Public email",
          type: "email",
        },
        {
          id: "public_phone",
          label: "Public phone",
          type: "text",
        },
        {
          id: "linkedin",
          label: "LinkedIn / professional link",
          type: "url",
        },
      ],
    },

    {
      id: "brand-media",
      title: "Brand & Media",
      description:
        "Approved public organisation media.",

      fields: [
        {
          id: "logo_reference",
          label: "Logo file / media reference",
          type: "text",
        },
        {
          id: "cover_reference",
          label: "Cover image reference",
          type: "text",
        },
        {
          id: "media_rights",
          label: "Media rights / provenance note",
          type: "textarea",
        },
      ],
    },

    {
      id: "verification",
      title: "Verification & Provenance",
      description:
        "Evidence supporting the organisation identity.",

      fields: [
        {
          id: "authoritative_source",
          label: "Authoritative source URL",
          type: "url",
          required: true,
        },
        {
          id: "authorised_representative",
          label: "Authorised representative",
          type: "text",
          required: true,
        },
        {
          id: "evidence_notes",
          label: "Identity / verification notes",
          type: "textarea",
        },
      ],
    },
  ];
}


function peopleSections(
  entityLabel: string
): Section[] {
  return [
    {
      id: "person",
      title: entityLabel,
      description:
        "Connect a genuine person to this workspace.",

      fields: [
        {
          id: "person_name",
          label: "Person name",
          type: "text",
          required: true,
        },
        {
          id: "role_title",
          label: "Role / title",
          type: "text",
          required: true,
        },
        {
          id: "department",
          label: "Department / team",
          type: "text",
        },
        {
          id: "arknoz_profile",
          label: "Existing Arknoz profile URL",
          type: "url",
        },
        {
          id: "relationship",
          label: "Relationship to organisation",
          type: "select",
          required: true,
          options: [
            "Current",
            "Former",
            "Advisor",
            "Leadership",
            "Researcher / faculty",
            "Other",
          ],
        },
      ],
    },

    {
      id: "evidence",
      title: "Evidence & Public Status",
      description:
        "Support the claimed relationship.",

      fields: [
        {
          id: "source_url",
          label: "Official source URL",
          type: "url",
        },
        {
          id: "start_date",
          label: "Start date",
          type: "date",
        },
        {
          id: "end_date",
          label: "End date",
          type: "date",
        },
        {
          id: "notes",
          label: "Notes / evidence",
          type: "textarea",
        },
      ],
    },
  ];
}


function catalogueSections(
  entityLabel: string
): Section[] {
  return [
    {
      id: "record",
      title: `${entityLabel} Record`,
      description:
        `Create or connect a genuine ${entityLabel.toLowerCase()} record.`,

      fields: [
        {
          id: "title",
          label: `${entityLabel} title`,
          type: "text",
          required: true,
        },
        {
          id: "record_type",
          label: "Type / category",
          type: "text",
          required: true,
        },
        {
          id: "summary",
          label: "Summary",
          type: "textarea",
          required: true,
        },
        {
          id: "status",
          label: "Status",
          type: "select",
          options: [
            "Current",
            "Completed",
            "Planned",
            "Published",
            "Archived",
          ],
        },
        {
          id: "location",
          label: "Location",
          type: "text",
        },
        {
          id: "year",
          label: "Year",
          type: "number",
        },
      ],
    },

    {
      id: "source",
      title: "Source & Relationship",
      description:
        "Connect the record to source evidence.",

      fields: [
        {
          id: "public_url",
          label: "Official / public URL",
          type: "url",
        },
        {
          id: "source_url",
          label: "Source / evidence URL",
          type: "url",
          required: true,
        },
        {
          id: "relationship",
          label: "Organisation relationship",
          type: "textarea",
        },
        {
          id: "notes",
          label: "Internal notes",
          type: "textarea",
        },
      ],
    },
  ];
}


function opportunitySections(
  entityLabel: string
): Section[] {
  return [
    {
      id: "opportunity",
      title: entityLabel,
      description:
        "Create a genuine opportunity record.",

      fields: [
        {
          id: "title",
          label: "Opportunity title",
          type: "text",
          required: true,
        },
        {
          id: "opportunity_type",
          label: "Opportunity type",
          type: "select",
          required: true,
          options: [
            "Job",
            "Competition",
            "Research call",
            "Grant",
            "Collaboration",
            "Internship",
            "Scholarship",
            "Other",
          ],
        },
        {
          id: "summary",
          label: "Summary",
          type: "textarea",
          required: true,
        },
        {
          id: "deadline",
          label: "Deadline",
          type: "date",
        },
        {
          id: "eligibility",
          label: "Eligibility",
          type: "textarea",
        },
        {
          id: "location",
          label: "Location / remote",
          type: "text",
        },
      ],
    },

    {
      id: "source",
      title: "Application & Source",
      description:
        "Official application and provenance details.",

      fields: [
        {
          id: "application_url",
          label: "Application URL",
          type: "url",
        },
        {
          id: "source_url",
          label: "Official source URL",
          type: "url",
          required: true,
        },
        {
          id: "contact",
          label: "Public contact",
          type: "text",
        },
      ],
    },
  ];
}


function contributionSections(
  entityLabel: string
): Section[] {
  return [
    {
      id: "contribution",
      title: entityLabel,
      description:
        "Prepare a structured contribution for Arknoz review.",

      fields: [
        {
          id: "contribution_type",
          label: "Contribution type",
          type: "select",
          required: true,
          options: [
            "Project",
            "Product / Material / System",
            "Knowledge & Research",
            "Organisation",
            "Education",
            "Opportunity",
          ],
        },
        {
          id: "title",
          label: "Contribution title",
          type: "text",
          required: true,
        },
        {
          id: "summary",
          label: "Summary",
          type: "textarea",
          required: true,
        },
        {
          id: "relationship",
          label: "Organisation relationship",
          type: "textarea",
          required: true,
        },
      ],
    },

    {
      id: "evidence",
      title: "Evidence & Sources",
      description:
        "Source-backed information only.",

      fields: [
        {
          id: "source_url",
          label: "Primary source URL",
          type: "url",
          required: true,
        },
        {
          id: "supporting_sources",
          label: "Supporting sources",
          type: "textarea",
        },
        {
          id: "rights_notes",
          label: "Rights / provenance notes",
          type: "textarea",
        },
      ],
    },
  ];
}


function portfolioSections(): Section[] {
  return [
    {
      id: "portfolio",
      title: "Portfolio Workspace",
      description:
        "Create a structured portfolio grouping.",

      fields: [
        {
          id: "portfolio_name",
          label: "Portfolio name",
          type: "text",
          required: true,
        },
        {
          id: "objective",
          label: "Purpose / objective",
          type: "textarea",
          required: true,
        },
        {
          id: "geography",
          label: "Geographic scope",
          type: "text",
        },
        {
          id: "sectors",
          label: "Sectors / themes",
          type: "text",
        },
        {
          id: "record_links",
          label: "Included Arknoz record links",
          type: "textarea",
        },
      ],
    },

    {
      id: "management",
      title: "Portfolio Management",
      description:
        "Internal portfolio organisation.",

      fields: [
        {
          id: "status",
          label: "Status",
          type: "select",
          options: [
            "Active",
            "Planning",
            "Archived",
          ],
        },
        {
          id: "owner",
          label: "Portfolio owner",
          type: "text",
        },
        {
          id: "notes",
          label: "Notes",
          type: "textarea",
        },
      ],
    },
  ];
}


function collaborationSections(
  entityLabel: string
): Section[] {
  return [
    {
      id: "collaboration",
      title: entityLabel,
      description:
        "Record a genuine collaboration or partner relationship.",

      fields: [
        {
          id: "partner",
          label: "Partner organisation",
          type: "text",
          required: true,
        },
        {
          id: "collaboration_type",
          label: "Collaboration type",
          type: "select",
          required: true,
          options: [
            "Project collaboration",
            "Research",
            "Industry partnership",
            "Knowledge partnership",
            "Programme",
            "Strategic relationship",
            "Other",
          ],
        },
        {
          id: "summary",
          label: "Relationship summary",
          type: "textarea",
          required: true,
        },
        {
          id: "start_date",
          label: "Start date",
          type: "date",
        },
        {
          id: "status",
          label: "Status",
          type: "select",
          options: [
            "Active",
            "Completed",
            "Planned",
          ],
        },
      ],
    },

    {
      id: "evidence",
      title: "Evidence",
      description:
        "Support the collaboration relationship.",

      fields: [
        {
          id: "source_url",
          label: "Public / official source",
          type: "url",
        },
        {
          id: "notes",
          label: "Evidence notes",
          type: "textarea",
        },
      ],
    },
  ];
}


function evidenceSections(
  entityLabel: string
): Section[] {
  return [
    {
      id: "evidence",
      title: entityLabel,
      description:
        "Add source-backed evidence or publication information.",

      fields: [
        {
          id: "title",
          label: "Title",
          type: "text",
          required: true,
        },
        {
          id: "evidence_type",
          label: "Evidence type",
          type: "select",
          required: true,
          options: [
            "Publication",
            "Report",
            "Dataset",
            "Standard",
            "Impact evidence",
            "Case study",
            "Source document",
            "Other",
          ],
        },
        {
          id: "source_url",
          label: "Source URL",
          type: "url",
          required: true,
        },
        {
          id: "publication_date",
          label: "Publication date",
          type: "date",
        },
        {
          id: "identifier",
          label: "DOI / ISBN / identifier",
          type: "text",
        },
        {
          id: "summary",
          label: "Summary",
          type: "textarea",
        },
        {
          id: "rights",
          label: "Rights / provenance",
          type: "textarea",
        },
      ],
    },
  ];
}


function intelligenceSections(
  entityLabel: string
): Section[] {
  return [
    {
      id: "scope",
      title: entityLabel,
      description:
        "Define an intelligence view without fabricating analysis.",

      fields: [
        {
          id: "view_name",
          label: "View name",
          type: "text",
          required: true,
        },
        {
          id: "geography",
          label: "Geography",
          type: "text",
        },
        {
          id: "sectors",
          label: "Sectors / topics",
          type: "text",
        },
        {
          id: "period",
          label: "Period / time horizon",
          type: "text",
        },
        {
          id: "comparison",
          label: "Comparison focus",
          type: "textarea",
        },
        {
          id: "notes",
          label: "Research notes",
          type: "textarea",
        },
      ],
    },
  ];
}


function analyticsSections(
  entityLabel: string
): Section[] {
  return [
    {
      id: "analytics",
      title: entityLabel,
      description:
        "Configure an analytics or benchmarking view.",

      fields: [
        {
          id: "view_name",
          label: "View name",
          type: "text",
          required: true,
        },
        {
          id: "metric_focus",
          label: "Metric / analysis focus",
          type: "text",
          required: true,
        },
        {
          id: "date_range",
          label: "Date range",
          type: "text",
        },
        {
          id: "benchmark_group",
          label: "Benchmark / comparison group",
          type: "text",
        },
        {
          id: "filters",
          label: "Filters",
          type: "textarea",
        },
        {
          id: "notes",
          label: "Notes",
          type: "textarea",
        },
      ],
    },
  ];
}


function permissionSections(
  entityLabel: string
): Section[] {
  return [
    {
      id: "member",
      title: entityLabel,
      description:
        "Prepare a workspace role and permission assignment.",

      fields: [
        {
          id: "email",
          label: "Member email",
          type: "email",
          required: true,
        },
        {
          id: "role",
          label: "Workspace role",
          type: "select",
          required: true,
          options: [
            "Owner",
            "Organisation Admin",
            "Editor",
            "Contributor",
            "Reviewer",
            "Viewer",
          ],
        },
        {
          id: "scope",
          label: "Access scope",
          type: "select",
          options: [
            "Entire workspace",
            "Selected modules",
            "Selected records",
          ],
        },
        {
          id: "modules",
          label: "Permitted modules / records",
          type: "textarea",
        },
        {
          id: "expiry",
          label: "Access expiry",
          type: "date",
        },
        {
          id: "notes",
          label: "Permission notes",
          type: "textarea",
        },
      ],
    },
  ];
}


export function buildOrganisationSections(
  template: OrganisationModuleTemplate,
  kind: OrganisationKind,
  entityLabel: string
): Section[] {
  switch (template) {
    case "profile":
      return profileSections(kind);

    case "people":
      return peopleSections(entityLabel);

    case "catalogue":
      return catalogueSections(entityLabel);

    case "opportunity":
      return opportunitySections(entityLabel);

    case "contribution":
      return contributionSections(entityLabel);

    case "portfolio":
      return portfolioSections();

    case "collaboration":
      return collaborationSections(entityLabel);

    case "evidence":
      return evidenceSections(entityLabel);

    case "intelligence":
      return intelligenceSections(entityLabel);

    case "analytics":
      return analyticsSections(entityLabel);

    case "permissions":
      return permissionSections(entityLabel);
  }
}


export default function ProductionOrganisationModuleWorkspace({
  kind,
  moduleId,
  template,
  entityLabel,
  workspaceId,
  userId,
}: {
  kind: OrganisationKind;
  moduleId: string;
  template: OrganisationModuleTemplate;
  entityLabel: string;
  workspaceId: string;
  userId: string;
}) {
  const sections =
    useMemo(
      () =>
        buildOrganisationSections(
          template,
          kind,
          entityLabel
        ),
      [
        template,
        kind,
        entityLabel,
      ]
    );

  const supabase =
    useMemo(
      () => createClient(),
      []
    );

  const [values, setValues] =
    useState<
      Record<string, string>
    >({});

  const [loaded, setLoaded] =
    useState(false);

  const [savedAt, setSavedAt] =
    useState<string | null>(
      null
    );

  const [
    recordId,
    setRecordId,
  ] =
    useState<string | null>(
      null
    );

  const [
    saveBusy,
    setSaveBusy,
  ] =
    useState(false);


  useEffect(() => {

    let cancelled =
      false;


    async function loadDraft() {

      const {
        data:
          records,

        error,
      } =
        await supabase
          .from(
            "organisation_workspace_records"
          )
          .select(
            "id, payload, updated_at"
          )
          .eq(
            "workspace_id",
            workspaceId
          )
          .eq(
            "module_key",
            moduleId
          )
          .eq(
            "record_kind",
            "module_draft"
          )
          .eq(
            "record_status",
            "draft"
          )
          .order(
            "updated_at",
            {
              ascending:
                false,
            }
          )
          .limit(1);


      if (cancelled) {
        return;
      }


      if (error) {
        console.error(
          "Arknoz workspace draft load failed.",
          error
        );

        setLoaded(true);
        return;
      }


      const record =
        records?.[0] ??
        null;


      if (
        record?.payload &&
        typeof record.payload ===
          "object" &&
        !Array.isArray(
          record.payload
        )
      ) {

        const nextValues =
          Object.fromEntries(
            Object.entries(
              record.payload
            ).filter(
              ([, value]) =>
                typeof value ===
                  "string"
            )
          ) as Record<
            string,
            string
          >;


        setValues(
          nextValues
        );
      }


      if (record) {

        setRecordId(
          record.id
        );

        setSavedAt(
          new Date(
            record.updated_at
          ).toLocaleTimeString(
            [],
            {
              hour:
                "2-digit",

              minute:
                "2-digit",
            }
          )
        );
      }


      setLoaded(true);
    }


    void loadDraft();


    return () => {
      cancelled =
        true;
    };

  }, [
    supabase,
    workspaceId,
    moduleId,
  ]);


  function updateField(
    id: string,
    value: string
  ) {

    setValues(
      (current) => ({
        ...current,
        [id]:
          value,
      })
    );
  }


  async function saveDraft() {

    if (saveBusy) {
      return;
    }


    setSaveBusy(true);


    try {

      let saved:
        {
          id: string;
          updated_at:
            string;
        } |
        null =
          null;


      if (recordId) {

        const {
          data,
          error,
        } =
          await supabase
            .from(
              "organisation_workspace_records"
            )
            .update({
              title:
                `${entityLabel} draft`,

              payload:
                values,

              record_status:
                "draft",
            })
            .eq(
              "id",
              recordId
            )
            .eq(
              "workspace_id",
              workspaceId
            )
            .select(
              "id, updated_at"
            )
            .single();


        if (error) {
          throw error;
        }


        saved =
          data;
      }

      else {

        const {
          data,
          error,
        } =
          await supabase
            .from(
              "organisation_workspace_records"
            )
            .insert({
              workspace_id:
                workspaceId,

              module_key:
                moduleId,

              record_kind:
                "module_draft",

              title:
                `${entityLabel} draft`,

              payload:
                values,

              record_status:
                "draft",

              created_by_user_id:
                userId,
            })
            .select(
              "id, updated_at"
            )
            .single();


        if (error) {
          throw error;
        }


        saved =
          data;
      }


      if (saved) {

        setRecordId(
          saved.id
        );

        setSavedAt(
          new Date(
            saved.updated_at
          ).toLocaleTimeString(
            [],
            {
              hour:
                "2-digit",

              minute:
                "2-digit",
            }
          )
        );
      }
    }

    catch (error) {

      console.error(
        "Arknoz workspace draft save failed.",
        error
      );

      window.alert(
        "Draft could not be saved to Arknoz."
      );
    }

    finally {

      setSaveBusy(false);
    }
  }


  async function clearDraft() {

    const confirmed =
      window.confirm(
        "Clear this Arknoz workspace draft?"
      );


    if (!confirmed) {
      return;
    }


    if (recordId) {

      const {
        error,
      } =
        await supabase
          .from(
            "organisation_workspace_records"
          )
          .delete()
          .eq(
            "id",
            recordId
          )
          .eq(
            "workspace_id",
            workspaceId
          );


      if (error) {

        console.error(
          "Arknoz workspace draft clear failed.",
          error
        );

        window.alert(
          "Arknoz draft could not be cleared."
        );

        return;
      }
    }


    setValues({});
    setRecordId(null);
    setSavedAt(null);
  }


  const requiredFields =
    sections.flatMap(
      (section) =>
        section.fields.filter(
          (field) =>
            field.required
        )
    );

  const completedRequired =
    requiredFields.filter(
      (field) =>
        Boolean(
          values[field.id]?.trim()
        )
    ).length;

  const completion =
    requiredFields.length === 0
      ? 100
      : Math.round(
          (
            completedRequired /
            requiredFields.length
          ) *
            100
        );


  if (!loaded) {
    return (
      <div className="rounded-[20px] border border-slate-200 bg-white p-5 text-sm text-slate-500">
        Loading draft...
      </div>
    );
  }


  return (
    <div>
      <div className="flex flex-col gap-3 rounded-[20px] border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-400">
            ARKNOZ WORKSPACE DRAFT
          </p>

          <p className="mt-1 text-sm font-bold text-[#17315c]">
            {completion}% required information complete
          </p>

          <p className="mt-1 text-[10px] text-slate-400">
            Secure workspace persistence is active. Use Save Draft to store changes.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={clearDraft}
            className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-50"
          >
            Clear
          </button>

          <button
            type="button"
            disabled={saveBusy}
            onClick={saveDraft}
            className="rounded-xl bg-[#17315c] px-4 py-2 text-xs font-bold text-white"
          >
            {saveBusy ? "Saving..." : "Save Draft"}
          </button>
        </div>
      </div>

      {savedAt ? (
        <p className="mt-2 text-right text-[10px] text-slate-400">
          Draft saved at {savedAt}
        </p>
      ) : null}

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        {sections.map(
          (section) => (
            <section
              key={section.id}
              className="rounded-[20px] border border-slate-200 bg-white p-5"
            >
              <h2 className="text-base font-bold text-[#17315c]">
                {section.title}
              </h2>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                {section.description}
              </p>

              <div className="mt-5 grid gap-4">
                {section.fields.map(
                  (field) => (
                    <label
                      key={field.id}
                      className="block"
                    >
                      <span className="text-xs font-bold text-slate-700">
                        {field.label}

                        {field.required
                          ? " *"
                          : ""}
                      </span>

                      {field.type ===
                      "textarea" ? (
                        <textarea
                          value={
                            values[
                              field.id
                            ] ?? ""
                          }
                          onChange={(
                            event
                          ) =>
                            updateField(
                              field.id,
                              event.target
                                .value
                            )
                          }
                          placeholder={
                            field.placeholder
                          }
                          rows={4}
                          className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-300"
                        />
                      ) : field.type ===
                        "select" ? (
                        <select
                          value={
                            values[
                              field.id
                            ] ?? ""
                          }
                          onChange={(
                            event
                          ) =>
                            updateField(
                              field.id,
                              event.target
                                .value
                            )
                          }
                          className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-300"
                        >
                          <option value="">
                            Select
                          </option>

                          {field.options?.map(
                            (option) => (
                              <option
                                key={
                                  option
                                }
                                value={
                                  option
                                }
                              >
                                {
                                  option
                                }
                              </option>
                            )
                          )}
                        </select>
                      ) : (
                        <input
                          type={
                            field.type
                          }
                          value={
                            values[
                              field.id
                            ] ?? ""
                          }
                          onChange={(
                            event
                          ) =>
                            updateField(
                              field.id,
                              event.target
                                .value
                            )
                          }
                          placeholder={
                            field.placeholder
                          }
                          className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-300"
                        />
                      )}
                    </label>
                  )
                )}
              </div>
            </section>
          )
        )}
      </div>
    </div>
  );
}