import { Component } from '@angular/core';
import { JobService } from '@data/service/job.service';
import { forkJoin, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { JobOfferEvent } from '@modules/jobs/components/job-offer-form/job-offer-form.component';
import { Router } from '@angular/router';
import { ToastService } from '@modules/toast/toast.service';

@Component({
  selector: 'app-job-creator',
  templateUrl: './job-creator.component.html',
  styleUrls: ['./job-creator.component.scss']
})
export class JobCreatorComponent {
  constructor(private jobService: JobService, private router: Router, private toastService: ToastService) {}

  // TODO refactor
  saveJobOffer(event: JobOfferEvent) {
    this.jobService
      .createJobOffer(event.jobOffer)
      .pipe(
        mergeMap(jobOffer =>
          forkJoin({
            jobOffer: of(jobOffer),
            types: this.jobService.setJobTypes(jobOffer.id, event.types ?? []),
            levels: this.jobService.setEntryLevels(jobOffer.id, event.levels ?? [])
          })
        )
      )
      .subscribe({
        next: value => {
          this.toastService.showToasts([
            {
              isError: false,
              message: 'Stellenangebot erfolgreich angelegt'
            }
          ]);
          this.router.navigate([`/jobs/${value.jobOffer.id}`]);
        },
        error: err => {
          this.toastService.showToasts([
            {
              isError: true,
              message: 'Das Stellenangebot konnte nicht gespeichert werden, bitte versuchen Sie es später erneut'
            }
          ]);
          console.error(err);
        }
      });
  }
}
