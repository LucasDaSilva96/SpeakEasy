import FriendsBoxes from '@/components/FriendsBoxes';
import { getUserFriends } from '@/lib/actions/user.actions';

export const dynamic = 'force-dynamic';

export default async function page() {
  const friends = await getUserFriends();
  if (!friends || friends.length === 0) return <div>No friends found</div>;
  return <FriendsBoxes friends={friends} isOnAccountPage={true} />;
}
