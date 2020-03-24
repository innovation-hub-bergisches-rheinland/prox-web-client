import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';

import { StudyCourseRoutingModule } from './study-course-routing.module';
import { StudyCourseComponent } from './page/study-course/study-course.component';
import { StudyCourseDetailsComponent } from './page/study-course-details/study-course-details.component';

@NgModule({
  declarations: [StudyCourseComponent, StudyCourseDetailsComponent],
  imports: [SharedModule, StudyCourseRoutingModule]
})
export class StudyCourseModule {}
