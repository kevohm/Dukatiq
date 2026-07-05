import { cn } from "../../lib/utils";

type AvatarProps = {
  name: string;
  src?: string;
  className?: string;
};

const palette = [
  "bg-blue-100 text-blue-700",
  "bg-purple-100 text-purple-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
  "bg-emerald-100 text-emerald-700",
];

function colorFor(name: string) {
  const index = name.charCodeAt(0) % palette.length;
  return palette[index];
}

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function Avatar({ name, src, className }: AvatarProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn("h-7 w-7 rounded-full object-cover", className)}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold",
        colorFor(name),
        className
      )}
    >
      {initials(name)}
    </div>
  );
}
