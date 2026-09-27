export function hasPersonalArknozPro(
  membership: unknown
): boolean {
  return (
    String(membership ?? "")
      .trim()
      .toUpperCase() === "PRO"
  );
}

export function hasOrganisationArknozPro(
  plan: unknown
): boolean {
  return (
    String(plan ?? "")
      .trim()
      .toUpperCase() === "ONE"
  );
}
