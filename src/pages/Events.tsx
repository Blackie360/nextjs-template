import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { EventsTab } from "@/components/events/EventsTab";
import { Event } from "@/components/events/types";
import { useToast } from "@/components/ui/use-toast";

const Events = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const { toast } = useToast();

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
      // First get all events
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select(`
          *,
          event_rsvps (
            user_id,
            status
          )
        `)
        .order('start_time', { ascending: true });

      if (eventsError) {
        toast({
          title: "Error fetching events",
          description: eventsError.message,
          variant: "destructive",
        });
        return [];
      }

      return eventsData as Event[];
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

      if (error) {
        toast({
          title: "Error fetching organized events",
          description: error.message,
          variant: "destructive",
        });
        return [];
      }

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

          <TabsContent value="browse">
            {isLoading ? (
              <p>Loading events...</p>
            ) : (
              <EventsTab 
                events={events || []}
                onRSVP={handleRSVP}
                onChat={handleChat}
              />
            )}
          </TabsContent>

          {userId && (
            <TabsContent value="attending">
              <EventsTab 
                events={(events || []).filter(event => 
                  event.event_rsvps?.some(rsvp => 
                    rsvp.user_id === userId && rsvp.status === 'attending'
                  )
                )}
                onRSVP={handleRSVP}
                onChat={handleChat}
              />
            </TabsContent>
          )}

          {userId && (
            <TabsContent value="organizing">
              <EventsTab 
                events={organizedEvents || []}
                onRSVP={handleRSVP}
                onChat={handleChat}
              />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default Events;
