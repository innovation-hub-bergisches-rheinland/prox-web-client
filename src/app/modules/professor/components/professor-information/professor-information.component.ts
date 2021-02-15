import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { TextProcessor } from '@app/util/text-processor';
import {
  Faculty,
  Professor
} from '@data/schema/openapi/professor-profile-service/models';
import { ProfessorProfileService } from '@data/service/professor-profile.service';
import { of } from 'rxjs';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-professor-information',
  templateUrl: './professor-information.component.html',
  styleUrls: ['./professor-information.component.scss'],
  host: { class: 'prof-information' }
})
export class ProfessorInformationComponent implements OnInit {
  professor$: Observable<Professor>;
  prof: Professor;
  imgUrl: string;
  faculty: Faculty;

  constructor(
    private professorProfileService: ProfessorProfileService,
    public textProcessor: TextProcessor
  ) {}

  ngOnInit(): void {
    this.professor$.subscribe(res => {
      this.prof = res;
      this.professorProfileService.getProfessorImageUrl(res.id).subscribe(
        res2 => (this.imgUrl = res2),
        err => console.error(err)
      );
      this.professorProfileService.getProfessorFaculty(res.id).subscribe(
        res2 => (this.faculty = res2),
        err => console.error(err)
      );
    });
  }

  @Input()
  set professor(professor: Professor) {
    this.professor$ = of(professor);
  }
}
