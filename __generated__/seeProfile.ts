/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: seeProfile
// ====================================================

export interface seeProfile_seeProfile_photos {
  __typename: "Photo";
  id: number;
  file: string;
  likes: number;
  commentNumber: number;
  isLiked: boolean;
}

export interface seeProfile_seeProfile {
  __typename: "User";
  firstName: string;
  lastName: string | undefined;
  username: string;
  bio: string | undefined;
  avatar: string | undefined;
  photos: (seeProfile_seeProfile_photos | undefined)[] | undefined;
  totalFollowing: number;
  totalFollowers: number;
  isMe: boolean;
  isFollowing: boolean;
}

export interface seeProfile {
  seeProfile: seeProfile_seeProfile | undefined;
}

export interface seeProfileVariables {
  username: string;
}
