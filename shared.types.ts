import { IMPData } from "iamport-react-native";

export type RootStackParamList = {
  Tabs: any | undefined;
  Feed: { screenName: string };
  Search: { keyword: string };
  Notifications: undefined;
  Me: undefined;
  Profile: { username: string; id: string };
  Photo: undefined;
  Likes: { photoid: string };
  Comments: { id: string };
  ReComments: any | undefined;
  Rooms: undefined;
  Room: { id: string; talkingTo: string };
  PhotoDetail: { id: string };
  Upload: { screenName: string };
  SharedWriteButton: { screenName: string };
  AddFeed: { screenName: string };
  Group: any | undefined;
  AddGroup: { screenName: string };
  Tutor: any | undefined;
  AddTutor: { screenName: string };
  RequestAddTutor: { screenName: string };
  TutorGroup: any | undefined;
  Facility: any | undefined;
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
  Login: any | undefined;
  Welcome: any | undefined;
  ChangePassword: any | undefined;
  BannerDetail: any | undefined;
  SportsFilter: any | undefined;
  TutorRequsetDetail: any | undefined;
  TutorRequestList: any | undefined;
  EditProfile: any | undefined;
  Report: any | undefined;
  MyReport: any | undefined;
  TabHome: any | undefined;
  SportsSelectSearch: any | undefined;
  Common: any | undefined;
  Home: undefined;
  Certification: CertificationParams | undefined;
  CertificationTest: undefined;
  CertificationResult: any;
  Payment: PaymentParams | undefined;
  PaymentTest: undefined;
  PaymentResult: any;
};

export interface CertificationParams {
  params: IMPData.CertificationData;
  tierCode?: string;
}

export interface PaymentParams {
  params: IMPData.PaymentData;
  tierCode?: string;
}

export const SHOW_OPTION = [
  { id: 0, name: "전체공개", isChecked: true },
  { id: 1, name: "나만보기", isChecked: false },
];

export function AroundDistance(location: any, radius: any) {
  const EARTH_RADIUS = 6371;
  const curLatitude = parseFloat(location.latitude);
  const curLongitude = parseFloat(location.longitude);
  const mForLatitude = 1 / (EARTH_RADIUS * 1 * (Math.PI / 180)) / 1000;
  const mForLongitude =
    1 /
    (EARTH_RADIUS *
      1 *
      (Math.PI / 180) *
      Math.cos((curLatitude * Math.PI) / 180)) /
    1000;

  const maxY = curLatitude + radius * mForLatitude;
  const minY = curLatitude - radius * mForLatitude;
  const maxX = curLongitude + radius * mForLongitude;
  const minX = curLongitude - radius * mForLongitude;

  return { maxY, minY, maxX, minX };
}

export function phoneNumberMasking(phoneNumber: string) {
  if (phoneNumber !== undefined) {
    let values1 = phoneNumber.substring(0, 3);
    let values2 = phoneNumber.substring(3, 7);
    let values3 = phoneNumber.substring(7, 11);
    values2 = values2.replace(values2.substring(2, 4), "**");
    values3 = values3.replace(values3.substring(2, 4), "**");

    return values1 + values2 + values3;
  }
}

export function emailMasking(email: any) {
  if (email !== undefined) {
    if (email.length > 0) {
      const mask = "*".repeat(email.split("@")[0].length - 1);
      return email[0] + mask + email.slice(mask.length + 1, email.length);
    }
  }
}
