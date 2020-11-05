import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

import { HalOptions } from 'angular4-hal';

import { StudyCourse } from '@data/schema/study-course.resource';
import { StudyCourseService } from '@data/service/study-course.service';

@Component({
  selector: 'app-study-course',
  templateUrl: './study-course.component.html',
  styleUrls: ['./study-course.component.scss']
})
export class StudyCourseComponent implements OnInit {
  academicDegrees: string[] = [];
  filteredStudyCourses: StudyCourse[] = [];
  searchString = new FormControl('');
  selectedAcademicDegree = new FormControl('');

  private studyCourses: StudyCourse[] = [];

  constructor(
    private studyCourseService: StudyCourseService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.getAllStudyCourses();
  }

  filterStudyCourses() {
    this.filteredStudyCourses = this.studyCourses
      .filter(({ academicDegree }) =>
        this.selectedAcademicDegree.value
          ? academicDegree === this.selectedAcademicDegree.value
          : true
      )
      .filter(({ name }) =>
        this.searchString.value
          ? name.toLowerCase().includes(this.searchString.value.toLowerCase())
          : true
      );
  }

  private getAllStudyCourses() {
    const options: HalOptions = { sort: [{ path: 'name', order: 'ASC' }] };
    this.studyCourseService.getAllStudyCourses(options).subscribe(
      studyCourses => {
        this.studyCourses = studyCourses;
        this.filteredStudyCourses = this.studyCourses;
        this.fillAcademicDegrees();
      },
      error => {
        console.error('study course service error', error);
        this.openSnackBar(
          'Studiengänge konnten nicht geladen werden! Versuchen Sie es später noch mal.'
        );
      }
    );
  }

  private fillAcademicDegrees() {
    this.studyCourses.forEach(({ academicDegree }) => {
      if (!this.academicDegrees.includes(academicDegree)) {
        this.academicDegrees.push(academicDegree);
      }
    });
  }

  private openSnackBar(message: string) {
    this.snackBar.open(message, 'Verstanden');
  }
}
