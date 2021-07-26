import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  AfterViewInit
} from '@angular/core';
import { JobOffer } from '@data/schema/openapi/job-service/jobOffer';
import { ProfessorProfileService } from '@data/service/professor-profile.service';
import { CompanyProfileService } from '@data/service/company-profile.service';
import { forkJoin, from, Observable, of } from 'rxjs';
import { JobService } from '@data/service/job.service';
import { filter, map, mergeMap } from 'rxjs/operators';
import { KeycloakService } from 'keycloak-angular';
import { MatDialog } from '@angular/material/dialog';
import { Project } from '@data/schema/openapi/project-service/project';
import { ConfirmDialogComponent } from '@modules/project/components/confirm-dialog/confirm-dialog.component';
import { ToastService } from '@modules/toast/toast.service';

@Component({
  selector: 'app-job-item',
  templateUrl: './job-item.component.html',
  styleUrls: ['./job-item.component.scss']
})
export class JobItemComponent implements OnInit, AfterViewInit {
  private _jobOffer: JobOffer;
  @Output() jobOfferDeleted = new EventEmitter<JobOffer>();
  creatorName$: Observable<string>;
  creatorLink$: Observable<string>;

  availableTypesAsString$: Observable<string[]>;
  availableEntryLevelsAsString$: Observable<string[]>;
  hasPermission$: Observable<boolean>;

  get jobOffer(): JobOffer {
    return this._jobOffer;
  }

  @Input()
  set jobOffer(jobOffer: JobOffer) {
    // TODO: otherwise throws error, because somehow null is set
    if (jobOffer) {
      this._jobOffer = jobOffer;
      this.setObservables();
    }
  }

  constructor(
    private professorService: ProfessorProfileService,
    private companyService: CompanyProfileService,
    private jobService: JobService,
    private keycloakService: KeycloakService,
    private dialog: MatDialog,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {}

  getFormattedDate(date: string): string {
    return new Intl.DateTimeFormat('de-DE').format(Date.parse(date));
  }

  private setObservables() {
    this.availableTypesAsString$ = this.jobService
      .getTypesFromJobOffer(this.jobOffer.id)
      .pipe(map(jobOfferTypes => jobOfferTypes.map(type => type.description)));
    this.availableEntryLevelsAsString$ = this.jobService
      .getEntryLevelsFromJobOffer(this.jobOffer.id)
      .pipe(
        map(jobOfferEntryLevels => jobOfferEntryLevels.map(o => o.description))
      );
    this.hasPermission$ = from(this.keycloakService.isLoggedIn()).pipe(
      map(isLoggedIn => {
        if (isLoggedIn) {
          return (
            (this.keycloakService.isUserInRole('professor') ||
              this.keycloakService.isUserInRole('company-manager')) &&
            this.jobOffer.createdBy.userId ===
              this.keycloakService.getKeycloakInstance().subject
          );
        }
        return false;
      })
    );
    this.setCreatorNameAndLink();
  }

  // TODO: refactor
  private setCreatorNameAndLink() {
    switch (this.jobOffer.createdBy.variant) {
      case 'PROFESSOR':
        this.professorService
          .getProfessorProfile(this.jobOffer.createdBy.userId)
          .subscribe(res => {
            this.creatorName$ = of(res.name);
            this.creatorLink$ = of(`/lecturers/${res.id}`);
          });
        break;
      case 'COMPANY':
        this.companyService
          .findCompanyByCreatorId(this.jobOffer.createdBy.userId)
          .subscribe(res => {
            this.creatorName$ = of(res.information.name);
            this.creatorLink$ = of(`/companies/${res.id}`);
          });
        break;
    }
  }

  // TODO emit event so that the overview can be refreshed
  private deleteJobOffer() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Löschen', message: 'Stellenangebot wirklich löschen?' }
    });

    dialogRef
      .afterClosed()
      .pipe(
        filter(res => res === true),
        mergeMap(_ => this.jobService.deleteJobOffer(this.jobOffer.id))
      )
      .subscribe({
        next: () => {
          this.toastService.showToasts([
            {
              message: 'Stellenangebot erfolgreich gelöscht',
              isError: false
            }
          ]);
          this.jobOfferDeleted.emit(this.jobOffer);
        },
        error: err => {
          this.toastService.showToasts([
            {
              message:
                'Das Stellenangebot konnte nicht gelöscht werden. Bitte versuchen Sie es später erneut',
              isError: true
            }
          ]);
          console.error(err);
        }
      });
  }
}
