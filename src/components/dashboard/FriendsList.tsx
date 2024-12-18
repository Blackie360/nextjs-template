import { Users } from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Friend {
  id: string;
  otherUser: {
    username: string;
    avatar_url: string;
  };
}

interface FriendRequest {
  id: string;
  sender: {
    username: string;
    avatar_url: string;
  };
}

interface FriendsListProps {
  friends: Friend[];
  pendingRequests: FriendRequest[];
}

export const FriendsList = ({ friends, pendingRequests }: FriendsListProps) => {
  const { toast } = useToast();
  const [friendUsername, setFriendUsername] = useState("");

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
        if (requestError.code === '23505') {
          toast({
            title: "Already friends",
            description: "You've already sent a request to this user or are already friends",
            variant: "destructive"
          });
        } else {
          throw requestError;
        }
      } else {
        // Send notification using edge function
        const { data: { user } } = await supabase.auth.getUser();
        await supabase.functions.invoke('notify', {
          body: {
            userId: foundUser.id,
            type: 'friend_request',
            message: `${user?.email} wants to be your Aura buddy!`
          }
        });

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

      // Send notification using edge function
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.functions.invoke('notify', {
        body: {
          userId: user?.id,
          type: 'friend_accepted',
          message: accept ? 
            `${user?.email} accepted your buddy request!` :
            `${user?.email} declined your buddy request`
        }
      });

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

  return (
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
          <div className="flex gap-2">
            <Input
              placeholder="Enter username to add a buddy"
              value={friendUsername}
              onChange={(e) => setFriendUsername(e.target.value)}
            />
            <Button onClick={handleAddFriend}>Add Buddy</Button>
          </div>

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
  );
};