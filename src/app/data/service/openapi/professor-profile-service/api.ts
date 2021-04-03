export * from './facultyAPI.service';
import { FacultyAPIService } from './facultyAPI.service';
export * from './professorAPI.service';
import { ProfessorAPIService } from './professorAPI.service';
export const APIS = [FacultyAPIService, ProfessorAPIService];
