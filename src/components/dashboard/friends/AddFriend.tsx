import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const AddFriend = () => {
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

  return (
    <div className="flex gap-2">
      <Input
        placeholder="Enter username to add a buddy"
        value={friendUsername}
        onChange={(e) => setFriendUsername(e.target.value)}
      />
      <Button onClick={handleAddFriend}>Add Buddy</Button>
    </div>
  );
};