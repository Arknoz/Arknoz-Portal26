import type {
  ReactNode,
} from "react";


export default function UniversalRecordSystem({
  overview,
  workspace,
}: {
  overview: ReactNode;
  workspace: ReactNode;
}) {
  return (
    <div
      className="contents"
      data-universal-record-system
    >

      {/* ==================================================
          01 OVERVIEW
      ================================================== */}

      <section
        id="overview"
        className="contents"
        data-universal-record-screen="overview"
      >
        {overview}
      </section>


      {/* ==================================================
          02 RECORD
          03 CONNECTIONS
          04 INTELLIGENCE
      ================================================== */}

      <section
        className="contents"
        data-universal-record-screen="workspace"
      >
        {workspace}
      </section>

    </div>
  );
}
