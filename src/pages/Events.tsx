import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Users, MessageSquare } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Events = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);

  // Check authentication status
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user?.id || null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch all public events and events user is part of
  const { data: events, isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          event_rsvps!inner(user_id, status)
        `)
        .order('start_time', { ascending: true });

      if (error) throw error;
      return data;
    }
  });

  // Fetch events created by the user
  const { data: organizedEvents } = useQuery({
    queryKey: ['organized-events', userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('creator_id', userId)
        .order('start_time', { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!userId
  });

  const handleRSVP = async (eventId: string) => {
    if (!userId) {
      navigate('/login');
      return;
    }
    // Handle RSVP logic here
  };

  const handleChat = async (eventId: string) => {
    if (!userId) {
      navigate('/login');
      return;
    }
    // Handle chat navigation here
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Events</h1>
          {userId && (
            <Button onClick={() => navigate('/events/create')}>Create New Event</Button>
          )}
        </div>

        <Tabs defaultValue="browse" className="space-y-6">
          <TabsList>
            <TabsTrigger value="browse">Browse Events</TabsTrigger>
            {userId && <TabsTrigger value="attending">My RSVPs</TabsTrigger>}
            {userId && <TabsTrigger value="organizing">My Events</TabsTrigger>}
          </TabsList>

          <TabsContent value="browse" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                <p>Loading events...</p>
              ) : (
                events?.map((event) => (
                  <Card key={event.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle>{event.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span>{new Date(event.start_time).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-gray-500" />
                          <span>{event.max_attendees ? `${event.max_attendees} max` : 'Unlimited'}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            className="flex-1"
                            onClick={() => handleRSVP(event.id)}
                          >
                            RSVP
                          </Button>
                          <Button 
                            variant="outline"
                            className="flex-1"
                            onClick={() => handleChat(event.id)}
                          >
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Chat
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {userId && (
            <TabsContent value="attending" className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events?.filter(event => 
                  event.event_rsvps.some(rsvp => 
                    rsvp.user_id === userId && rsvp.status === 'attending'
                  )
                ).map((event) => (
                  <Card key={event.id} className="hover:shadow-lg transition-shadow">
                    {/* Similar card content as above */}
                    <CardHeader>
                      <CardTitle>{event.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span>{new Date(event.start_time).toLocaleDateString()}</span>
                        </div>
                        <Button 
                          variant="outline"
                          className="w-full"
                          onClick={() => handleChat(event.id)}
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Chat
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          )}

          {userId && (
            <TabsContent value="organizing" className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {organizedEvents?.map((event) => (
                  <Card key={event.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle>{event.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span>{new Date(event.start_time).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-gray-500" />
                          <span>{event.max_attendees ? `${event.max_attendees} max` : 'Unlimited'}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline"
                            className="flex-1"
                            onClick={() => navigate(`/events/${event.id}/manage`)}
                          >
                            Manage
                          </Button>
                          <Button 
                            variant="outline"
                            className="flex-1"
                            onClick={() => handleChat(event.id)}
                          >
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Chat
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default Events;