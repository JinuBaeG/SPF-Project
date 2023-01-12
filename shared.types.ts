export type RootStackParamList = {
  Feed: undefined;
  Search: { keyword: string };
  Notifications: undefined;
  Me: undefined;
  Profile: { username: string; id: number };
  Photo: undefined;
  Likes: { photoId: number };
  Comments: undefined;
  Rooms: undefined;
  Room: { id: number; talkingTo: string };
};
