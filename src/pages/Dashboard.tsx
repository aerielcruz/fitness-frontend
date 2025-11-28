import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { api, Activity } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { ActivityCard } from "@/components/ActivityCard";
import { CreateActivityDialog } from "@/components/CreateActivityDialog";
import { useToast } from "@/hooks/use-toast";
import { LogOut, Dumbbell, Filter } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Activity["status"] | "all">("all");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
      return;
    }

    if (user) {
      loadActivities();
    }
  }, [user, authLoading, navigate]);

  const loadActivities = async () => {
    try {
      const data = await api.getActivities();
      setActivities(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load activities",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateActivity = async (data: {
    title: string;
    description: string;
    status: Activity["status"];
  }) => {
    await api.createActivity(data);
    toast({
      title: "Activity created!",
      description: "Your new activity has been added.",
    });
    loadActivities();
  };

  const handleUpdateStatus = async (id: number, status: Activity["status"]) => {
    try {
      await api.updateActivity(id, { status });
      toast({
        title: "Status updated!",
        description: `Activity marked as ${status}.`,
      });
      loadActivities();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update activity status",
      });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.deleteActivity(id);
      toast({
        title: "Activity deleted",
        description: "The activity has been removed.",
      });
      loadActivities();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete activity",
      });
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/auth");
  };

  const filteredActivities =
    filter === "all" ? activities : activities.filter((a) => a.status === filter);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Dumbbell className="h-12 w-12 animate-pulse text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-md">
                <Dumbbell className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">FitTrack</h1>
                {user && (
                  <p className="text-sm text-muted-foreground">
                    Welcome, {user.first_name}!
                  </p>
                )}
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-3xl font-bold mb-2">Your Activities</h2>
              <p className="text-muted-foreground">Track and manage your fitness journey</p>
            </div>
            <CreateActivityDialog onCreateActivity={handleCreateActivity} />
          </div>

          <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)} className="mb-6">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="planned">Planned</TabsTrigger>
              <TabsTrigger value="in progress">In Progress</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {filteredActivities.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
              <Filter className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No activities found</h3>
            <p className="text-muted-foreground mb-6">
              {filter === "all"
                ? "Create your first activity to get started!"
                : `No ${filter} activities yet.`}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredActivities.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                onUpdateStatus={handleUpdateStatus}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
