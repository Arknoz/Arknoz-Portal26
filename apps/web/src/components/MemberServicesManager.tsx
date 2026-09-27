"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { createClient } from "@/lib/supabase/client";

type Service = {
  id: string;
  service_type: string;
  title: string;
  summary: string;
  availability: string;
  status: string;
  created_at: string;
  updated_at: string;
};

const SERVICE_TYPES = [
  {
    value: "consultation",
    label: "Consultation",
  },
  {
    value: "packaged_service",
    label: "Packaged Service",
  },
  {
    value: "request_a_proposal",
    label: "Request a Proposal",
  },
];

export default function MemberServicesManager() {
  const supabase = useMemo(
    () => createClient(),
    []
  );

  const [userId, setUserId] = useState<
    string | null
  >(null);

  const [services, setServices] = useState<
    Service[]
  >([]);

  const [serviceType, setServiceType] =
    useState("consultation");

  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [availability, setAvailability] =
    useState("");

  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);

  const [message, setMessage] = useState<
    string | null
  >(null);

  useEffect(() => {
    let active = true;

    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!active) return;

      if (!user) {
        setMessage(
          "Your Arknoz session could not be found."
        );
        setReady(true);
        return;
      }

      setUserId(user.id);

      const { data, error } = await supabase
        .from("member_services")
        .select(
          "id,service_type,title,summary,availability,status,created_at,updated_at"
        )
        .eq("user_id", user.id)
        .order("updated_at", {
          ascending: false,
        });

      if (!active) return;

      if (error) {
        setMessage(
          "Services database is not connected yet."
        );
        setReady(true);
        return;
      }

      setServices(data ?? []);
      setReady(true);
    }

    load();

    return () => {
      active = false;
    };
  }, [supabase]);

  async function addService() {
    if (!userId || busy) return;

    if (!title.trim()) {
      setMessage(
        "Add a service title before saving."
      );
      return;
    }

    setBusy(true);
    setMessage(null);

    const { data, error } = await supabase
      .from("member_services")
      .insert({
        user_id: userId,
        service_type: serviceType,
        title: title.trim(),
        summary: summary.trim(),
        availability: availability.trim(),
        status: "draft",
      })
      .select(
        "id,service_type,title,summary,availability,status,created_at,updated_at"
      )
      .single();

    if (error) {
      setMessage(
        "Arknoz could not save this service."
      );
      setBusy(false);
      return;
    }

    setServices((current) => [
      data,
      ...current,
    ]);

    setTitle("");
    setSummary("");
    setAvailability("");
    setMessage("Service saved as draft.");
    setBusy(false);
  }

  async function toggleStatus(service: Service) {
    if (busy) return;

    const next =
      service.status === "published"
        ? "draft"
        : "published";

    setBusy(true);
    setMessage(null);

    const { error } = await supabase
      .from("member_services")
      .update({
        status: next,
      })
      .eq("id", service.id);

    if (error) {
      setMessage(
        "Arknoz could not update service status."
      );
      setBusy(false);
      return;
    }

    setServices((current) =>
      current.map((item) =>
        item.id === service.id
          ? {
              ...item,
              status: next,
            }
          : item
      )
    );

    setBusy(false);
  }

  async function removeService(id: string) {
    if (busy) return;

    setBusy(true);
    setMessage(null);

    const { error } = await supabase
      .from("member_services")
      .delete()
      .eq("id", id);

    if (error) {
      setMessage(
        "Arknoz could not remove this service."
      );
      setBusy(false);
      return;
    }

    setServices((current) =>
      current.filter(
        (item) => item.id !== id
      )
    );

    setBusy(false);
  }

  if (!ready) {
    return (
      <div className="rounded-[24px] border border-slate-200 bg-white p-6 text-sm text-slate-500">
        Loading services...
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="rounded-[18px] border border-blue-100 bg-blue-50/60 px-5 py-4">
        <p className="text-sm font-bold text-[#17315c]">
          Pro service publishing
        </p>

        <p className="mt-1 text-xs leading-5 text-slate-600">
          Pro members can prepare and manage
          truthful professional service records.
          Arknoz does not process service payments,
          escrow or delivery in this phase.
        </p>
      </div>

      {message ? (
        <p className="rounded-[14px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
          {message}
        </p>
      ) : null}

      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-[24px] border border-slate-200 bg-white p-6">
          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-blue-700">
            NEW SERVICE
          </p>

          <h2 className="mt-2 text-xl font-bold text-[#17315c]">
            Add professional service
          </h2>

          <div className="mt-5 space-y-4">
            <label className="block">
              <span className="text-xs font-bold text-slate-700">
                Service type
              </span>

              <select
                value={serviceType}
                onChange={(event) =>
                  setServiceType(
                    event.target.value
                  )
                }
                className="mt-2 w-full rounded-[14px] border border-slate-200 px-4 py-3 text-sm"
              >
                {SERVICE_TYPES.map(
                  (item) => (
                    <option
                      key={item.value}
                      value={item.value}
                    >
                      {item.label}
                    </option>
                  )
                )}
              </select>
            </label>

            <label className="block">
              <span className="text-xs font-bold text-slate-700">
                Title - Required
              </span>

              <input
                value={title}
                maxLength={240}
                onChange={(event) =>
                  setTitle(event.target.value)
                }
                className="mt-2 w-full rounded-[14px] border border-slate-200 px-4 py-3 text-sm"
                placeholder="Example: Sustainable design review"
              />
            </label>

            <label className="block">
              <span className="text-xs font-bold text-slate-700">
                Summary - Optional
              </span>

              <textarea
                value={summary}
                maxLength={2000}
                onChange={(event) =>
                  setSummary(
                    event.target.value
                  )
                }
                className="mt-2 min-h-28 w-full rounded-[14px] border border-slate-200 px-4 py-3 text-sm"
              />
            </label>

            <label className="block">
              <span className="text-xs font-bold text-slate-700">
                Availability - Optional
              </span>

              <input
                value={availability}
                maxLength={240}
                onChange={(event) =>
                  setAvailability(
                    event.target.value
                  )
                }
                className="mt-2 w-full rounded-[14px] border border-slate-200 px-4 py-3 text-sm"
                placeholder="Example: Available from October"
              />
            </label>

            <button
              type="button"
              onClick={addService}
              disabled={
                busy ||
                title.trim() === ""
              }
              className="rounded-[14px] bg-[#17315c] px-5 py-3 text-xs font-bold text-white disabled:opacity-50"
            >
              {busy
                ? "Working..."
                : "Save service"}
            </button>
          </div>
        </section>

        <section className="rounded-[24px] border border-slate-200 bg-white p-6">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-blue-700">
                YOUR SERVICES
              </p>

              <h2 className="mt-2 text-xl font-bold text-[#17315c]">
                Service records
              </h2>
            </div>

            <span className="text-xs text-slate-400">
              {services.length}
            </span>
          </div>

          {services.length === 0 ? (
            <p className="mt-5 text-sm text-slate-500">
              No service records yet.
            </p>
          ) : (
            <div className="mt-5 divide-y divide-slate-100">
              {services.map((service) => (
                <article
                  key={service.id}
                  className="py-4 first:pt-0"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-slate-500">
                        {service.status}
                      </span>

                      <h3 className="mt-3 text-sm font-bold text-[#17315c]">
                        {service.title}
                      </h3>

                      <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-slate-400">
                        {service.service_type.replace(
                          /_/g,
                          " "
                        )}
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() =>
                          toggleStatus(
                            service
                          )
                        }
                        className="text-xs font-bold text-blue-700 disabled:opacity-50"
                      >
                        {service.status ===
                        "published"
                          ? "Move to draft"
                          : "Publish"}
                      </button>

                      <button
                        type="button"
                        disabled={busy}
                        onClick={() =>
                          removeService(
                            service.id
                          )
                        }
                        className="text-xs font-bold text-slate-500 disabled:opacity-50"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  {service.summary ? (
                    <p className="mt-3 whitespace-pre-wrap text-xs leading-5 text-slate-500">
                      {service.summary}
                    </p>
                  ) : null}

                  {service.availability ? (
                    <p className="mt-2 text-xs font-semibold text-slate-600">
                      {service.availability}
                    </p>
                  ) : null}
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}