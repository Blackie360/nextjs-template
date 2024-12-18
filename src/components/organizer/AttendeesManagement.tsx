import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Event {
  id: string;
  title: string;
  event_rsvps: Array<{
    user_id: string;
    status: string;
  }>;
}

export const AttendeesManagement = ({ events }: { events: Event[] }) => {
  const [selectedEvent, setSelectedEvent] = useState<string>("");
  const { toast } = useToast();

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

  const selectedEventData = events.find(e => e.id === selectedEvent);

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

      {selectedEventData && (
        <Card>
          <CardHeader>
            <CardTitle>Attendees List</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedEventData.event_rsvps.map((rsvp) => (
                  <TableRow key={rsvp.user_id}>
                    <TableCell>{rsvp.user_id}</TableCell>
                    <TableCell>{rsvp.status}</TableCell>
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
          </CardContent>
        </Card>
      )}
    </div>
  );
};