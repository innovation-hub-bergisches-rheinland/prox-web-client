import { Tag } from './tag.types';

export interface LecturerProfile {
  profile: LecturerProfileInformation;
}

export interface LecturerProfileInformation {
  affiliation: string;
  subject: string;
  publications: string[];
  room: string;
  consultationHour: string;
  collegePage: string;
}

export interface ContactInformation {
  email: string | null;
  telephone: string | null;
  homepage: string | null;
}

export interface UserProfile {
  visibleInPublicSearch: boolean;
  userId: string;
  displayName: string;
  avatarUrl: string | null;
  vita: string;
  tags: Tag[];
  contact: ContactInformation;
  lecturerProfile?: LecturerProfile;
}

export type CreateLecturerProfileRequest = LecturerProfile;

export type CreateUserProfileRequest = Omit<UserProfile, 'avatarUrl' | 'tags' | 'lecturerProfile' | 'userId'>;

export interface SetLecturerTagsRequest {
  tags: string[];
}
export type SetLecturerTagsResponse = {
  tags: Tag[];
};
