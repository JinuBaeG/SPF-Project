import { gql } from "@apollo/client";

export const PHOTO_FRAGMENT_NATIVE = gql`
  fragment PhotoFragmentNative on Photo {
    id
    feedUpload {
      id
      imagePath
    }
    likes
    commentNumber
    isLiked
    feedCategoryList {
      id
      name
    }
  }
`;

export const COMMENT_FRAGMENT_NATIVE = gql`
  fragment CommentFragmentNative on Comment {
    id
    user {
      id
      username
      avatar
    }
    payload
    isMine
    createdAt
  }
`;

export const USER_FRAGMENT_NATIVE = gql`
  fragment UserFragmentNative on User {
    id
    username
    avatar
    isFollowing
    isMe
  }
`;
export const FEED_PHOTO_NATIVE = gql`
  fragment FeedPhoto on Photo {
    ...PhotoFragmentNative
    user {
      id
      username
      avatar
    }
    caption
    createdAt
    isMine
  }
  ${PHOTO_FRAGMENT_NATIVE}
`;

export const ROOM_FRAGMENT_NATIVE = gql`
  fragment RoomParts on Room {
    id
    unreadTotal
    users {
      username
      avatar
    }
  }
`;

export const GROUPINFO_FRAGMENT_NATIVE = gql`
  fragment GroupInfoFragmentNative on GroupInfo {
    id
    awardDate
    discription
  }
`;

export const GROUP_FRAGMENT_NATIVE = gql`
  fragment GroupFragmentNative on Group {
    id
    name
    activeArea
    address
    addrRoad
    zipcode
    areaLatitude
    areaLongitude
    sportsEvent
    imagePath
    discription
    users {
      id
      username
      avatar
    }
    groupInfo {
      id
      discription
      awardDate
    }
    facility {
      id
      address
      discription
      name
      facilityTag {
        id
        name
      }
      facilitySports {
        id
        name
      }
    }
    groupTag {
      id
      name
      isUse
      isCustom
    }
    userCount
    maxMember
    createdAt
    isJoin
    isJoining
    groupJoinRequest {
      id
      user {
        id
        username
        avatar
      }
    }
    isPresident
    groupPresident {
      id
      user {
        id
        username
        avatar
      }
    }
  }
`;
