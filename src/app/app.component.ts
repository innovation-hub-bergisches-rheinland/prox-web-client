import { Component, OnInit } from '@angular/core';
import { LoggerService } from '@shared/modules/logger/logger.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private logger: LoggerService) {}

  ngOnInit(): void {
    this.logger.info('Initialized Application');
  }
}
