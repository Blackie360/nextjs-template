import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventAnalytics } from "@/components/organizer/EventAnalytics";
import { EventManagement } from "@/components/organizer/EventManagement";
import { AttendeesManagement } from "@/components/organizer/AttendeesManagement";
import { CommunicationTools } from "@/components/organizer/CommunicationTools";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const OrganizerDashboard = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user?.id || null);
      if (!session?.user) {
        navigate('/login');
      }
    });
  }, [navigate]);

  const { data: events, isLoading: eventsLoading } = useQuery({
    queryKey: ['organizer-events', userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          event_analytics (
            views_count,
            registration_count,
            attendance_rate
          ),
          event_rsvps (
            user_id,
            status
          )
        `)
        .eq('creator_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!userId
  });

  if (eventsLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Organizer Dashboard</h1>
        
        <Tabs defaultValue="management" className="space-y-6">
          <TabsList>
            <TabsTrigger value="management">Event Management</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="attendees">Attendees</TabsTrigger>
            <TabsTrigger value="communication">Communication</TabsTrigger>
          </TabsList>

          <TabsContent value="management">
            <EventManagement events={events || []} />
          </TabsContent>

          <TabsContent value="analytics">
            <EventAnalytics events={events || []} />
          </TabsContent>

          <TabsContent value="attendees">
            <AttendeesManagement events={events || []} />
          </TabsContent>

          <TabsContent value="communication">
            <CommunicationTools events={events || []} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default OrganizerDashboard;