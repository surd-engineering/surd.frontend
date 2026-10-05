import { Image01Icon } from "@hugeicons/core-free-icons";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";

type MediaPlaceholderProps = React.ComponentProps<"div"> & {
  label?: string;
  aspect?: string;
};

export function MediaPlaceholder({
  label,
  aspect = "aspect-[4/3]",
  className,
  ...props
}: MediaPlaceholderProps) {
  return (
    <div
      role="img"
      aria-label={label ? `Placeholder: ${label}` : "Image placeholder"}
      className={cn(
        "flex flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl",
        "bg-grey-50 text-grey-300",
        aspect,
        className,
      )}
      {...props}
    >
      <Icon icon={Image01Icon} size={24} />
      {label ? (
        <span className="px-4 text-center text-2xs font-semibold">{label}</span>
      ) : null}
    </div>
  );
}
