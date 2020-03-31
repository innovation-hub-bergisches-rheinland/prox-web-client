import { Component, OnInit } from '@angular/core';

import { StudyCourse } from '@data/schema/study-course.resource';
import { StudyCourseService } from '@data/service/study-course.service';
import { ActivatedRoute } from '@angular/router';
import { HalOptions, Sort } from 'angular4-hal';
import { Module } from '@data/schema/module.resource';
import { SortOrder } from 'angular4-hal/src/sort';
import { map } from 'rxjs/operators';

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
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => (this.studyCourseID = params.id));
    this.getStudyCourse();
  }

  private getStudyCourse() {
    this.studyCourseService.get(this.studyCourseID).subscribe(studyCourse => {
      this.studyCourse = studyCourse;
      studyCourse
        .getModules()
        .pipe(
          map(modules =>
            modules.sort((a, b) => {
              if (a.name < b.name) {
                return -1;
              }
              if (a.name > b.name) {
                return 1;
              }
              return 0;
            })
          )
        )
        .subscribe(modules => (studyCourse.modules = modules));
    });
  }
}
