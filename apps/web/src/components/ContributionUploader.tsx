"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

type ContributionType =
  | "projects"
  | "products"
  | "knowledge"
  | "organisations"
  | "education"
  | "opportunities";

type FieldDefinition = {
  key: string;
  label: string;
  placeholder?: string;
  multiline?: boolean;
  required?: boolean;
};

type UploadSession = {
  importId: string;
  manifestKey: string;
  sourceKey: string;
  originalFilename: string;
  mimeType: string;
  declaredSizeBytes: number;
  uploadUrl: string;
  uploadHeaders: Record<
    string,
    string
  >;
  expiresInSeconds: number;
};

type FinalizedEvidence = {
  importId: string;
  manifestKey: string;
  filename: string;
  sizeBytes: number;
  sha256: string;
  status: string;
};

type SubmittedContribution = {
  importId: string;
  manifestKey: string;
  contributionType: string | null;
  title: string | null;
  reviewStatus: string | null;
  submittedAt: string | null;
  evidenceCount: number;
};

const MAX_FILE_BYTES =
  50 * 1024 * 1024;

const MAX_FILES = 10;

const ACCEPTED_EXTENSIONS = [
  ".pdf",
  ".json",
  ".csv",
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
];

const COMMON_FIELDS:
  FieldDefinition[] = [
    {
      key: "title",
      label: "Record title",
      placeholder:
        "Name of the project, product, research, organisation, programme or opportunity",
      required: true,
    },
    {
      key: "location",
      label: "Location / geography",
      placeholder:
        "City, country or Global",
    },
    {
      key: "summary",
      label: "What should Arknoz know?",
      placeholder:
        "Describe the record and why it is useful to the Built World.",
      multiline: true,
      required: true,
    },
    {
      key: "relationship",
      label:
        "Your relationship to this record",
      placeholder:
        "Architect, researcher, manufacturer, author, organiser, participant, institution representative, etc.",
      required: true,
    },
    {
      key: "sourceUrls",
      label:
        "Official / supporting source links",
      placeholder:
        "One URL per line",
      multiline: true,
    },
    {
      key: "notes",
      label:
        "Notes for Arknoz review",
      placeholder:
        "Anything the Arknoz reviewer should understand.",
      multiline: true,
    },
  ];

const TYPES: Array<{
  value: ContributionType;
  title: string;
  description: string;
  mapping: string;
  fields: FieldDefinition[];
}> = [
  {
    value: "projects",
    title: "Project",
    description:
      "Buildings, infrastructure, interiors, landscapes and other real Built World projects.",
    mapping:
      "Sydney-style canonical framework: identity, place, project facts, people, timeline, evidence, sources, rights and connections.",
    fields: [
      {
        key: "projectCategory",
        label: "Project type / category",
        placeholder:
          "Residential, hospital, infrastructure, workplace...",
      },
      {
        key: "projectStatus",
        label: "Project status",
        placeholder:
          "Concept, design, under construction, completed...",
      },
      {
        key: "year",
        label: "Year / period",
        placeholder:
          "2026 or 2022–2026",
      },
      {
        key: "role",
        label: "Your project role",
        placeholder:
          "Lead architect, consultant, client, contractor...",
      },
      {
        key: "organisation",
        label:
          "Organisation / practice",
        placeholder:
          "Practice, company or institution",
      },
      {
        key: "participants",
        label:
          "People & organisations involved",
        placeholder:
          "One participant or organisation per line",
        multiline: true,
      },
      {
        key: "projectFacts",
        label: "Key project facts",
        placeholder:
          "Area, height, programme, structural system, materials, capacity, etc.",
        multiline: true,
      },
      {
        key: "timeline",
        label: "Timeline / milestones",
        placeholder:
          "Competition, design, construction, completion...",
        multiline: true,
      },
      {
        key: "topics",
        label:
          "Topics / disciplines / themes",
        placeholder:
          "Architecture, sustainability, timber, healthcare...",
      },
    ],
  },
  {
    value: "products",
    title:
      "Product / Material / System",
    description:
      "Materials, components, technologies, systems and equipment.",
    mapping:
      "Maps into the Arknoz Product record with manufacturer, technical context, evidence and real applications.",
    fields: [
      {
        key: "manufacturer",
        label: "Manufacturer / maker",
        placeholder:
          "Organisation",
      },
      {
        key: "productCategory",
        label: "Product category",
        placeholder:
          "Material, component, system, equipment...",
      },
      {
        key: "model",
        label: "Product / model / system name",
      },
      {
        key: "applications",
        label:
          "Applications / use cases",
        multiline: true,
      },
      {
        key: "performance",
        label:
          "Technical / performance information",
        multiline: true,
      },
      {
        key: "certifications",
        label:
          "Certifications / standards",
        multiline: true,
      },
      {
        key: "topics",
        label: "Topics",
      },
    ],
  },
  {
    value: "knowledge",
    title:
      "Knowledge & Research",
    description:
      "Research, publications, case studies, standards, methods and technical knowledge.",
    mapping:
      "Maps into Arknoz Knowledge with authorship, publication context, sources, topics and evidence.",
    fields: [
      {
        key: "knowledgeType",
        label:
          "Knowledge / publication type",
        placeholder:
          "Research paper, case study, book, standard, method...",
      },
      {
        key: "authors",
        label: "Author(s)",
      },
      {
        key: "publisher",
        label:
          "Publisher / institution",
      },
      {
        key: "year",
        label:
          "Publication year",
      },
      {
        key: "identifier",
        label:
          "DOI / ISBN / reference",
      },
      {
        key: "topics",
        label:
          "Research topics",
      },
      {
        key: "findings",
        label:
          "Key findings / relevance",
        multiline: true,
      },
    ],
  },
  {
    value: "organisations",
    title:
      "Organisation / Practice",
    description:
      "Built World practices, companies, NGOs, public bodies and institutions.",
    mapping:
      "Maps into a canonical Organisation record and its genuine relationships.",
    fields: [
      {
        key: "organisationType",
        label:
          "Organisation type",
        placeholder:
          "Architecture practice, engineering consultant, developer...",
      },
      {
        key: "headquarters",
        label:
          "Headquarters / primary location",
      },
      {
        key: "website",
        label:
          "Official website",
      },
      {
        key: "disciplines",
        label:
          "Disciplines / capabilities",
        multiline: true,
      },
      {
        key: "founded",
        label:
          "Founded / established",
      },
    ],
  },
  {
    value: "education",
    title:
      "Education / University",
    description:
      "Universities, programmes, courses, workshops and professional learning.",
    mapping:
      "Maps into Arknoz Education / institution records with programme and learning context.",
    fields: [
      {
        key: "institution",
        label:
          "Institution",
      },
      {
        key: "programmeType",
        label:
          "Programme / learning type",
        placeholder:
          "Degree, course, studio, workshop, CPD...",
      },
      {
        key: "qualification",
        label:
          "Qualification / outcome",
      },
      {
        key: "delivery",
        label:
          "Delivery",
        placeholder:
          "Campus, online, hybrid...",
      },
      {
        key: "duration",
        label:
          "Duration",
      },
      {
        key: "website",
        label:
          "Official programme URL",
      },
      {
        key: "topics",
        label:
          "Subjects / skills",
      },
    ],
  },
  {
    value: "opportunities",
    title: "Opportunity",
    description:
      "Jobs, competitions, fellowships, grants, calls and professional collaborations.",
    mapping:
      "Maps into Arknoz Opportunities with organiser, dates, eligibility and official source.",
    fields: [
      {
        key: "opportunityType",
        label:
          "Opportunity type",
        placeholder:
          "Job, competition, fellowship, grant, research call...",
      },
      {
        key: "organiser",
        label:
          "Organisation / organiser",
      },
      {
        key: "deadline",
        label:
          "Deadline / important date",
      },
      {
        key: "eligibility",
        label: "Eligibility",
        multiline: true,
      },
      {
        key: "website",
        label:
          "Official opportunity URL",
      },
      {
        key: "topics",
        label:
          "Discipline / topic",
      },
    ],
  },
];

function extensionAllowed(
  filename: string
) {
  const lower =
    filename.toLowerCase();

  return ACCEPTED_EXTENSIONS.some(
    (extension) =>
      lower.endsWith(
        extension
      )
  );
}

function formatBytes(
  bytes: number
) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (
    bytes <
    1024 * 1024
  ) {
    return `${(
      bytes / 1024
    ).toFixed(1)} KB`;
  }

  return `${(
    bytes /
    (1024 * 1024)
  ).toFixed(1)} MB`;
}

function uploadDirectlyToR2(
  file: File,
  session: UploadSession
) {
  return new Promise<void>(
    (
      resolve,
      reject
    ) => {
      const xhr =
        new XMLHttpRequest();

      xhr.open(
        "PUT",
        session.uploadUrl
      );

      for (
        const [
          name,
          value,
        ] of Object.entries(
          session.uploadHeaders
        )
      ) {
        xhr.setRequestHeader(
          name,
          value
        );
      }

      xhr.onload = () => {
        if (
          xhr.status >= 200 &&
          xhr.status < 300
        ) {
          resolve();
          return;
        }

        reject(
          new Error(
            `Private upload failed with status ${xhr.status}.`
          )
        );
      };

      xhr.onerror = () => {
        reject(
          new Error(
            "The browser could not reach private Arknoz storage."
          )
        );
      };

      xhr.send(file);
    }
  );
}

export default function ContributionUploader() {
  const inputRef =
    useRef<HTMLInputElement>(
      null
    );

  const [
    contributionType,
    setContributionType,
  ] =
    useState<
      ContributionType | ""
    >("");

  const [
    values,
    setValues,
  ] =
    useState<
      Record<string, string>
    >({});

  const [
    files,
    setFiles,
  ] =
    useState<File[]>([]);

  const [
    busy,
    setBusy,
  ] =
    useState(false);

  const [
    progress,
    setProgress,
  ] =
    useState("");

  const [
    errorMessage,
    setErrorMessage,
  ] =
    useState("");

  const [
    draftMessage,
    setDraftMessage,
  ] =
    useState("");

  const [
    submitted,
    setSubmitted,
  ] =
    useState<
      SubmittedContribution | null
    >(null);

  useEffect(() => {
    try {
      const raw =
        window.localStorage.getItem(
          "arknoz-contribution-draft-v2"
        );

      if (!raw) {
        return;
      }

      const draft =
        JSON.parse(raw);

      queueMicrotask(() => {
        if (
          TYPES.some(
            (item) =>
              item.value ===
              draft?.contributionType
          )
        ) {
          setContributionType(
            draft.contributionType
          );
        }

        if (
          draft?.values &&
          typeof draft.values ===
            "object"
        ) {
          setValues(
            draft.values
          );
        }
      });
    } catch {
      // Fail closed: a broken local draft is ignored.
    }
  }, []);

  const selectedType =
    TYPES.find(
      (item) =>
        item.value ===
        contributionType
    );

  function updateValue(
    key: string,
    value: string
  ) {
    setValues(
      (current) => ({
        ...current,
        [key]: value,
      })
    );

    setDraftMessage("");
  }

  function saveDraft() {
    if (
      !contributionType
    ) {
      setDraftMessage(
        "Choose a contribution area before saving."
      );
      return;
    }

    window.localStorage.setItem(
      "arknoz-contribution-draft-v2",
      JSON.stringify({
        contributionType,
        values,
        savedAt:
          new Date().toISOString(),
      })
    );

    setDraftMessage(
      "Draft details saved on this device. Evidence files must be selected again when you return."
    );
  }

  function clearDraft() {
    window.localStorage.removeItem(
      "arknoz-contribution-draft-v2"
    );

    setContributionType("");
    setValues({});
    setFiles([]);
    setSubmitted(null);
    setErrorMessage("");
    setDraftMessage(
      "Draft cleared."
    );

    if (inputRef.current) {
      inputRef.current.value =
        "";
    }
  }

  function chooseFiles() {
    if (!busy) {
      inputRef.current?.click();
    }
  }

  function handleFiles(
    selected: FileList | null
  ) {
    setErrorMessage("");

    if (!selected) {
      return;
    }

    const incoming =
      Array.from(selected);

    const combined = [
      ...files,
      ...incoming,
    ];

    if (
      combined.length >
      MAX_FILES
    ) {
      setErrorMessage(
        `Maximum ${MAX_FILES} evidence files per contribution.`
      );
      return;
    }

    for (
      const file
      of combined
    ) {
      if (
        !extensionAllowed(
          file.name
        )
      ) {
        setErrorMessage(
          `${file.name}: unsupported file type.`
        );
        return;
      }

      if (
        file.size <= 0
      ) {
        setErrorMessage(
          `${file.name}: file is empty.`
        );
        return;
      }

      if (
        file.size >
        MAX_FILE_BYTES
      ) {
        setErrorMessage(
          `${file.name}: exceeds the 50 MB per-file limit.`
        );
        return;
      }
    }

    setFiles(
      combined
    );

    if (inputRef.current) {
      inputRef.current.value =
        "";
    }
  }

  function removeFile(
    index: number
  ) {
    if (busy) {
      return;
    }

    setFiles(
      (current) =>
        current.filter(
          (
            _,
            itemIndex
          ) =>
            itemIndex !==
            index
        )
    );
  }

  async function uploadEvidence(
    file: File
  ): Promise<
    FinalizedEvidence
  > {
    const createResponse =
      await fetch(
        "/api/contributions/create-upload",
        {
          method:
            "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body:
            JSON.stringify({
              filename:
                file.name,

              sizeBytes:
                file.size,
            }),
        }
      );

    const createData =
      await createResponse.json();

    if (
      !createResponse.ok ||
      !createData?.ok ||
      !createData?.upload
    ) {
      throw new Error(
        createData?.error ||
          "Arknoz could not prepare the evidence upload."
      );
    }

    const session =
      createData.upload as UploadSession;

    await uploadDirectlyToR2(
      file,
      session
    );

    const finalizeResponse =
      await fetch(
        "/api/contributions/finalize-upload",
        {
          method:
            "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body:
            JSON.stringify({
              manifestKey:
                session.manifestKey,
            }),
        }
      );

    const finalizeData =
      await finalizeResponse.json();

    if (
      !finalizeResponse.ok ||
      !finalizeData?.ok ||
      !finalizeData
        ?.contribution
    ) {
      throw new Error(
        finalizeData?.error ||
          "Arknoz could not verify the uploaded evidence."
      );
    }

    return finalizeData
      .contribution as FinalizedEvidence;
  }

  async function submitContribution() {
    if (
      busy ||
      !contributionType
    ) {
      return;
    }

    setErrorMessage("");
    setSubmitted(null);

    const title =
      String(
        values.title || ""
      ).trim();

    const summary =
      String(
        values.summary ||
          ""
      ).trim();

    const relationship =
      String(
        values.relationship ||
          ""
      ).trim();

    if (!title) {
      setErrorMessage(
        "Record title is required."
      );
      return;
    }

    if (!summary) {
      setErrorMessage(
        "Contribution summary is required."
      );
      return;
    }

    if (!relationship) {
      setErrorMessage(
        "Tell Arknoz your genuine relationship to the record."
      );
      return;
    }

    if (
      files.length === 0
    ) {
      setErrorMessage(
        "Add at least one evidence file before submission."
      );
      return;
    }

    try {
      setBusy(true);

      const uploaded:
        FinalizedEvidence[] =
        [];

      for (
        let index = 0;
        index <
        files.length;
        index += 1
      ) {
        setProgress(
          `Uploading evidence ${index + 1} of ${files.length}`
        );

        uploaded.push(
          await uploadEvidence(
            files[index]
          )
        );
      }

      const primary =
        uploaded[0];

      if (!primary) {
        throw new Error(
          "No verified evidence was available for submission."
        );
      }

      setProgress(
        "Submitting to Arknoz review"
      );

      const submitResponse =
        await fetch(
          "/api/contributions/submit",
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                manifestKey:
                  primary.manifestKey,

                supportingManifestKeys:
                  uploaded
                    .slice(1)
                    .map(
                      (item) =>
                        item.manifestKey
                    ),

                contributionType,

                declarationAccepted:
                  true,

                details: {
                  ...values,

                  contributionFramework:
                    contributionType ===
                    "projects"
                      ? "arknoz-sydney-project-framework"
                      : `arknoz-${contributionType}-canonical-framework`,

                  evidenceFileNames:
                    files.map(
                      (file) =>
                        file.name
                    ),
                },
              }),
          }
        );

      const data =
        await submitResponse.json();

      if (
        !submitResponse.ok ||
        !data?.ok ||
        !data?.contribution
      ) {
        throw new Error(
          data?.error ||
            "Contribution could not be submitted to Arknoz."
        );
      }

      setSubmitted(
        data.contribution
      );

      window.localStorage.removeItem(
        "arknoz-contribution-draft-v2"
      );

      setProgress("");
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Contribution could not be submitted."
      );
    } finally {
      setBusy(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-[26px] border border-emerald-200 bg-emerald-50 p-7">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-700">
          CONTRIBUTION SUBMITTED
        </p>

        <h2 className="mt-2 text-2xl font-bold text-slate-950">
          Sent to Arknoz review.
        </h2>

        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
          Nothing has been published automatically.
          Arknoz will review identity, duplicate or
          canonical matches, evidence, relationships,
          provenance and rights before any public record
          is created or enriched.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-[18px] bg-white p-4">
            <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400">
              Contribution ID
            </p>

            <p className="mt-2 break-all text-sm font-bold text-[#17315c]">
              {submitted.importId}
            </p>
          </div>

          <div className="rounded-[18px] bg-white p-4">
            <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400">
              Status
            </p>

            <p className="mt-2 text-sm font-bold text-[#17315c]">
              Submitted for review
            </p>
          </div>

          <div className="rounded-[18px] bg-white p-4">
            <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400">
              Evidence
            </p>

            <p className="mt-2 text-sm font-bold text-[#17315c]">
              {submitted.evidenceCount} file
              {submitted.evidenceCount === 1
                ? ""
                : "s"}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href="/dashboard/contributions"
            className="rounded-full bg-[#17315c] px-5 py-3 text-[11px] font-bold text-white"
          >
            View My Contributions
          </a>

          <button
            type="button"
            onClick={() => {
              setSubmitted(null);
              setContributionType("");
              setValues({});
              setFiles([]);
            }}
            className="rounded-full border border-slate-300 bg-white px-5 py-3 text-[11px] font-bold text-[#17315c]"
          >
            Start another contribution
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <section className="rounded-[26px] border border-slate-200 bg-white p-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-700">
          01 · CONTRIBUTION AREA
        </p>

        <h2 className="mt-2 text-2xl font-bold text-[#17315c]">
          What are you contributing?
        </h2>

        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {TYPES.map(
            (item) => {
              const active =
                contributionType ===
                item.value;

              return (
                <button
                  type="button"
                  key={item.value}
                  disabled={busy}
                  onClick={() => {
                    setContributionType(
                      item.value
                    );
                    setErrorMessage("");
                  }}
                  className={`rounded-[20px] border p-5 text-left transition ${
                    active
                      ? "border-[#17315c] bg-[#17315c] text-white"
                      : "border-slate-200 bg-[#f7f9fc] text-slate-950 hover:border-blue-300"
                  }`}
                >
                  <p className="text-sm font-bold">
                    {item.title}
                  </p>

                  <p
                    className={`mt-2 text-[11px] leading-5 ${
                      active
                        ? "text-slate-200"
                        : "text-slate-500"
                    }`}
                  >
                    {item.description}
                  </p>
                </button>
              );
            }
          )}
        </div>
      </section>

      {selectedType ? (
        <>
          <section className="rounded-[26px] border border-slate-200 bg-white p-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-700">
              02 · STRUCTURED RECORD
            </p>

            <h2 className="mt-2 text-2xl font-bold text-[#17315c]">
              {selectedType.title} information
            </h2>

            <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">
              {selectedType.mapping}
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {[
                ...COMMON_FIELDS,
                ...selectedType.fields,
              ].map(
                (field) => (
                  <label
                    key={field.key}
                    className={
                      field.multiline
                        ? "md:col-span-2"
                        : ""
                    }
                  >
                    <span className="text-[10px] font-bold uppercase tracking-[0.13em] text-slate-500">
                      {field.label}
                      {field.required
                        ? " *"
                        : ""}
                    </span>

                    {field.multiline ? (
                      <textarea
                        rows={4}
                        disabled={busy}
                        value={
                          values[
                            field.key
                          ] ?? ""
                        }
                        placeholder={
                          field.placeholder
                        }
                        onChange={(
                          event
                        ) =>
                          updateValue(
                            field.key,
                            event.target
                              .value
                          )
                        }
                        className="mt-2 w-full rounded-[16px] border border-slate-200 bg-[#fbfcfe] px-4 py-3 text-sm outline-none focus:border-blue-400"
                      />
                    ) : (
                      <input
                        type="text"
                        disabled={busy}
                        value={
                          values[
                            field.key
                          ] ?? ""
                        }
                        placeholder={
                          field.placeholder
                        }
                        onChange={(
                          event
                        ) =>
                          updateValue(
                            field.key,
                            event.target
                              .value
                          )
                        }
                        className="mt-2 w-full rounded-[16px] border border-slate-200 bg-[#fbfcfe] px-4 py-3 text-sm outline-none focus:border-blue-400"
                      />
                    )}
                  </label>
                )
              )}
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                type="button"
                disabled={busy}
                onClick={saveDraft}
                className="rounded-full border border-slate-300 bg-white px-5 py-2.5 text-[11px] font-bold text-[#17315c]"
              >
                Save Draft
              </button>

              <button
                type="button"
                disabled={busy}
                onClick={clearDraft}
                className="text-[11px] font-bold text-slate-500"
              >
                Clear Draft
              </button>
            </div>

            {draftMessage ? (
              <p className="mt-3 text-xs leading-5 text-slate-500">
                {draftMessage}
              </p>
            ) : null}
          </section>

          <section className="rounded-[26px] border border-slate-200 bg-white p-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-700">
              03 · EVIDENCE & SOURCES
            </p>

            <h2 className="mt-2 text-2xl font-bold text-[#17315c]">
              Add supporting evidence
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              Add up to {MAX_FILES} PDFs, images,
              JSON or CSV evidence files. Each file
              remains private during review. Maximum
              size is 50 MB per file.
            </p>

            <input
              ref={inputRef}
              type="file"
              multiple
              disabled={busy}
              accept=".pdf,.json,.csv,.jpg,.jpeg,.png,.webp"
              className="hidden"
              onChange={(
                event
              ) =>
                handleFiles(
                  event.target.files
                )
              }
            />

            <button
              type="button"
              disabled={busy}
              onClick={chooseFiles}
              className="mt-5 rounded-full bg-[#17315c] px-5 py-3 text-[11px] font-bold text-white disabled:opacity-50"
            >
              Add Evidence Files
            </button>

            {files.length ? (
              <div className="mt-5 space-y-2">
                {files.map(
                  (
                    file,
                    index
                  ) => (
                    <div
                      key={`${file.name}-${index}`}
                      className="flex items-center justify-between gap-4 rounded-[16px] bg-[#f5f7fa] px-4 py-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold">
                          {file.name}
                        </p>

                        <p className="mt-1 text-[10px] text-slate-500">
                          {formatBytes(
                            file.size
                          )}
                        </p>
                      </div>

                      <button
                        type="button"
                        disabled={busy}
                        onClick={() =>
                          removeFile(
                            index
                          )
                        }
                        className="text-[10px] font-bold text-slate-500"
                      >
                        Remove
                      </button>
                    </div>
                  )
                )}
              </div>
            ) : (
              <div className="mt-5 rounded-[18px] border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-500">
                No evidence files selected yet.
              </div>
            )}
          </section>

          <section className="rounded-[26px] border border-slate-200 bg-white p-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-700">
              04 · REVIEW & SUBMIT
            </p>

            <h2 className="mt-2 text-2xl font-bold text-[#17315c]">
              Submit to Arknoz
            </h2>

            <div className="mt-4 rounded-[18px] bg-[#f5f7fa] p-5 text-xs leading-6 text-slate-600">
              By submitting, you confirm that the
              information is provided responsibly,
              that you have authority or permission
              to provide the uploaded material, and
              that Arknoz must independently review
              identity, sources, rights, relationships
              and duplicate/canonical matching before
              anything becomes public.
            </div>

            {progress ? (
              <p className="mt-4 text-sm font-bold text-blue-700">
                {progress}...
              </p>
            ) : null}

            {errorMessage ? (
              <div className="mt-4 rounded-[16px] border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {errorMessage}
              </div>
            ) : null}

            <button
              type="button"
              disabled={busy}
              onClick={
                submitContribution
              }
              className="mt-5 rounded-full bg-[#17315c] px-6 py-3 text-[11px] font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy
                ? "Submitting Contribution..."
                : "Submit for Arknoz Review"}
            </button>

            <p className="mt-3 text-[10px] leading-5 text-slate-500">
              Submission does not create a public
              record automatically.
            </p>
          </section>
        </>
      ) : (
        <div className="rounded-[24px] border border-dashed border-slate-300 bg-white p-7 text-sm text-slate-500">
          Choose one of the six contribution areas
          above to open the structured form.
        </div>
      )}
    </div>
  );
}
