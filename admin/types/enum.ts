export enum Currency {
  NGN = "NGN",
  USD = "USD",
  GBP = "GBP",
  EUR = "EUR",
  GHS = "GHS",
  KES = "KES",
  USDT = "USDT",
  USDC = "USDC",
  BTC = "BTC",
  ETH = "ETH",
  BNB = "BNB",
  TRX = "TRX",
  SOL = "SOL",
}

export type FiatCurrency =
  | Currency.NGN
  | Currency.USD
  | Currency.GBP
  | Currency.EUR
  | Currency.GHS
  | Currency.KES;

export type CryptoCurrency =
  | Currency.USDT
  | Currency.USDC
  | Currency.BTC
  | Currency.ETH
  | Currency.BNB
  | Currency.TRX
  | Currency.SOL;

export const FIAT_CURRENCIES: readonly FiatCurrency[] = [
  Currency.NGN,
  Currency.USD,
  Currency.GBP,
  Currency.EUR,
  Currency.GHS,
  Currency.KES,
];

export const CRYPTO_CURRENCIES: readonly CryptoCurrency[] = [
  Currency.USDT,
  Currency.USDC,
  Currency.BTC,
  Currency.ETH,
  Currency.BNB,
  Currency.TRX,
  Currency.SOL,
];

export function isCryptoCurrency(currency: string): currency is CryptoCurrency {
  return (CRYPTO_CURRENCIES as readonly string[]).includes(currency);
}

export type CountryCode = string;

export enum RecordStatus {
  Open = "OPEN",
  Closed = "CLOSED",
  Active = "ACTIVE",
  Inactive = "INACTIVE",
  Deleted = "DELETED",
  Pending = "PENDING",
  Completed = "COMPLETED",
  Broken = "BROKEN",
}

export enum UserStatus {
  Active = "ACTIVE",
  Inactive = "INACTIVE",
  Pending = "PENDING",
  Suspended = "SUSPENDED",
  Frozen = "FROZEN",
  Closed = "CLOSED",
  Deleted = "DELETED",
}

export enum KycStatus {
  Pending = "KYC_PENDING",
  Processing = "KYC_PROCESSING",
  Verified = "KYC_VERIFIED",
  Rejected = "KYC_REJECTED",
}

export const KYC_DECISIONS = [KycStatus.Verified, KycStatus.Rejected] as const;

export enum IdDocument {
  NinSlip = "NIN_SLIP",
  IdCard = "ID_CARD",
  Passport = "PASSPORT",
  DriversLicense = "DRIVERS_LICENSE",
  VotersCard = "VOTERS_CARD",
}

export const ID_DOCUMENT_LABELS: Record<IdDocument, string> = {
  [IdDocument.NinSlip]: "NIN slip",
  [IdDocument.IdCard]: "ID card",
  [IdDocument.Passport]: "Passport",
  [IdDocument.DriversLicense]: "Driver's licence",
  [IdDocument.VotersCard]: "Voter's card",
};

export enum UserTier {
  Zero = "TIER_ZERO",
  One = "TIER_ONE",
  Two = "TIER_TWO",
  Three = "TIER_THREE",
}

export enum VerificationPurpose {
  Kyc = "KYC",
}

export enum TransactionStatus {
  Pending = "PENDING",
  Processing = "PROCESSING",
  Completed = "COMPLETED",
  Failed = "FAILED",
  Cancelled = "CANCELLED",
  Rejected = "REJECTED",
  Refunded = "REFUNDED",
  OnHold = "ON_HOLD",
}

export const OPEN_TRANSACTION_STATUSES: readonly TransactionStatus[] = [
  TransactionStatus.Pending,
  TransactionStatus.Processing,
  TransactionStatus.OnHold,
];

export enum TransactionDirection {
  Credit = "CREDIT",
  Debit = "DEBIT",
}

export enum TransactionType {
  Deposit = "DEPOSIT",
  Withdrawal = "WITHDRAWAL",
  Transfer = "TRANSFER",
  SavingsFunding = "SAVINGS_FUNDING",
  SavingsWithdrawal = "SAVINGS_WITHDRAWAL",
  RoiPayout = "ROI_PAYOUT",
  CapitalOutflow = "CAPITAL_OUTFLOW",
  CapitalRefund = "CAPITAL_REFUND",
  Conversion = "CONVERSION",
  Fee = "FEE",
}

export enum SavingsTemplate {
  FlexSave = "FLEX_SAVE",
  TargetSave = "TARGET_SAVE",
  FixedSave = "FIXED_SAVE",
}

export enum SavingsFrequency {
  Daily = "DAILY",
  Weekly = "WEEKLY",
  Monthly = "MONTHLY",
  Quarterly = "QUARTERLY",
  Annually = "ANNUALLY",
  OneTime = "ONE_TIME",
  ProRata = "PRO_RATA",
}

export enum WithdrawalMode {
  Locked = "LOCKED",
  Flexible = "FLEXIBLE",
}

export enum SourceOfFunds {
  Wallet = "WALLET",
  Card = "CARD",
}

export enum SavingsSortField {
  UpdatedAt = "UPDATED_AT",
  CreatedAt = "CREATED_AT",
  StartedAt = "STARTED_AT",
  EndingAt = "ENDING_AT",
  AmountSaved = "AMOUNT_SAVED",
}

export enum SortDirection {
  Desc = "desc",
  Asc = "asc",
}

export enum WalletType {
  Flexi = "FLEXI",
  Savings = "SAVINGS",
  Vault = "VAULT",
  Crypto = "CRYPTO",
}

export enum BreakdownMode {
  Savings = "SAVINGS",
  System = "SYSTEM",
  Currency = "CURRENCY",
}

export enum Granularity {
  Day = "DAY",
  Month = "MONTH",
  Year = "YEAR",
}

export enum TransactionCategory {
  Deposit = "DEPOSIT",
  Withdrawal = "WITHDRAWAL",
  Transfer = "TRANSFER",
  RoiPayout = "ROI_PAYOUT",
  RoiClawback = "ROI_CLAWBACK",
  Conversion = "CONVERSION",
  Other = "OTHER",
}

export enum CancellationReason {
  SuspectedFraud = "SUSPECTED_FRAUD",
  FailedComplianceCheck = "FAILED_COMPLIANCE_CHECK",
  InvalidDestinationAccount = "INVALID_DESTINATION_ACCOUNT",
  DuplicateRequest = "DUPLICATE_REQUEST",
  CustomerRequest = "CUSTOMER_REQUEST",
  InsufficientVerification = "INSUFFICIENT_VERIFICATION",
  Other = "OTHER",
}

export enum CapitalTransactionType {
  Outflow = "OUTFLOW",
  Refund = "REFUND",
}

export type ProductStatus = Extract<
  RecordStatus,
  | RecordStatus.Active
  | RecordStatus.Inactive
  | RecordStatus.Pending
  | RecordStatus.Deleted
>;

export type FaqStatus = Extract<
  RecordStatus,
  RecordStatus.Active | RecordStatus.Inactive | RecordStatus.Deleted
>;

export type SavingStatus = Extract<
  RecordStatus,
  | RecordStatus.Active
  | RecordStatus.Pending
  | RecordStatus.Completed
  | RecordStatus.Broken
  | RecordStatus.Closed
  | RecordStatus.Inactive
>;

export enum AuditModule {
  Dashboard = "DASHBOARD",
  Finance = "FINANCE",
  Wallet = "WALLET",
  Savings = "SAVINGS",
  Roi = "ROI",
  Vault = "VAULT",
  Treasury = "TREASURY",
  TransactionHistory = "TRANSACTION_HISTORY",
  Users = "USERS",
  UserList = "USER_LIST",
  KycCompliance = "KYC_COMPLIANCE",
  Configuration = "CONFIGURATION",
  Rates = "RATES",
  Penalties = "PENALTIES",
  Limits = "LIMITS",
  Settings = "SETTINGS",
  AdminAccounts = "ADMIN_ACCOUNTS",
  ContentMarketing = "CONTENT_MARKETING",
  DeveloperConfig = "DEVELOPER_CONFIG",
}

export const AUDIT_MODULE_GROUPS = {
  Finance: [
    AuditModule.Dashboard,
    AuditModule.Finance,
    AuditModule.Wallet,
    AuditModule.Savings,
    AuditModule.Roi,
    AuditModule.Vault,
    AuditModule.Treasury,
    AuditModule.TransactionHistory,
  ],
  Users: [AuditModule.Users, AuditModule.UserList, AuditModule.KycCompliance],
  Configurations: [
    AuditModule.Configuration,
    AuditModule.Rates,
    AuditModule.Penalties,
    AuditModule.Limits,
  ],
  Settings: [
    AuditModule.Settings,
    AuditModule.AdminAccounts,
    AuditModule.ContentMarketing,
    AuditModule.DeveloperConfig,
  ],
} as const satisfies Record<string, readonly AuditModule[]>;

export type AuditModuleGroup = keyof typeof AUDIT_MODULE_GROUPS;

export const AUDIT_MODULE_GROUP_OF = Object.fromEntries(
  Object.entries(AUDIT_MODULE_GROUPS).flatMap(([group, modules]) =>
    modules.map((module) => [module, group as AuditModuleGroup]),
  ),
) as Record<AuditModule, AuditModuleGroup>;

export enum AuditStatus {
  Success = "SUCCESS",
  Failure = "FAILURE",
}

export enum AdminPrivilege {
  UserManagement = "USER_MANAGEMENT",
  KycCompliance = "KYC_COMPLIANCE",
  TransactionManagement = "TRANSACTION_MANAGEMENT",
  ProductConfiguration = "PRODUCT_CONFIGURATION",
  TreasuryManagement = "TREASURY_MANAGEMENT",
  PlatformSettings = "PLATFORM_SETTINGS",
  AdminOnboarding = "ADMIN_ONBOARDING",
  ViewAuditLogs = "VIEW_AUDIT_LOGS",
  ExportReports = "EXPORT_REPORTS",
  ContentMarketing = "CONTENT_MARKETING",
}

export enum AdminAccountStatus {
  Active = "ACTIVE",
  PendingInvite = "PENDING_INVITE",
  Suspended = "SUSPENDED",
}

export enum AdminInviteStatus {
  Pending = "PENDING",
  Accepted = "ACCEPTED",
  Cancelled = "CANCELLED",
}

export enum ContentPlatform {
  MobileApp = "MOBILE_APP",
  AdminPortal = "ADMIN_PORTAL",
  Website = "WEBSITE",
}

export enum ConfigUnit {
  Percentage = "PERCENTAGE",
  Ngn = "NGN",
  Usd = "USD",
  Hours = "HOURS",
  Days = "DAYS",
}

export enum RoiActivityType {
  Credited = "CREDITED",
  Withdrawn = "WITHDRAWN",
  ClawedBack = "CLAWED_BACK",
}

export enum ChallengeMethod {
  App = "APP",
  Email = "EMAIL",
}

export enum CapitalTransactionKind {
  Outflow = "ADMIN_OUTFLOW",
  Refund = "ADMIN_REFUND",
}
