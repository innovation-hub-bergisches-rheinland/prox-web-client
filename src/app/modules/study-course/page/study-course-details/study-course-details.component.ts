import { Component, OnInit } from '@angular/core';

import { StudyCourse } from '@data/schema/study-course.resource';
import { StudyCourseService } from '@data/service/study-course.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-study-course-details',
  templateUrl: './study-course-details.component.html',
  styleUrls: ['./study-course-details.component.scss']
})
export class StudyCourseDetailsComponent implements OnInit {
  studyCourse: StudyCourse;
  studyCourseID: string;

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
