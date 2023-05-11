import { Discipline, ModuleType } from './project.types';
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

export type SearchPreferences = {
  userId: string;
  tags: Tag[];
  projectSearch: ProjectSearchPreferences;
  lecturerSearch: LecturerSearchPreferences;
  organizationSearch: OrganizationSearchPreferences;
};

export type ProjectSearchPreferences = {
  enabled: boolean;
  moduleTypes: ModuleType[];
  disciplines: Discipline[];
};

export type LecturerSearchPreferences = {
  enabled: boolean;
};

export type OrganizationSearchPreferences = {
  enabled: boolean;
};

export type SearchPreferencesRequest = {
  projectSearch: ProjectSearchPreferencesRequest;
  lecturerSearch: LecturerSearchPreferencesRequest;
  organizationSearch: OrganizationSearchPreferencesRequest;
};

export type ProjectSearchPreferencesRequest = {
  enabled: boolean;
  moduleTypes: string[];
  disciplines: string[];
};

export type LecturerSearchPreferencesRequest = {
  enabled: boolean;
};

export type OrganizationSearchPreferencesRequest = {
  enabled: boolean;
};
