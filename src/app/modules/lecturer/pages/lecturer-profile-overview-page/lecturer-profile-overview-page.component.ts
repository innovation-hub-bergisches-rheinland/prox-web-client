import { Component } from '@angular/core';
import { UserService } from '@data/service/user.service';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { NotificationService } from '@shared/modules/notifications/notification.service';
import { BriefUserProfile } from '@data/schema/user-service.types';

@Component({
  selector: 'app-lecturer-profile-overview-page',
  templateUrl: './lecturer-profile-overview-page.component.html',
  styleUrls: ['./lecturer-profile-overview-page.component.scss']
})
export class LecturerProfileOverviewPageComponent {
  profiles$: Observable<BriefUserProfile[]>;

  constructor(private userService: UserService, private notificationService: NotificationService) {
    this.profiles$ = userService.getUserProfiles().pipe(
      map(p => p.profiles),
      catchError(err => {
        this.notificationService.error('Benutzerprofile konnten nicht geladen werden.');
        return of([]);
      })
    );
  }

  getAvatarUrl(id: string): string {
    return this.userService.getUserAvatar(id);
  }
}
