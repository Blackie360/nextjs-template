import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Event {
  id: string;
  title: string;
  event_analytics: {
    views_count: number;
    registration_count: number;
    attendance_rate: number;
  } | null;
  event_rsvps: Array<{ status: string }>;
}

export const EventAnalytics = ({ events }: { events: Event[] }) => {
  const analyticsData = events.map(event => ({
    name: event.title,
    registrations: event.event_analytics?.registration_count || 0,
    views: event.event_analytics?.views_count || 0,
    attendanceRate: event.event_analytics?.attendance_rate || 0
  }));

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Event Analytics</h2>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Events</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{events.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Registrations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {events.reduce((acc, event) => 
                acc + (event.event_analytics?.registration_count || 0), 0
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Average Attendance Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {Math.round(events.reduce((acc, event) => 
                acc + (event.event_analytics?.attendance_rate || 0), 0
              ) / events.length || 0)}%
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Event Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="registrations" fill="#8884d8" name="Registrations" />
                <Bar dataKey="views" fill="#82ca9d" name="Views" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};