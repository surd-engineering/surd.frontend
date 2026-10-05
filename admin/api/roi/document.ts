import { ERROR_FRAGMENT } from "@/api/fragments";

export const ADMIN_ROI_OVERVIEW_QUERY = `
query AdminROIOverview($input: AdminDateRangeInput) {
  adminROIOverview(input: $input) {
    ${ERROR_FRAGMENT}
    ... on ResponseWithAdminROIOverview {
      message
      data {
        currency
        total_roi_liability
        total_roi_liability_change_today
        roi_generated_today
        roi_generated_today_change_pct_vs_yesterday
        roi_withdrawn_today
        roi_withdrawn_today_change_pct_vs_yesterday
        roi_clawed_back
        roi_clawed_back_change_pct_vs_previous_period
      }
    }
  }
}
`;

export const ADMIN_ROI_BY_PRODUCT_QUERY = `
query AdminROIByProduct($input: AdminDateRangeInput) {
  adminROIByProduct(input: $input) {
    ${ERROR_FRAGMENT}
    ... on ResponseWithAdminBreakdown {
      message
      data {
        key
        label
        amount
      }
    }
  }
}
`;

export const ADMIN_ROI_FLOW_SERIES_QUERY = `
query AdminROIFlowSeries($input: AdminSeriesInput) {
  adminROIFlowSeries(input: $input) {
    ${ERROR_FRAGMENT}
    ... on ResponseWithAdminROIFlowSeries {
      message
      data {
        date
        roi_generated
        roi_withdrawn
      }
    }
  }
}
`;
