"use client";

import { Bounce, ToastContainer, toast as notify } from "react-toastify";
import {
  Alert02Icon,
  CheckmarkCircle02Icon,
  InformationCircleIcon,
} from "@hugeicons/core-free-icons";
import { Icon, type IconSvgElement } from "@/components/ui/icon";
import { cn } from "@/lib/cn";

export const TOAST_TONES = ["info", "success", "warning", "danger"] as const;
export type ToastTone = (typeof TOAST_TONES)[number];

const tones: Record<
  ToastTone,
  { icon: string; surface: string; glyph: IconSvgElement }
> = {
  info: {
    icon: "text-primary",
    surface: "!border-surd-blue-200 !bg-surd-blue-50",
    glyph: InformationCircleIcon,
  },
  success: {
    icon: "text-green-600",
    surface: "!border-green-200 !bg-green-50",
    glyph: CheckmarkCircle02Icon,
  },
  warning: {
    icon: "text-orange-500",
    surface: "!border-orange-300 !bg-orange-50",
    glyph: Alert02Icon,
  },
  danger: {
    icon: "text-red-500",
    surface: "!border-red-200 !bg-red-50",
    glyph: Alert02Icon,
  },
};

export function toast({
  message,
  tone = "info",
}: {
  message: string;
  tone?: ToastTone;
}) {
  const { icon, surface, glyph } = tones[tone];

  notify(
    <div className="flex items-center gap-3">
      <Icon icon={glyph} size={22} className={cn("shrink-0", icon)} />
      <p className="text-md font-medium text-grey-900">{message}</p>
    </div>,
    {
      className: cn(
        "!min-h-0 !rounded-xl !border !px-4 !py-3 !shadow-lg",
        surface,
      ),
    },
  );
}

export function ToastViewport() {
  return (
    <ToastContainer
      position="top-center"
      autoClose={4000}
      hideProgressBar
      closeButton={false}
      newestOnTop
      draggable
      transition={Bounce}
      className="!w-auto !max-w-sm !p-4"
    />
  );
}
