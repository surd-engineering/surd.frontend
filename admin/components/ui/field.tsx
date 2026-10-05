import { cn } from "@/lib/cn";

type FieldProps = React.ComponentProps<"div"> & {
  label?: string;
  htmlFor?: string;
  hint?: string;
  error?: string;
  required?: boolean;

  optional?: boolean;
};

export function Field({
  label,
  htmlFor,
  hint,
  error,
  required = false,
  optional = false,
  className,
  children,
  ...props
}: FieldProps) {
  const message = error ?? hint;
  const messageId = htmlFor ? `${htmlFor}-message` : undefined;

  return (
    <div className={cn("flex w-full flex-col gap-1.5", className)} {...props}>
      {label ? (
        <label
          htmlFor={htmlFor}
          className="text-md font-medium text-grey-900"
        >
          {label}
          {required ? <span className="ml-0.5 text-red-500">*</span> : null}
          {optional ? (
            <span className="ml-1 font-normal text-grey-400">(Optional)</span>
          ) : null}
        </label>
      ) : null}

      {children}

      {message ? (
        <p
          id={messageId}
          className={cn(
            "text-xs",
            error ? "text-red-600" : "text-grey-400",
          )}
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}
