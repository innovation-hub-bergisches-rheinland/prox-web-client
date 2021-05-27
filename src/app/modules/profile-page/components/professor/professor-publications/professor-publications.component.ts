import { Input, OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { TextProcessor } from '@app/util/text-processor';
import {
  Professor,
  Publication
} from '@data/schema/openapi/professor-profile-service/models';
import { of } from 'rxjs';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-professor-publications',
  templateUrl: './professor-publications.component.html',
  styleUrls: ['./professor-publications.component.scss'],
  host: { class: 'prof-publications' }
})
export class ProfessorPublicationsComponent implements OnInit {
  @Input()
  publications: Publication[];

  constructor(public textProcessor: TextProcessor) {}

  ngOnInit(): void {}
}
