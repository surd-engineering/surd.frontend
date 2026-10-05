"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { request, SESSION_ENDED } from "@/api/graphql-client";
import { touchSession } from "@/api/session-token";
import type { Scope } from "@/api/query-keys";
import { toast } from "@/components/ui/toast";
import type { APIError, IResponse } from "@/types/api";

const DEFAULT_STALE_MS = 30_000;

export type HookOptions = {
  enabled?: boolean;
  refetchInterval?: number | false;
  staleTime?: number;
};

function handleSuccess(response: IResponse, message?: string | false) {
  if (message === false) return;
  const text = response.message || message;
  if (text) toast({ tone: "success", message: text });
}

function handleError(error: APIError) {
  if (error.code === SESSION_ENDED) return;
  toast({ tone: "danger", message: error.message });
}

export function createQuery<TData, TInput = void>(config: {
  resolver: string;
  document: string;
  scope: Scope;

  key?: (input: TInput) => readonly unknown[];
  enabled?: (input: TInput) => boolean;
  staleTime?: number;
  paginated?: boolean;
}) {
  return (input?: TInput, options?: HookOptions) =>
    useQuery<IResponse<TData>, APIError>({
      queryKey: [
        config.scope,
        config.resolver,
        ...(config.key?.(input as TInput) ??
          (input === undefined ? [] : [input])),
      ],
      queryFn: ({ signal }) =>
        request<TData>(config.document, config.resolver, input, signal),
      enabled:
        (options?.enabled ?? true) && (config.enabled?.(input as TInput) ?? true),
      staleTime: options?.staleTime ?? config.staleTime ?? DEFAULT_STALE_MS,
      refetchInterval: options?.refetchInterval,
      placeholderData: config.paginated ? keepPreviousData : undefined,
    });
}

export type MutationOptions<TData, TInput> = {
  onSuccess?: (response: IResponse<TData>, input: TInput) => void;
  onError?: (error: APIError, input: TInput) => void;

  silent?: boolean;
};

export function createMutation<TData, TInput = void>(config: {
  resolver: string;
  document: string;

  success?: string | false;
  invalidates?: readonly Scope[];
}) {
  return (options?: MutationOptions<TData, TInput>) => {
    const queryClient = useQueryClient();
    const silent = options?.silent ?? false;

    return useMutation<IResponse<TData>, APIError, TInput>({
      mutationFn: (input) => {
        touchSession();
        return request<TData>(config.document, config.resolver, input);
      },

      retry: false,

      onSuccess: (response, input) => {
        if (!silent) handleSuccess(response, config.success);
        for (const scope of config.invalidates ?? []) {
          void queryClient.invalidateQueries({ queryKey: [scope] });
        }
        options?.onSuccess?.(response, input);
      },

      onError: (error, input) => {
        if (!silent) handleError(error);
        options?.onError?.(error, input);
      },
    });
  };
}
