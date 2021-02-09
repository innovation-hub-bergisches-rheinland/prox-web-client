import { Link } from '@data/schema/openapi/common/link';

export interface ProfessorOverview {
  id?: string;
  name?: string;
  faculty?: string;
  facultyId?: string;
  mainSubject?: string;
  researchSubjects?: string[];
  sumRunningProjects?: number;
  sumFinishedProjects?: number;
  sumAvailableProjects?: number;
  _links?: {
    image?: Link;
  };
}
