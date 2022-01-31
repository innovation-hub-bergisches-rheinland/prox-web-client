export type Status = 'AVAILABLE' | 'RUNNING' | 'FINISHED';
export type Context = 'COMPANY' | 'PROFESSOR';
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

export interface Project {
  id: ID;
  name: string;
  description: string;
  shortDescription: string;
  requirement: string;
  status: Status;
  context: Context;
  creatorID: ID;
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

export type ProjectWithModules = Project & {
  modules: ModuleType[];
};

export type ProjectCollectionModel = CollectionModel<Project, 'projects'>;
export type ModuleTypeCollectionModel = CollectionModel<ModuleType, 'moduleTypes'>;
export type StudyProgramCollectionModel = CollectionModel<StudyProgram, 'studyPrograms'>;
export type StudyProgramWithModulesCollectionModel = CollectionModel<StudyProgramsWithModules, 'studyPrograms'>;
export type CreateProjectSchema = Omit<Project, 'id' | 'creatorID' | 'creatorName' | 'createdAt' | 'modifiedAt'>;
