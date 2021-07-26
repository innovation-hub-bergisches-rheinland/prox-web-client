import { Injectable, Injector } from '@angular/core';
import { JobOfferControllerService } from '@data/service/openapi/job-service/jobOfferController.service';
import { JobOffer } from '@data/schema/openapi/job-service/jobOffer';
import { Observable } from 'rxjs';
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

  getAllJobOffers(): Observable<JobOffer[]> {
    return this.jobControllerService.getAll().pipe(map(j => Array.from(j)));
  }

  getAllEntryLevels(): Observable<JobOfferEntryLevel[]> {
    return this.jobOfferEntryLevelService.getAll2();
  }

  getAllJobTypes(): Observable<JobOfferType[]> {
    return this.jobOfferTypeService.getAll1();
  }

  getTypesFromJobOffer(id: string): Observable<JobOfferType[]> {
    return this.jobControllerService.getTypes(id);
  }

  getEntryLevelsFromJobOffer(id: string): Observable<JobOfferEntryLevel[]> {
    return this.jobControllerService.getEntryLevels(id);
  }

  setJobTypes(id: string, types: JobOfferType[]): Observable<JobOfferType[]> {
    return this.jobControllerService.setTypes(
      id,
      types.map(type => type.id)
    );
  }

  setEntryLevels(
    id: string,
    levels: JobOfferEntryLevel[]
  ): Observable<JobOfferEntryLevel[]> {
    return this.jobControllerService.setEntryLevels(
      id,
      levels.map(level => level.id)
    );
  }
}
