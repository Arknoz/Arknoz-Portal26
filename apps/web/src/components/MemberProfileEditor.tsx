"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type ProfileDraft = {
  fullName: string;
  stage: string;
  headline: string;
  organisation: string;
  location: string;
  about: string;
  disciplines: string;
  sectors: string;
  skills: string;
  languages: string;
  yearsExperience: string;
  countries: string;
  website: string;
  portfolioUrl: string;
  linkedinUrl: string;
};

const EMPTY_PROFILE: ProfileDraft = {
  fullName: "",
  stage: "professional",
  headline: "",
  organisation: "",
  location: "",
  about: "",
  disciplines: "",
  sectors: "",
  skills: "",
  languages: "",
  yearsExperience: "",
  countries: "",
  website: "",
  portfolioUrl: "",
  linkedinUrl: "",
};

const inputClass =
  "mt-2 w-full rounded-[14px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:ring-2 focus:ring-blue-100";

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
        {label}
      </span>

      {children}

      {hint ? (
        <span className="mt-1.5 block text-[10px] leading-4 text-slate-400">
          {hint}
        </span>
      ) : null}
    </label>
  );
}

export default function MemberProfileEditor() {
  const supabase = useMemo(() => createClient(), []);

  const [profile, setProfile] = useState<ProfileDraft>(EMPTY_PROFILE);
  const [userId, setUserId] = useState<string | null>(null);
  const [hasProfile, setHasProfile] = useState(false);
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadProfile() {
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

      const { data, error } = await supabase
        .from("member_profiles")
        .select(
          "full_name,stage,headline,organisation,location,about,disciplines,sectors,skills,languages,years_experience,countries,website,portfolio_url,linkedin_url"
        )
        .eq("user_id", user.id)
        .maybeSingle();

      if (!active) return;

      if (error) {
        setMessage("Arknoz could not load your profile. Please try again.");
        setReady(true);
        return;
      }

      if (data) {
        setHasProfile(true);
        setProfile({
          fullName: data.full_name ?? "",
          stage: data.stage ?? "professional",
          headline: data.headline ?? "",
          organisation: data.organisation ?? "",
          location: data.location ?? "",
          about: data.about ?? "",
          disciplines: (data.disciplines ?? []).join(", "),
          sectors: (data.sectors ?? []).join(", "),
          skills: (data.skills ?? []).join(", "),
          languages: (data.languages ?? []).join(", "),
          yearsExperience:
            data.years_experience === null ||
            data.years_experience === undefined
              ? ""
              : String(data.years_experience),
          countries: (data.countries ?? []).join(", "),
          website: data.website ?? "",
          portfolioUrl: data.portfolio_url ?? "",
          linkedinUrl: data.linkedin_url ?? "",
        });
      }

      setReady(true);
    }

    loadProfile();

    return () => {
      active = false;
    };
  }, [supabase]);

  function update<K extends keyof ProfileDraft>(
    key: K,
    value: ProfileDraft[K]
  ) {
    setProfile((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function toList(value: string) {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  function optionalText(value: string) {
    const trimmed = value.trim();
    return trimmed === "" ? null : trimmed;
  }

  async function saveProfile() {
    if (!userId || saving) return;

    setSaving(true);
    setMessage(null);

    const values = {
      full_name: profile.fullName.trim(),
      stage: profile.stage,
      headline: profile.headline.trim(),
      organisation: optionalText(profile.organisation),
      location: profile.location.trim(),
      about: profile.about.trim(),
      disciplines: toList(profile.disciplines),
      sectors: toList(profile.sectors),
      skills: toList(profile.skills),
      languages: toList(profile.languages),
      years_experience:
        profile.yearsExperience.trim() === ""
          ? null
          : Number(profile.yearsExperience),
      countries: toList(profile.countries),
      website: optionalText(profile.website),
      portfolio_url: optionalText(profile.portfolioUrl),
      linkedin_url: optionalText(profile.linkedinUrl),
    };

    const result = hasProfile
      ? await supabase
          .from("member_profiles")
          .update(values)
          .eq("user_id", userId)
      : await supabase.from("member_profiles").insert({
          user_id: userId,
          ...values,
        });

    if (result.error) {
      setMessage("Arknoz could not save your profile. Please try again.");
      setSaving(false);
      return;
    }

    setHasProfile(true);
    setMessage("Profile saved.");
    setSaving(false);
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
      <div className="space-y-5">
        <section className="rounded-[24px] border border-slate-200 bg-white p-5 sm:p-6">
          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-blue-700">
            CORE IDENTITY
          </p>

          <h2 className="mt-2 text-xl font-bold text-[#17315c]">
            Professional identity
          </h2>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <Field label="Full name">
              <input
                className={inputClass}
                value={profile.fullName}
                onChange={(e) => update("fullName", e.target.value)}
                maxLength={160}
                placeholder="Your professional name"
              />
            </Field>

            <Field label="Professional stage">
              <select
                className={inputClass}
                value={profile.stage}
                onChange={(e) => update("stage", e.target.value)}
              >
                <option value="student">Student</option>
                <option value="graduate">Graduate</option>
                <option value="professional">Professional</option>
                <option value="specialist">Specialist</option>
                <option value="academic">Academic</option>
                <option value="educator">Educator</option>
                <option value="independent">Independent</option>
              </select>
            </Field>

            <div className="md:col-span-2">
              <Field label="Professional headline">
                <input
                  className={inputClass}
                  value={profile.headline}
                  onChange={(e) => update("headline", e.target.value)}
                  maxLength={240}
                  placeholder="Architect | Sustainable Design | Project Strategy"
                />
              </Field>
            </div>

            <Field label="Organisation">
              <input
                className={inputClass}
                value={profile.organisation}
                onChange={(e) => update("organisation", e.target.value)}
                maxLength={240}
                placeholder="Practice, company or institution"
              />
            </Field>

            <Field label="Location">
              <input
                className={inputClass}
                value={profile.location}
                onChange={(e) => update("location", e.target.value)}
                maxLength={240}
                placeholder="City, Country"
              />
            </Field>

            <div className="md:col-span-2">
              <Field label="Professional overview">
                <textarea
                  className={`${inputClass} min-h-32 resize-y`}
                  value={profile.about}
                  onChange={(e) => update("about", e.target.value)}
                  maxLength={3000}
                  placeholder="Describe your professional background, focus and Built World work."
                />
              </Field>
            </div>
          </div>
        </section>

        <section className="rounded-[24px] border border-slate-200 bg-white p-5 sm:p-6">
          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-blue-700">
            EXPERTISE
          </p>

          <h2 className="mt-2 text-xl font-bold text-[#17315c]">
            Disciplines, sectors & skills
          </h2>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <Field label="Disciplines" hint="Separate items with commas.">
              <input
                className={inputClass}
                value={profile.disciplines}
                onChange={(e) => update("disciplines", e.target.value)}
                placeholder="Architecture, Urban Design"
              />
            </Field>

            <Field label="Sectors" hint="Separate items with commas.">
              <input
                className={inputClass}
                value={profile.sectors}
                onChange={(e) => update("sectors", e.target.value)}
                placeholder="Residential, Healthcare"
              />
            </Field>

            <Field label="Skills" hint="Separate items with commas.">
              <input
                className={inputClass}
                value={profile.skills}
                onChange={(e) => update("skills", e.target.value)}
                placeholder="BIM, Design Review, Research"
              />
            </Field>

            <Field label="Languages" hint="Separate items with commas.">
              <input
                className={inputClass}
                value={profile.languages}
                onChange={(e) => update("languages", e.target.value)}
                placeholder="English, Hindi"
              />
            </Field>

            <Field label="Years of experience">
              <input
                type="number"
                min="0"
                max="80"
                className={inputClass}
                value={profile.yearsExperience}
                onChange={(e) => update("yearsExperience", e.target.value)}
                placeholder="18"
              />
            </Field>

            <Field label="Countries worked in" hint="Separate items with commas.">
              <input
                className={inputClass}
                value={profile.countries}
                onChange={(e) => update("countries", e.target.value)}
                placeholder="India, UAE, United Kingdom"
              />
            </Field>
          </div>
        </section>

        <section className="rounded-[24px] border border-slate-200 bg-white p-5 sm:p-6">
          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-blue-700">
            PROFESSIONAL LINKS
          </p>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <Field label="Website">
              <input
                className={inputClass}
                value={profile.website}
                onChange={(e) => update("website", e.target.value)}
                placeholder="https://"
              />
            </Field>

            <Field label="Portfolio">
              <input
                className={inputClass}
                value={profile.portfolioUrl}
                onChange={(e) => update("portfolioUrl", e.target.value)}
                placeholder="https://"
              />
            </Field>

            <div className="md:col-span-2">
              <Field label="LinkedIn">
                <input
                  className={inputClass}
                  value={profile.linkedinUrl}
                  onChange={(e) => update("linkedinUrl", e.target.value)}
                  placeholder="https://linkedin.com/in/..."
                />
              </Field>
            </div>
          </div>
        </section>
      </div>

      <aside className="self-start space-y-4 xl:sticky xl:top-24">
        <div className="rounded-[24px] bg-[#17315c] p-5 text-white">
          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-blue-200">
            PROFILE STATUS
          </p>

          <h3 className="mt-2 text-lg font-bold">
            Build your professional identity
          </h3>

          <p className="mt-2 text-xs leading-5 text-blue-100">
            This information will form the member-owned profile layer behind your public Arknoz identity.
          </p>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-5">
          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-500">
            DATA PRINCIPLE
          </p>

          <p className="mt-2 text-sm font-bold text-[#17315c]">
            Your claims remain separate from verified Arknoz evidence.
          </p>

          <p className="mt-2 text-[11px] leading-5 text-slate-500">
            Projects, relationships and verification states are not created automatically from profile text.
          </p>
        </div>

        <button
          type="button"
          disabled={!ready || !userId || saving}
          onClick={saveProfile}
          className="w-full rounded-[14px] bg-[#17315c] px-5 py-3 text-xs font-bold text-white transition hover:bg-[#244779] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
        >
          {saving ? "Saving..." : ready ? "Save profile" : "Loading profile..."}
        </button>

        {message ? (
          <p
            aria-live="polite"
            className="px-1 text-center text-[11px] leading-5 text-slate-500"
          >
            {message}
          </p>
        ) : null}
      </aside>
    </div>
  );
}
