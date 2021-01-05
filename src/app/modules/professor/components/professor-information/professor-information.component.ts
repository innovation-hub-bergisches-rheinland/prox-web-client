import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { TextProcessor } from '@app/util/text-processor';
import { Professor } from '@data/schema/openapi/professor-profile-service/models';
import { ProfessorProfileService } from '@data/service/professor-profile.service';
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
  imgUrl: string;
  room: string;
  consultationHour: string;
  telephone: string;
  email: string;
  homepage: string;
  name: string;
  faculty: string;

  constructor(
    private professorProfileService: ProfessorProfileService,
    public textProcessor: TextProcessor
  ) {}

  ngOnInit(): void {
    this.professor$.subscribe(res => {
      this.professorProfileService.getProfessorImageUrl(res).subscribe(
        res2 => (this.imgUrl = res2),
        err => console.error(err)
      );
      this.professorProfileService.getProfessorFaculty(res.id).subscribe(
        res2 => (this.faculty = res2.name),
        err => console.error(err)
      );
      this.room = res.contactInformation.room;
      this.consultationHour = res.contactInformation.consultationHour;
      this.telephone = res.contactInformation.telephone;
      this.email = res.contactInformation.email;
      this.homepage = res.contactInformation.homepage;
      this.name = res.name;
    });
  }

  @Input()
  set professor(professor: Observable<Professor>) {
    this.professor$ = professor;
  }
}
