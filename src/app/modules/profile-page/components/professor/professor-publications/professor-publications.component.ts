import { Input, OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { Publication } from '@data/schema/openapi/professor-profile-service/models';

@Component({
  selector: 'app-professor-publications',
  templateUrl: './professor-publications.component.html',
  styleUrls: ['./professor-publications.component.scss'],
  host: { class: 'prof-publications' }
})
export class ProfessorPublicationsComponent implements OnInit {
  @Input()
  publications: Publication[];

  limit = 10;

  constructor() {}

  ngOnInit(): void {}
}
