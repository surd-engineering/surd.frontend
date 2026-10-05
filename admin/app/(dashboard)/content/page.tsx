"use client";

import { useState } from "react";
import {
  CodeIcon,
  Edit02Icon,
  Globe02Icon,
  PlusSignIcon,
  SmartPhone01Icon,
  TextFontIcon,
} from "@hugeicons/core-free-icons";
import {
  useAdminContent,
  useAdminContents,
  useAdminCreateContent,
  useAdminSetContentStatus,
  useAdminUpdateContent,
} from "@/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { SearchInput } from "@/components/ui/search-input";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { Can } from "@/components/auth/can";
import { PersonCell } from "@/components/dashboard/person-cell";
import { DataTable, type Column } from "@/components/ui/table";
import { TabPanel, Tabs, type TabItem } from "@/components/ui/tabs";
import { useDebounced } from "@/hooks/use-debounced";
import { useTablePage } from "@/hooks/use-pagination";
import { useDisclosure } from "@/hooks/use-disclosure";
import { usePermissions } from "@/contexts/permissions";
import { formatName, formatTimestamp } from "@/lib/format";
import { ContentPlatform } from "@/types/enum";
import { Permission } from "@/types/permission";
import type { AdminContent } from "@/types/content";

const PLATFORM_TABS: TabItem[] = [
  { value: ContentPlatform.MobileApp, label: "Mobile app", icon: SmartPhone01Icon },
  { value: ContentPlatform.AdminPortal, label: "Admin", icon: CodeIcon },
  { value: ContentPlatform.Website, label: "Website", icon: Globe02Icon },
];

export default function ContentPage() {
  const [platform, setPlatform] = useState<string>(ContentPlatform.MobileApp);
  const [query, setQuery] = useState("");
  const { page, setPage, pageSize, setPageSize } = useTablePage();

  const edit = useDisclosure<AdminContent>();
  const create = useDisclosure();

  const search = useDebounced(query);
  const { can } = usePermissions();
  const mayEdit = can(Permission.ContentManage);

  const { data, isLoading } = useAdminContents({
    platform: platform as ContentPlatform,
    search: search || undefined,
    page,
    limit: pageSize,
  });

  const setStatus = useAdminSetContentStatus();

  const columns: Column<AdminContent>[] = [
    {
      id: "key",
      header: "Key",
      cell: (row) => <span className="font-medium">{row.key}</span>,
      width: "min-w-48",
    },
    {
      id: "title",
      header: "Title",
      cell: (row) => <span className="font-semibold">{row.title}</span>,
      width: "min-w-44",
    },
    { id: "placement", header: "Placement", cell: (row) => row.placement || "—" },
    {
      id: "english",
      header: "English",
      cell: (row) => <Truncated text={row.english} />,
      width: "min-w-40",
    },
    {
      id: "french",
      header: "French",
      cell: (row) => <Truncated text={row.french} />,
      width: "min-w-40",
    },
    {
      id: "enabled",
      header: "Live",
      cell: (row) => (
        <Switch
          size="sm"
          checked={row.enabled}
          disabled={!mayEdit || setStatus.isPending}
          aria-label={`${row.enabled ? "Disable" : "Enable"} ${row.key}`}
          onCheckedChange={(enabled) =>
            setStatus.mutate({ content_id: row.id, enabled })
          }
        />
      ),
    },
    {
      id: "updatedBy",
      header: "Updated by",
      cell: (row) => (
        <PersonCell
          name={row.updated_by ? formatName(row.updated_by) : null}
          email={row.updated_by?.email}
          avatar={row.updated_by?.avatar}
        />
      ),
      width: "min-w-48",
    },
    {
      id: "lastUpdated",
      header: "Last updated",
      cell: (row) => formatTimestamp(row.updated_at),
    },
    {
      id: "actions",
      header: "Actions",
      cell: (row) => (
        <Can do={Permission.ContentManage}>
          <Button
            variant="soft"
            size="md"
            shape="pill"
            leadingIcon={Edit02Icon}
            onClick={() => edit.open(row)}
          >
            Edit
          </Button>
        </Can>
      ),
    },
  ];

  const table = (
    <DataTable
      data={data?.data ?? []}
      columns={columns}
      getRowId={(row) => row.id}
      isLoading={isLoading}
      minWidth="min-w-6xl"
      pagination={{
        mode: "server",
        page,
        pageSize,
        totalItems: data?.pagination?.total ?? 0,
        onPageChange: setPage,
        onPageSizeChange: setPageSize,
      }}
      emptyState={
        <EmptyState
          icon={TextFontIcon}
          title="No content yet"
          description={
            search
              ? "No copy matches that search on this surface."
              : "Add a key to start managing copy for this surface."
          }
        />
      }
    />
  );

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Content & Marketing"
        description="Manage all content across all Surd platforms"
        actions={
          <Can do={Permission.ContentManage}>
            <Button
              tone="primary"
              size="xl"
              shape="pill"
              leadingIcon={PlusSignIcon}
              onClick={() => create.open()}
            >
              Add key
            </Button>
          </Can>
        }
      />

      <section className="rounded-2xl border border-grey-50 bg-white p-4 sm:p-5">
        <Tabs
          items={PLATFORM_TABS}
          value={platform}
          onValueChange={(next) => {
            setPlatform(next);
            setPage(1);
          }}
          variant="pill"
          className="gap-6"
        >
          {PLATFORM_TABS.map((tab) => (
            <TabPanel key={tab.value} value={tab.value}>
              <SearchInput
                value={query}
                onChange={(next) => {
                  setQuery(next);
                  setPage(1);
                }}
                placeholder="Search key, title or copy"
                className="mb-5 w-full sm:w-80"
              />
              {table}
            </TabPanel>
          ))}
        </Tabs>
      </section>

      {edit.isOpen && edit.data ? (
        <EditContentDialog control={edit} row={edit.data} />
      ) : null}

      {create.isOpen ? (
        <CreateContentDialog control={create} platform={platform as ContentPlatform} />
      ) : null}
    </div>
  );
}

function Truncated({ text }: { text: string }) {
  if (!text) return <span className="text-grey-400">—</span>;
  return (
    <span className="block max-w-40 truncate" title={text}>
      {text}
    </span>
  );
}

function EditContentDialog({
  control,
  row,
}: {
  control: ReturnType<typeof useDisclosure<AdminContent>>;
  row: AdminContent;
}) {
  const { data } = useAdminContent({ content_id: row.id });
  const entry = data?.data;

  if (!entry) {
    return (
      <Dialog control={control} title="Edit content" icon={Edit02Icon}>
        <div className="grid place-items-center py-10">
          <Spinner size={24} className="text-primary" />
        </div>
      </Dialog>
    );
  }

  return <ContentForm control={control} entry={entry} />;
}

function ContentForm({
  control,
  entry,
}: {
  control: ReturnType<typeof useDisclosure<AdminContent>>;
  entry: AdminContent;
}) {
  const [english, setEnglish] = useState(entry.english);
  const [french, setFrench] = useState(entry.french);

  const save = useAdminUpdateContent({ onSuccess: control.close });

  const changed = {
    ...(english !== entry.english ? { english } : {}),
    ...(french !== entry.french ? { french } : {}),
  };
  const nothingToSave = Object.keys(changed).length === 0;

  return (
    <Dialog
      control={control}
      title="Edit content"
      icon={Edit02Icon}
      confirmLabel="Save changes"
      confirmDisabled={nothingToSave}
      isSubmitting={save.isPending}
      onConfirm={() => save.mutate({ content_id: entry.id, ...changed })}
    >
      <Field label="Key" hint="Client apps look copy up by this — it cannot be changed.">
        <Input value={entry.key} readOnly />
      </Field>

      <Field label="Title">
        <Input value={entry.title} readOnly />
      </Field>

      <Field label="English" htmlFor="content-english">
        <Textarea
          id="content-english"
          value={english}
          onChange={setEnglish}
          placeholder="Copy shown to the user"
        />
      </Field>

      <Field label="French" htmlFor="content-french">
        <Textarea
          id="content-french"
          value={french}
          onChange={setFrench}
          placeholder="La version française"
        />
      </Field>
    </Dialog>
  );
}

const EMPTY_DRAFT = {
  key: "",
  title: "",
  placement: "",
  english: "",
  french: "",
};

function CreateContentDialog({
  control,
  platform,
}: {
  control: ReturnType<typeof useDisclosure<void>>;
  platform: ContentPlatform;
}) {
  const [draft, setDraft] = useState(EMPTY_DRAFT);
  const [enabled, setEnabled] = useState(true);

  const create = useAdminCreateContent({ onSuccess: control.close });

  const set = (field: keyof typeof EMPTY_DRAFT) => (value: string) =>
    setDraft((current) => ({ ...current, [field]: value }));

  const incomplete = Object.values(draft).some((value) => !value.trim());

  return (
    <Dialog
      control={control}
      title="Add content key"
      description={`Adds a key to ${platform.replace(/_/g, " ").toLowerCase()}. The same key may exist once per surface.`}
      icon={PlusSignIcon}
      confirmLabel="Create key"
      confirmDisabled={incomplete}
      isSubmitting={create.isPending}
      onConfirm={() => create.mutate({ ...draft, platform, enabled })}
    >
      <Field label="Key" htmlFor="new-key">
        <Input
          id="new-key"
          value={draft.key}
          onChange={(event) => set("key")(event.target.value)}
          placeholder="homeBannerSavingsPrompt"
        />
      </Field>

      <Field label="Title" htmlFor="new-title">
        <Input
          id="new-title"
          value={draft.title}
          onChange={(event) => set("title")(event.target.value)}
          placeholder="Home banner — savings prompt"
        />
      </Field>

      <Field label="Placement" htmlFor="new-placement">
        <Input
          id="new-placement"
          value={draft.placement}
          onChange={(event) => set("placement")(event.target.value)}
          placeholder="home_banner"
        />
      </Field>

      <Field label="English" htmlFor="new-english">
        <Textarea
          id="new-english"
          value={draft.english}
          onChange={set("english")}
          placeholder="Pay your future self by saving first."
        />
      </Field>

      <Field label="French" htmlFor="new-french">
        <Textarea
          id="new-french"
          value={draft.french}
          onChange={set("french")}
          placeholder="Payez-vous d'abord pour votre avenir."
        />
      </Field>

      <label className="flex items-center justify-between gap-3 rounded-xl bg-grey-25 px-4 py-3 text-sm">
        <span className="flex flex-col">
          <span className="font-medium text-grey-900">Live on the client apps</span>
          <span className="text-xs text-grey-500">
            Disabled keys stay visible here but are hidden from users.
          </span>
        </span>
        <Switch checked={enabled} onCheckedChange={setEnabled} />
      </label>

      <Badge tone="neutral" variant="soft" size="sm">
        {platform.replace(/_/g, " ")}
      </Badge>
    </Dialog>
  );
}

function Textarea({
  id,
  value,
  onChange,
  placeholder,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <textarea
      id={id}
      rows={4}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="w-full resize-y rounded-xl bg-grey-25 px-4 py-3 text-sm text-grey-900 outline-none placeholder:text-grey-300 focus:shadow-ring-gray"
    />
  );
}
