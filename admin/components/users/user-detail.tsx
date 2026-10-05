"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowDataTransferVerticalIcon,
  ArrowLeft02Icon,
  ArrowRight02Icon,
  BankIcon,
  Calendar03Icon,
  Clock01Icon,
  ComputerIcon,
  IdentityCardIcon,
  InformationCircleIcon,
  Location01Icon,
  Mail01Icon,
  PiggyBankIcon,
  SmartPhone01Icon,
  UnavailableIcon,
  UserAccountIcon,
  UserGroupIcon,
  UserIcon,
  UserSquareIcon,
  ViewIcon,
} from "@hugeicons/core-free-icons";
import {
  useAdminCloseUserAccount,
  useAdminKyc,
  useAdminUser,
  useAdminUserOverview,
  useAdminUserSessions,
  useSavings,
  useTransactions,
} from "@/api";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { EmptyState, TableEmptyState } from "@/components/ui/empty-state";
import { Field } from "@/components/ui/field";
import { Flag } from "@/components/ui/flag";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { SearchInput } from "@/components/ui/search-input";
import { Spinner } from "@/components/ui/spinner";
import {
  TableFilter,
  TableSort,
  type FilterGroup,
  type FilterOption,
} from "@/components/ui/table-controls";
import { Can } from "@/components/auth/can";
import { CurrencyChip } from "@/components/dashboard/editor-cell";
import { Panel } from "@/components/dashboard/panel";
import { StatCard } from "@/components/dashboard/stat-card";
import { HniBadge, StatusBadge } from "@/components/dashboard/status-badge";
import { DataTable, type Column } from "@/components/ui/table";
import { TabPanel, Tabs, type TabItem } from "@/components/ui/tabs";
import { DetailGrid, type DetailField } from "@/components/users/detail-grid";
import { CURRENCIES } from "@/constants/currency";
import { ROUTES } from "@/constants/routes";
import { useDebounced } from "@/hooks/use-debounced";
import { useDisclosure } from "@/hooks/use-disclosure";
import { useTablePage } from "@/hooks/use-pagination";
import { cn } from "@/lib/cn";
import {
  formatCount,
  formatEnum,
  formatMoney,
  formatName,
  formatTimestamp,
  maskIp,
  parseUserAgent,
} from "@/lib/format";
import {
  Currency,
  ID_DOCUMENT_LABELS,
  KycStatus,
  SavingsTemplate,
  SortDirection,
  TransactionCategory,
  TransactionStatus,
} from "@/types/enum";
import { Permission } from "@/types/permission";
import type { Kyc } from "@/types/kyc";
import type { Saving } from "@/types/savings";
import type { Transaction } from "@/types/transaction";
import type { User, UserSession } from "@/types/user";
import { useCurrency } from "@/contexts/currency";

const TABS: TabItem[] = [
  { value: "balances", label: "Balances" },
  { value: "profile", label: "Profile" },
  { value: "account", label: "Account" },
  { value: "transactions", label: "Transactions" },
  { value: "plans", label: "Savings Plans" },
  { value: "kyc", label: "KYC" },
  { value: "logins", label: "Login History" },
];

export function UserDetail({ userId }: { userId: string }) {
  const { currency } = useCurrency();
  const closeAccount = useDisclosure<void>();

  const { data: profile, isLoading } = useAdminUser({ user_id: userId });
  const { data: overview } = useAdminUserOverview({ user_id: userId });

  const user = profile?.data;

  const balances = overview?.data?.balances;
  const balance = balances?.find((row) => row.currency === currency);

  const currencies = balances?.length
    ? balances.map((row) => row.currency)
    : [Currency.NGN, Currency.USD];

  if (isLoading) {
    return (
      <div className="grid py-24 place-items-center">
        <Spinner size={32} className="text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <EmptyState
        icon={UserIcon}
        title="User not found"
        description="This account does not exist, or is not visible to your role."
        action={
          <Button variant="soft" size="lg" shape="pill" asChild>
            <Link href={ROUTES.users.list}>Back to users</Link>
          </Button>
        }
      />
    );
  }

  const name = formatName(user);

  return (
    <div className="flex flex-col gap-6">
      <Link
        href={ROUTES.users.list}
        className="inline-flex w-fit items-center gap-2 text-lg font-semibold text-grey-900 hover:text-primary"
      >
        <Icon icon={ArrowLeft02Icon} size={20} />
        Back
      </Link>

      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-4">
          <Avatar name={name} src={user.avatar ?? undefined} size="xl" />
          <div className="flex flex-col gap-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-heading-xs font-extrabold text-grey-900">{name}</h1>
              <StatusBadge status={formatEnum(user.status)} />
              {user.is_hni ? <HniBadge /> : null}
            </div>
            <p className="text-md text-grey-500">{user.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Can do={Permission.UsersManage}>
            <Button
              tone="danger"
              variant="soft"
              size="xl"
              shape="pill"
              leadingIcon={UnavailableIcon}
              onClick={() => closeAccount.open()}
            >
              Close account
            </Button>
          </Can>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Active plans"
          value={formatCount(balance?.active_plans)}
          hint="Plans currently running in this currency"
        />
        <StatCard
          label="Completed plans"
          value={formatCount(balance?.completed_plans)}
          hint="Matured and broken plans — both are finished"
        />
        <StatCard
          label="Total Withdrawals"
          value={formatMoney(balance?.total_withdrawals, currency)}
          hint="Lifetime withdrawals in this currency"
        />
        <StatCard
          label="Total ROI Liability"
          value={formatMoney(balance?.roi_earned, currency)}
          hint="Interest credited to this account — what the platform owes it"
        />
      </div>

      <Tabs items={TABS} defaultValue="balances" className="gap-6">
        <TabPanel value="balances">
          <BalancesTab
            currencies={currencies}
            targetSavings={balance?.target_savings}
            fixedDeposits={balance?.fixed_deposits}
            roiEarned={balance?.roi_earned}
            flexiBalance={balance?.flexi_balance}
          />
        </TabPanel>

        <TabPanel value="profile">
          <ProfileTab user={user} />
        </TabPanel>

        <TabPanel value="account">
          <AccountTab user={user} userId={userId} />
        </TabPanel>

        <TabPanel value="transactions">
          <TransactionsTab userId={userId} />
        </TabPanel>

        <TabPanel value="plans">
          <PlansTab userId={userId} />
        </TabPanel>

        <TabPanel value="kyc">
          <KycTab userId={userId} />
        </TabPanel>

        <TabPanel value="logins">
          <LoginsTab userId={userId} />
        </TabPanel>
      </Tabs>

      <CloseAccountDialog control={closeAccount} userId={userId} name={name} />
    </div>
  );
}

function CurrencySwitch({ currencies }: { currencies: Currency[] }) {
  const { currency, setCurrency } = useCurrency();

  return (
    <div className="flex items-center gap-1">
      {currencies.map((option) => {
        const active = option === currency;
        return (
          <button
            key={option}
            type="button"
            onClick={() => setCurrency(option)}
            aria-pressed={active}
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-3 py-1.5",
              "text-md transition-colors outline-none focus-visible:shadow-ring-primary",
              active
                ? "border-primary bg-white font-bold text-primary"
                : "border-transparent font-medium text-grey-600 hover:text-grey-900",
            )}
          >
            <Flag code={countryOf(option)} size="sm" />
            {option}
          </button>
        );
      })}
    </div>
  );
}

function countryOf(currency: Currency) {
  return CURRENCIES.find((entry) => entry.value === currency)?.country ?? "";
}

function BalanceCard({
  label,
  amount,
  hint,
  currencies,
}: {
  label: string;
  amount?: number;
  hint: string;
  currencies: Currency[];
}) {
  const { currency } = useCurrency();

  return (
    <article className="flex flex-col gap-3">
      <div className="rounded-xl border border-grey-50 bg-grey-25 p-1">
        <div className="px-2 py-1.5">
          <CurrencySwitch currencies={currencies} />
        </div>

        <div className="flex flex-col gap-2 rounded-xl border border-grey-50 bg-white p-4 sm:p-5">
          <h3 className="flex items-center gap-2 text-sm text-grey-500">
            {label}
            <Icon
              icon={InformationCircleIcon}
              size={15}
              className="text-grey-300"
              aria-label={hint}
            />
          </h3>
          <p className="text-heading-xs font-extrabold text-grey-900">
            {formatMoney(amount, currency)}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center gap-1.5">
        {currencies.map((option) => (
          <span
            key={option}
            className={cn(
              "h-1.5 rounded-full transition-all",
              option === currency ? "w-14 bg-grey-300" : "w-7 bg-grey-100",
            )}
          />
        ))}
      </div>
    </article>
  );
}

function BalancesTab({
  currencies,
  targetSavings,
  fixedDeposits,
  roiEarned,
  flexiBalance,
}: {
  currencies: Currency[];
  targetSavings?: number;
  fixedDeposits?: number;
  roiEarned?: number;
  flexiBalance?: number;
}) {
  return (
    <div className="grid gap-5 rounded-lg border border-grey-50 bg-white p-4 sm:grid-cols-2 sm:p-5">
      <BalanceCard
        label="Target Savings Balance"
        amount={targetSavings}
        hint="Live principal held in target plans"
        currencies={currencies}
      />
      <BalanceCard
        label="Fixed Deposit Balance"
        amount={fixedDeposits}
        hint="Live principal held in fixed deposits"
        currencies={currencies}
      />
      <BalanceCard
        label="ROI Earned"
        amount={roiEarned}
        hint="Interest credited to this account"
        currencies={currencies}
      />
      <BalanceCard
        label="Flexi Wallet Balance"
        amount={flexiBalance}
        hint="Balance sitting in the flexi wallet"
        currencies={currencies}
      />
    </div>
  );
}

function ProfileTab({ user }: { user: User }) {
  const address = user.address
    ? [
        user.address.house_number,
        user.address.street,
        user.address.city,
        user.address.state,
      ]
        .filter(Boolean)
        .join(", ")
    : "";

  const fields: DetailField[] = [
    { label: "First name", value: user.firstname || "—", icon: UserIcon },
    { label: "Last name", value: user.lastname || "—", icon: UserIcon },
    { label: "Email", value: user.email, icon: Mail01Icon },
    {
      label: "Phone",
      value: [user.phone_code, user.phone].filter(Boolean).join(" ") || "—",
      icon: SmartPhone01Icon,
    },
    { label: "Address", value: address || "—", icon: Location01Icon },
    { label: "Gender", value: formatEnum(user.gender), icon: UserAccountIcon },
    { label: "Date of Birth", value: user.dob || "—", icon: Calendar03Icon },
  ];

  return (
    <Panel title="Profile Information" icon={UserGroupIcon}>
      <DetailGrid fields={fields} />
    </Panel>
  );
}

function DocumentChip({
  label,
  tone,
  onView,
}: {
  label: string;
  tone: "primary" | "purple";
  onView?: () => void;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold",
        tone === "primary"
          ? "border-surd-blue-100 text-primary"
          : "border-purple-200 text-purple-600",
      )}
    >
      <Icon icon={IdentityCardIcon} size={14} />
      {label}
      {onView ? (
        <button
          type="button"
          onClick={onView}
          aria-label={`View ${label}`}
          className="outline-none focus-visible:shadow-ring-primary"
        >
          <Icon icon={ViewIcon} size={14} />
        </button>
      ) : null}
    </span>
  );
}

function AccountTab({ user, userId }: { user: User; userId: string }) {
  const preview = useDisclosure<string>();

  const { data: kycData } = useAdminKyc({ user_id: userId });
  const { data: sessions } = useAdminUserSessions({
    user_id: userId,
    limit: 1,
    page: 1,
  });

  const kyc = kycData?.data;
  const lastLogin = sessions?.data?.[0];

  const documents = (
    <span className="flex flex-wrap items-center gap-2">
      {kyc?.nin ? (
        <DocumentChip
          label="NIN"
          tone="primary"
          onView={kyc.id_url ? () => preview.open(kyc.id_url!) : undefined}
        />
      ) : null}
      {kyc?.bvn ? <DocumentChip label="BVN" tone="purple" /> : null}
      {!kyc?.nin && !kyc?.bvn ? <span className="text-grey-400">—</span> : null}
    </span>
  );

  const fields: DetailField[] = [
    { label: "Bank", value: "—", icon: BankIcon },
    { label: "Virtual Account number", value: "—", icon: BankIcon },
    {
      label: "Joined",
      value: formatTimestamp(user.created_at),
      icon: Calendar03Icon,
    },
    {
      label: "Status",
      value: <StatusBadge status={formatEnum(user.status)} />,
      icon: UserSquareIcon,
    },
    { label: "KYC Documents", value: documents, icon: IdentityCardIcon },
    {
      label: "Last Login",
      value: lastLogin ? formatTimestamp(lastLogin.created_at) : "—",
      icon: Clock01Icon,
    },
  ];

  return (
    <>
      <Panel title="Account Information" icon={UserSquareIcon}>
        <DetailGrid fields={fields} />
      </Panel>
      <DocumentPreviewDialog control={preview} />
    </>
  );
}

const TX_STATUS_OPTIONS: FilterOption[] = [
  { value: "", label: "All statuses" },
  ...Object.values(TransactionStatus).map((status) => ({
    value: status,
    label: formatEnum(status),
  })),
];

const TX_CATEGORY_OPTIONS: FilterOption[] = [
  { value: "", label: "All types" },
  ...Object.values(TransactionCategory).map((category) => ({
    value: category,
    label: formatEnum(category),
  })),
];

const TX_CURRENCY_OPTIONS: FilterOption[] = [
  { value: "", label: "All currencies" },
  ...CURRENCIES.map((entry) => ({
    value: entry.value,
    label: entry.label,
    adornment: <Flag code={entry.country} size="sm" />,
  })),
];

const TX_FILTER_GROUPS: FilterGroup[] = [
  { id: "status", label: "Status", options: TX_STATUS_OPTIONS },
  { id: "category", label: "Type", options: TX_CATEGORY_OPTIONS },
  { id: "currency", label: "Currency", options: TX_CURRENCY_OPTIONS },
];

function TransactionsTab({ userId }: { userId: string }) {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<Record<string, string | undefined>>({});
  const [sort, setSort] = useState<SortDirection>(SortDirection.Desc);
  const { page, setPage, pageSize, setPageSize } = useTablePage();

  const search = useDebounced(query);

  const { data, isLoading } = useTransactions({
    user_id: userId,
    search: search || undefined,
    ...(filters.status ? { status: filters.status as TransactionStatus } : {}),
    ...(filters.category
      ? { category: filters.category as TransactionCategory }
      : {}),
    ...(filters.currency ? { currency: filters.currency as Currency } : {}),
    sort,
    page,
    limit: pageSize,
    paginate: true,
  });

  const reset = <T,>(setter: (value: T) => void) => (value: T) => {
    setter(value);
    setPage(1);
  };

  const columns: Column<Transaction>[] = [
    {
      id: "status",
      header: "Status",
      cell: (row) => <StatusBadge status={formatEnum(row.status)} />,
    },
    { id: "category", header: "Type", cell: (row) => formatEnum(row.category) },
    {
      id: "currency",
      header: "Currency",
      cell: (row) => <CurrencyChip currency={row.currency as never} />,
    },
    {
      id: "amount",
      header: "Amount",
      cell: (row) => (
        <span className="font-semibold tabular-nums">
          {formatMoney(row.amount, row.currency)}
        </span>
      ),
      width: "min-w-36",
    },
    {
      id: "remark",
      header: "Narration",
      cell: (row) => row.remark || "—",
      width: "min-w-44",
    },
    {
      id: "flow",
      header: "Flow",
      cell: (row) =>
        row.flow ? (
          <span className="flex items-center gap-2">
            <span className="flex-1">{row.flow.source}</span>
            <Icon icon={ArrowRight02Icon} size={16} className="shrink-0 text-grey-300" />
            <span className="flex-1">{row.flow.destination}</span>
          </span>
        ) : (
          "—"
        ),
      width: "min-w-56",
    },
    {
      id: "created",
      header: "Date & Time",
      cell: (row) => formatTimestamp(row.created_at),
      width: "min-w-32",
    },
  ];

  return (
    <Panel
      title="Transactions History"
      icon={ArrowDataTransferVerticalIcon}
      actions={
        <>
          <SearchInput
            value={query}
            onChange={reset(setQuery)}
            placeholder="Search..."
            className="w-full sm:w-64"
          />
          <TableFilter
            groups={TX_FILTER_GROUPS}
            value={filters}
            onChange={reset(setFilters)}
          />
          <TableSort value={sort} onChange={reset(setSort)} />
        </>
      }
      bleed
    >
      <div className="px-4 pb-5 sm:px-5">
        <DataTable
          data={data?.data ?? []}
          columns={columns}
          getRowId={(row) => row.id}
          isLoading={isLoading}
          minWidth="min-w-5xl"
          pagination={{
            mode: "server",
            page,
            pageSize,
            totalItems: data?.pagination?.total ?? 0,
            onPageChange: setPage,
            onPageSizeChange: setPageSize,
          }}
          emptyState={
            <TableEmptyState
              query={search}
              onClearSearch={() => reset(setQuery)("")}
              title="No Transaction Record Yet"
              description="No record for a transaction on this account yet. New activity will automatically appear here."
            />
          }
        />
      </div>
    </Panel>
  );
}

const PLAN_TABS: TabItem[] = [
  { value: SavingsTemplate.TargetSave, label: "Target Savings" },
  { value: SavingsTemplate.FixedSave, label: "Fixed Deposits" },
];

function roiEarned(plan: Saving) {
  return (plan.interest ?? 0) + (plan.interest_accrued ?? 0);
}

const STATUS_COLUMN: Column<Saving> = {
  id: "status",
  header: "Status",
  cell: (row) => <StatusBadge status={formatEnum(row.status)} />,
};

const CURRENCY_COLUMN: Column<Saving> = {
  id: "currency",
  header: "Currency",
  cell: (row) => <CurrencyChip currency={row.currency as never} />,
};

const SAVED_COLUMN: Column<Saving> = {
  id: "balance",
  header: "Amount Saved",
  cell: (row) => (
    <span className="font-semibold tabular-nums">
      {formatMoney(row.balance, row.currency)}
    </span>
  ),
  width: "min-w-36",
};

const ROI_COLUMN: Column<Saving> = {
  id: "roi",
  header: "ROI Earned",
  cell: (row) => (
    <span className="tabular-nums">{formatMoney(roiEarned(row), row.currency)}</span>
  ),
  width: "min-w-32",
};

const STARTED_COLUMN: Column<Saving> = {
  id: "started",
  header: "Started",
  cell: (row) => formatTimestamp(row.started_at ?? row.created_at),
  width: "min-w-32",
};

const MATURITY_COLUMN: Column<Saving> = {
  id: "maturity",
  header: "Maturity",
  cell: (row) => formatTimestamp(row.ending_at),
  width: "min-w-32",
};

const TARGET_COLUMNS: Column<Saving>[] = [
  STATUS_COLUMN,
  CURRENCY_COLUMN,
  SAVED_COLUMN,
  {
    id: "target",
    header: "Target Amount",
    cell: (row) =>
      row.target_amount == null ? (
        <span className="text-grey-400">—</span>
      ) : (
        <span className="tabular-nums">
          {formatMoney(row.target_amount, row.currency)}
        </span>
      ),
    width: "min-w-36",
  },
  ROI_COLUMN,
  {
    id: "withdrawal",
    header: "Withdrawal",
    cell: (row) => formatEnum(row.withdrawal_mode),
  },
  STARTED_COLUMN,
  MATURITY_COLUMN,
];

const FIXED_COLUMNS: Column<Saving>[] = [
  {
    id: "label",
    header: "Plan name",
    cell: (row) => (
      <span className="block max-w-40 truncate font-semibold" title={row.label ?? ""}>
        {row.label || "—"}
      </span>
    ),
    width: "min-w-40",
  },
  {
    id: "duration",
    header: "Period",
    cell: (row) => (row.duration ? `${row.duration} days` : "—"),
  },
  STATUS_COLUMN,
  CURRENCY_COLUMN,
  SAVED_COLUMN,
  ROI_COLUMN,
  {
    id: "break",
    header: "Break Fee",
    cell: (row) =>
      row.interest_forfeited ? (
        <span className="tabular-nums">
          {formatMoney(row.interest_forfeited, row.currency)}
        </span>
      ) : (
        <span className="text-grey-400">—</span>
      ),
  },
  STARTED_COLUMN,
  MATURITY_COLUMN,
];

function PlansTab({ userId }: { userId: string }) {
  const [template, setTemplate] = useState<string>(SavingsTemplate.TargetSave);
  const [query, setQuery] = useState("");
  const { page, setPage, pageSize, setPageSize } = useTablePage();

  const search = useDebounced(query);

  const { data, isLoading } = useSavings({
    user_id: userId,
    template,
    search: search || undefined,
    page,
    limit: pageSize,
    paginate: true,
  });

  const columns =
    template === SavingsTemplate.FixedSave ? FIXED_COLUMNS : TARGET_COLUMNS;

  return (
    <Panel
      title="Savings Plans"
      icon={PiggyBankIcon}
      actions={
        <SearchInput
          value={query}
          onChange={(next) => {
            setQuery(next);
            setPage(1);
          }}
          placeholder="Search..."
          className="w-full sm:w-64"
        />
      }
      bleed
    >
      <div className="flex flex-col gap-4 px-4 pb-5 sm:px-5">
        <Tabs
          items={PLAN_TABS}
          value={template}
          onValueChange={(next) => {
            setTemplate(next);
            setPage(1);
          }}
          variant="pill"
        />

        <DataTable
          data={data?.data ?? []}
          columns={columns}
          getRowId={(row) => row.id}
          isLoading={isLoading}
          minWidth="min-w-5xl"
          pagination={{
            mode: "server",
            page,
            pageSize,
            totalItems: data?.pagination?.total ?? 0,
            onPageChange: setPage,
            onPageSizeChange: setPageSize,
          }}
          emptyState={
            <TableEmptyState
              query={search}
              onClearSearch={() => {
                setQuery("");
                setPage(1);
              }}
              title="No Savings Plan Yet"
              description="No record for a savings plan on this account yet. New plans will automatically appear here."
            />
          }
        />
      </div>
    </Panel>
  );
}

type KycDocumentRow = {
  id: string;
  label: string;
  url: string | null;
};

function documentRows(kyc: Kyc): KycDocumentRow[] {
  const rows: KycDocumentRow[] = [];

  if (kyc.bvn) rows.push({ id: "bvn", label: "BVN Verification", url: null });
  if (kyc.nin) rows.push({ id: "nin", label: "NIN Verification", url: null });
  if (kyc.id_document) {
    rows.push({
      id: "id",
      label: ID_DOCUMENT_LABELS[kyc.id_document] ?? formatEnum(kyc.id_document),
      url: kyc.id_url,
    });
  }

  return rows;
}

const DECIDED = [KycStatus.Verified, KycStatus.Rejected];

function KycTab({ userId }: { userId: string }) {
  const preview = useDisclosure<string>();
  const { data, isLoading } = useAdminKyc({ user_id: userId });
  const kyc = data?.data;

  const rows = useMemo(() => (kyc ? documentRows(kyc) : []), [kyc]);

  if (isLoading) {
    return (
      <div className="grid py-16 place-items-center">
        <Spinner size={28} className="text-primary" />
      </div>
    );
  }

  const columns: Column<KycDocumentRow>[] = [
    {
      id: "label",
      header: "Document",
      cell: (row) => (
        <span className="flex items-center gap-2.5 font-medium">
          <Icon icon={IdentityCardIcon} size={18} className="text-grey-400" />
          {row.label}
        </span>
      ),
      width: "min-w-52",
    },
    {
      id: "status",
      header: "Status",
      cell: () =>
        kyc ? (
          <StatusBadge status={formatEnum(kyc.status.replace(/^KYC_/, ""))} />
        ) : null,
    },
    {
      id: "uploaded",
      header: "Uploaded",
      cell: () => formatTimestamp(kyc?.created_at),
      width: "min-w-32",
    },
    {
      id: "reviewed",
      header: "Reviewed",
      cell: () =>
        kyc && DECIDED.includes(kyc.status) ? (
          formatTimestamp(kyc.updated_at)
        ) : (
          <span className="text-grey-400">—</span>
        ),
      width: "min-w-32",
    },
    {
      id: "action",
      header: "Action",
      cell: (row) =>
        row.url ? (
          <button
            type="button"
            onClick={() => preview.open(row.url!)}
            className="font-semibold text-primary underline underline-offset-4 outline-none focus-visible:shadow-ring-primary"
          >
            View
          </button>
        ) : (
          <span className="text-grey-400">—</span>
        ),
    },
  ];

  return (
    <>
      <Panel title="KYC Documents" icon={IdentityCardIcon} bleed>
        <div className="px-4 pb-5 sm:px-5">
          <DataTable
            data={rows}
            columns={columns}
            getRowId={(row) => row.id}
            minWidth="min-w-3xl"
            pagination={false}
            emptyState={
              <TableEmptyState
                title="No KYC Record Yet"
                description="This account has not submitted any identity documents yet."
              />
            }
          />
        </div>
      </Panel>
      <DocumentPreviewDialog control={preview} />
    </>
  );
}

function DocumentPreviewDialog({
  control,
}: {
  control: ReturnType<typeof useDisclosure<string>>;
}) {
  return (
    <Dialog control={control} title="Identity document" width="md">
      {control.data ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={control.data}
          alt="Identity document"
          className="aspect-[4/3] w-full rounded-xl object-contain"
        />
      ) : null}
    </Dialog>
  );
}

function LoginsTab({ userId }: { userId: string }) {
  const { page, setPage, pageSize, setPageSize } = useTablePage();

  const { data, isLoading } = useAdminUserSessions({
    user_id: userId,
    page,
    limit: pageSize,
  });

  const columns: Column<UserSession>[] = [
    {
      id: "device",
      header: "Device",
      cell: (row) => {
        const parsed = parseUserAgent(row.device_name);
        return (
          <span className="flex items-center gap-2">
            <Icon icon={ComputerIcon} size={18} className="shrink-0 text-grey-400" />
            <span className="flex flex-col">
              <span className="font-medium">{parsed?.platform ?? row.device_name ?? "—"}</span>
              {parsed ? (
                <span className="text-xs text-grey-400">{parsed.browser}</span>
              ) : null}
            </span>
          </span>
        );
      },
      width: "min-w-52",
    },
    { id: "ip", header: "IP Address", cell: (row) => maskIp(row.ip_address) },
    { id: "location", header: "Location", cell: (row) => row.location || "—" },
    {
      id: "active",
      header: "Session",
      cell: (row) => (
        <Badge tone={row.active ? "success" : "neutral"} variant="outline" size="sm">
          {row.active ? "Active" : "Ended"}
        </Badge>
      ),
    },
    {
      id: "created",
      header: "Signed in",
      cell: (row) => formatTimestamp(row.created_at),
      width: "min-w-32",
    },
  ];

  return (
    <Panel title="Login History" icon={ComputerIcon} bleed>
      <div className="px-4 pb-5 sm:px-5">
        <DataTable
          data={data?.data ?? []}
          columns={columns}
          getRowId={(row) => row.id}
          isLoading={isLoading}
          minWidth="min-w-4xl"
          pagination={{
            mode: "server",
            page,
            pageSize,
            totalItems: data?.pagination?.total ?? 0,
            onPageChange: setPage,
            onPageSizeChange: setPageSize,
          }}
          emptyState={
            <TableEmptyState
              title="No Sign-in Record Yet"
              description="This account has never signed in. Sessions will automatically appear here."
            />
          }
        />
      </div>
    </Panel>
  );
}

function CloseAccountDialog({
  control,
  userId,
  name,
}: {
  control: ReturnType<typeof useDisclosure<void>>;
  userId: string;
  name: string;
}) {
  const [reason, setReason] = useState("");
  const close = useAdminCloseUserAccount({ onSuccess: control.close });

  return (
    <Dialog
      control={control}
      tone="danger"
      title={`Close ${name}'s account?`}
      description="This cannot be undone through the admin portal. The account is disabled and every session is revoked immediately."
      confirmLabel="Close account"
      cancelLabel="Keep account"
      isSubmitting={close.isPending}
      onConfirm={() =>
        close.mutate({ user_id: userId, reason: reason.trim() || undefined })
      }
    >
      <div className="mt-6 w-full text-left">
        <Field label="Reason" htmlFor="close-reason" hint="Recorded on the closure request.">
          <Input
            id="close-reason"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            placeholder="e.g. requested by customer"
          />
        </Field>
      </div>
    </Dialog>
  );
}
