import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NotificationService } from '@shared/modules/notifications/notification.service';
import { PageEvent } from '@angular/material/paginator';
import { ProfileSearch } from '@modules/profile/components/profile-search-panel/profile-search-panel.component';
import { LecturerService } from '@data/service/lecturer.service';
import { LecturerList } from '@data/schema/lecturer.types';

@Component({
  selector: 'app-lecturer-profile-overview-page',
  templateUrl: './lecturer-profile-overview-page.component.html',
  styleUrls: ['./lecturer-profile-overview-page.component.scss']
})
export class LecturerProfileOverviewPageComponent {
  activeProfilePage$: Observable<LecturerList>;

  constructor(private lecturerService: LecturerService, private notificationService: NotificationService) {
    this.activeProfilePage$ = lecturerService.getLecturers().pipe(
      catchError(err => {
        this.notificationService.error('Benutzerprofile konnten nicht geladen werden.');
        throw err;
      })
    );
  }

  handlePageEvent(event: PageEvent) {
    this.activeProfilePage$ = this.lecturerService.getLecturers({
      page: event.pageIndex,
      size: event.pageSize
    });
  }

  onSearch(event: ProfileSearch) {
    this.activeProfilePage$ = this.lecturerService.filterLecturers(event.txt);
  }
}
