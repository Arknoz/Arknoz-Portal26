import Link from "next/link";

export default function MemberActions({
  returnTo,
}: {
  returnTo: string;
}) {
  const encodedReturn = encodeURIComponent(returnTo);

  return (
    <div className="flex flex-wrap gap-3">
      <Link
        href={`/sign-in?action=save&returnTo=${encodedReturn}`}
        className="rounded-full border border-slate-300 bg-white px-5 py-2.5 font-semibold text-slate-800 hover:border-blue-400"
      >
        Save
      </Link>

      <Link
        href={`/sign-in?action=follow&returnTo=${encodedReturn}`}
        className="rounded-full bg-[#17315c] px-5 py-2.5 font-semibold text-white"
      >
        Follow
      </Link>
    </div>
  );
}
