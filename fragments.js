import { gql } from "@apollo/client"

export const PHOTO_FRAGMENT_NATIVE = gql`
    fragment PhotoFragmentNative on Photo {
        id
        file
        likes
        commentNumber
        isLiked
    }
`;

export const COMMENT_FRAGMENT_NATIVE = gql`
    fragment CommentFragmentNative on Comment {
        id
        user {
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
`
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
`

export const ROOM_FRAGMENT_NATIVE = gql`
    fragment RoomParts on Room {
      id
      unreadTotal
      users {
        username
        avatar
      }
    }
`