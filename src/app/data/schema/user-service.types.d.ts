export type OrganizationId = string;
export type UserId = string;

export type OrganizationRole = 'MEMBER' | 'ADMIN' | 'OWNER';

export interface UserSearchResult {
  id: UserId;
  name: string;
}

export interface Organization {
  id: OrganizationId;
  name: string;
  profile: OrganizationProfile;
  permissions: OrganizationPermissions;
}

export interface OrganizationProfile {
  foundingDate: string;
  numberOfEmployees: string;
  homepage: string;
  contactEmail: string;
  vita: string;
  headquarter: string;
  quarters: string[];
  branches: string[];
  socialMedia: SocialMedia;
}

export interface OrganizationPermissions {
  canEdit: boolean;
  canViewMembers: boolean;
}

export interface SocialMedia {
  facebookHandle: string;
  twitterHandle: string;
  instagramHandle: string;
  xingHandle: string;
  linkedInHandle: string;
  youtubeHandle: string;
}

export interface OrganizationMembershipWrapper {
  members: OrganizationMembership[];
}

export interface OrganizationMembership {
  memberId: string;
  name: string;
  role: OrganizationRole;
}

export interface CreateOrganizationMembership {
  member: string;
  role: OrganizationRole;
}

export interface UpdateOrganizationMembership {
  role: OrganizationRole;
}

export interface GetOrganizationsWrapper {
  organizations: Organization[];
}

export type CreateOrganizationSchema = Omit<Organization, 'id' | 'permissions'>;
