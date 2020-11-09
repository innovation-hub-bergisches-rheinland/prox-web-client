export * from './moduleService.service';
import { ModuleServiceService } from './moduleService.service';
export * from './projectService.service';
import { ProjectServiceService } from './projectService.service';
export * from './tagService.service';
import { TagServiceService } from './tagService.service';
export const APIS = [
  ModuleServiceService,
  ProjectServiceService,
  TagServiceService
];
