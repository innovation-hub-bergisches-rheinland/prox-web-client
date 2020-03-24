import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StudyCourseComponent } from './page/study-course/study-course.component';
import { StudyCourseDetailsComponent } from './page/study-course-details/study-course-details.component';

const routes: Routes = [
  {
    path: '',
    component: StudyCourseComponent
  },
  {
    path: ':id',
    component: StudyCourseDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudyCourseRoutingModule {}
