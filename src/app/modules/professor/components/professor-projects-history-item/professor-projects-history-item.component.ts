import {
  Component,
  OnInit,
  Input,
  HostBinding,
  ChangeDetectionStrategy,
  OnChanges,
  SimpleChanges,
  ChangeDetectorRef,
  AfterViewInit
} from '@angular/core';
import {
  trigger,
  state,
  style,
  transition,
  animate,
  AnimationEvent
} from '@angular/animations';
import { Project } from '@data/schema/project.resource';

@Component({
  selector: 'app-professor-projects-history-item',
  templateUrl: './professor-projects-history-item.component.html',
  styleUrls: ['./professor-projects-history-item.component.scss'],
  animations: [
    trigger('translateSlide', [
      state('center, void', style({ transform: 'none' })),
      state('left', style({ transform: 'translate3D(-100%, 0, 0)' })),
      state('right', style({ transform: 'translate3D(100%, 0, 0)' })),
      transition(
        '* => left, * => right, left => center, right => center',
        animate('500ms cubic-bezier(0.35, 0, 0.25, 1)')
      )
    ])
  ]
})
export class ProfessorProjectsHistoryItemComponent implements OnInit {
  _position;
  _positionIndex;
  _displayContent = false;
  _project: Project;

  @Input()
  set project(project: Project) {
    this._project = project;
  }

  @Input()
  set position(positionValue: number) {
    this._positionIndex = positionValue;
    this.computePosition();
  }

  get activeClass() {
    return this._positionIndex === 0;
  }

  get className(): string {
    return this.activeClass
      ? 'slider-content-item-active'
      : 'slider-content-item';
  }

  constructor() {}

  ngOnInit() {
    this.computePosition();
  }

  computePosition() {
    if (this._positionIndex < 0) {
      this._position = 'left';
    } else if (this._positionIndex > 0) {
      this._position = 'right';
    } else {
      this._position = 'center';
    }
  }

  onTranslateSlideStart(event: AnimationEvent) {
    if (event.toState === 'center') {
      this._displayContent = true;
    }
  }

  onTranslateSlideEnd(event: AnimationEvent) {
    if (event.fromState === 'center' && event.toState !== 'center') {
      this._displayContent = false;
    }
  }
}
