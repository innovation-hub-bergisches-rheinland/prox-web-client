import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import {
  trigger,
  state,
  style,
  transition,
  animate,
  AnimationEvent
} from '@angular/animations';
import { ProjectHistoryItem } from '@modules/profile/components/profile-project-history/profile-project-history-item/types';

@Component({
  selector: 'app-profile-project-history-item',
  templateUrl: './profile-project-history-item.component.html',
  styleUrls: ['./profile-project-history-item.component.scss'],
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
  ],
  changeDetection: ChangeDetectionStrategy.OnPush // Prevent ExpressionChangedAfterItHasBeenCheckedError by manual pushing changes
})
export class ProfileProjectHistoryItemComponent implements OnInit {
  _position;
  _positionIndex;
  _displayContent = false;
  _project: ProjectHistoryItem;

  constructor(private cd: ChangeDetectorRef) {}

  @Input()
  set project(project: ProjectHistoryItem) {
    this._project = project;

    this.cd.detectChanges(); // Change
  }

  @Input()
  set position(positionValue: number) {
    this._positionIndex = positionValue;
    this.computePosition();

    this.cd.detectChanges(); // Change
  }

  get activeClass() {
    return this._positionIndex === 0;
  }

  get className(): string {
    return this.activeClass
      ? 'slider-content-item-active'
      : 'slider-content-item';
  }

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

    this.cd.detectChanges(); // Change
  }

  onTranslateSlideStart(event: AnimationEvent) {
    if (event.toState === 'center') {
      this._displayContent = true;
    }

    this.cd.detectChanges(); // Change
  }

  onTranslateSlideEnd(event: AnimationEvent) {
    if (event.fromState === 'center' && event.toState !== 'center') {
      this._displayContent = false;
    }

    this.cd.detectChanges(); // Change
  }
}
