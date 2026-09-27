"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type ExperienceForm = {
  experienceType: string;
  roleTitle: string;
  organisation: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
};

type CredentialForm = {
  credentialType: string;
  title: string;
  issuer: string;
  credentialId: string;
  issueDate: string;
  expiryDate: string;
  credentialUrl: string;
  description: string;
};

type ExperienceRecord = {
  id: string;
  experience_type: string;
  role_title: string;
  organisation: string;
  location: string | null;
  start_date: string | null;
  end_date: string | null;
  is_current: boolean;
  description: string;
  verification_state: string;
};

type CredentialRecord = {
  id: string;
  credential_type: string;
  title: string;
  issuer: string;
  credential_id: string | null;
  issue_date: string | null;
  expiry_date: string | null;
  credential_url: string | null;
  description: string;
  verification_state: string;
};

const EMPTY_EXPERIENCE: ExperienceForm = {
  experienceType: "employment",
  roleTitle: "",
  organisation: "",
  location: "",
  startDate: "",
  endDate: "",
  isCurrent: false,
  description: "",
};

const EMPTY_CREDENTIAL: CredentialForm = {
  credentialType: "degree",
  title: "",
  issuer: "",
  credentialId: "",
  issueDate: "",
  expiryDate: "",
  credentialUrl: "",
  description: "",
};

const inputClass =
  "mt-2 w-full rounded-[14px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:ring-2 focus:ring-blue-100";

function monthForInput(value: string | null) {
  return value ? value.slice(0, 7) : "";
}

function monthForDb(value: string) {
  return value ? `${value}-01` : null;
}

function optionalText(value: string) {
  const clean = value.trim();
  return clean === "" ? null : clean;
}

function verificationLabel(value: string) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default function MemberExperienceCredentialsEditor() {
  const supabase = useMemo(() => createClient(), []);

  const [userId, setUserId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const [experiences, setExperiences] = useState<ExperienceRecord[]>([]);
  const [credentials, setCredentials] = useState<CredentialRecord[]>([]);

  const [experience, setExperience] =
    useState<ExperienceForm>(EMPTY_EXPERIENCE);
  const [credential, setCredential] =
    useState<CredentialForm>(EMPTY_CREDENTIAL);

  const [editingExperienceId, setEditingExperienceId] =
    useState<string | null>(null);
  const [editingCredentialId, setEditingCredentialId] =
    useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!active) return;

      if (!user) {
        setMessage("Your Arknoz session could not be found.");
        setReady(true);
        return;
      }

      setUserId(user.id);

      const [experienceResult, credentialResult] = await Promise.all([
        supabase
          .from("member_experiences")
          .select(
            "id,experience_type,role_title,organisation,location,start_date,end_date,is_current,description,verification_state"
          )
          .eq("user_id", user.id)
          .order("created_at", { ascending: false }),

        supabase
          .from("member_credentials")
          .select(
            "id,credential_type,title,issuer,credential_id,issue_date,expiry_date,credential_url,description,verification_state"
          )
          .eq("user_id", user.id)
          .order("created_at", { ascending: false }),
      ]);

      if (!active) return;

      if (experienceResult.error || credentialResult.error) {
        setMessage(
          "Experience & Credentials database is not connected yet."
        );
        setReady(true);
        return;
      }

      setExperiences(experienceResult.data ?? []);
      setCredentials(credentialResult.data ?? []);
      setReady(true);
    }

    load();

    return () => {
      active = false;
    };
  }, [supabase]);

  async function saveExperience() {
    if (!userId || busy) return;

    if (!experience.roleTitle.trim() || !experience.organisation.trim()) {
      setMessage("Add a role/title and organisation before saving.");
      return;
    }

    setBusy(true);
    setMessage(null);

    const values = {
      experience_type: experience.experienceType,
      role_title: experience.roleTitle.trim(),
      organisation: experience.organisation.trim(),
      location: optionalText(experience.location),
      start_date: monthForDb(experience.startDate),
      end_date: experience.isCurrent
        ? null
        : monthForDb(experience.endDate),
      is_current: experience.isCurrent,
      description: experience.description.trim(),
    };

    if (editingExperienceId) {
      const { data, error } = await supabase
        .from("member_experiences")
        .update(values)
        .eq("id", editingExperienceId)
        .eq("user_id", userId)
        .select(
          "id,experience_type,role_title,organisation,location,start_date,end_date,is_current,description,verification_state"
        )
        .single();

      if (error) {
        setMessage("Arknoz could not update this experience.");
        setBusy(false);
        return;
      }

      setExperiences((current) =>
        current.map((item) =>
          item.id === editingExperienceId ? data : item
        )
      );
    } else {
      const { data, error } = await supabase
        .from("member_experiences")
        .insert({
          user_id: userId,
          ...values,
        })
        .select(
          "id,experience_type,role_title,organisation,location,start_date,end_date,is_current,description,verification_state"
        )
        .single();

      if (error) {
        setMessage("Arknoz could not save this experience.");
        setBusy(false);
        return;
      }

      setExperiences((current) => [data, ...current]);
    }

    setExperience(EMPTY_EXPERIENCE);
    setEditingExperienceId(null);
    setMessage("Experience saved.");
    setBusy(false);
  }

  async function saveCredential() {
    if (!userId || busy) return;

    if (!credential.title.trim() || !credential.issuer.trim()) {
      setMessage("Add a credential title and issuer before saving.");
      return;
    }

    setBusy(true);
    setMessage(null);

    const values = {
      credential_type: credential.credentialType,
      title: credential.title.trim(),
      issuer: credential.issuer.trim(),
      credential_id: optionalText(credential.credentialId),
      issue_date: monthForDb(credential.issueDate),
      expiry_date: monthForDb(credential.expiryDate),
      credential_url: optionalText(credential.credentialUrl),
      description: credential.description.trim(),
    };

    if (editingCredentialId) {
      const { data, error } = await supabase
        .from("member_credentials")
        .update(values)
        .eq("id", editingCredentialId)
        .eq("user_id", userId)
        .select(
          "id,credential_type,title,issuer,credential_id,issue_date,expiry_date,credential_url,description,verification_state"
        )
        .single();

      if (error) {
        setMessage("Arknoz could not update this credential.");
        setBusy(false);
        return;
      }

      setCredentials((current) =>
        current.map((item) =>
          item.id === editingCredentialId ? data : item
        )
      );
    } else {
      const { data, error } = await supabase
        .from("member_credentials")
        .insert({
          user_id: userId,
          ...values,
        })
        .select(
          "id,credential_type,title,issuer,credential_id,issue_date,expiry_date,credential_url,description,verification_state"
        )
        .single();

      if (error) {
        setMessage("Arknoz could not save this credential.");
        setBusy(false);
        return;
      }

      setCredentials((current) => [data, ...current]);
    }

    setCredential(EMPTY_CREDENTIAL);
    setEditingCredentialId(null);
    setMessage("Credential saved.");
    setBusy(false);
  }

  function editExperience(item: ExperienceRecord) {
    setEditingExperienceId(item.id);
    setExperience({
      experienceType: item.experience_type,
      roleTitle: item.role_title,
      organisation: item.organisation,
      location: item.location ?? "",
      startDate: monthForInput(item.start_date),
      endDate: monthForInput(item.end_date),
      isCurrent: item.is_current,
      description: item.description ?? "",
    });
  }

  function editCredential(item: CredentialRecord) {
    setEditingCredentialId(item.id);
    setCredential({
      credentialType: item.credential_type,
      title: item.title,
      issuer: item.issuer,
      credentialId: item.credential_id ?? "",
      issueDate: monthForInput(item.issue_date),
      expiryDate: monthForInput(item.expiry_date),
      credentialUrl: item.credential_url ?? "",
      description: item.description ?? "",
    });
  }

  async function removeExperience(id: string) {
    if (!userId || busy) return;

    setBusy(true);

    const { error } = await supabase
      .from("member_experiences")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) {
      setMessage("Arknoz could not remove this experience.");
      setBusy(false);
      return;
    }

    setExperiences((current) => current.filter((item) => item.id !== id));
    setBusy(false);
  }

  async function removeCredential(id: string) {
    if (!userId || busy) return;

    setBusy(true);

    const { error } = await supabase
      .from("member_credentials")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) {
      setMessage("Arknoz could not remove this credential.");
      setBusy(false);
      return;
    }

    setCredentials((current) => current.filter((item) => item.id !== id));
    setBusy(false);
  }

  return (
    <div className="space-y-5">
      <div className="rounded-[18px] border border-blue-100 bg-blue-50/60 px-5 py-4">
        <p className="text-sm font-bold text-[#17315c]">
          Optional — add only what applies to you.
        </p>
        <p className="mt-1 text-xs leading-5 text-slate-600">
          You can leave this page blank and complete it later. If you add a record, only the fields marked Required must be completed.
        </p>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <section className="rounded-[24px] border border-slate-200 bg-white p-5 sm:p-6">
          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-blue-700">
            EXPERIENCE
          </p>

          <h2 className="mt-2 text-xl font-bold text-[#17315c]">
            Professional experience
          </h2>

          <p className="mt-2 text-xs leading-5 text-slate-500">
            Optional. Add professional roles only if you want them in your Arknoz record. Role / Title and Organisation are required only when adding an experience.
          </p>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                Experience type · Optional
              </span>
              <select
                className={inputClass}
                value={experience.experienceType}
                onChange={(e) =>
                  setExperience((current) => ({
                    ...current,
                    experienceType: e.target.value,
                  }))
                }
              >
                <option value="employment">Employment</option>
                <option value="practice">Practice</option>
                <option value="freelance">Independent / Freelance</option>
                <option value="academic">Academic</option>
                <option value="volunteer">Volunteer</option>
                <option value="other">Other</option>
              </select>
            </label>

            <label className="block">
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                Role / title · Required
              </span>
              <input
                className={inputClass}
                value={experience.roleTitle}
                onChange={(e) =>
                  setExperience((current) => ({
                    ...current,
                    roleTitle: e.target.value,
                  }))
                }
                placeholder="Architect, Director, Researcher"
              />
            </label>

            <label className="block">
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                Organisation · Required
              </span>
              <input
                className={inputClass}
                value={experience.organisation}
                onChange={(e) =>
                  setExperience((current) => ({
                    ...current,
                    organisation: e.target.value,
                  }))
                }
                placeholder="Practice, company or institution"
              />
            </label>

            <label className="block">
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                Location · Optional
              </span>
              <input
                className={inputClass}
                value={experience.location}
                onChange={(e) =>
                  setExperience((current) => ({
                    ...current,
                    location: e.target.value,
                  }))
                }
                placeholder="City, Country"
              />
            </label>

            <label className="block">
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                Start · Optional
              </span>
              <input
                type="month"
                className={inputClass}
                value={experience.startDate}
                onChange={(e) =>
                  setExperience((current) => ({
                    ...current,
                    startDate: e.target.value,
                  }))
                }
              />
            </label>

            <label className="block">
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                End · Optional
              </span>
              <input
                type="month"
                disabled={experience.isCurrent}
                className={inputClass}
                value={experience.endDate}
                onChange={(e) =>
                  setExperience((current) => ({
                    ...current,
                    endDate: e.target.value,
                  }))
                }
              />
            </label>

            <label className="flex items-center gap-3 md:col-span-2">
              <input
                type="checkbox"
                checked={experience.isCurrent}
                onChange={(e) =>
                  setExperience((current) => ({
                    ...current,
                    isCurrent: e.target.checked,
                    endDate: e.target.checked ? "" : current.endDate,
                  }))
                }
              />
              <span className="text-sm font-semibold text-slate-700">
                I currently work here
              </span>
            </label>

            <label className="block md:col-span-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                Description · Optional
              </span>
              <textarea
                className={`${inputClass} min-h-24 resize-y`}
                value={experience.description}
                onChange={(e) =>
                  setExperience((current) => ({
                    ...current,
                    description: e.target.value,
                  }))
                }
                placeholder="Responsibilities, scope or professional focus."
              />
            </label>
          </div>

          <div className="mt-5 flex gap-3">
            <button
              type="button"
              disabled={!ready || !userId || busy}
              onClick={saveExperience}
              className="rounded-[14px] bg-[#17315c] px-5 py-3 text-xs font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {editingExperienceId ? "Update experience" : "Add experience"}
            </button>

            {editingExperienceId ? (
              <button
                type="button"
                onClick={() => {
                  setEditingExperienceId(null);
                  setExperience(EMPTY_EXPERIENCE);
                }}
                className="rounded-[14px] border border-slate-200 px-5 py-3 text-xs font-bold text-slate-600"
              >
                Cancel
              </button>
            ) : null}
          </div>
        </section>

        <section className="rounded-[24px] border border-slate-200 bg-white p-5 sm:p-6">
          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-blue-700">
            CREDENTIALS
          </p>

          <h2 className="mt-2 text-xl font-bold text-[#17315c]">
            Qualifications & credentials
          </h2>

          <p className="mt-2 text-xs leading-5 text-slate-500">
            Optional. Add qualifications or credentials only if relevant. Title and Issuer are required only when adding a credential.
          </p>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                Credential type · Optional
              </span>
              <select
                className={inputClass}
                value={credential.credentialType}
                onChange={(e) =>
                  setCredential((current) => ({
                    ...current,
                    credentialType: e.target.value,
                  }))
                }
              >
                <option value="degree">Degree</option>
                <option value="license">Professional licence</option>
                <option value="certification">Certification</option>
                <option value="membership">Professional membership</option>
                <option value="award">Award</option>
                <option value="other">Other</option>
              </select>
            </label>

            <label className="block">
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                Title · Required
              </span>
              <input
                className={inputClass}
                value={credential.title}
                onChange={(e) =>
                  setCredential((current) => ({
                    ...current,
                    title: e.target.value,
                  }))
                }
                placeholder="B.Arch, LEED AP, RIBA"
              />
            </label>

            <label className="block">
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                Issuer · Required
              </span>
              <input
                className={inputClass}
                value={credential.issuer}
                onChange={(e) =>
                  setCredential((current) => ({
                    ...current,
                    issuer: e.target.value,
                  }))
                }
                placeholder="University or professional body"
              />
            </label>

            <label className="block">
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                Credential ID · Optional
              </span>
              <input
                className={inputClass}
                value={credential.credentialId}
                onChange={(e) =>
                  setCredential((current) => ({
                    ...current,
                    credentialId: e.target.value,
                  }))
                }
                placeholder="Optional"
              />
            </label>

            <label className="block">
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                Issued · Optional
              </span>
              <input
                type="month"
                className={inputClass}
                value={credential.issueDate}
                onChange={(e) =>
                  setCredential((current) => ({
                    ...current,
                    issueDate: e.target.value,
                  }))
                }
              />
            </label>

            <label className="block">
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                Expiry · Optional
              </span>
              <input
                type="month"
                className={inputClass}
                value={credential.expiryDate}
                onChange={(e) =>
                  setCredential((current) => ({
                    ...current,
                    expiryDate: e.target.value,
                  }))
                }
              />
            </label>

            <label className="block md:col-span-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                Credential URL · Optional
              </span>
              <input
                className={inputClass}
                value={credential.credentialUrl}
                onChange={(e) =>
                  setCredential((current) => ({
                    ...current,
                    credentialUrl: e.target.value,
                  }))
                }
                placeholder="https://"
              />
            </label>

            <label className="block md:col-span-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                Notes · Optional
              </span>
              <textarea
                className={`${inputClass} min-h-24 resize-y`}
                value={credential.description}
                onChange={(e) =>
                  setCredential((current) => ({
                    ...current,
                    description: e.target.value,
                  }))
                }
                placeholder="Optional credential context."
              />
            </label>
          </div>

          <div className="mt-5 flex gap-3">
            <button
              type="button"
              disabled={!ready || !userId || busy}
              onClick={saveCredential}
              className="rounded-[14px] bg-[#17315c] px-5 py-3 text-xs font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {editingCredentialId ? "Update credential" : "Add credential"}
            </button>

            {editingCredentialId ? (
              <button
                type="button"
                onClick={() => {
                  setEditingCredentialId(null);
                  setCredential(EMPTY_CREDENTIAL);
                }}
                className="rounded-[14px] border border-slate-200 px-5 py-3 text-xs font-bold text-slate-600"
              >
                Cancel
              </button>
            ) : null}
          </div>
        </section>
      </div>

      {message ? (
        <p
          aria-live="polite"
          className="rounded-[14px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600"
        >
          {message}
        </p>
      ) : null}

      <div className="grid gap-5 xl:grid-cols-2">
        <section className="rounded-[24px] border border-slate-200 bg-white p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-[#17315c]">
              Experience record
            </h2>
            <span className="text-xs text-slate-400">
              {experiences.length} records
            </span>
          </div>

          <div className="mt-4 space-y-3">
            {experiences.length === 0 ? (
              <p className="rounded-[14px] bg-slate-50 p-4 text-sm text-slate-500">
                No experience records added yet.
              </p>
            ) : (
              experiences.map((item) => (
                <article
                  key={item.id}
                  className="rounded-[16px] border border-slate-200 p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-bold text-[#17315c]">
                        {item.role_title}
                      </p>
                      <p className="mt-1 text-sm text-slate-600">
                        {item.organisation}
                      </p>
                    </div>

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500">
                      {verificationLabel(item.verification_state)}
                    </span>
                  </div>

                  <div className="mt-3 flex gap-4 text-xs text-slate-500">
                    <button
                      type="button"
                      onClick={() => editExperience(item)}
                      className="font-bold text-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => removeExperience(item.id)}
                      className="font-bold text-slate-500"
                    >
                      Remove
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>

        <section className="rounded-[24px] border border-slate-200 bg-white p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-[#17315c]">
              Credential record
            </h2>
            <span className="text-xs text-slate-400">
              {credentials.length} records
            </span>
          </div>

          <div className="mt-4 space-y-3">
            {credentials.length === 0 ? (
              <p className="rounded-[14px] bg-slate-50 p-4 text-sm text-slate-500">
                No credentials added yet.
              </p>
            ) : (
              credentials.map((item) => (
                <article
                  key={item.id}
                  className="rounded-[16px] border border-slate-200 p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-bold text-[#17315c]">{item.title}</p>
                      <p className="mt-1 text-sm text-slate-600">
                        {item.issuer}
                      </p>
                    </div>

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500">
                      {verificationLabel(item.verification_state)}
                    </span>
                  </div>

                  <div className="mt-3 flex gap-4 text-xs text-slate-500">
                    <button
                      type="button"
                      onClick={() => editCredential(item)}
                      className="font-bold text-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => removeCredential(item.id)}
                      className="font-bold text-slate-500"
                    >
                      Remove
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </div>

      <div className="rounded-[20px] border border-blue-100 bg-blue-50/60 p-5">
        <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-blue-700">
          ARKNOZ EVIDENCE PRINCIPLE
        </p>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">
          Adding experience or credentials does not automatically verify an
          organisation relationship, project role, qualification or
          professional status. Stronger verification states are controlled
          separately by Arknoz evidence and connected records.
        </p>
      </div>
    </div>
  );
}