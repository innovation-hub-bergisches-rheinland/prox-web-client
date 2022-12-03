export interface Discipline {
  key: string;
  name: string;
}

export interface ModuleType {
  key: string;
  name: string;
}

export interface ProjectPermissions {
  hasAccess: boolean;
}

export interface ProjectAuthor {
  id: string;
}

export interface ProjectPartner {
  id: string;
  name: string;
}

export interface CurriculumContext {
  disciplines: Discipline[];
  modules: ModuleType[];
}

export type ProjectState = 'PROPOSED' | 'ARCHIVED' | 'STALE' | 'OFFERED' | 'RUNNING' | 'COMPLETED';

export interface ProjectStatus {
  state: ProjectState;
  updatedAt: number;
}

export interface ProjectSupervisor {
  id: string;
  name: string;
}

export interface ProjectTimeBox {
  start: string;
  end: string;
}

export interface Project {
  id: string;
  title: string;
  summary: string;
  description: string;
  requirement: string;
  author: ProjectAuthor;
  partner?: ProjectPartner;
  curriculumContext?: CurriculumContext;
  supervisors: ProjectSupervisor[];
  tags: string[];
  timeBox: ProjectTimeBox;
  status: ProjectStatus;
  _permissions: ProjectPermissions;
}

export interface ProjectList {
  projects: Project[];
}

export interface CreateProjectRequest {
  title: string;
  summary: string;
  description: string;
  requirement: string;
  context: CurriculumContext;
  timeBox: ProjectTimeBox;
}
