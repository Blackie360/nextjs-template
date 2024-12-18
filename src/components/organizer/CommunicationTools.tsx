import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface Event {
  id: string;
  title: string;
}

export const CommunicationTools = ({ events }: { events: Event[] }) => {
  const [selectedEvent, setSelectedEvent] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const { toast } = useToast();

  const { data: attendees } = useQuery({
    queryKey: ['attendees-emails', selectedEvent],
    queryFn: async () => {
      if (!selectedEvent) return [];
      
      const { data, error } = await supabase
        .from('event_rsvps')
        .select(`
          user_id,
          status,
          profile:profiles(email)
        `)
        .eq('event_id', selectedEvent)
        .eq('status', 'attending');

      if (error) {
        console.error('Error fetching attendees:', error);
        return [];
      }

      return data.map(rsvp => rsvp.profile.email).filter(Boolean);
    },
    enabled: !!selectedEvent
  });

  const handleSendMessage = async () => {
    if (!selectedEvent || !message.trim()) {
      toast({
        title: "Error",
        description: "Please select an event and enter a message",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select('*')
        .eq('id', selectedEvent)
        .single();

      if (eventError) throw eventError;

      // Send email to all attendees
      const { error } = await supabase.functions.invoke('send-bulk-message', {
        body: {
          eventId: selectedEvent,
          message: message,
          emails: attendees,
        },
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Message sent successfully to all attendees",
      });

      setMessage("");
    } catch (error: any) {
      toast({
        title: "Error sending message",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Communication Tools</h2>

      <Card>
        <CardHeader>
          <CardTitle>Send Bulk Message</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Select value={selectedEvent} onValueChange={setSelectedEvent}>
              <SelectTrigger>
                <SelectValue placeholder="Select an event" />
              </SelectTrigger>
              <SelectContent>
                {events.map((event) => (
                  <SelectItem key={event.id} value={event.id}>
                    {event.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedEvent && attendees && (
            <div className="text-sm text-muted-foreground">
              Message will be sent to {attendees.length} attendee(s)
            </div>
          )}

          <Textarea
            placeholder="Enter your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[200px]"
          />

          <Button onClick={handleSendMessage} className="w-full">
            Send Message
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};