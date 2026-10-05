import type { ContentPlatform } from "@/types/enum";
import type { PageRequest } from "@/types/filters";
import type { User } from "@/types/user";

export interface AdminContent {
  id: string;

  key: string;
  platform: ContentPlatform;
  title: string;
  placement: string;

  enabled: boolean;

  english: string;
  french: string;
  updated_by_id: string | null;

  updated_by?: Pick<
    User,
    "id" | "firstname" | "lastname" | "email" | "avatar"
  > | null;
  updated_at: string | null;
}

export interface AdminContentsFilterInput extends PageRequest {
  search?: string;

  platform?: ContentPlatform;
  placement?: string;
  paginate?: boolean;
}

export interface AdminContentInput {
  content_id: string;
}

export interface AdminCreateContentInput {
  key: string;
  platform: ContentPlatform;
  title: string;
  placement: string;
  english: string;
  french: string;

  enabled?: boolean;
}

export interface AdminUpdateContentInput {
  content_id: string;
  english?: string;
  french?: string;
  title?: string;
  placement?: string;
}

export interface AdminSetContentStatusInput {
  content_id: string;
  enabled: boolean;
}
