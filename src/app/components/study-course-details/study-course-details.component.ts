import { Component, OnInit } from '@angular/core';
import { StudyCourse } from '@prox/shared/hal-resources';
import { StudyCourseService } from '@prox/core/services';
import { ActivatedRoute } from '@angular/router';
import { UUID } from 'angular2-uuid';

@Component({
  selector: 'prox-module-detail',
  templateUrl: './study-course-details.component.html',
  styleUrls: ['./study-course-details.component.scss']
})
export class StudyCourseDetailsComponent implements OnInit {
  studyCourse: StudyCourse;
  studyCourseID: UUID;

  constructor(
    private studyCourseService: StudyCourseService,
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe(params => (this.studyCourseID = params.id));
  }

  ngOnInit() {
    this.getStudyCourse();
  }

  private getStudyCourse() {
    this.studyCourseService.get(this.studyCourseID).subscribe(studyCourse => {
      this.studyCourse = studyCourse;
      this.studyCourse.getAndSetModuleArray().then();
    });
  }
}
