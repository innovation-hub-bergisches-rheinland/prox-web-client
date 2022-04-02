import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile-header-card',
  templateUrl: './profile-header-card.component.html',
  styleUrls: ['./profile-header-card.component.scss']
})
export class ProfileHeaderCardComponent implements OnInit {
  @Input()
  title: string;

  @Input()
  imageSrc: string;

  @Input()
  showEdit: boolean;

  constructor() {}

  ngOnInit(): void {}
}
