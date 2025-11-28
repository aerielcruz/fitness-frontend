import { Activity } from "@/lib/api";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "./StatusBadge";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ActivityCardProps {
  activity: Activity;
  onUpdateStatus: (id: number, status: Activity["status"]) => void;
  onDelete: (id: number) => void;
}

export function ActivityCard({ activity, onUpdateStatus, onDelete }: ActivityCardProps) {
  return (
    <Card className="group hover:shadow-[var(--shadow-hover)] transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-lg text-card-foreground">{activity.title}</h3>
          <StatusBadge status={activity.status} />
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <p className="text-muted-foreground">{activity.description}</p>
      </CardContent>
      <CardFooter className="flex justify-between pt-0">
        <Select
          value={activity.status}
          onValueChange={(value) => onUpdateStatus(activity.id, value as Activity["status"])}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="planned">Planned</SelectItem>
            <SelectItem value="in progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(activity.id)}
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
