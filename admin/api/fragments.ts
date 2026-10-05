export const ERROR_FRAGMENT = `
  __typename
  ... on Error {
    message
    code
    status
  }
`;

export const PAGINATION_FIELDS = `
  pagination {
    page
    limit
    pages
    total
  }
`;

export const USER_FIELDS = `
  id
  firstname
  middlename
  lastname
  email
  phone
  phone_code
  gender
  country
  username
  language
  tier
  dob
  passcode
  pin_set
  referral
  avatar
  internal
  role
  status
  created_at
  updated_at
`;

export const ADMIN_USER_SUMMARY_FIELDS = `
  id
  firstname
  middlename
  lastname
  fullname
  email
  avatar
  status
  tier
  kyc_level
  total_balance_ngn
  total_balance_usd
  fixed_deposits_ngn
  fixed_deposits_usd
  target_savings_ngn
  target_savings_usd
  joined_at
`;

export const ADDRESS_FIELDS = `
  id
  user_id
  state
  city
  house_number
  address_meta
  street
  zip
  verified
  created_at
  updated_at
`;

export const KYC_FIELDS = `
  id
  user_id
  status
  bvn
  bvn_meta
  nin
  nin_meta
  id_document
  id_url
  face_map
  marital_status
  income_range
  work_industry
  created_at
  updated_at
`;

export const KYC_DETAIL_FIELDS = `
  ${KYC_FIELDS}
  next_of_kin {
    firstname
    lastname
    email
    address
    phone
    phone_code
    relationship
  }
  user {
    ${USER_FIELDS}
    is_hni
    address {
      ${ADDRESS_FIELDS}
    }
  }
`;

export const SESSION_USER_FIELDS = `
  ${USER_FIELDS}
  address {
    ${ADDRESS_FIELDS}
  }
  security_setting {
    id
    user_id
    appearance_mode
    push_enabled
    email_enabled
    biometric_enabled
    private_mode
    allow_screenshot
    context_menu
    sms_alert
    two_factor_enabled
    two_factor_channel
    authenticator_configured
    authenticator_verified_at
    created_at
    updated_at
  }
`;

export const RATE_FIELDS = `
  id
  base
  exchange
  symbol
  val
  markup
  quote
  fee
  fee_type
  created_at
  updated_at
`;

export const WALLET_FIELDS = `
  id
  user_id
  type
  name
  balance
  earnings
  currency
  created_at
  updated_at
`;

export const TRANSACTION_FIELDS = `
  id
  user_id
  savings_id
  wallet_id
  type
  category
  flow {
    source
    destination
  }
  reference
  currency
  source_currency
  gateway
  method
  status
  completed_at
  failed_at
  cancelled_at
  checksum
  payment_link
  initial_config
  final_config
  metadata
  savings_amount
  source_amount
  amount
  fees
  total
  roi_clawback_amount
  savings_template
  roi_activity_type
  pre_balance
  post_balance
  remark
  direction
  settlement_reason
  settlement_due_at
  settlement_policy_version
  parent_transaction_id
  cycle_reference
  created_at
  updated_at
`;

export const COUNTERPARTY_FIELDS = `
  user {
    id
    firstname
    lastname
    email
    avatar
    status
  }
`;

export const TRANSACTION_DETAIL_FIELDS = `
  ${TRANSACTION_FIELDS}
  history {
    act
    by
    at
  }
  invoice {
    key
    name
    number
    amount
    fees
    bank
    metadata
  }
  rate {
    ${RATE_FIELDS}
  }
  ${COUNTERPARTY_FIELDS}
`;

export const LIEN_FIELDS = `
  id
  savings_id
  product_id
  author_id
  amount
  reason
  active
  ending_at
  created_at
  updated_at
`;

export const PRODUCT_FIELDS = `
  id
  author_id
  name
  template
  description
  code
  headline
  status
  account_creation_type
  account_number
  currency
  product_name
  is_configurable
  interest_rate
  interest_calculation_method
  interest_type
  minimum_amount_per_contribution
  minimum_initial_deposit
  minimum_balance_required
  maximum_single_deposit_per_day
  enable_withdrawal
  enable_break
  enable_auto_save
  auto_save_frequency
  auto_renew
  minimum_duration_days
  maximum_duration_days
  minimum_days_before_penalty_free_withdrawal
  early_withdrawal_penalty
  monthly_withdrawal_limit
  withdrawal_cooldown_hours
  penalty_model
  interest_payment_frequency
  penalty_free_at_maturity_only
  withdrawal_modes
  tenure_interest_rates
  locked_interest_rate
  flexible_interest_rate
  interest_payment_timing
  early_exit_interest_policy
  break_waiting_period_hours
  allow_partial_early_withdrawal
  maturity_auto_settle_to_flex
  lifecycle_policy_enabled
  account_opening_fee
  minimum_withdrawal_limit
  withdrawal_fee
  tax_rate
  created_at
  updated_at
`;

export const TARGET_PLAN_TEMPLATE_FIELDS = `
  id
  user_id
  title
  image
  description
  target_amount
  duration
  frequency
  currency
  auto_save
  auto_save_frequency
  status
  created_at
  updated_at
`;

export const FAQ_FIELDS = `
  id
  question
  answer
  category
  sort_order
  status
  created_by
  created_at
  updated_at
`;

export const PLATFORM_CONFIG_FIELDS = `
  tiers
  free_transfer
  free_transfer_cycle
  minimum_account_balance
  maximum_account_balance
  maximum_total_withdrawals_per_day
  maximum_amount_per_withdrawal
  maximum_net_capital_outflow
  created_at
  updated_at
`;

export const SAVING_FIELDS = `
  id
  user_id
  product_id
  template
  label
  image
  interest_rate
  savings_amount
  target_amount
  frequency
  withdrawal_mode
  source_of_funds
  auto_save
  auto_save_frequency
  next_auto_save_at
  auto_renew
  duration
  status
  amount_saved
  amount_withdrawn
  balance
  interest
  interest_accrued
  penalty_count
  interest_forfeited
  currency
  account_number
  settlement_policy_version
  policy_snapshot
  cycle_reference
  is_renewal
  renewed_from_savings_id
  renewal_root_savings_id
  renewal_sequence
  upfront_interest_gross
  upfront_interest_tax
  upfront_interest_net
  upfront_interest_paid_at
  break_requested_at
  break_settlement_at
  matured_at
  settled_at
  started_at
  ending_at
  last_withdrawal_at
  last_penalty_at
  interested_computed_till
  created_at
  updated_at
`;

export const ADMIN_ACCOUNT_FIELDS = `
  id
  firstname
  lastname
  email
  avatar
  status
  admin_role_id
  admin_role_name
  admin_privileges
  admin_invite
  admin_last_login_at
  created_at
`;

export const ADMIN_CONTENT_FIELDS = `
  id
  key
  platform
  title
  placement
  enabled
  english
  french
  updated_by_id
  updated_by {
    id
    firstname
    lastname
    email
    avatar
  }
  updated_at
`;

export const RATE_EDITOR_FIELDS = `
  updated_by
  user {
    id
    firstname
    lastname
    email
    avatar
  }
`;

export const USER_SESSION_FIELDS = `
  id
  user_id
  device_name
  ip_address
  location
  active
  created_at
  last_seen_at
`;
