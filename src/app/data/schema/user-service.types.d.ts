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

export type CreateOrganizationSchema = Omit<Organization, 'id'>;
