export interface LecturerPermissions {
  hasAccess: boolean;
}

export interface LecturerProfile {
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

export interface Lecturer {
  id: string;
  userId: string;
  name: string;
  profile: LecturerProfile;
  tags: string[];
  avatarUrl: string;
  _permissions: LecturerPermissions;
}

export interface CreateLecturerRequest {
  name: string;
  profile: LecturerProfile;
}

export type SocialMedia = 'FACEBOOK' | 'TWITTER' | 'LINKEDIN' | 'XING' | 'INSTAGRAM' | 'YOUTUBE';
export type OrganizationRole = 'ADMIN' | 'MEMBER';

export interface OrganizationPermissions {
  hasAccess: boolean;
}

export interface OrganizationProfile {
  foundingDate: string;
  numberOfEmployees: string;
  homepage: string;
  contactEmail: string;
  vita: string;
  headquarter: string;
  quarters: string;
  socialMediaHandles: Record<SocialMedia, string>;
}

export interface Organization {
  id: string;
  name: string;
  profile: OrganizationProfile;
  tags: string[];
  logoUrl: string;
  _permissions: OrganizationPermissions;
}

export interface CreateOrganizationRequest {
  name: string;
  profile: OrganizationProfile;
}

export interface OrganizationMembership {
  member: string;
  name: string;
  role: OrganizationRole;
}

export interface OrganizationMemberList {
  members: OrganizationMembership[];
}

export type AddOrganizationMembershipRequest = {
  member: string;
  role: OrganizationRole;
};
export type UpdateOrganizationMembershipRequest = Omit<OrganizationMembership, 'member'>;

export interface SetLecturerTagsRequest {
  tags: string[];
}
export type SetLecturerTagsResponse = SetLecturerTagsRequest;

export interface SetOrganizationTagsRequest {
  tags: string[];
}
export type SetOrganizationResponse = SetOrganizationTagsRequest;
