import { Component } from '@angular/core';
import { UserService } from '@data/service/user.service';
import { Observable, of } from 'rxjs';
import { BriefUserProfile } from '@data/schema/user-service.types';
import { catchError, map } from 'rxjs/operators';
import { NotificationService } from '@shared/modules/notifications/notification.service';

@Component({
  selector: 'app-user-profile-overview-page',
  templateUrl: './user-profile-overview-page.component.html',
  styleUrls: ['./user-profile-overview-page.component.scss']
})
export class UserProfileOverviewPageComponent {
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
