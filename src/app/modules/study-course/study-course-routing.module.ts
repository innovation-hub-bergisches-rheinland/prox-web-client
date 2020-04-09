import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StudyCourseComponent } from './pages/study-course/study-course.component';
import { StudyCourseDetailsComponent } from './pages/study-course-details/study-course-details.component';

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
