import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  color?: string;
  bg?: string;
  border?: string;
}

export function Badge({ children, className, color, bg, border }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        color,
        bg,
        border,
        className
      )}
    >
      {children}
    </span>
  );
}
