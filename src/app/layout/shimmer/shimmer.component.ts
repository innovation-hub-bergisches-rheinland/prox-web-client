import { Component, OnInit } from '@angular/core';
import { ShimmerService } from '@layout/shimmer/shimmer.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-shimmer',
  templateUrl: './shimmer.component.html',
  styleUrls: ['./shimmer.component.scss']
})
export class ShimmerComponent implements OnInit {
  state$: Observable<boolean>;

  constructor(private shimmerService: ShimmerService) {
    this.state$ = shimmerService.state$;
  }

  ngOnInit(): void {}
}
