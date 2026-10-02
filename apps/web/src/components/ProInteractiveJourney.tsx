"use client";

import { hasOrganisationArknozPro, hasPersonalArknozPro } from "@/lib/entitlements/arknoz-pro";

import Link from "next/link";

import {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  createClient,
} from "@/lib/supabase/client";

import {
  COMPANY_V3,
  INSTITUTION_V3,
  UNIVERSITY_V3,
} from "@/lib/workspaces/organisation-dashboard-v3";


type ProMode =
  | "workspaces"
  | "tasks"
  | "intelligence"
  | "connections";

type OrganisationWorkspaceType =
  | "company"
  | "university"
  | "institution";

type WorkspaceBase =
  | "personal"
  | OrganisationWorkspaceType;

type AuthState =
  | "loading"
  | "signed-out"
  | "signed-in";


type OrganisationWorkspace = {
  id: string;
  workspaceType: OrganisationWorkspaceType;
  plan: "FREE" | "ONE";
  displayName: string;
  role: string;
};


type ModuleDefinition = {
  id: string;
  title: string;
  description: string;
  groupTitle: string;
  access: "FREE" | "PRO";
};


type ResolvedModule =
  ModuleDefinition & {
    href: string;
    locked: boolean;
  };


type RoleView = {
  key: string;
  title: string;
  workspaceTitle: string;
  baseType: WorkspaceBase;
  short: string;
  description: string;
};


const roleViews: readonly RoleView[] = [
  {
    key: "professional",
    title: "Professional",
    workspaceTitle: "Professional Workspace",
    baseType: "personal",
    short: "Identity · work · credentials · opportunities",
    description:
      "Build verified professional identity, organise credentials, manage your work and use Arknoz professional capabilities.",
  },
  {
    key: "career",
    title: "Student / Early career",
    workspaceTitle: "Career Workspace",
    baseType: "personal",
    short: "Skills · evidence · career · opportunities",
    description:
      "Build career readiness through verified identity, experience, credentials, saved knowledge and opportunity discovery.",
  },
  {
    key: "university",
    title: "University",
    workspaceTitle: "University Workspace",
    baseType: "university",
    short: "Programmes · research · people · industry",
    description:
      "Connect academic identity, programmes, research, projects, opportunities and industry collaboration.",
  },
  {
    key: "employer",
    title: "Employer",
    workspaceTitle: "Employer Workspace",
    baseType: "company",
    short: "People · opportunities · collaboration · intelligence",
    description:
      "Use an authorised company workspace to manage people, opportunities, collaboration and organisational intelligence.",
  },
  {
    key: "organisation",
    title: "Practice / Company",
    workspaceTitle: "Organisation Workspace",
    baseType: "company",
    short: "Identity · portfolio · people · growth",
    description:
      "Operate company identity, projects, portfolio, knowledge, participation and Built World intelligence.",
  },
  {
    key: "manufacturer",
    title: "Manufacturer",
    workspaceTitle: "Manufacturer Workspace",
    baseType: "company",
    short: "Products · projects · market intelligence",
    description:
      "Use the company workspace around products, services, projects, market activity and organisational intelligence.",
  },
  {
    key: "researcher",
    title: "Researcher / Faculty",
    workspaceTitle: "Research Workspace",
    baseType: "personal",
    short: "Credentials · evidence · contribution · analysis",
    description:
      "Connect professional identity, credentials, evidence, contribution and analytical tools around research activity.",
  },
  {
    key: "developer",
    title: "Developer / Client",
    workspaceTitle: "Project Intelligence Workspace",
    baseType: "company",
    short: "Projects · partners · knowledge · market context",
    description:
      "Use an authorised organisation workspace around projects, partners, opportunities and Built World intelligence.",
  },
  {
    key: "institution",
    title: "Institution / Government",
    workspaceTitle: "Institution Workspace",
    baseType: "institution",
    short: "Programmes · evidence · networks · geography",
    description:
      "Operate institutional programmes, projects, evidence, collaboration networks and geographic intelligence.",
  },
];


const modes: {
  key: ProMode;
  number: string;
  label: string;
  description: string;
}[] = [
  {
    key: "workspaces",
    number: "01",
    label: "Workspaces",
    description: "Choose your operating context.",
  },
  {
    key: "tasks",
    number: "02",
    label: "Tasks",
    description: "Start with what you need to do.",
  },
  {
    key: "intelligence",
    number: "03",
    label: "Intelligence",
    description: "Use analysis and evidence.",
  },
  {
    key: "connections",
    number: "04",
    label: "Connections",
    description: "Follow connected Arknoz records.",
  },
];


const connections = [
  {
    label: "People",
    description: "Professionals, researchers and Built World participants.",
    href: "/people",
  },
  {
    label: "Organisations",
    description: "Practices, companies, institutions and organisations.",
    href: "/organisations",
  },
  {
    label: "Projects",
    description: "Buildings, infrastructure and connected project activity.",
    href: "/projects",
  },
  {
    label: "Products",
    description: "Materials, systems, equipment and product records.",
    href: "/products",
  },
  {
    label: "Knowledge",
    description: "Research, evidence, cases, methods and references.",
    href: "/knowledge",
  },
  {
    label: "Opportunities",
    description: "Jobs, calls, competitions and professional opportunities.",
    href: "/opportunities",
  },
  {
    label: "Universities",
    description: "Academic institutions, programmes and research contexts.",
    href: "/universities",
  },
] as const;


function flattenOrganisationModules(
  dashboard:
    | typeof COMPANY_V3
    | typeof UNIVERSITY_V3
    | typeof INSTITUTION_V3
): ModuleDefinition[] {
  return dashboard.groups.flatMap(
    (group) =>
      group.services.map(
        (service) => ({
          id: service.id,
          title: service.title,
          description:
            service.description,
          groupTitle:
            group.title,
          access:
            service.access === "ONE"
              ? "PRO"
              : "FREE",
        })
      )
  );
}


const organisationModules: Record<
  OrganisationWorkspaceType,
  ModuleDefinition[]
> = {
  company:
    flattenOrganisationModules(
      COMPANY_V3
    ),

  university:
    flattenOrganisationModules(
      UNIVERSITY_V3
    ),

  institution:
    flattenOrganisationModules(
      INSTITUTION_V3
    ),
};


const personalModules: ModuleDefinition[] = [
  {
    id: "profile",
    title: "Profile",
    description:
      "Professional identity and public member profile.",
    groupTitle: "Identity",
    access: "FREE",
  },
  {
    id: "experience-credentials",
    title: "Experience & Credentials",
    description:
      "Experience, qualifications and credentials.",
    groupTitle: "Identity",
    access: "FREE",
  },
  {
    id: "arknoz-points",
    title: "Arknoz Points",
    description:
      "Trusted participation and contribution points.",
    groupTitle: "Identity",
    access: "FREE",
  },
  {
    id: "saved",
    title: "Saved",
    description:
      "Projects, products and knowledge saved for later.",
    groupTitle: "My World",
    access: "FREE",
  },
  {
    id: "activity",
    title: "Activity",
    description:
      "Your recent Arknoz activity and continuity.",
    groupTitle: "My World",
    access: "FREE",
  },
  {
    id: "opportunities",
    title: "Opportunities",
    description:
      "Jobs, competitions, calls and opportunities.",
    groupTitle: "My World",
    access: "FREE",
  },
  {
    id: "messages",
    title: "Messages",
    description:
      "Professional member-to-member communication.",
    groupTitle: "Professional",
    access: "PRO",
  },
  {
    id: "arknoz-cv",
    title: "Arknoz CV",
    description:
      "Your structured professional Arknoz record.",
    groupTitle: "Professional",
    access: "PRO",
  },
  {
    id: "services",
    title: "Services",
    description:
      "Publish and manage professional services.",
    groupTitle: "Professional",
    access: "PRO",
  },
  {
    id: "contributions",
    title: "Contributions",
    description:
      "Contribute structured Built World records and evidence.",
    groupTitle: "Intelligence & Work",
    access: "PRO",
  },
  {
    id: "advanced-analytics",
    title: "Advanced Analytics",
    description:
      "Deeper analysis across your Arknoz world.",
    groupTitle: "Intelligence & Work",
    access: "PRO",
  },
  {
    id: "professional-tools",
    title: "Professional Tools",
    description:
      "Higher-value professional workspace capabilities.",
    groupTitle: "Intelligence & Work",
    access: "PRO",
  },
];


const personalPriority: Record<
  string,
  string[]
> = {
  professional: [
    "profile",
    "experience-credentials",
    "arknoz-cv",
    "services",
    "opportunities",
    "professional-tools",
    "advanced-analytics",
    "messages",
  ],

  career: [
    "profile",
    "experience-credentials",
    "saved",
    "opportunities",
    "arknoz-cv",
    "activity",
    "advanced-analytics",
    "contributions",
  ],

  researcher: [
    "profile",
    "experience-credentials",
    "saved",
    "contributions",
    "advanced-analytics",
    "professional-tools",
    "arknoz-cv",
    "opportunities",
  ],
};


const organisationPriority: Record<
  string,
  string[]
> = {
  employer: [
    "people",
    "opportunities",
    "collaboration",
    "analytics-benchmarks",
    "market-intelligence",
    "team-permissions",
    "company-profile",
    "projects",
  ],

  organisation: [
    "company-profile",
    "people",
    "projects",
    "portfolio-workspace",
    "knowledge",
    "collaboration",
    "market-intelligence",
    "analytics-benchmarks",
  ],

  manufacturer: [
    "products-services",
    "projects",
    "market-intelligence",
    "analytics-benchmarks",
    "people",
    "knowledge",
    "collaboration",
    "company-profile",
  ],

  developer: [
    "projects",
    "people",
    "products-services",
    "market-intelligence",
    "opportunities",
    "collaboration",
    "analytics-benchmarks",
    "company-profile",
  ],

  university: [
    "university-profile",
    "programmes",
    "research",
    "projects",
    "people",
    "industry-collaboration",
    "research-analytics",
    "impact-benchmarking",
  ],

  institution: [
    "institution-profile",
    "programmes",
    "projects",
    "knowledge-standards",
    "collaboration-network",
    "impact-evidence",
    "institutional-analytics",
    "geographic-intelligence",
  ],
};


function isOrganisationWorkspaceType(
  value: unknown
): value is OrganisationWorkspaceType {
  return (
    value === "company" ||
    value === "university" ||
    value === "institution"
  );
}


function sortByPriority(
  modules: ModuleDefinition[],
  priority: string[]
) {
  const position =
    new Map(
      priority.map(
        (id, index) => [
          id,
          index,
        ]
      )
    );

  return [...modules].sort(
    (a, b) => {
      const aPosition =
        position.get(a.id) ??
        999;

      const bPosition =
        position.get(b.id) ??
        999;

      return (
        aPosition -
        bPosition
      );
    }
  );
}


function Arrow() {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden="true"
      className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M4 10h11" />
      <path d="m11 6 4 4-4 4" />
    </svg>
  );
}


function SearchIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <circle
        cx="8.5"
        cy="8.5"
        r="4.5"
      />

      <path d="m12 12 4 4" />
    </svg>
  );
}


function personalHref(
  moduleId: string
) {
  return (
    moduleId === "profile"
      ? "/dashboard/profile"
      : `/dashboard/${moduleId}`
  );
}


export default function ProInteractiveJourney() {
  const router =
    useRouter();

  const [
    query,
    setQuery,
  ] =
    useState("");

  const [
    mode,
    setMode,
  ] =
    useState<ProMode>(
      "workspaces"
    );

  const [
    roleIndex,
    setRoleIndex,
  ] =
    useState(0);

  const [
    selectedWorkspaceId,
    setSelectedWorkspaceId,
  ] =
    useState("");

  const [
    taskIndex,
    setTaskIndex,
  ] =
    useState(0);

  const [
    intelligenceIndex,
    setIntelligenceIndex,
  ] =
    useState(0);

  const [
    connectionIndex,
    setConnectionIndex,
  ] =
    useState(0);

  const [
    authState,
    setAuthState,
  ] =
    useState<AuthState>(
      "loading"
    );

  const [
    personalPro,
    setPersonalPro,
  ] =
    useState(false);

  const [
    organisationWorkspaces,
    setOrganisationWorkspaces,
  ] =
    useState<
      OrganisationWorkspace[]
    >([]);

  const [
    workspaceLoadError,
    setWorkspaceLoadError,
  ] =
    useState(false);


  useEffect(() => {
    let cancelled =
      false;

    async function loadWorkspaceAccess() {
      const supabase =
        createClient();

      const {
        data: {
          user,
        },
        error:
          userError,
      } =
        await supabase.auth.getUser();

      if (cancelled) {
        return;
      }

      if (
        userError ||
        !user
      ) {
        setAuthState(
          "signed-out"
        );

        return;
      }

      setPersonalPro(
        hasPersonalArknozPro(user.app_metadata?.membership)
      );

      const {
        data:
          memberships,
        error:
          membershipError,
      } =
        await supabase
          .from(
            "organisation_workspace_members"
          )
          .select(
            "workspace_id, workspace_role"
          )
          .eq(
            "user_id",
            user.id
          )
          .eq(
            "member_status",
            "active"
          );

      if (cancelled) {
        return;
      }

      if (
        membershipError
      ) {
        setWorkspaceLoadError(
          true
        );

        setAuthState(
          "signed-in"
        );

        return;
      }

      const roleByWorkspaceId =
        new Map<
          string,
          string
        >();

      for (
        const membership
        of memberships ?? []
      ) {
        if (
          typeof membership.workspace_id ===
            "string" &&
          typeof membership.workspace_role ===
            "string"
        ) {
          roleByWorkspaceId.set(
            membership.workspace_id,
            membership.workspace_role
          );
        }
      }

      const workspaceIds =
        Array.from(
          roleByWorkspaceId.keys()
        );

      if (
        workspaceIds.length ===
        0
      ) {
        setAuthState(
          "signed-in"
        );

        return;
      }

      const {
        data:
          workspaceRows,
        error:
          workspaceError,
      } =
        await supabase
          .from(
            "organisation_workspaces"
          )
          .select(
            "id, workspace_type, plan, display_name, lifecycle_status"
          )
          .in(
            "id",
            workspaceIds
          )
          .eq(
            "lifecycle_status",
            "active"
          );

      if (cancelled) {
        return;
      }

      if (
        workspaceError
      ) {
        setWorkspaceLoadError(
          true
        );

        setAuthState(
          "signed-in"
        );

        return;
      }

      const nextWorkspaces:
        OrganisationWorkspace[] =
        [];

      for (
        const workspace
        of workspaceRows ?? []
      ) {
        if (
          typeof workspace.id !==
            "string" ||
          !isOrganisationWorkspaceType(
            workspace.workspace_type
          ) ||
          (
            workspace.plan !==
              "FREE" &&
            workspace.plan !==
              "ONE"
          ) ||
          typeof workspace.display_name !==
            "string"
        ) {
          continue;
        }

        const role =
          roleByWorkspaceId.get(
            workspace.id
          );

        if (!role) {
          continue;
        }

        nextWorkspaces.push({
          id:
            workspace.id,

          workspaceType:
            workspace.workspace_type,

          plan:
            workspace.plan,

          displayName:
            workspace.display_name,

          role,
        });
      }

      nextWorkspaces.sort(
        (a, b) =>
          a.displayName.localeCompare(
            b.displayName
          )
      );

      setOrganisationWorkspaces(
        nextWorkspaces
      );

      setAuthState(
        "signed-in"
      );
    }

    void loadWorkspaceAccess();

    return () => {
      cancelled =
        true;
    };
  }, []);


  const activeRole =
    roleViews[
      roleIndex
    ] ??
    roleViews[0];


  const matchingWorkspaces =
    useMemo(
      () =>
        activeRole.baseType ===
        "personal"
          ? []
          : organisationWorkspaces.filter(
              (workspace) =>
                workspace.workspaceType ===
                activeRole.baseType
            ),
      [
        activeRole,
        organisationWorkspaces,
      ]
    );


  const activeOrganisation =
    useMemo(
      () =>
        matchingWorkspaces.find(
          (workspace) =>
            workspace.id ===
            selectedWorkspaceId
        ) ??
        matchingWorkspaces[0] ??
        null,
      [
        matchingWorkspaces,
        selectedWorkspaceId,
      ]
    );


  const protectedPersonalHref =
    useCallback(
      (href: string) => {
        if (
          authState ===
          "signed-out"
        ) {
          return (
            `/sign-in?returnTo=${encodeURIComponent(
              href
            )}`
          );
        }

        return href;
      },
      [authState]
    );


  const currentModules:
    ResolvedModule[] =
    useMemo(
      () => {
        if (
          activeRole.baseType ===
          "personal"
        ) {
          const priority =
            personalPriority[
              activeRole.key
            ] ??
            personalPriority
              .professional;

          return sortByPriority(
            personalModules,
            priority
          ).map(
            (module) => ({
              ...module,

              href:
                protectedPersonalHref(
                  personalHref(
                    module.id
                  )
                ),

              locked:
                module.access ===
                  "PRO" &&
                !personalPro,
            })
          );
        }

        if (
          !activeOrganisation
        ) {
          return [];
        }

        const priority =
          organisationPriority[
            activeRole.key
          ] ?? [];

        return sortByPriority(
          organisationModules[
            activeOrganisation
              .workspaceType
          ],
          priority
        ).map(
          (module) => ({
            ...module,

            href:
              `/workspace/${activeOrganisation.id}/${module.id}`,

            locked:
              module.access ===
                "PRO" &&
              !hasOrganisationArknozPro(
                activeOrganisation.plan
              ),
          })
        );
      },
      [
        activeRole,
        activeOrganisation,
        personalPro,
        protectedPersonalHref,
      ]
    );


  const workspaceHref =
    useMemo(
      () => {
        if (
          activeRole.baseType ===
          "personal"
        ) {
          return protectedPersonalHref(
            "/dashboard"
          );
        }

        if (
          activeOrganisation
        ) {
          return (
            `/workspace/${activeOrganisation.id}`
          );
        }

        if (
          authState ===
          "loading"
        ) {
          return null;
        }

        if (
          authState ===
          "signed-out"
        ) {
          return (
            "/sign-in?returnTo=%2Fintelligence%23pro-navigator"
          );
        }

        return "/dashboard";
      },
      [
        activeRole,
        activeOrganisation,
        authState,
        protectedPersonalHref,
      ]
    );


  const workspaceLabel =
    activeRole.baseType ===
    "personal"
      ? "My Arknoz"
      : activeOrganisation
        ?.displayName ??
        activeRole
          .workspaceTitle;


  const taskOptions =
    useMemo(
      () => {
        function find(
          matcher:
            (
              module:
                ResolvedModule
            ) => boolean
        ) {
          return (
            currentModules.find(
              matcher
            ) ??
            null
          );
        }

        return [
          {
            label:
              "Identity",

            title:
              "Manage identity",

            description:
              "Keep the identity, profile and professional context behind this workspace current.",

            target:
              find(
                (module) =>
                  module.id ===
                    "profile" ||
                  module.id.endsWith(
                    "-profile"
                  )
              ),
          },
          {
            label:
              "Projects",

            title:
              "Work with projects",

            description:
              "Move into the project or portfolio capability currently available in this workspace.",

            target:
              find(
                (module) =>
                  module.id ===
                    "projects" ||
                  module.id ===
                    "saved" ||
                  module.id ===
                    "portfolio-workspace"
              ),
          },
          {
            label:
              "Opportunities",

            title:
              "Find opportunities",

            description:
              "Open the opportunity capability connected to this Arknoz context.",

            target:
              find(
                (module) =>
                  module.id ===
                  "opportunities"
              ),
          },
          {
            label:
              "Evidence",

            title:
              "Contribute evidence",

            description:
              "Move into contribution, evidence or research-output capabilities where your workspace supports them.",

            target:
              find(
                (module) =>
                  module.id ===
                    "contributions" ||
                  module.id.includes(
                    "evidence"
                  )
              ),
          },
          {
            label:
              "Analyse",

            title:
              "Analyse activity",

            description:
              "Use the analytical or intelligence capability already available to this workspace.",

            target:
              find(
                (module) =>
                  /analytics|intelligence|benchmark/i.test(
                    `${module.id} ${module.title}`
                  )
              ),
          },
          {
            label:
              "Collaborate",

            title:
              "Work with others",

            description:
              "Move into collaboration, network, people or professional communication capabilities.",

            target:
              find(
                (module) =>
                  /collaboration|messages|people/i.test(
                    `${module.id} ${module.title}`
                  )
              ),
          },
        ];
      },
      [
        currentModules,
      ]
    );


  const activeTask =
    taskOptions[
      taskIndex
    ] ??
    taskOptions[0];


  const intelligenceOptions =
    useMemo(
      () =>
        currentModules.filter(
          (module) =>
            /analytics|intelligence|benchmark|impact|professional-tools/i.test(
              `${module.id} ${module.title}`
            )
        ),
      [
        currentModules,
      ]
    );


  const activeIntelligence =
    intelligenceOptions[
      intelligenceIndex
    ] ??
    intelligenceOptions[0] ??
    null;


  const activeConnection =
    connections[
      connectionIndex
    ] ??
    connections[0];


  const workspaceDescription =
    useMemo(
      () => {
        if (
          activeRole.baseType ===
          "personal"
        ) {
          return (
            activeRole.description
          );
        }

        if (
          activeOrganisation
        ) {
          return (
            `${activeRole.description} Active authorised workspace: ${activeOrganisation.displayName}.`
          );
        }

        if (
          authState ===
          "loading"
        ) {
          return (
            "Checking the active organisation workspaces linked to this Arknoz account."
          );
        }

        if (
          workspaceLoadError
        ) {
          return (
            "Arknoz could not load organisation workspace access at this moment."
          );
        }

        if (
          authState ===
          "signed-out"
        ) {
          return (
            `Sign in to see authorised ${activeRole.title.toLowerCase()} workspaces linked to your Arknoz ID.`
          );
        }

        return (
          `No active ${activeRole.title.toLowerCase()} workspace is currently linked to this Arknoz account.`
        );
      },
      [
        activeRole,
        activeOrganisation,
        authState,
        workspaceLoadError,
      ]
    );


  const context =
    useMemo(
      () => {
        if (
          mode ===
          "tasks"
        ) {
          const target =
            activeTask.target;

          return {
            eyebrow:
              "PRO TASK",

            title:
              activeTask.title,

            description:
              target
                ? target.locked
                  ? `${activeTask.description} This capability requires the paid workspace level.`
                  : activeTask.description
                : `${activeTask.description} No dedicated module is currently available in this workspace.`,

            href:
              target &&
              !target.locked
                ? target.href
                : workspaceHref,

            cta:
              target &&
              !target.locked
                ? "Open task"
                : "Open workspace",
          };
        }

        if (
          mode ===
          "intelligence"
        ) {
          if (
            !activeIntelligence
          ) {
            return {
              eyebrow:
                "PRO INTELLIGENCE",

              title:
                "Workspace intelligence",

              description:
                "No dedicated intelligence module is currently available in this selected workspace context.",

              href:
                workspaceHref,

              cta:
                "Open workspace",
            };
          }

          return {
            eyebrow:
              "PRO INTELLIGENCE",

            title:
              activeIntelligence.title,

            description:
              activeIntelligence.locked
                ? `${activeIntelligence.description} This capability requires the paid workspace level.`
                : activeIntelligence.description,

            href:
              activeIntelligence
                .locked
                ? workspaceHref
                : activeIntelligence
                    .href,

            cta:
              activeIntelligence
                .locked
                ? "Open workspace"
                : "Open intelligence",
          };
        }

        if (
          mode ===
          "connections"
        ) {
          return {
            eyebrow:
              "ARKNOZ CONNECTION",

            title:
              activeConnection.label,

            description:
              activeConnection.description,

            href:
              activeConnection.href,

            cta:
              "Open connection",
          };
        }

        return {
          eyebrow:
            "PRO WORKSPACE",

          title:
            workspaceLabel,

          description:
            workspaceDescription,

          href:
            workspaceHref,

          cta:
            activeRole.baseType ===
            "personal"
              ? authState ===
                "signed-out"
                ? "Sign in to My Arknoz"
                : "Open My Arknoz"
              : activeOrganisation
                ? "Open workspace"
                : authState ===
                  "signed-out"
                  ? "Sign in"
                  : "Open My Arknoz",
        };
      },
      [
        mode,
        activeTask,
        activeIntelligence,
        activeConnection,
        activeRole,
        activeOrganisation,
        authState,
        workspaceLabel,
        workspaceDescription,
        workspaceHref,
      ]
    );


  function submitSearch(
    event: FormEvent
  ) {
    event.preventDefault();

    const value =
      query.trim();

    if (!value) {
      return;
    }

    router.push(
      `/search?q=${encodeURIComponent(
        value
      )}`
    );
  }


  function workspaceCount(
    baseType:
      WorkspaceBase
  ) {
    if (
      baseType ===
      "personal"
    ) {
      return null;
    }

    return (
      organisationWorkspaces.filter(
        (workspace) =>
          workspace.workspaceType ===
          baseType
      ).length
    );
  }


  return (
    <section
      id="pro-navigator"
      data-pro-workbench="true"
      className="border-t border-slate-200 bg-[#f5f7fb] text-slate-950"
    >
      <div className="mx-auto max-w-[1720px] px-4 py-5 sm:px-6 lg:px-8 lg:py-7">

        {/* HEADER */}

        <div className="mb-5 grid gap-4 lg:grid-cols-[1fr_1.25fr] lg:items-end">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-700">
              ARKNOZ PRO
            </p>

            <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
              Operate the Built World.
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Choose a role, enter a real Arknoz workspace, use available
              professional modules and move through the connected Built World.
            </p>
          </div>

          <form
            onSubmit={submitSearch}
            className="flex items-center overflow-hidden rounded-[8px] border border-slate-200 bg-white p-1.5 shadow-sm"
          >
            <span
              aria-hidden="true"
              className="ml-3 text-slate-400"
            >
              <SearchIcon />
            </span>

            <input
              value={query}
              onChange={(event) =>
                setQuery(
                  event.target.value
                )
              }
              placeholder="Search talent, organisations, projects, products, knowledge..."
              className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm outline-none placeholder:text-slate-400"
            />

            <button
              type="submit"
              className="rounded-[8px] bg-[#0a2230] px-5 py-3 text-xs font-semibold text-white transition hover:bg-[#153e57]"
            >
              Search
            </button>
          </form>
        </div>


        {/* WORKBENCH */}

        <div className="grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)_310px] lg:items-start">

          {/* LEFT NAVIGATOR */}

          <aside className="rounded-[10px] border border-slate-200 bg-[#0a2230] p-3 text-white shadow-sm lg:sticky lg:top-28 lg:self-start">
            <p className="px-3 pt-2 text-[9px] font-bold uppercase tracking-[0.18em] text-blue-200">
              Pro navigator
            </p>

            <div className="mt-4 grid grid-cols-2 gap-2 lg:grid-cols-1">
              {modes.map(
                (item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() =>
                      setMode(
                        item.key
                      )
                    }
                    className={`rounded-[8px] border p-4 text-left transition ${
                      mode ===
                      item.key
                        ? "border-white bg-white text-slate-950"
                        : "border-white/10 bg-white/[0.04] text-white/70 hover:bg-white/[0.09] hover:text-white"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm font-semibold">
                        {item.label}
                      </span>

                      <span className="text-[9px] font-bold tracking-[0.15em] opacity-40">
                        {item.number}
                      </span>
                    </div>

                    <p className="mt-2 text-[10px] leading-4 opacity-50">
                      {item.description}
                    </p>
                  </button>
                )
              )}
            </div>

            <div className="mt-5 border-t border-white/10 pt-4">
              {[
                [
                  "My Arknoz",
                  "/dashboard",
                ],
                [
                  "Explore",
                  "/explore",
                ],
                [
                  "Search",
                  "/search",
                ],
              ].map(
                ([
                  label,
                  href,
                ]) => (
                  <Link
                    key={href}
                    href={href}
                    className="group flex items-center justify-between rounded-[6px] px-3 py-2.5 text-xs font-medium text-white/55 transition hover:bg-white/[0.06] hover:text-white"
                  >
                    {label}
                    <Arrow />
                  </Link>
                )
              )}
            </div>
          </aside>


          {/* CENTRAL CANVAS */}

          <div className="min-w-0 overflow-hidden rounded-[10px] border border-slate-200 bg-white shadow-sm">

            {/* WORKSPACES */}

            {mode ===
            "workspaces" ? (
              <div className="flex min-h-full flex-col">
                <div className="border-b border-slate-200 p-5 sm:p-6">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-[0.17em] text-slate-400">
                        ROLE-AWARE WORKSPACES
                      </p>

                      <h3 className="mt-2 text-2xl font-semibold tracking-[-0.035em]">
                        Select how you are operating
                      </h3>
                    </div>

                    <p className="text-xs text-slate-400">
                      One Arknoz ID · multiple authorised contexts
                    </p>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-2 md:grid-cols-3">
                    {roleViews.map(
                      (
                        role,
                        index
                      ) => {
                        const count =
                          workspaceCount(
                            role.baseType
                          );

                        return (
                          <button
                            key={
                              role.key
                            }
                            type="button"
                            onClick={() => {
                              setRoleIndex(
                                index
                              );

                              setSelectedWorkspaceId(
                                ""
                              );

                              setTaskIndex(
                                0
                              );

                              setIntelligenceIndex(
                                0
                              );
                            }}
                            className={`min-h-[94px] rounded-[8px] border px-4 py-3 text-left transition ${
                              roleIndex ===
                              index
                                ? "border-[#0a2230] bg-[#0a2230] text-white"
                                : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-white"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <span className="text-xs font-semibold leading-5">
                                {
                                  role.title
                                }
                              </span>

                              <span className="shrink-0 text-[8px] font-bold uppercase tracking-[0.12em] opacity-45">
                                {
                                  role.baseType ===
                                  "personal"
                                    ? "MY"
                                    : authState ===
                                      "loading"
                                      ? "..."
                                      : authState ===
                                        "signed-out"
                                        ? "ID"
                                        : `${count ?? 0}`
                                }
                              </span>
                            </div>

                            <p className="mt-2 line-clamp-2 text-[9px] leading-4 opacity-50">
                              {
                                role.short
                              }
                            </p>
                          </button>
                        );
                      }
                    )}
                  </div>
                </div>


                <div className="grid flex-1 lg:grid-cols-[.76fr_1.24fr] lg:items-start">

                  {/* ACTIVE WORKSPACE */}

                  <div className="relative min-h-[380px] overflow-hidden bg-[#0a2230] p-6 text-white sm:p-8">
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(255,255,255,.4)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.4)_1px,transparent_1px)] [background-size:46px_46px]"
                    />

                    <div className="relative flex h-full flex-col">
                      <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/55">
                        ACTIVE ROLE
                      </p>

                      <h4 className="mt-4 max-w-[12ch] text-4xl font-semibold tracking-[-0.05em]">
                        {
                          activeRole.workspaceTitle
                        }
                      </h4>

                      <p className="mt-4 max-w-xl text-sm leading-7 text-white/65">
                        {
                          activeRole.description
                        }
                      </p>


                      {activeRole.baseType !==
                        "personal" &&
                      matchingWorkspaces.length >
                        0 ? (
                        <div className="mt-7">
                          <p className="text-[9px] font-bold uppercase tracking-[0.17em] text-white/40">
                            YOUR AUTHORISED WORKSPACES
                          </p>

                          <div className="mt-3 grid gap-2">
                            {matchingWorkspaces.map(
                              (
                                workspace
                              ) => (
                                <button
                                  key={
                                    workspace.id
                                  }
                                  type="button"
                                  onClick={() =>
                                    setSelectedWorkspaceId(
                                      workspace.id
                                    )
                                  }
                                  className={`rounded-[8px] border px-4 py-3 text-left transition ${
                                    activeOrganisation
                                      ?.id ===
                                    workspace.id
                                      ? "border-white bg-white text-slate-950"
                                      : "border-white/15 bg-white/[0.06] text-white/75 hover:bg-white/[0.1]"
                                  }`}
                                >
                                  <div className="flex items-center justify-between gap-3">
                                    <span className="text-xs font-semibold">
                                      {
                                        workspace.displayName
                                      }
                                    </span>

                                    <span className="text-[8px] font-bold uppercase tracking-[0.12em] opacity-45">
                                      {
                                        workspace.role
                                      }
                                    </span>
                                  </div>
                                </button>
                              )
                            )}
                          </div>
                        </div>
                      ) : null}


                      <div className="mt-7 border-t border-white/10 pt-6">
                        <p className="text-[9px] font-bold uppercase tracking-[0.17em] text-white/40">
                          ACTIVE WORKSPACE
                        </p>

                        <p className="mt-2 text-lg font-semibold">
                          {
                            workspaceLabel
                          }
                        </p>

                        <p className="mt-2 max-w-md text-xs leading-6 text-white/50">
                          {
                            workspaceDescription
                          }
                        </p>

                        {workspaceHref ? (
                          <Link
                            href={
                              workspaceHref
                            }
                            className="group mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950"
                          >
                            {
                              activeRole.baseType ===
                              "personal"
                                ? "Open My Arknoz"
                                : activeOrganisation
                                  ? "Enter workspace"
                                  : authState ===
                                    "signed-out"
                                    ? "Sign in"
                                    : "Open My Arknoz"
                            }

                            <Arrow />
                          </Link>
                        ) : (
                          <div className="mt-5 inline-flex rounded-full border border-white/15 px-5 py-3 text-xs font-semibold text-white/50">
                            Checking workspace access...
                          </div>
                        )}
                      </div>
                    </div>
                  </div>


                  {/* REAL MODULES */}

                  <div className="border-t border-slate-200 bg-[#f5f7fb] p-5 lg:border-l lg:border-t-0 sm:p-6">
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-[0.17em] text-slate-400">
                          WORKSPACE MODULES
                        </p>

                        <h4 className="mt-2 text-xl font-semibold tracking-[-0.03em]">
                          {
                            workspaceLabel
                          }
                        </h4>
                      </div>

                      <span className="text-[9px] font-bold uppercase tracking-[0.13em] text-slate-400">
                        {
                          currentModules.length
                        } modules
                      </span>
                    </div>

                    {currentModules.length >
                    0 ? (
                      <div className="mt-4 grid gap-2 xl:grid-cols-2">
                        {currentModules.map(
                            (
                              module,
                              index
                            ) =>
                              module.locked ? (
                                <div
                                  key={
                                    module.id
                                  }
                                  className="flex min-h-[58px] items-center justify-between rounded-[8px] border border-slate-200 bg-slate-100/70 px-4 py-3"
                                >
                                  <div className="min-w-0">
                                    <p className="truncate text-xs font-semibold text-slate-500">
                                      <span className="mr-3 text-[8px] text-slate-400">
                                        {String(
                                          index +
                                            1
                                        ).padStart(
                                          2,
                                          "0"
                                        )}
                                      </span>

                                      {
                                        module.title
                                      }
                                    </p>

                                    <p className="mt-1 text-[9px] text-slate-400">
                                      {
                                        module.groupTitle
                                      }
                                    </p>
                                  </div>

                                  <span className="ml-3 shrink-0 rounded-full border border-slate-200 bg-white px-2 py-1 text-[7px] font-bold tracking-[0.12em] text-slate-400">
                                    PRO
                                  </span>
                                </div>
                              ) : (
                                <Link
                                  key={
                                    module.id
                                  }
                                  href={
                                    module.href
                                  }
                                  className="group flex min-h-[58px] items-center justify-between rounded-[8px] border border-slate-200 bg-white px-4 py-3 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:shadow-sm"
                                >
                                  <span className="min-w-0">
                                    <span className="mr-3 text-[8px] text-slate-400">
                                      {String(
                                        index +
                                          1
                                      ).padStart(
                                        2,
                                        "0"
                                      )}
                                    </span>

                                    {
                                      module.title
                                    }

                                    <span className="mt-1 block pl-7 text-[9px] font-medium text-slate-400">
                                      {
                                        module.groupTitle
                                      }
                                    </span>
                                  </span>

                                  <Arrow />
                                </Link>
                              )
                          )}
                      </div>
                    ) : (
                      <div className="mt-4 rounded-[8px] border border-slate-200 bg-white p-6">
                        <p className="text-sm font-semibold text-slate-700">
                          {
                            authState ===
                            "loading"
                              ? "Checking workspace access..."
                              : authState ===
                                "signed-out"
                                ? "Sign in to view your authorised workspace modules."
                                : "No authorised workspace is linked for this role."
                          }
                        </p>

                        <p className="mt-2 text-xs leading-6 text-slate-500">
                          Arknoz only exposes organisation modules when an active
                          workspace membership exists. No workspace ID is guessed
                          or generated here.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : null}


            {/* TASKS */}

            {mode ===
            "tasks" ? (
              <div className="grid min-h-[560px] lg:grid-cols-[300px_1fr]">
                <div className="border-b border-slate-200 bg-[#f5f7fb] p-5 lg:border-b-0 lg:border-r">
                  <p className="text-[9px] font-bold uppercase tracking-[0.17em] text-slate-400">
                    START FROM A TASK
                  </p>

                  <div className="mt-4 grid gap-2">
                    {taskOptions.map(
                      (
                        task,
                        index
                      ) => (
                        <button
                          key={
                            task.label
                          }
                          type="button"
                          onClick={() =>
                            setTaskIndex(
                              index
                            )
                          }
                          className={`rounded-[8px] border px-4 py-3 text-left transition ${
                            taskIndex ===
                            index
                              ? "border-[#0a2230] bg-[#0a2230] text-white"
                              : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                          }`}
                        >
                          <p className="text-xs font-semibold">
                            {
                              task.label
                            }
                          </p>

                          <p className="mt-1 text-[9px] leading-4 opacity-50">
                            {
                              task.title
                            }
                          </p>
                        </button>
                      )
                    )}
                  </div>
                </div>

                <div className="relative flex min-h-[500px] items-center overflow-hidden bg-white p-8 sm:p-12">
                  <div className="max-w-2xl">
                    <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-blue-700">
                      PRO TASK · {
                        activeRole.title
                      }
                    </p>

                    <h3 className="mt-4 max-w-[13ch] text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
                      {
                        activeTask.title
                      }
                    </h3>

                    <p className="mt-6 max-w-xl text-base leading-8 text-slate-500">
                      {
                        activeTask.description
                      }
                    </p>

                    {activeTask.target ? (
                      <div className="mt-7 rounded-[8px] border border-slate-200 bg-slate-50 p-5">
                        <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400">
                          REAL ARKNOZ MODULE
                        </p>

                        <p className="mt-2 text-sm font-semibold text-slate-800">
                          {
                            activeTask.target
                              .title
                          }
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {
                            activeTask.target
                              .groupTitle
                          }
                        </p>
                      </div>
                    ) : null}

                    {context.href ? (
                      <Link
                        href={
                          context.href
                        }
                        className="group mt-7 inline-flex items-center gap-2 rounded-[8px] bg-[#0a2230] px-6 py-3 text-sm font-semibold text-white"
                      >
                        {
                          context.cta
                        }
                        <Arrow />
                      </Link>
                    ) : null}
                  </div>
                </div>
              </div>
            ) : null}


            {/* INTELLIGENCE */}

            {mode ===
            "intelligence" ? (
              <div className="min-h-[560px] bg-[#f5f7fb] p-5 sm:p-7">
                <div className="flex flex-col gap-3 border-b border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.17em] text-slate-400">
                      WORKSPACE INTELLIGENCE
                    </p>

                    <h3 className="mt-2 text-2xl font-semibold tracking-[-0.035em]">
                      Analyse from the active context
                    </h3>
                  </div>

                  <p className="text-xs text-slate-400">
                    {
                      activeRole.title
                    } · {
                      workspaceLabel
                    }
                  </p>
                </div>

                {intelligenceOptions.length >
                0 ? (
                  <div className="mt-5 grid gap-3 md:grid-cols-2">
                    {intelligenceOptions.map(
                      (
                        item,
                        index
                      ) => (
                        <button
                          key={
                            item.id
                          }
                          type="button"
                          onClick={() =>
                            setIntelligenceIndex(
                              index
                            )
                          }
                          className={`min-h-[125px] rounded-[8px] border p-5 text-left transition ${
                            activeIntelligence
                              ?.id ===
                            item.id
                              ? "border-[#0a2230] bg-[#0a2230] text-white shadow-sm"
                              : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:shadow-sm"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <span className="text-[8px] font-bold tracking-[0.15em] opacity-40">
                              {String(
                                index +
                                  1
                              ).padStart(
                                2,
                                "0"
                              )}
                            </span>

                            {item.locked ? (
                              <span className="rounded-full border border-current/15 px-2 py-1 text-[7px] font-bold tracking-[0.12em] opacity-55">
                                PRO
                              </span>
                            ) : null}
                          </div>

                          <h4 className="mt-7 text-xl font-semibold tracking-[-0.03em]">
                            {
                              item.title
                            }
                          </h4>

                          <p className="mt-2 text-xs leading-5 opacity-55">
                            {
                              item.description
                            }
                          </p>
                        </button>
                      )
                    )}
                  </div>
                ) : (
                  <div className="mt-5 rounded-[8px] border border-slate-200 bg-white p-7">
                    <p className="text-sm font-semibold text-slate-700">
                      No dedicated intelligence module is currently available in this workspace.
                    </p>

                    <p className="mt-2 max-w-xl text-xs leading-6 text-slate-500">
                      Select another authorised workspace or return to Workspaces to change your operating context.
                    </p>
                  </div>
                )}

                {activeIntelligence ? (
                  <div className="mt-5 rounded-[10px] border border-slate-200 bg-white p-6">
                    <p className="text-[9px] font-bold uppercase tracking-[0.17em] text-blue-700">
                      ACTIVE INTELLIGENCE
                    </p>

                    <h4 className="mt-3 text-2xl font-semibold tracking-[-0.035em]">
                      {
                        activeIntelligence.title
                      }
                    </h4>

                    <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
                      {
                        activeIntelligence.description
                      }
                    </p>

                    {context.href ? (
                      <Link
                        href={
                          context.href
                        }
                        className="group mt-5 inline-flex items-center gap-2 rounded-[8px] bg-[#0a2230] px-5 py-3 text-sm font-semibold text-white"
                      >
                        {
                          context.cta
                        }
                        <Arrow />
                      </Link>
                    ) : null}
                  </div>
                ) : null}
              </div>
            ) : null}


            {/* CONNECTIONS */}

            {mode ===
            "connections" ? (
              <div className="relative min-h-[560px] overflow-hidden bg-[#f5f7fb] p-5 sm:p-7">
                <div className="mx-auto grid min-h-[500px] max-w-[900px] grid-cols-3 grid-rows-3 gap-3">
                  {connections.map(
                    (
                      item,
                      index
                    ) => {
                      const positions = [
                        "col-start-2 row-start-1",
                        "col-start-3 row-start-1",
                        "col-start-3 row-start-2",
                        "col-start-3 row-start-3",
                        "col-start-2 row-start-3",
                        "col-start-1 row-start-3",
                        "col-start-1 row-start-2",
                      ];

                      return (
                        <button
                          key={
                            item.label
                          }
                          type="button"
                          onClick={() =>
                            setConnectionIndex(
                              index
                            )
                          }
                          className={`${positions[index]} flex min-h-[118px] flex-col justify-between rounded-[8px] border p-5 text-left transition ${
                            connectionIndex ===
                            index
                              ? "border-[#0a2230] bg-[#0a2230] text-white shadow-sm"
                              : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:shadow-sm"
                          }`}
                        >
                          <span className="text-[8px] font-bold tracking-[0.15em] opacity-40">
                            {String(
                              index +
                                1
                            ).padStart(
                              2,
                              "0"
                            )}
                          </span>

                          <span className="text-sm font-semibold">
                            {
                              item.label
                            }
                          </span>
                        </button>
                      );
                    }
                  )}

                  <div className="col-start-2 row-start-2 flex min-h-[118px] flex-col items-center justify-center rounded-[10px] border border-slate-200 bg-white p-5 text-center shadow-sm">
                    <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-red-500">
                      ARKNOZ PRO
                    </p>

                    <p className="mt-2 text-sm font-semibold">
                      Connected Built World
                    </p>

                    <p className="mt-2 text-[9px] leading-4 text-slate-400">
                      {
                        activeRole.title
                      }
                    </p>
                  </div>
                </div>
              </div>
            ) : null}
          </div>


          {/* CONTEXT DRAWER */}

          <aside className="flex flex-col rounded-[10px] border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-28 lg:self-start">
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-blue-700">
              {
                context.eyebrow
              }
            </p>

            <h3 className="mt-4 text-2xl font-semibold tracking-[-0.035em]">
              {
                context.title
              }
            </h3>

            <p className="mt-4 text-sm leading-6 text-slate-500">
              {
                context.description
              }
            </p>

            <div className="mt-5 rounded-[8px] border border-slate-200 bg-slate-50 p-4">
              <p className="text-[8px] font-bold uppercase tracking-[0.15em] text-slate-400">
                ACTIVE ROLE
              </p>

              <p className="mt-1 text-xs font-semibold text-slate-700">
                {
                  activeRole.title
                }
              </p>

              {activeOrganisation ? (
                <p className="mt-1 text-[9px] text-slate-400">
                  {
                    activeOrganisation.displayName
                  } · {
                    activeOrganisation.role
                  }
                </p>
              ) : null}
            </div>

            {context.href ? (
              <Link
                href={
                  context.href
                }
                className="group mt-6 inline-flex items-center justify-between rounded-[8px] bg-[#0a2230] px-4 py-3 text-xs font-semibold text-white"
              >
                {
                  context.cta
                }
                <Arrow />
              </Link>
            ) : (
              <div className="mt-6 rounded-[8px] border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-400">
                Checking access...
              </div>
            )}

            <div className="mt-6 border-t border-slate-100 pt-5">
              <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-400">
                QUICK ACCESS
              </p>

              <div className="mt-3 grid gap-2">
                {[
                  [
                    "My Arknoz",
                    "/dashboard",
                  ],
                  [
                    "Explore Arknoz",
                    "/explore",
                  ],
                  [
                    "Search all Arknoz",
                    "/search",
                  ],
                ].map(
                  ([
                    label,
                    href,
                  ]) => (
                    <Link
                      key={href}
                      href={href}
                      className="group flex items-center justify-between rounded-[6px] border border-slate-200 bg-slate-50 px-3 py-3 text-[11px] font-semibold text-slate-600 transition hover:bg-white"
                    >
                      {
                        label
                      }
                      <Arrow />
                    </Link>
                  )
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
