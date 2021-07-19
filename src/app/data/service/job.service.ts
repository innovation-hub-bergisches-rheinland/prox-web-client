import { Injectable, Injector } from '@angular/core';
import { JobOfferControllerService } from '@data/service/openapi/job-service/jobOfferController.service';
import { JobOffer } from '@data/schema/openapi/job-service/jobOffer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import EntryLevelsEnum = JobOffer.EntryLevelsEnum;
import AvailableTypesEnum = JobOffer.AvailableTypesEnum;

export function getEntryLevelRepresentation(
  entryLevel: EntryLevelsEnum
): string {
  switch (entryLevel) {
    case 'CAREER_STARTER':
      return 'Berufseinsteiger';
    case 'EXPERIENCED':
      return 'Berufserfahrene';
  }
}

export function getTypeRepresentation(type: AvailableTypesEnum): string {
  switch (type) {
    case 'FULL_TIME':
      return 'Vollzeit';
    case 'INTERNSHIP':
      return 'Ausbildung / Praktikum';
    case 'MINIJOB':
      return 'Minijob';
    case 'PART_TIME':
      return 'Teilzeit';
    case 'RESEARCH_ASSISTANT':
      return 'Wissenschaftliche Hilfskraft';
    case 'STUDENT_WORKER':
      return 'Studentische Hilfskraft / Werkstudent';
  }
}

@Injectable({
  providedIn: 'root'
})
export class JobService {
  constructor(private jobControllerService: JobOfferControllerService) {}

  createJobOffer(jobOffer: JobOffer): Observable<JobOffer> {
    return this.jobControllerService.save(jobOffer);
  }

  getAllJobOffers(): Observable<JobOffer[]> {
    return this.jobControllerService.getAll().pipe(map(j => Array.from(j)));
  }
}
