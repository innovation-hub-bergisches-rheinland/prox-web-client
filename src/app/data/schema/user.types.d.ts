export interface User {
  id: string;
  name: string;
}

export type RoleSearch = 'professor';

export interface LecturerTag {
  id: string;
  tagName: string;
}

export interface LecturerProfile {
  visibleInPublicSearch: true;
  profile: LecturerProfileInformation;
  tags: LecturerTag[];
}

export interface LecturerProfileInformation {
  affiliation: string;
  subject: string;
  vita: string;
  publications: string[];
  room: string;
  consultationHour: string;
  email: string;
  telephone: string;
  homepage: string;
  collegePage: string;
}

export interface UserProfile {
  userId: string;
  displayName: string;
  avatarUrl: string | null;
  lecturerProfile?: LecturerProfile;
}

export interface CreateLecturerProfileRequest {
  profile: LecturerProfile;
  visibleInPublicSearch: boolean;
}

export interface SetLecturerTagsRequest {
  tags: string[];
}
export type SetLecturerTagsResponse = {
  tags: LecturerTag[];
};
