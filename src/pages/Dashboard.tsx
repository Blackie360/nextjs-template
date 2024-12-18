import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

const Dashboard = () => {
  const { toast } = useToast();
  const [friendUsername, setFriendUsername] = useState("");

  const { data: upcomingEvents, isLoading: eventsLoading } = useQuery({
    queryKey: ['upcoming-events'],
    queryFn: async () => {
      const { data: events, error } = await supabase
        .from('events')
        .select(`
          *,
          event_rsvps!inner(*)
        `)
        .eq('event_rsvps.user_id', (await supabase.auth.getUser()).data.user?.id)
        .gte('start_time', new Date().toISOString())
        .order('start_time', { ascending: true })
        .limit(5);

      if (error) throw error;
      return events;
    },
  });

  const { data: friends, isLoading: friendsLoading } = useQuery({
    queryKey: ['friends'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: friendships, error } = await supabase
        .from('friends')
        .select(`
          *,
          friend:profiles!friends_friend_id_fkey(username, avatar_url),
          user:profiles!friends_user_id_fkey(username, avatar_url)
        `)
        .or(`user_id.eq.${user?.id},friend_id.eq.${user?.id}`)
        .eq('status', 'accepted');

      if (error) throw error;
      return friendships.map(friendship => ({
        ...friendship,
        // Ensure we get the other user's info regardless of which side of the friendship we are
        otherUser: friendship.user_id === user?.id ? friendship.friend : friendship.user
      }));
    },
  });

  const { data: pendingRequests, isLoading: requestsLoading } = useQuery({
    queryKey: ['friend-requests'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: requests, error } = await supabase
        .from('friends')
        .select(`
          *,
          sender:profiles!friends_user_id_fkey(username, avatar_url)
        `)
        .eq('friend_id', user?.id)
        .eq('status', 'pending');

      if (error) throw error;
      return requests;
    },
  });

  const handleAddFriend = async () => {
    try {
      // First find the user by username
      const { data: foundUser, error: searchError } = await supabase
        .from('profiles')
        .select('id, username')
        .eq('username', friendUsername)
        .single();

      if (searchError || !foundUser) {
        toast({
          title: "User not found",
          description: "Please check the username and try again",
          variant: "destructive"
        });
        return;
      }

      // Send friend request
      const { error: requestError } = await supabase
        .from('friends')
        .insert({
          user_id: (await supabase.auth.getUser()).data.user?.id,
          friend_id: foundUser.id,
          status: 'pending'
        });

      if (requestError) {
        if (requestError.code === '23505') { // Unique violation
          toast({
            title: "Already friends",
            description: "You've already sent a request to this user or are already friends",
            variant: "destructive"
          });
        } else {
          throw requestError;
        }
      } else {
        toast({
          title: "Friend request sent!",
          description: `Request sent to ${foundUser.username}`,
        });
        setFriendUsername("");
      }
    } catch (error) {
      console.error('Error adding friend:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleFriendRequest = async (requestId: string, accept: boolean) => {
    try {
      const { error } = await supabase
        .from('friends')
        .update({ status: accept ? 'accepted' : 'rejected' })
        .eq('id', requestId);

      if (error) throw error;

      toast({
        title: accept ? "Friend request accepted!" : "Friend request declined",
        description: accept ? "You are now connected" : "The request has been declined",
      });
    } catch (error) {
      console.error('Error handling friend request:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (eventsLoading || friendsLoading || requestsLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white p-6">
      <h1 className="text-3xl font-bold mb-8">Welcome to Aura</h1>
      <div className="grid md:grid-cols-2 gap-6">
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
              {upcomingEvents?.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  No upcoming events. 
                  <Link to="/events" className="text-primary ml-2 hover:underline">
                    Browse events
                  </Link>
                </div>
              ) : (
                upcomingEvents?.map((event) => (
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
              {upcomingEvents?.filter(event => event.meeting_link)?.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  No virtual events scheduled
                </div>
              ) : (
                upcomingEvents?.filter(event => event.meeting_link).map((event) => (
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

        <Card className="md:col-span-2 hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Your Aura Buddies
            </CardTitle>
            <CardDescription>Connect with other event enthusiasts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Add friend section */}
              <div className="flex gap-2">
                <Input
                  placeholder="Enter username to add a buddy"
                  value={friendUsername}
                  onChange={(e) => setFriendUsername(e.target.value)}
                />
                <Button onClick={handleAddFriend}>Add Buddy</Button>
              </div>

              {/* Pending requests section */}
              {pendingRequests && pendingRequests.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-medium text-sm text-gray-500">Pending Buddy Requests</h3>
                  {pendingRequests.map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                      <div className="font-medium">{request.sender.username}</div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleFriendRequest(request.id, false)}
                        >
                          Decline
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleFriendRequest(request.id, true)}
                        >
                          Accept
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Friends list */}
              <div className="space-y-3">
                <h3 className="font-medium text-sm text-gray-500">Your Buddies</h3>
                {friends && friends.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    No buddies yet. Add some friends to get started!
                  </div>
                ) : (
                  <div className="grid gap-3 md:grid-cols-2">
                    {friends?.map((friendship) => (
                      <div key={friendship.id} className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          {friendship.otherUser.username?.[0]?.toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{friendship.otherUser.username}</div>
                        </div>
                        <Button variant="ghost" size="sm">Message</Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;