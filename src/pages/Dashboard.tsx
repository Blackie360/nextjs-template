import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { data: upcomingEvents, isLoading } = useQuery({
    queryKey: ['upcoming-events'],
    queryFn: async () => {
      const { data: events, error } = await supabase
        .from('events')
        .select(`
          *,
          event_rsvps!inner(*)
        `)
        .eq('event_rsvps.user_id', (await supabase.auth.getUser()).data.user?.id)
        .gte('start_time', new Date().toISOString())
        .order('start_time', { ascending: true })
        .limit(5);

      if (error) throw error;
      return events;
    },
  });

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white p-6">
      <h1 className="text-3xl font-bold mb-8">Welcome to Aura</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Upcoming Events
            </CardTitle>
            <CardDescription>Your scheduled events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents?.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  No upcoming events. 
                  <Link to="/events" className="text-primary ml-2 hover:underline">
                    Browse events
                  </Link>
                </div>
              ) : (
                upcomingEvents?.map((event) => (
                  <div key={event.id} className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
                    <div className="w-24 text-sm text-gray-600">
                      {format(new Date(event.start_time), 'MMM d, h:mm a')}
                    </div>
                    <div className="flex-1 font-medium">{event.title}</div>
                    <Link to={`/events/${event.id}`}>
                      <Button variant="ghost" size="sm">View</Button>
                    </Link>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5 text-primary" />
              Live Sessions
            </CardTitle>
            <CardDescription>Join your virtual events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents?.filter(event => event.meeting_link)?.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  No virtual events scheduled
                </div>
              ) : (
                upcomingEvents?.filter(event => event.meeting_link).map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                    <div>
                      <div className="font-medium">{event.title}</div>
                      <div className="text-sm text-gray-600">
                        {format(new Date(event.start_time), 'MMM d, h:mm a')}
                      </div>
                    </div>
                    <a href={event.meeting_link} target="_blank" rel="noopener noreferrer">
                      <Button size="sm">Join</Button>
                    </a>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;