export type Status = 'AVAILABLE' | 'RUNNING' | 'FINISHED';
export type ProposalStatus = 'PROPOSED' | 'ARCHIVED';
export type ID = string;

export interface ModuleType {
  id: ID;
  key: string;
  name: string;
}

export interface StudyProgram {
  id: ID;
  key: string;
  name: string;
}

export interface Specialization {
  id: ID;
  key: string;
  name: string;
  modules: ModuleType[];
}

export type OwnerDiscriminator = 'user' | 'organization';

export interface Owner {
  id: ID;
  name: string;
  discriminator: OwnerDiscriminator;
}

export interface Permissions {
  canEdit: boolean;
  canDelete: boolean;
}

export interface ProjectSupervisor {
  id: string;
  name: string;
}

export interface Project {
  id: ID;
  name: string;
  description: string;
  shortDescription: string;
  requirement: string;
  status: Status;
  owner: Owner;
  creatorName?: string;
  supervisors: ProjectSupervisor[];
  createdAt: string;
  modifiedAt: string;
  modules: ModuleType[];
  specializations: Specialization[];
  permissions: Permissions;
}

export interface Proposal {
  id: ID;
  name: string;
  description: string;
  requirement: string;
  status: ProposalStatus;
  owner: Owner;
  modules: ModuleType[];
  specializations: Specialization[];
  createdAt: string;
  modifiedAt: string;
  permissions: Permissions & { canCommit: boolean };
}

export type CollectionModel<T, K extends string> = Record<K, T[]>;

export type ProjectCollectionModel = CollectionModel<Project, 'projects'>;
export type ProposalCollectionModel = CollectionModel<Proposal, 'proposals'>;
export type ModuleTypeCollectionModel = CollectionModel<ModuleType, 'modules'>;
export type SpecializationCollectionModel = CollectionModel<Specialization, 'specializations'>;
export type StudyProgramCollectionModel = CollectionModel<StudyProgram, 'studyPrograms'>;

export type CreateProjectSchema = Omit<
  Project,
  'id' | 'owner' | 'createdAt' | 'modifiedAt' | 'modules' | 'specializations' | 'permissions'
>;

export type CreateProposalSchema = Pick<Proposal, 'name' | 'description' | 'requirement'>;
