import { Component } from '@angular/core';
import { ProfileService } from '@data/service/profile.service';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { NotificationService } from '@shared/modules/notifications/notification.service';
import { Lecturer } from '@data/schema/profile.types';

@Component({
  selector: 'app-lecturer-profile-overview-page',
  templateUrl: './lecturer-profile-overview-page.component.html',
  styleUrls: ['./lecturer-profile-overview-page.component.scss']
})
export class LecturerProfileOverviewPageComponent {
  profiles$: Observable<Lecturer[]>;

  constructor(private userService: ProfileService, private notificationService: NotificationService) {
    this.profiles$ = userService.getLecturersAsArray().pipe(
      catchError(err => {
        this.notificationService.error('Benutzerprofile konnten nicht geladen werden.');
        return of([]);
      })
    );
  }
}
