import { AvatarLabel } from "@/components/ui/avatar-label";

export function PersonCell({
  name,
  email,
  avatar,
}: {
  name?: string | null;
  email?: string | null;
  avatar?: string | null;
}) {
  const label = name?.trim();
  const address = email?.trim();

  if (!label && !address) return <span className="text-grey-400">—</span>;

  return (
    <AvatarLabel
      name={label || address!}
      caption={address}
      src={avatar?.trim() || undefined}
      size="sm"
      className="max-w-48"
    />
  );
}
