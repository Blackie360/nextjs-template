import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, MessageSquare, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Event {
  id: string;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string;
  event_status: string;
  event_type: string;
  max_attendees: number | null;
  event_rsvps: Array<{ status: string }>;
}

export const EventManagement = ({ events }: { events: Event[] }) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleDelete = async (eventId: string) => {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', eventId);

    if (error) {
      toast({
        title: "Error deleting event",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Event deleted successfully",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Your Events</h2>
        <Button onClick={() => navigate('/events/create')}>Create New Event</Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <Card key={event.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex justify-between items-start">
                <span>{event.title}</span>
                <span className="text-sm font-normal px-2 py-1 bg-primary/10 rounded-full">
                  {event.event_status}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>{new Date(event.start_time).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span>
                    {event.event_rsvps?.filter(r => r.status === 'attending').length || 0}
                    {event.max_attendees ? ` / ${event.max_attendees}` : ' (unlimited)'}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => navigate(`/events/${event.id}/edit`)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleDelete(event.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};