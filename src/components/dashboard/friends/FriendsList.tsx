import { Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AddFriend } from "./AddFriend";
import { PendingRequests } from "./PendingRequests";

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
          <AddFriend />
          <PendingRequests requests={pendingRequests} />
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