import { Avatar } from "../../../components/ui/Avatar";

export function AssigneeCell({
  name,
  avatarUrl,
}: {
  name: string;
  avatarUrl?: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <Avatar name={name} src={avatarUrl} />
      <span className="font-medium text-gray-800">{name}</span>
    </div>
  );
}
