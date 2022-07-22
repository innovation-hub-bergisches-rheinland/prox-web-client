import { NgModule } from '@angular/core';
import { FeatureDirective } from './feature.directive';

@NgModule({
  declarations: [FeatureDirective],
  exports: [FeatureDirective]
})
export class FeatureDirectiveModule {}
