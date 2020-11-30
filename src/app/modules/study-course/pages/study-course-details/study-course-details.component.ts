import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { map } from 'rxjs/operators';

import { StudyCourse } from '@data/schema/study-course.resource';
import { StudyCourseService } from '@data/service/study-course.service';

@Component({
  selector: 'app-study-course-details',
  templateUrl: './study-course-details.component.html',
  styleUrls: ['./study-course-details.component.scss']
})
export class StudyCourseDetailsComponent implements OnInit {
  studyCourse: StudyCourse;

  constructor(
    private studyCourseService: StudyCourseService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const studyCourseID = this.route.snapshot.paramMap.get('id');
    this.getStudyCourse(studyCourseID);
  }

  private getStudyCourse(id: string) {
    this.studyCourseService.getStudyCourse(id).subscribe(studyCourse => {
      this.studyCourse = studyCourse;
      this.getModules();
    });
  }

  private getModules() {
    this.studyCourseService
      .findModulesOfStudyCourse(this.studyCourse.id)
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
      .subscribe(modules => {
        this.studyCourse.modules = modules;
      });
  }
}
