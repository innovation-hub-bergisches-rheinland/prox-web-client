import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-shimmer',
  templateUrl: './shimmer.component.html',
  styleUrls: ['./shimmer.component.scss']
})
export class ShimmerComponent implements OnInit {
  @Input()
  active = false;

  constructor() {}

  ngOnInit(): void {}
}
