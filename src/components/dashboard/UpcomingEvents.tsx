import { format } from "date-fns";
import { Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Event {
  id: string;
  title: string;
  start_time: string;
}

export const UpcomingEvents = ({ events }: { events: Event[] }) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Upcoming Events
        </CardTitle>
        <CardDescription>Your scheduled events</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events?.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              No upcoming events. 
              <Link to="/events" className="text-primary ml-2 hover:underline">
                Browse events
              </Link>
            </div>
          ) : (
            events?.map((event) => (
              <div key={event.id} className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
                <div className="w-24 text-sm text-gray-600">
                  {format(new Date(event.start_time), 'MMM d, h:mm a')}
                </div>
                <div className="flex-1 font-medium">{event.title}</div>
                <Link to={`/events/${event.id}`}>
                  <Button variant="ghost" size="sm">View</Button>
                </Link>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};