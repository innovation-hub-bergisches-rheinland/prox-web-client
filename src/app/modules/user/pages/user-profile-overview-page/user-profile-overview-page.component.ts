import { Component } from '@angular/core';
import { UserService } from '@data/service/user.service';
import { Observable } from 'rxjs';
import { BriefUserProfile } from '@data/schema/user-service.types';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-user-profile-overview-page',
  templateUrl: './user-profile-overview-page.component.html',
  styleUrls: ['./user-profile-overview-page.component.scss']
})
export class UserProfileOverviewPageComponent {
  profiles$: Observable<BriefUserProfile[]>;

  constructor(private userService: UserService) {
    this.profiles$ = userService.getUserProfiles().pipe(map(p => p.profiles));
  }

  getAvatarUrl(id: string): string {
    return this.userService.getUserAvatar(id);
  }
}
