"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  createClient,
} from "@/lib/supabase/client";


type RecordStatus =
  | "draft"
  | "active"
  | "in_review"
  | "completed"
  | "archived";


type TeamRecord = {
  id: string;
  title: string;
  payload: unknown;
  record_status: RecordStatus;
  updated_at: string;
};


function readNotes(
  payload: unknown
) {
  if (
    payload &&
    typeof payload === "object" &&
    !Array.isArray(payload) &&
    "notes" in payload &&
    typeof (
      payload as {
        notes?: unknown;
      }
    ).notes === "string"
  ) {
    return (
      payload as {
        notes: string;
      }
    ).notes;
  }

  return "";
}


export default function ProductionTeamPanelWorkspace({
  assignmentId,
  userId,
  panelKey,
  panelTitle,
}: {
  assignmentId:
    string;

  userId:
    string;

  panelKey:
    string;

  panelTitle:
    string;
}) {

  const supabase =
    useMemo(
      () => createClient(),
      []
    );


  const [
    records,
    setRecords,
  ] =
    useState<TeamRecord[]>([]);


  const [
    selectedId,
    setSelectedId,
  ] =
    useState<string | null>(
      null
    );


  const [
    title,
    setTitle,
  ] =
    useState("");


  const [
    notes,
    setNotes,
  ] =
    useState("");


  const [
    status,
    setStatus,
  ] =
    useState<RecordStatus>(
      "draft"
    );


  const [
    loaded,
    setLoaded,
  ] =
    useState(false);


  const [
    busy,
    setBusy,
  ] =
    useState(false);


  async function loadRecords() {

    const {
      data,
      error,
    } =
      await supabase
        .from(
          "team_panel_records"
        )
        .select(
          "id, title, payload, record_status, updated_at"
        )
        .eq(
          "assignment_id",
          assignmentId
        )
        .eq(
          "user_id",
          userId
        )
        .eq(
          "panel_key",
          panelKey
        )
        .order(
          "updated_at",
          {
            ascending:
              false,
          }
        )
        .limit(100);


    if (error) {

      console.error(
        "Arknoz Team records load failed.",
        error
      );

      setLoaded(true);

      return;
    }


    setRecords(
      (data ??
        []) as TeamRecord[]
    );

    setLoaded(true);
  }


  useEffect(() => {
    queueMicrotask(() => {
      void loadRecords();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    assignmentId,
    userId,
    panelKey,
  ]);


  function resetEditor() {

    setSelectedId(null);
    setTitle("");
    setNotes("");
    setStatus("draft");
  }


  function selectRecord(
    record: TeamRecord
  ) {

    setSelectedId(
      record.id
    );

    setTitle(
      record.title
    );

    setNotes(
      readNotes(
        record.payload
      )
    );

    setStatus(
      record.record_status
    );
  }


  async function saveRecord() {

    if (
      busy ||
      !title.trim()
    ) {
      return;
    }


    setBusy(true);


    try {

      const payload = {
        notes:
          notes.trim(),
      };


      if (selectedId) {

        const {
          error,
        } =
          await supabase
            .from(
              "team_panel_records"
            )
            .update({
              title:
                title.trim(),

              payload,

              record_status:
                status,
            })
            .eq(
              "id",
              selectedId
            )
            .eq(
              "assignment_id",
              assignmentId
            )
            .eq(
              "user_id",
              userId
            )
            .eq(
              "panel_key",
              panelKey
            );


        if (error) {
          throw error;
        }
      }

      else {

        const {
          error,
        } =
          await supabase
            .from(
              "team_panel_records"
            )
            .insert({
              assignment_id:
                assignmentId,

              user_id:
                userId,

              panel_key:
                panelKey,

              title:
                title.trim(),

              payload,

              record_status:
                status,
            });


        if (error) {
          throw error;
        }
      }


      await loadRecords();

      resetEditor();
    }

    catch (error) {

      console.error(
        "Arknoz Team record save failed.",
        error
      );

      window.alert(
        "Team record could not be saved."
      );
    }

    finally {

      setBusy(false);
    }
  }


  async function deleteRecord() {

    if (
      !selectedId ||
      (
        status !== "draft" &&
        status !== "archived"
      )
    ) {
      return;
    }


    const confirmed =
      window.confirm(
        "Delete this Team record?"
      );


    if (!confirmed) {
      return;
    }


    setBusy(true);


    try {

      const {
        error,
      } =
        await supabase
          .from(
            "team_panel_records"
          )
          .delete()
          .eq(
            "id",
            selectedId
          )
          .eq(
            "assignment_id",
            assignmentId
          )
          .eq(
            "user_id",
            userId
          )
          .eq(
            "panel_key",
            panelKey
          );


      if (error) {
        throw error;
      }


      await loadRecords();

      resetEditor();
    }

    catch (error) {

      console.error(
        "Arknoz Team record delete failed.",
        error
      );

      window.alert(
        "Team record could not be deleted."
      );
    }

    finally {

      setBusy(false);
    }
  }


  if (!loaded) {

    return (
      <div className="rounded-[18px] border border-slate-200 bg-white p-5 text-sm text-slate-500">
        Loading Team workspace...
      </div>
    );
  }


  return (
    <div className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">

      <section className="rounded-[18px] border border-slate-200 bg-white p-5">

        <div className="flex items-center justify-between gap-3">

          <div>

            <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-blue-700">
              SPECIALIST WORKSPACE
            </p>

            <h2 className="mt-1 text-base font-bold text-[#17315c]">
              {panelTitle}
            </h2>

          </div>


          <button
            type="button"
            onClick={
              resetEditor
            }
            className="rounded-xl border border-slate-200 px-3 py-2 text-[10px] font-bold text-slate-600"
          >
            New record
          </button>

        </div>


        <div className="mt-5 grid gap-3">

          <input
            value={title}
            onChange={
              (event) =>
                setTitle(
                  event.target.value
                )
            }
            placeholder="Record title"
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-xs"
          />


          <textarea
            value={notes}
            onChange={
              (event) =>
                setNotes(
                  event.target.value
                )
            }
            rows={8}
            placeholder="Notes, evidence, decision or working detail"
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-xs leading-5"
          />


          <select
            value={status}
            onChange={
              (event) =>
                setStatus(
                  event.target
                    .value as
                    RecordStatus
                )
            }
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-xs"
          >
            <option value="draft">
              Draft
            </option>

            <option value="active">
              Active
            </option>

            <option value="in_review">
              In review
            </option>

            <option value="completed">
              Completed
            </option>

            <option value="archived">
              Archived
            </option>
          </select>


          <div className="flex flex-wrap gap-2">

            <button
              type="button"
              disabled={
                busy ||
                !title.trim()
              }
              onClick={
                saveRecord
              }
              className="rounded-xl bg-[#17315c] px-4 py-2.5 text-[10px] font-bold text-white disabled:opacity-50"
            >
              {busy
                ? "Saving..."
                : selectedId
                  ? "Update record"
                  : "Save record"}
            </button>


            {selectedId &&
            (
              status === "draft" ||
              status === "archived"
            ) ? (

              <button
                type="button"
                disabled={busy}
                onClick={
                  deleteRecord
                }
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-[10px] font-bold text-slate-500"
              >
                Delete
              </button>

            ) : null}

          </div>

        </div>

      </section>


      <section className="rounded-[18px] border border-slate-200 bg-white p-5">

        <div>

          <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-blue-700">
            GENUINE RECORDS
          </p>

          <h2 className="mt-1 text-base font-bold text-[#17315c]">
            Current workspace
          </h2>

        </div>


        <div className="mt-4 space-y-2">

          {records.length === 0 ? (

            <div className="rounded-xl border border-dashed border-slate-200 px-4 py-8 text-center text-xs text-slate-400">
              No Team records yet.
            </div>

          ) : (

            records.map(
              (record) => (

                <button
                  key={
                    record.id
                  }
                  type="button"
                  onClick={
                    () =>
                      selectRecord(
                        record
                      )
                  }
                  className={`w-full rounded-xl border p-3 text-left transition ${
                    selectedId ===
                      record.id
                      ? "border-blue-200 bg-blue-50/40"
                      : "border-slate-200 hover:bg-slate-50"
                  }`}
                >

                  <div className="flex items-start justify-between gap-3">

                    <div className="min-w-0">

                      <p className="truncate text-xs font-bold text-[#17315c]">
                        {record.title ||
                          "Untitled record"}
                      </p>

                      <p className="mt-1 line-clamp-2 text-[10px] leading-4 text-slate-500">
                        {readNotes(
                          record.payload
                        ) ||
                          "No notes added."}
                      </p>

                    </div>


                    <span className="shrink-0 rounded-full border border-slate-200 bg-white px-2 py-1 text-[8px] font-bold uppercase text-slate-500">
                      {record.record_status.replace(
                        "_",
                        " "
                      )}
                    </span>

                  </div>


                  <p className="mt-2 text-[9px] text-slate-400">
                    Updated{" "}
                    {new Date(
                      record.updated_at
                    ).toLocaleString()}
                  </p>

                </button>

              )
            )

          )}

        </div>

      </section>

    </div>
  );
}
