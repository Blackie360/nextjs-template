import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, MessageSquare } from "lucide-react";
import { Event } from "./types";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { GroupRSVPDialog } from "./GroupRSVPDialog";

interface EventCardProps {
  event: Event;
  onRSVP: (eventId: string, notes?: string) => void;
  onChat: (eventId: string) => void;
}

export const EventCard = ({ event, onRSVP, onChat }: EventCardProps) => {
  const [isGroupRSVPOpen, setIsGroupRSVPOpen] = useState(false);
  const { toast } = useToast();
  const [friends, setFriends] = useState([]);

  const fetchFriends = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('friends')
      .select(`
        friend:profiles!friends_friend_id_fkey(
          id,
          username
        )
      `)
      .eq('user_id', user.id)
      .eq('status', 'accepted');

    if (error) {
      console.error('Error fetching friends:', error);
      return;
    }

    setFriends(data.map(d => d.friend));
  };

  const handleGroupRSVP = () => {
    fetchFriends();
    setIsGroupRSVPOpen(true);
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
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
            <Button variant="outline" className="flex-1" onClick={handleGroupRSVP}>
              <Users className="h-4 w-4 mr-2" />
              Group RSVP
            </Button>
            <Button 
              variant="outline"
              className="flex-1"
              onClick={() => onChat(event.id)}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Chat
            </Button>
          </div>
        </div>

        <GroupRSVPDialog
          isOpen={isGroupRSVPOpen}
          onClose={() => setIsGroupRSVPOpen(false)}
          event={event}
          friends={friends}
        />
      </CardContent>
    </Card>
  );
};