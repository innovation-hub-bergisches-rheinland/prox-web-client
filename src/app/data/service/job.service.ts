import { Injectable, Injector } from '@angular/core';
import { JobOfferControllerService } from '@data/service/openapi/job-service/jobOfferController.service';
import { JobOffer } from '@data/schema/openapi/job-service/jobOffer';
import { EMPTY, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { JobOfferEntryLevel } from '@data/schema/openapi/job-service/jobOfferEntryLevel';
import { JobOfferEntryLevelControllerService } from '@data/service/openapi/job-service/jobOfferEntryLevelController.service';
import { JobOfferTypeControllerService } from '@data/service/openapi/job-service/jobOfferTypeController.service';
import { JobOfferType } from '@data/schema/openapi/job-service/jobOfferType';

@Injectable({
  providedIn: 'root'
})
export class JobService {
  constructor(
    private jobControllerService: JobOfferControllerService,
    private jobOfferEntryLevelService: JobOfferEntryLevelControllerService,
    private jobOfferTypeService: JobOfferTypeControllerService
  ) {}

  createJobOffer(jobOffer: JobOffer): Observable<JobOffer> {
    return this.jobControllerService.save(jobOffer);
  }

  updateJobOffer(id: string, jobOffer: JobOffer): Observable<JobOffer> {
    return this.jobControllerService.update(id, jobOffer);
  }

  getAllJobOffers(): Observable<JobOffer[]> {
    return this.jobControllerService.getAll().pipe(map(j => Array.from(j)));
  }

  getAllEntryLevels(): Observable<JobOfferEntryLevel[]> {
    return this.jobOfferEntryLevelService.getAll2();
  }

  getAllJobTypes(): Observable<JobOfferType[]> {
    return this.jobOfferTypeService.getAll1();
  }

  getJobOffer(id: string): Observable<JobOffer> {
    return this.jobControllerService.getById(id);
  }

  getTypesFromJobOffer(id: string): Observable<JobOfferType[]> {
    return this.jobControllerService.getTypes(id);
  }

  getEntryLevelsFromJobOffer(id: string): Observable<JobOfferEntryLevel[]> {
    return this.jobControllerService.getEntryLevels(id);
  }

  setJobTypes(id: string, types: JobOfferType[]): Observable<JobOfferType[]> {
    if (id && types && types.length > 0) {
      return this.jobControllerService.setTypes(
        id,
        types.map(type => type.id)
      );
    }
    return of([]);
  }

  setEntryLevels(id: string, levels: JobOfferEntryLevel[]): Observable<JobOfferEntryLevel[]> {
    if (id && levels && levels.length > 0) {
      return this.jobControllerService.setEntryLevels(
        id,
        levels.map(level => level.id)
      );
    }
    return of([]);
  }

  deleteJobOffer(id: string): Observable<any> {
    return this.jobControllerService._delete(id);
  }

  searchJobOffers(search: string = '', entryLevels: JobOfferEntryLevel[] = [], types: JobOfferType[] = []): Observable<JobOffer[]> {
    return this.jobControllerService.searchJobOffers(
      search,
      entryLevels?.map(level => level.entryLevel),
      types?.map(type => type.type)
    );
  }

  findAllJobsByCreator(id: string): Observable<JobOffer[]> {
    return this.jobControllerService.findAllJobsByCreator(id);
  }
}
