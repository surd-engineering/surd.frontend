import { Icon, type IconSvgElement } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import {
  NoRecordsIllustration,
  NoResultsIllustration,
} from "@/components/ui/illustrations";
import { cn } from "@/lib/cn";

type EmptyStateProps = {
  title: string;
  description?: string;
  icon?: IconSvgElement;
  illustration?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
};

export function EmptyState({
  title,
  description,
  icon,
  illustration,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-4 px-6 py-16 text-center",
        className,
      )}
    >
      {illustration ??
        (icon ? (
          <span className="grid size-20 place-items-center rounded-full bg-surd-blue-50 text-primary">
            <Icon icon={icon} size={32} />
          </span>
        ) : null)}

      <h3 className="text-lg font-bold text-grey-900">{title}</h3>
      {description ? (
        <p className="max-w-md text-sm text-balance text-grey-400">
          {description}
        </p>
      ) : null}
      {action}
    </div>
  );
}

export function TableEmptyState({
  title,
  description,
  query,
  onClearSearch,
  action,
}: {
  title: string;
  description?: string;

  query?: string;
  onClearSearch?: () => void;
  action?: React.ReactNode;
}) {
  if (query) {
    return (
      <EmptyState
        illustration={<NoResultsIllustration />}
        title="No matching record."
        description={`Your search for “${query}” is not found.`}
        action={
          onClearSearch ? (
            <Button tone="primary" size="xl" shape="pill" onClick={onClearSearch}>
              Clear search
            </Button>
          ) : null
        }
      />
    );
  }

  return (
    <EmptyState
      illustration={<NoRecordsIllustration />}
      title={title}
      description={description}
      action={action}
    />
  );
}
