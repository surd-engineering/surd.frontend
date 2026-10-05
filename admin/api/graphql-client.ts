"use client";

import { ClientError, GraphQLClient } from "graphql-request";
import { APIError, type IResponse } from "@/types/api";
import { clearToken, getToken, hasToken, setToken } from "@/api/session-token";

export const ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT ?? "";

const LABEL_REQUESTS = process.env.NODE_ENV === "development";

export const graphQLClient = new GraphQLClient(ENDPOINT, {
  headers: (): Record<string, string> => {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  },

  requestMiddleware: (request) =>
    LABEL_REQUESTS && request.operationName
      ? { ...request, url: `${request.url}?op=${request.operationName}` }
      : request,
});

type Body = Record<string, IResponse | undefined>;

const SESSION_REJECTED = "Your session is no longer valid. Please sign in again.";

export const SESSION_ENDED = "SESSION_ENDED";

function rejectSession(message?: string, code?: string): never {
  if (hasToken()) {
    clearToken("unauthorized");
    throw new APIError(message || SESSION_REJECTED, SESSION_ENDED, 401);
  }
  throw new APIError(message || SESSION_REJECTED, code, 401);
}

function isUnauthenticated(error?: {
  extensions?: Record<string, unknown>;
}) {
  const extensions = error?.extensions;
  return (
    extensions?.status === 401 ||
    extensions?.code === "UNAUTHENTICATED" ||
    extensions?.code === "UNAUTHORIZED"
  );
}

async function send(document: string, input: unknown, signal?: AbortSignal) {
  try {
    return await graphQLClient.rawRequest<Body, Record<string, unknown>>({
      query: document,
      variables: input === undefined ? {} : { input },
      signal,
    });
  } catch (caught) {
    if (caught instanceof ClientError) {
      if (caught.response?.status === 401) rejectSession();

      if (caught.response?.data) {
        return {
          data: caught.response.data as Body,
          headers: caught.response.headers,
        };
      }

      const first = caught.response?.errors?.[0];
      if (isUnauthenticated(first)) rejectSession(first?.message, "UNAUTHENTICATED");
      if (first?.message) throw new APIError(first.message);
    }

    throw new APIError(
      "We couldn't reach the server. Check your connection and try again.",
    );
  }
}

const DECIMAL_KEYS = new Set(["parsedValue", "source", "__typename"]);

function isDecimal(value: Record<string, unknown>) {
  return (
    typeof value.parsedValue === "number" &&
    Object.keys(value).every((key) => DECIMAL_KEYS.has(key))
  );
}

function normalize(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(normalize);

  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    if (isDecimal(record)) return record.parsedValue as number;

    const out: Record<string, unknown> = {};
    for (const [key, item] of Object.entries(record)) out[key] = normalize(item);
    return out;
  }

  return value;
}

export async function request<TData>(
  document: string,
  resolver: string,
  input?: unknown,
  signal?: AbortSignal,
): Promise<IResponse<TData>> {
  const { data, headers } = await send(document, input, signal);

  const rotated = headers?.get("X-Authorization");
  if (rotated) setToken(rotated, { rotate: true });

  const payload = data?.[resolver];

  if (!payload || payload.__typename === "Error") {
    if (payload?.status === 401) rejectSession(payload.message, payload.code);

    throw new APIError(
      payload?.message || "The server returned an empty response.",
      payload?.code,
      payload?.status,
    );
  }

  return normalize(payload) as IResponse<TData>;
}
