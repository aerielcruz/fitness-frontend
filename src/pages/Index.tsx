import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dumbbell, Activity, TrendingUp } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/20 -z-10" />
        
        <div className="container mx-auto px-4 py-20">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-primary/80 mb-8 shadow-2xl">
              <Dumbbell className="h-10 w-10 text-primary-foreground" />
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-primary/90 to-accent bg-clip-text text-transparent">
              Welcome to FitTrack
            </h1>
            
            <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
              Your personal fitness companion. Track activities, monitor progress, and achieve your fitness goals with ease.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => navigate("/auth")} className="shadow-lg text-lg px-8">
                Get Started
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/auth")} className="text-lg px-8">
                Sign In
              </Button>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mt-20 max-w-5xl mx-auto">
            <div className="text-center p-6 rounded-2xl bg-card hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 mb-4">
                <Activity className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Track Activities</h3>
              <p className="text-muted-foreground">
                Log your workouts and fitness activities with detailed descriptions
              </p>
            </div>
            
            <div className="text-center p-6 rounded-2xl bg-card hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-accent/10 mb-4">
                <TrendingUp className="h-7 w-7 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Monitor Progress</h3>
              <p className="text-muted-foreground">
                Update activity status from planned to in progress to completed
              </p>
            </div>
            
            <div className="text-center p-6 rounded-2xl bg-card hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-success/10 mb-4">
                <Dumbbell className="h-7 w-7 text-success" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Stay Motivated</h3>
              <p className="text-muted-foreground">
                Organize and manage your fitness journey in one place
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
