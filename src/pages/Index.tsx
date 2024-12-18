import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, Video, Ticket, Link, MessageSquare, Globe } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16 animate-fade-up">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Virtual Event Management
            <span className="text-primary block mt-2">Made Simple</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Create, manage, and host engaging virtual events with seamless integration
            for all your favorite platforms.
          </p>
          <Button size="lg" className="mr-4">Get Started</Button>
          <Button variant="outline" size="lg">Watch Demo</Button>
        </div>

        {/* Dashboard Preview */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5 text-primary" />
                Live Sessions
              </CardTitle>
              <CardDescription>Stream and manage your event content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                <Button variant="ghost">Preview Stream</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link className="h-5 w-5 text-primary" />
                Platform Integration
              </CardTitle>
              <CardDescription>Connect with your preferred platforms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  <img src="/google-meet.svg" alt="Google Meet" className="w-5 h-5 mr-2" />
                  Google Meet
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <img src="/zoom.svg" alt="Zoom" className="w-5 h-5 mr-2" />
                  Zoom
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <img src="/teams.svg" alt="Microsoft Teams" className="w-5 h-5 mr-2" />
                  Microsoft Teams
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ticket className="h-5 w-5 text-primary" />
                Ticketing
              </CardTitle>
              <CardDescription>Manage event registration and tickets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-secondary rounded-lg">
                  <span>Early Bird</span>
                  <Button size="sm">$99</Button>
                </div>
                <div className="flex justify-between items-center p-3 bg-secondary rounded-lg">
                  <span>Regular</span>
                  <Button size="sm">$149</Button>
                </div>
                <div className="flex justify-between items-center p-3 bg-secondary rounded-lg">
                  <span>VIP Access</span>
                  <Button size="sm">$299</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Schedule
              </CardTitle>
              <CardDescription>Organize your event timeline</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((session) => (
                  <div key={session} className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
                    <div className="w-16 text-sm text-gray-600">10:00 AM</div>
                    <div className="flex-1">Keynote Session {session}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Networking
              </CardTitle>
              <CardDescription>Connect with other attendees</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">JD</div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">John Doe</div>
                    <div className="text-xs text-gray-500">Product Manager</div>
                  </div>
                  <MessageSquare className="h-4 w-4 text-gray-400" />
                </div>
                <div className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white">AS</div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">Alice Smith</div>
                    <div className="text-xs text-gray-500">Developer</div>
                  </div>
                  <MessageSquare className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                Analytics
              </CardTitle>
              <CardDescription>Track event performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-secondary rounded-lg">
                  <span>Registered</span>
                  <span className="font-medium">245</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-secondary rounded-lg">
                  <span>Active Now</span>
                  <span className="font-medium">123</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-secondary rounded-lg">
                  <span>Engagement</span>
                  <span className="font-medium">87%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;