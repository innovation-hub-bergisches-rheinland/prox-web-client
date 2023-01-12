import { Component } from '@angular/core';
import { ProfileService } from '@data/service/profile.service';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NotificationService } from '@shared/modules/notifications/notification.service';
import { LecturerList } from '@data/schema/profile.types';
import { PageEvent } from '@angular/material/paginator';
import { ProfileSearch } from '@modules/profile/components/profile-search-panel/profile-search-panel.component';

@Component({
  selector: 'app-lecturer-profile-overview-page',
  templateUrl: './lecturer-profile-overview-page.component.html',
  styleUrls: ['./lecturer-profile-overview-page.component.scss']
})
export class LecturerProfileOverviewPageComponent {
  activeProfilePage$: Observable<LecturerList>;

  constructor(private userService: ProfileService, private notificationService: NotificationService) {
    this.activeProfilePage$ = userService.getLecturers().pipe(
      catchError(err => {
        this.notificationService.error('Benutzerprofile konnten nicht geladen werden.');
        throw err;
      })
    );
  }

  handlePageEvent(event: PageEvent) {
    this.activeProfilePage$ = this.userService.getLecturers({
      page: event.pageIndex,
      size: event.pageSize
    });
  }

  onSearch(event: ProfileSearch) {
    this.activeProfilePage$ = this.userService.filterLecturers(event.txt, event.tags);
  }
}
