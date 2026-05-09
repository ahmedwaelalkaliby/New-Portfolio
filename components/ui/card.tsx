import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div className={cn("rounded-[1.75rem] border border-white/10 bg-slate-950/60 shadow-2xl shadow-black/20", className)}>
      {children}
    </div>
  );
}
