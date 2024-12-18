import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface FriendRequest {
  id: string;
  sender: {
    username: string;
    avatar_url: string;
  };
}

interface PendingRequestsProps {
  requests: FriendRequest[];
}

export const PendingRequests = ({ requests }: PendingRequestsProps) => {
  const { toast } = useToast();

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

  if (!requests.length) return null;

  return (
    <div className="space-y-3">
      <h3 className="font-medium text-sm text-gray-500">Pending Buddy Requests</h3>
      {requests.map((request) => (
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
  );
};