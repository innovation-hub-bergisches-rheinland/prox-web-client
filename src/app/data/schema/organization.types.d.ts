import { Page } from './shared.types';
import { Tag } from './tag.types';

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
  tags: Tag[];
  logoUrl: string;
  _permissions: OrganizationPermissions;
}

export type OrganizationList = Page<Organization>;

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

export interface SetOrganizationTagsRequest {
  tags: string[];
}
export type SetOrganizationResponse = SetOrganizationTagsRequest;
