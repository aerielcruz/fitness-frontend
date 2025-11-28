import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "planned" | "in progress" | "completed";
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusStyles = () => {
    switch (status) {
      case "planned":
        return "bg-status-planned text-primary-foreground";
      case "in progress":
        return "bg-status-in-progress text-warning-foreground";
      case "completed":
        return "bg-status-completed text-success-foreground";
    }
  };

  return (
    <Badge className={cn("border-0 font-medium", getStatusStyles())}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}
