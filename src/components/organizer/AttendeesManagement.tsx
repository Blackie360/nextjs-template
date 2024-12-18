import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface Event {
  id: string;
  title: string;
}

interface Attendee {
  user_id: string;
  status: string;
  notes: string | null;
  is_group_rsvp: boolean;
  tickets_count: number;
  profile: {
    username: string | null;
    email: string | null;
  };
}

export const AttendeesManagement = ({ events }: { events: Event[] }) => {
  const [selectedEvent, setSelectedEvent] = useState<string>("");
  const { toast } = useToast();

  const { data: attendees, isLoading } = useQuery({
    queryKey: ['attendees', selectedEvent],
    queryFn: async () => {
      if (!selectedEvent) return [];
      
      const { data, error } = await supabase
        .from('event_rsvps')
        .select(`
          user_id,
          status,
          notes,
          is_group_rsvp,
          tickets_count,
          profile:profiles(username, email)
        `)
        .eq('event_id', selectedEvent);

      if (error) {
        console.error('Error fetching attendees:', error);
        toast({
          title: "Error fetching attendees",
          description: error.message,
          variant: "destructive",
        });
        return [];
      }

      return data as Attendee[];
    },
    enabled: !!selectedEvent
  });

  const handleStatusChange = async (userId: string, newStatus: string) => {
    const { error } = await supabase
      .from('event_rsvps')
      .update({ status: newStatus })
      .eq('event_id', selectedEvent)
      .eq('user_id', userId);

    if (error) {
      toast({
        title: "Error updating status",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Status updated successfully",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Attendees Management</h2>
        <Select value={selectedEvent} onValueChange={setSelectedEvent}>
          <SelectTrigger className="w-[200px]">
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

      {selectedEvent && (
        <Card>
          <CardHeader>
            <CardTitle>Attendees List</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Username</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tickets</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendees?.map((rsvp) => (
                    <TableRow key={rsvp.user_id}>
                      <TableCell>{rsvp.profile.username || 'N/A'}</TableCell>
                      <TableCell>{rsvp.profile.email || 'N/A'}</TableCell>
                      <TableCell>{rsvp.status}</TableCell>
                      <TableCell>{rsvp.tickets_count}</TableCell>
                      <TableCell>{rsvp.notes || 'No notes'}</TableCell>
                      <TableCell>
                        <Select
                          value={rsvp.status}
                          onValueChange={(value) => handleStatusChange(rsvp.user_id, value)}
                        >
                          <SelectTrigger className="w-[150px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="attending">Attending</SelectItem>
                            <SelectItem value="declined">Declined</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};