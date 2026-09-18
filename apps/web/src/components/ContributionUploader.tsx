"use client";

import { useRef, useState } from "react";

type UploadSession = {
  importId: string;
  manifestKey: string;
  sourceKey: string;
  originalFilename: string;
  mimeType: string;
  declaredSizeBytes: number;
  uploadUrl: string;
  uploadHeaders: Record<string, string>;
  expiresInSeconds: number;
};

type FinalizedContribution = {
  importId: string;
  manifestKey: string;
  filename: string;
  sizeBytes: number;
  sha256: string;
  status: string;
  rights: string;
  publicationAllowed: boolean;
};

type SubmittedContribution = {
  importId: string | null;
  manifestKey: string;
  contributionType: string | null;
  reviewStatus: string | null;
  publicationAllowed: boolean;
};

type Stage =
  | "idle"
  | "preparing"
  | "uploading"
  | "finalizing"
  | "complete"
  | "error";

const MAX_FILE_BYTES =
  50 * 1024 * 1024;

const ACCEPTED_EXTENSIONS = [
  ".pdf",
  ".json",
  ".csv",
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
];

const CONTRIBUTION_TYPES = [
  {
    value: "projects",
    title: "Projects",
    description:
      "Buildings, infrastructure, transport, cities, industrial, energy, landscape and public realm.",
  },
  {
    value: "products_materials",
    title: "Products & Materials",
    description:
      "Products, materials, components, systems, equipment and technical solutions.",
  },
  {
    value: "knowledge_publications",
    title: "Knowledge & Publications",
    description:
      "Books, research, publications, reports, case studies, methods and professional knowledge.",
  },
  {
    value: "education_learning",
    title: "Education & Learning",
    description:
      "Courses, programmes, workshops, qualifications and learning resources.",
  },
  {
    value: "jobs_opportunities",
    title: "Jobs & Opportunities",
    description:
      "Jobs, competitions, grants, calls, fellowships and professional opportunities.",
  },
  {
    value: "people_professionals",
    title: "People & Professionals",
    description:
      "Architects, engineers, designers, researchers, specialists and Built World professionals.",
  },
  {
    value: "organisations",
    title: "Organisations",
    description:
      "Companies, practices, institutions, NGOs, associations and public bodies.",
  },
  {
    value: "universities_schools",
    title: "Universities & Schools",
    description:
      "Universities, schools, faculties, departments and research centres.",
  },
  {
    value: "places_geography",
    title: "Places & Geography",
    description:
      "Cities, regions, districts, locations and geographically connected information.",
  },
  {
    value: "community_collaboration",
    title: "Community & Collaboration",
    description:
      "Collaborations, chapters, initiatives, contributions, development and relevant news.",
  },
  {
    value: "standards_references_data",
    title: "Standards, References & Data",
    description:
      "Standards, datasets, classifications, guidance and technical references.",
  },
  {
    value: "other_built_world",
    title: "Other Built World",
    description:
      "Relevant Built World information that does not clearly fit another category.",
  },
];

function formatBytes(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(
      bytes / 1024
    ).toFixed(1)} KB`;
  }

  return `${(
    bytes /
    (1024 * 1024)
  ).toFixed(1)} MB`;
}

function extensionAllowed(
  filename: string
) {
  const lower =
    filename.toLowerCase();

  return ACCEPTED_EXTENSIONS.some(
    (extension) =>
      lower.endsWith(extension)
  );
}

function uploadDirectlyToR2(
  file: File,
  session: UploadSession,
  onProgress: (
    percent: number
  ) => void
) {
  return new Promise<void>(
    (resolve, reject) => {
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

      xhr.upload.onprogress = (
        event
      ) => {
        if (
          !event.lengthComputable
        ) {
          return;
        }

        const percent =
          Math.round(
            (
              event.loaded /
              event.total
            ) * 100
          );

        onProgress(
          Math.min(
            100,
            Math.max(
              0,
              percent
            )
          )
        );
      };

      xhr.onload = () => {
        if (
          xhr.status >= 200 &&
          xhr.status < 300
        ) {
          onProgress(100);
          resolve();
          return;
        }

        reject(
          new Error(
            `Private source upload failed with status ${xhr.status}.`
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

      xhr.onabort = () => {
        reject(
          new Error(
            "Upload was cancelled."
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
    useState("");

  const [
    selectedFile,
    setSelectedFile,
  ] =
    useState<File | null>(
      null
    );

  const [
    stage,
    setStage,
  ] =
    useState<Stage>("idle");

  const [
    uploadProgress,
    setUploadProgress,
  ] =
    useState(0);

  const [
    errorMessage,
    setErrorMessage,
  ] =
    useState("");

  const [
    completed,
    setCompleted,
  ] =
    useState<
      FinalizedContribution | null
    >(null);

  const [
    declarationAccepted,
    setDeclarationAccepted,
  ] =
    useState(false);

  const [
    submitting,
    setSubmitting,
  ] =
    useState(false);

  const [
    submitError,
    setSubmitError,
  ] =
    useState("");

  const [
    submitted,
    setSubmitted,
  ] =
    useState<
      SubmittedContribution | null
    >(null);

  const busy =
    stage === "preparing" ||
    stage === "uploading" ||
    stage === "finalizing";

  function chooseFile() {
    if (
      busy ||
      submitted
    ) {
      return;
    }

    inputRef.current?.click();
  }

  function handleFile(
    file: File | null
  ) {
    setErrorMessage("");
    setCompleted(null);
    setDeclarationAccepted(false);
    setSubmitError("");
    setSubmitted(null);
    setUploadProgress(0);

    if (!file) {
      setSelectedFile(null);
      setStage("idle");
      return;
    }

    if (
      !extensionAllowed(
        file.name
      )
    ) {
      setSelectedFile(null);
      setStage("error");
      setErrorMessage(
        "Unsupported file type. Use PDF, JSON, CSV, JPG, PNG or WebP."
      );
      return;
    }

    if (
      file.size <= 0
    ) {
      setSelectedFile(null);
      setStage("error");
      setErrorMessage(
        "The selected file is empty."
      );
      return;
    }

    if (
      file.size >
      MAX_FILE_BYTES
    ) {
      setSelectedFile(null);
      setStage("error");
      setErrorMessage(
        "The selected file exceeds the current 50 MB upload limit."
      );
      return;
    }

    setSelectedFile(file);
    setStage("idle");
  }

  async function startUpload() {
    if (
      !contributionType
    ) {
      setStage("error");
      setErrorMessage(
        "Select a contribution type before uploading."
      );
      return;
    }

    if (
      !selectedFile ||
      busy
    ) {
      return;
    }

    try {
      setErrorMessage("");
      setCompleted(null);
      setDeclarationAccepted(false);
      setSubmitError("");
      setSubmitted(null);
      setUploadProgress(0);
      setStage("preparing");

      const createResponse =
        await fetch(
          "/api/contributions/create-upload",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                filename:
                  selectedFile.name,

                sizeBytes:
                  selectedFile.size,
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
            "Arknoz could not create a private upload session."
        );
      }

      const session =
        createData.upload as UploadSession;

      setStage("uploading");

      await uploadDirectlyToR2(
        selectedFile,
        session,
        setUploadProgress
      );

      setStage("finalizing");

      const finalizeResponse =
        await fetch(
          "/api/contributions/finalize-upload",
          {
            method: "POST",

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
            "Arknoz could not finalize the private source."
        );
      }

      setCompleted(
        finalizeData.contribution
      );

      setStage("complete");
    } catch (error) {
      setStage("error");

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "The upload could not be completed."
      );
    }
  }

  async function submitForReview() {
    if (
      !completed ||
      !contributionType ||
      !declarationAccepted ||
      submitting
    ) {
      return;
    }

    try {
      setSubmitting(true);
      setSubmitError("");

      const response =
        await fetch(
          "/api/contributions/submit",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                manifestKey:
                  completed.manifestKey,

                contributionType,

                declarationAccepted:
                  true,
              }),
          }
        );

      const data =
        await response.json();

      if (
        !response.ok ||
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
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Contribution could not be submitted."
      );
    } finally {
      setSubmitting(false);
    }
  }

  function resetAll() {
    if (
      busy ||
      submitting
    ) {
      return;
    }

    setContributionType("");
    setSelectedFile(null);
    setCompleted(null);
    setDeclarationAccepted(false);
    setSubmitError("");
    setSubmitted(null);
    setErrorMessage("");
    setUploadProgress(0);
    setStage("idle");

    if (inputRef.current) {
      inputRef.current.value =
        "";
    }
  }

  const selectedType =
    CONTRIBUTION_TYPES.find(
      (item) =>
        item.value ===
        contributionType
    );

  return (
    <div className="space-y-6">
      <section className="rounded-[24px] border border-slate-200 bg-white p-7 shadow-sm">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
          STEP 01
        </p>

        <h2 className="mt-2 text-2xl font-bold">
          What are you contributing?
        </h2>

        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
          Choose the area that best
          represents the information
          you want to add, update or
          support with source material.
        </p>

        <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {CONTRIBUTION_TYPES.map(
            (item, index) => {
              const active =
                contributionType ===
                item.value;

              return (
                <button
                  key={item.value}
                  type="button"
                  disabled={
                    busy ||
                    Boolean(submitted)
                  }
                  onClick={() =>
                    setContributionType(
                      item.value
                    )
                  }
                  className={`rounded-[18px] border p-5 text-left transition ${
                    active
                      ? "border-[#17315c] bg-blue-50 ring-1 ring-[#17315c]"
                      : "border-slate-200 bg-slate-50/60 hover:border-slate-400"
                  } disabled:cursor-not-allowed disabled:opacity-60`}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-[11px] font-bold text-slate-500 ring-1 ring-slate-200">
                      {String(
                        index + 1
                      ).padStart(
                        2,
                        "0"
                      )}
                    </span>

                    <span className="text-sm font-bold text-[#17315c]">
                      {item.title}
                    </span>
                  </div>

                  <p className="mt-3 text-xs leading-5 text-slate-600">
                    {
                      item.description
                    }
                  </p>
                </button>
              );
            }
          )}
        </div>

        {selectedType && (
          <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-3 text-sm text-[#17315c]">
            Selected:{" "}
            <strong>
              {
                selectedType.title
              }
            </strong>
          </div>
        )}
      </section>

      <section className="rounded-[24px] border border-slate-200 bg-white p-7 shadow-sm">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
          STEP 02
        </p>

        <h2 className="mt-2 text-2xl font-bold">
          Upload supporting source material
        </h2>

        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
          Add a genuine document,
          drawing, image, publication,
          dataset, reference or other
          source that supports your
          contribution. The source
          remains private during intake
          and editorial review.
        </p>

        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept=".pdf,.json,.csv,.jpg,.jpeg,.png,.webp"
          disabled={
            busy ||
            Boolean(submitted)
          }
          onChange={(event) =>
            handleFile(
              event.target.files?.[0] ??
                null
            )
          }
        />

        {!completed && (
          <div className="mt-7 rounded-[20px] border border-dashed border-slate-300 bg-slate-50 p-8">
            <div className="max-w-2xl">
              <h3 className="text-lg font-bold">
                Private source upload
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Uploading a source does
                not verify it, grant
                publication rights or
                make it public.
              </p>

              {!selectedFile ? (
                <button
                  type="button"
                  onClick={chooseFile}
                  disabled={
                    busy ||
                    !contributionType
                  }
                  className="mt-6 rounded-xl bg-[#17315c] px-5 py-3 text-sm font-semibold text-white hover:bg-[#102541] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {contributionType
                    ? "Choose source file"
                    : "Select contribution type first"}
                </button>
              ) : (
                <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-950">
                        {
                          selectedFile.name
                        }
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {formatBytes(
                          selectedFile.size
                        )}
                      </p>
                    </div>

                    {!busy && (
                      <button
                        type="button"
                        onClick={
                          chooseFile
                        }
                        className="text-sm font-semibold text-[#17315c]"
                      >
                        Change file
                      </button>
                    )}
                  </div>

                  {stage ===
                    "uploading" && (
                    <div className="mt-5">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                        <span>
                          Uploading privately
                        </span>

                        <span>
                          {
                            uploadProgress
                          }
                          %
                        </span>
                      </div>

                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-[#17315c] transition-all"
                          style={{
                            width:
                              `${uploadProgress}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={
                      startUpload
                    }
                    disabled={busy}
                    className="mt-5 rounded-xl bg-[#17315c] px-5 py-3 text-sm font-semibold text-white hover:bg-[#102541] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {stage ===
                    "preparing"
                      ? "Preparing secure upload..."
                      : stage ===
                          "uploading"
                        ? `Uploading ${uploadProgress}%`
                        : stage ===
                            "finalizing"
                          ? "Verifying source..."
                          : "Upload privately"}
                  </button>
                </div>
              )}

              <p className="mt-4 text-xs leading-5 text-slate-500">
                Supported: PDF, JSON,
                CSV, JPG, PNG and WebP.
                Current maximum file
                size: 50 MB. Arknoz may
                revise contribution
                limits before public
                launch.
              </p>
            </div>
          </div>
        )}

        {stage === "error" &&
          errorMessage && (
            <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-5">
              <p className="font-semibold text-red-800">
                Upload not completed
              </p>

              <p className="mt-2 text-sm leading-6 text-red-700">
                {errorMessage}
              </p>
            </div>
          )}

        {completed && (
          <div className="mt-7 rounded-[20px] border border-emerald-200 bg-emerald-50/60 p-7">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-700">
              PRIVATE SOURCE STORED
            </p>

            <h3 className="mt-2 text-xl font-bold text-slate-950">
              Source upload complete
            </h3>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              The source is stored
              privately. It has not yet
              been submitted for
              editorial review or
              published.
            </p>

            <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  File
                </dt>

                <dd className="mt-1 break-words font-medium text-slate-900">
                  {
                    completed.filename
                  }
                </dd>
              </div>

              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Size
                </dt>

                <dd className="mt-1 font-medium text-slate-900">
                  {formatBytes(
                    completed.sizeBytes
                  )}
                </dd>
              </div>

              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Source status
                </dt>

                <dd className="mt-1 font-medium text-slate-900">
                  {
                    completed.status
                  }
                </dd>
              </div>

              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Publication
                </dt>

                <dd className="mt-1 font-medium text-slate-900">
                  Blocked
                </dd>
              </div>
            </dl>
          </div>
        )}
      </section>

      {completed && !submitted && (
        <section className="rounded-[24px] border border-slate-200 bg-white p-7 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
            STEP 03
          </p>

          <h2 className="mt-2 text-2xl font-bold">
            Contributor declaration
          </h2>

          <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-600">
            Before submitting this
            contribution to Arknoz,
            confirm your responsibility
            for the information and
            source material you provide.
          </p>

          <label className="mt-6 flex cursor-pointer items-start gap-4 rounded-[18px] border border-slate-200 bg-slate-50 p-5">
            <input
              type="checkbox"
              checked={
                declarationAccepted
              }
              onChange={(event) =>
                setDeclarationAccepted(
                  event.target.checked
                )
              }
              className="mt-1 h-5 w-5 shrink-0"
            />

            <span className="text-sm leading-7 text-slate-700">
              I confirm that the
              information and source
              material I am submitting
              are genuine to the best of
              my knowledge. I accept
              responsibility for this
              contribution and confirm
              that I created, own,
              control, or otherwise have
              sufficient authority or
              permission to provide the
              submitted information and
              source material to Arknoz.
            </span>
          </label>

          <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4 text-xs leading-6 text-slate-500">
            This declaration does not
            establish independent
            verification or automatically
            grant publication rights.
            Arknoz retains separate
            authority, rights, editorial
            and publication review.
          </div>

          {submitError && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {submitError}
            </div>
          )}

          <button
            type="button"
            onClick={
              submitForReview
            }
            disabled={
              !declarationAccepted ||
              !contributionType ||
              submitting
            }
            className="mt-6 rounded-xl bg-[#17315c] px-6 py-3 text-sm font-semibold text-white hover:bg-[#102541] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting
              ? "Submitting to Arknoz..."
              : "Submit to Arknoz Admin"}
          </button>
        </section>
      )}

      {submitted && (
        <section className="rounded-[24px] border border-emerald-200 bg-emerald-50/60 p-7">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-700">
            CONTRIBUTION SUBMITTED
          </p>

          <h2 className="mt-2 text-2xl font-bold">
            Submitted to Arknoz Admin
          </h2>

          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
            Your contribution is now in
            the private Arknoz editorial
            intake workflow. An Admin
            can review it and assign it
            to the appropriate Editor.
            Nothing has been published.
          </p>

          <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Contribution
              </dt>

              <dd className="mt-1 font-medium text-slate-900">
                {
                  selectedType?.title
                }
              </dd>
            </div>

            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Review status
              </dt>

              <dd className="mt-1 font-medium text-slate-900">
                Submitted for Admin
                review
              </dd>
            </div>

            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Publication
              </dt>

              <dd className="mt-1 font-medium text-slate-900">
                Blocked
              </dd>
            </div>

            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Editorial status
              </dt>

              <dd className="mt-1 font-medium text-slate-900">
                Awaiting Admin
              </dd>
            </div>
          </dl>

          <button
            type="button"
            onClick={resetAll}
            className="mt-6 text-sm font-semibold text-[#17315c]"
          >
            Start another contribution
          </button>
        </section>
      )}
    </div>
  );
}