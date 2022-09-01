import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { FeatureService } from '@app/service/feature.service';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[feature]'
})
export class FeatureDirective implements OnInit {
  @Input() feature: string;

  constructor(private tpl: TemplateRef<any>, private vcr: ViewContainerRef, private featureService: FeatureService) {}

  ngOnInit() {
    const isEnabled = this.featureService.isEnabled(this.feature);
    if (isEnabled) {
      this.vcr.createEmbeddedView(this.tpl);
    }
  }
}
