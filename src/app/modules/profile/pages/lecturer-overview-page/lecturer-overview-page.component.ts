import { Component, OnInit } from '@angular/core';
import { CompanyProfileService } from '@data/service/company-profile.service';
import { OverviewItem } from '@modules/profile/pages/overview-page/overview-page.component';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProfessorProfileService } from '@data/service/professor-profile.service';

@Component({
  selector: 'app-lecturer-overview-page',
  templateUrl: './lecturer-overview-page.component.html',
  styleUrls: ['./lecturer-overview-page.component.scss']
})
export class LecturerOverviewPageComponent implements OnInit {
  lecturers: Observable<OverviewItem[]>;

  constructor(private lecturerService: ProfessorProfileService) {}

  ngOnInit(): void {
    this.lecturers = this.lecturerService.getProfessorOverview().pipe(
      map(items =>
        items.map(item => ({
          avatar: this.lecturerService.getProfessorImageUrl(item.id),
          title: item.name,
          subtitle: item.faculty,
          numAvailableProjects: item.sumAvailableProjects,
          numFinishedProjects: item.sumFinishedProjects,
          numRunningProjects: item.sumRunningProjects,
          href: `/lecturers/${item.id}`
        }))
      )
    );
  }
}
