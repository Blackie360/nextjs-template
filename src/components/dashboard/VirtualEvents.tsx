import { format } from "date-fns";
import { Video } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Event {
  id: string;
  title: string;
  start_time: string;
  meeting_link: string;
}

export const VirtualEvents = ({ events }: { events: Event[] }) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Video className="h-5 w-5 text-primary" />
          Live Sessions
        </CardTitle>
        <CardDescription>Join your virtual events</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events?.filter(event => event.meeting_link)?.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              No virtual events scheduled
            </div>
          ) : (
            events?.filter(event => event.meeting_link).map((event) => (
              <div key={event.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                <div>
                  <div className="font-medium">{event.title}</div>
                  <div className="text-sm text-gray-600">
                    {format(new Date(event.start_time), 'MMM d, h:mm a')}
                  </div>
                </div>
                <a href={event.meeting_link} target="_blank" rel="noopener noreferrer">
                  <Button size="sm">Join</Button>
                </a>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};