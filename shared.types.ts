export type RootStackParamList = {
  Feed: { screenName: string };
  Search: { keyword: string };
  Notifications: undefined;
  Me: undefined;
  Profile: { username: string; id: number };
  Photo: undefined;
  Likes: { photoId: number };
  Comments: { id: number };
  ReComments: any | undefined;
  Rooms: undefined;
  Room: { id: number; talkingTo: string };
  PhotoDetail: { id: number };
  Upload: { screenName: string };
  SharedWriteButton: { screenName: string };
  AddFeed: { screenName: string };
  Group: { screenName: string };
  AddGroup: { screenName: string };
  Tutor: { screenName: string };
  AddTutor: { screenName: string };
  TutorGroup: any | undefined;
  Facility: { screenName: string };
  AddFacility: { screenName: string };
  GroupDetail: any | undefined;
  FacilityDetail: any | undefined;
  ActiveArea: any | undefined;
  TutorDetail: any | undefined;
  TutorInquiryDetail: any | undefined;
  Board: any | undefined;
  AddBoard: any | undefined;
  BoardList: any | undefined;
  BoardDetail: any | undefined;
  BoardReComments: any | undefined;
  Notice: any | undefined;
  AddNotice: any | undefined;
  NoticeList: any | undefined;
  NoticeDetail: any | undefined;
  NoticeReComments: any | undefined;
  LoggedOutNav: any | undefined;
};

export const SHOW_OPTION = [
  { id: 0, name: "전체공개", isChecked: true },
  { id: 1, name: "나만보기", isChecked: false },
];
