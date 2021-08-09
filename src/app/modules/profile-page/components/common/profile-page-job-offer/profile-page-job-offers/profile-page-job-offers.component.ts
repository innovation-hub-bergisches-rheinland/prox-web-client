import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild
} from '@angular/core';
import { JobOffer } from '@data/schema/openapi/job-service/jobOffer';
import { forkJoin, from, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { JobService } from '@data/service/job.service';
import { MatTable, MatTableDataSource } from '@angular/material/table';

interface JobOfferTableData {
  id: string;
  title: string;
  startDate: string;
  types: string[];
  levels: string[];
}

@Component({
  selector: 'app-profile-page-job-offers',
  templateUrl: './profile-page-job-offers.component.html',
  styleUrls: ['./profile-page-job-offers.component.scss']
})
export class ProfilePageJobOffersComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['title', 'startDate', 'types', 'levels'];
  @Input()
  jobOffers: JobOffer[] = [];

  data: JobOfferTableData[] = [];
  dataSource = new MatTableDataSource<JobOfferTableData>(this.data);

  @ViewChild(MatTable) table: MatTable<any>;

  constructor(private jobService: JobService) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    from(this.jobOffers)
      .pipe(
        mergeMap((offer: JobOffer) =>
          forkJoin({
            jobOffer: of(offer),
            types: this.jobService.getTypesFromJobOffer(offer.id),
            levels: this.jobService.getEntryLevelsFromJobOffer(offer.id)
          })
        )
      )
      .subscribe({
        next: value =>
          this.data.push({
            id: value.jobOffer.id,
            title: value.jobOffer.title,
            startDate: this.formatDate(
              value.jobOffer.earliestStartOfEmployment
            ),
            types: value.types.map(type => type.description),
            levels: value.levels.map(level => level.description)
          }),
        error: err => console.error(err),
        complete: () => {
          this.table.renderRows();
        }
      });
  }

  formatDate(s: string): string {
    if (s) {
      const date = new Date(s);
      const ye = new Intl.DateTimeFormat('de', { year: 'numeric' }).format(
        date
      );
      const mo = new Intl.DateTimeFormat('de', { month: '2-digit' }).format(
        date
      );
      const da = new Intl.DateTimeFormat('de', { day: '2-digit' }).format(date);
      return `${da}.${mo}.${ye}`;
    }
    return null;
  }
}
