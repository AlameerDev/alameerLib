import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SampleComponent } from './sample.component';
import { SampleDirective } from './sample.directive';
import { SamplePipe } from './sample.pipe';
import { SampleService } from './sample.service';
import { ElmDatepickerComponent } from './ElmDatepicker.Component';

export * from './sample.component';
export * from './sample.directive';
export * from './sample.pipe';
export * from './sample.service';
export * from './ElmDatepicker.Component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [
    SampleComponent,
    SampleDirective,
    SamplePipe,
    ElmDatepickerComponent
  ],
  exports: [
    SampleComponent,
    SampleDirective,
    SamplePipe,
    ElmDatepickerComponent
  ]
})
export class ElmModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ElmModule,
      providers: [SampleService]
    };
  }
}
