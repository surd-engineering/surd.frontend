import {
  ADMIN_CONTENT_FIELDS,
  ERROR_FRAGMENT,
  PAGINATION_FIELDS,
} from "@/api/fragments";

export const ADMIN_CONTENTS_QUERY = `
query AdminContents($input: AdminContentsFilterInput) {
  adminContents(input: $input) {
    ${ERROR_FRAGMENT}
    ... on ResponseWithAdminContents {
      message
      data {
        ${ADMIN_CONTENT_FIELDS}
      }
      ${PAGINATION_FIELDS}
    }
  }
}
`;

export const ADMIN_CONTENT_QUERY = `
query AdminContent($input: AdminContentInput!) {
  adminContent(input: $input) {
    ${ERROR_FRAGMENT}
    ... on ResponseWithAdminContent {
      message
      data {
        ${ADMIN_CONTENT_FIELDS}
      }
    }
  }
}
`;

export const ADMIN_CREATE_CONTENT_MUTATION = `
mutation AdminCreateContent($input: AdminCreateContentInput!) {
  adminCreateContent(input: $input) {
    ${ERROR_FRAGMENT}
    ... on ResponseWithAdminContent {
      message
      data {
        ${ADMIN_CONTENT_FIELDS}
      }
    }
  }
}
`;

export const ADMIN_UPDATE_CONTENT_MUTATION = `
mutation AdminUpdateContent($input: AdminUpdateContentInput!) {
  adminUpdateContent(input: $input) {
    ${ERROR_FRAGMENT}
    ... on ResponseWithAdminContent {
      message
      data {
        ${ADMIN_CONTENT_FIELDS}
      }
    }
  }
}
`;

export const ADMIN_SET_CONTENT_STATUS_MUTATION = `
mutation AdminSetContentStatus($input: AdminSetContentStatusInput!) {
  adminSetContentStatus(input: $input) {
    ${ERROR_FRAGMENT}
    ... on ResponseWithAdminContent {
      message
      data {
        id
        enabled
      }
    }
  }
}
`;
