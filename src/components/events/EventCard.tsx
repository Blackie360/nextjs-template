import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, MessageSquare } from "lucide-react";
import { Event } from "./types";

interface EventCardProps {
  event: Event;
  onRSVP: (eventId: string) => void;
  onChat: (eventId: string) => void;
}

export const EventCard = ({ event, onRSVP, onChat }: EventCardProps) => {
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
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => onRSVP(event.id)}
            >
              RSVP
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
      </CardContent>
    </Card>
  );
};