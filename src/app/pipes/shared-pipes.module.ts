import { ReplaceLineBreaksPipe } from './replaceLineBreaks.pipe';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [
    ReplaceLineBreaksPipe
  ],
  exports: [
    ReplaceLineBreaksPipe
  ]
})
export class SharedPipesModule { }
