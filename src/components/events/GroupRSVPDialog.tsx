import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Ticket, Users, Plus, Minus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Friend {
  id: string;
  username: string;
}

interface GroupRSVPDialogProps {
  isOpen: boolean;
  onClose: () => void;
  event: {
    id: string;
    title: string;
    max_attendees: number | null;
  };
  friends: Friend[];
}

export const GroupRSVPDialog = ({ isOpen, onClose, event, friends }: GroupRSVPDialogProps) => {
  const [selectedFriends, setSelectedFriends] = useState<Friend[]>([]);
  const [notes, setNotes] = useState("");
  const { toast } = useToast();

  const handleRSVP = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "Please sign in to RSVP",
          variant: "destructive",
        });
        return;
      }

      // Create RSVP
      const { error: rsvpError } = await supabase
        .from('event_rsvps')
        .insert({
          event_id: event.id,
          user_id: user.id,
          status: 'attending',
          notes,
          is_group_rsvp: selectedFriends.length > 0,
          tickets_count: selectedFriends.length + 1,
          purchased_for: selectedFriends.map(f => f.id),
        });

      if (rsvpError) {
        throw rsvpError;
      }

      // Send notification to friends
      const notificationPromises = selectedFriends.map(friend => 
        supabase.from('notifications').insert({
          user_id: friend.id,
          type: 'group_rsvp',
          message: `You've been added to a group RSVP for ${event.title}`,
        })
      );

      await Promise.all(notificationPromises);

      // Get event details for the email
      const { data: eventDetails } = await supabase
        .from('events')
        .select('*')
        .eq('id', event.id)
        .single();

      if (eventDetails) {
        // Send email notifications through edge function
        const { error: emailError } = await supabase.functions.invoke('send-event-email', {
          body: {
            eventId: event.id,
            userId: user.id,
            type: 'group_rsvp',
            eventDetails,
            attendees: selectedFriends.map(f => f.id)
          },
        });

        if (emailError) {
          console.error('Error sending email:', emailError);
          toast({
            title: "Note",
            description: "RSVP confirmed but there was an issue sending email notifications",
            variant: "default",
          });
        } else {
          toast({
            title: "Success",
            description: "RSVP confirmed and email notifications sent!",
          });
        }
      }

      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const toggleFriend = (friend: Friend) => {
    if (selectedFriends.find(f => f.id === friend.id)) {
      setSelectedFriends(selectedFriends.filter(f => f.id !== friend.id));
    } else {
      if (event.max_attendees && selectedFriends.length + 1 >= event.max_attendees) {
        toast({
          title: "Capacity Limit",
          description: "Maximum attendees limit reached",
          variant: "destructive",
        });
        return;
      }
      setSelectedFriends([...selectedFriends, friend]);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Group RSVP
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Select Friends</Label>
            <div className="grid grid-cols-2 gap-2">
              {friends.map((friend) => (
                <Button
                  key={friend.id}
                  variant={selectedFriends.find(f => f.id === friend.id) ? "default" : "outline"}
                  className="flex items-center gap-2"
                  onClick={() => toggleFriend(friend)}
                >
                  {selectedFriends.find(f => f.id === friend.id) ? (
                    <Minus className="h-4 w-4" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                  {friend.username}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Additional Notes</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any dietary restrictions or special requirements?"
            />
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Ticket className="h-4 w-4" />
            <span>Total tickets: {selectedFriends.length + 1}</span>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleRSVP}>
            Confirm RSVP
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};