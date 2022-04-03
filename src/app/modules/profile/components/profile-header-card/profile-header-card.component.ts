import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

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

  @Input()
  roundedAvatar: boolean = true;

  @Input()
  tags: string[] = [];

  @Output()
  onEditClicked = new EventEmitter<MouseEvent>();

  constructor() {}

  ngOnInit(): void {}
}
