"use client";

import { createMutation, createQuery } from "@/api/factory";
import {
  ADMIN_CONTENT_QUERY,
  ADMIN_CONTENTS_QUERY,
  ADMIN_CREATE_CONTENT_MUTATION,
  ADMIN_SET_CONTENT_STATUS_MUTATION,
  ADMIN_UPDATE_CONTENT_MUTATION,
} from "@/api/content/document";
import type {
  AdminContent,
  AdminContentInput,
  AdminContentsFilterInput,
  AdminCreateContentInput,
  AdminSetContentStatusInput,
  AdminUpdateContentInput,
} from "@/types/content";

export const useAdminContents = createQuery<
  AdminContent[],
  AdminContentsFilterInput
>({
  resolver: "adminContents",
  document: ADMIN_CONTENTS_QUERY,
  scope: "content",
  paginated: true,
});

export const useAdminContent = createQuery<AdminContent, AdminContentInput>({
  resolver: "adminContent",
  document: ADMIN_CONTENT_QUERY,
  scope: "content",
  key: (input) => ["detail", input?.content_id],
  enabled: (input) => Boolean(input?.content_id),
});

export const useAdminCreateContent = createMutation<
  AdminContent,
  AdminCreateContentInput
>({
  resolver: "adminCreateContent",
  document: ADMIN_CREATE_CONTENT_MUTATION,
  success: "Content key created.",
  invalidates: ["content", "audit"],
});

export const useAdminUpdateContent = createMutation<
  AdminContent,
  AdminUpdateContentInput
>({
  resolver: "adminUpdateContent",
  document: ADMIN_UPDATE_CONTENT_MUTATION,
  success: "Content updated.",
  invalidates: ["content", "audit"],
});

export const useAdminSetContentStatus = createMutation<
  AdminContent,
  AdminSetContentStatusInput
>({
  resolver: "adminSetContentStatus",
  document: ADMIN_SET_CONTENT_STATUS_MUTATION,
  invalidates: ["content", "audit"],
});
