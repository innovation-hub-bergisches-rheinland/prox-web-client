export type Status = 'AVAILABLE' | 'RUNNING' | 'FINISHED';
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
}

export type OwnerDiscriminator = 'user' | 'organization';

export interface Owner {
  id: ID;
  discriminator: OwnerDiscriminator;
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
  supervisorName: string;
  createdAt: string;
  modifiedAt: string;
}

export type ProjectProjection = 'withModules';
export type StudyProgramProjection = 'withModules';

export interface CollectionModel<T, K extends string> {
  _embedded: Record<K, T[]>;
}

export type StudyProgramsWithModules = StudyProgram & {
  modules: ModuleType[];
};

export type ProjectWithAssociations = Project & {
  modules: ModuleType[];
  specializations: Specialization[];
};

export type ProjectCollectionModel = CollectionModel<Project, 'projects'>;
export type ModuleTypeCollectionModel = CollectionModel<ModuleType, 'moduleTypes'>;
export type SpecializationCollectionModel = CollectionModel<Specialization, 'specializations'>;
export type StudyProgramCollectionModel = CollectionModel<StudyProgram, 'studyPrograms'>;
export type StudyProgramWithModulesCollectionModel = CollectionModel<StudyProgramsWithModules, 'studyPrograms'>;
export type CreateProjectSchema = Omit<Project, 'id' | 'owner' | 'createdAt' | 'modifiedAt'>;
