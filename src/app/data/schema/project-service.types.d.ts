export type Status = 'VERFÜGBAR' | 'LAUFEND' | 'ABGESCHLOSSEN';
export type Context = 'COMPANY' | 'PROFESSOR';
export type ID = string;

export interface ModuleType {
  id: string;
  key: string;
  name: string;
}

export interface StudyProgram {
  id: string;
  key: string;
  name: string;
  modules: ModuleType[];
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
  creatorName: string;
  supervisorName: string;
  created: string;
  modified: string;
}

export interface CollectionModel<T, K extends string> {
  _embedded: Record<K, T[]>;
}

export type StudyProgramWithoutModules = Omit<StudyProgram, 'modules'>;
export type StudyProgramsWithModules = StudyProgram;

export type ProjectCollectionModel = CollectionModel<Project, 'projects'>;
export type ModuleTypeCollectionModel = CollectionModel<
  ModuleType,
  'moduleTypes'
>;
export type StudyProgramWithoutModulesCollectionModel = CollectionModel<
  StudyProgramWithoutModules,
  'studyPrograms'
>;
export type StudyProgramWithModulesCollectionModel = CollectionModel<
  StudyProgramsWithModules,
  'studyPrograms'
>;
export type CreateProjectSchema = Pick<
  Project,
  | 'name'
  | 'description'
  | 'shortDescription'
  | 'requirement'
  | 'status'
  | 'supervisorName'
  | 'creatorName'
>;
