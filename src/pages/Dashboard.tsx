import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UpcomingEvents } from "@/components/dashboard/UpcomingEvents";
import { VirtualEvents } from "@/components/dashboard/VirtualEvents";
import { FriendsList } from "@/components/dashboard/FriendsList";

const Dashboard = () => {
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

  if (eventsLoading || friendsLoading || requestsLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white p-6">
      <h1 className="text-3xl font-bold mb-8">Welcome to Aura</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <UpcomingEvents events={upcomingEvents || []} />
        <VirtualEvents events={upcomingEvents || []} />
        <FriendsList 
          friends={friends || []} 
          pendingRequests={pendingRequests || []} 
        />
      </div>
    </div>
  );
};

export default Dashboard;