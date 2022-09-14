import { ReplaceLineBreaksPipe } from './replaceLineBreaks.pipe';
import { NgModule } from '@angular/core';
import { HtmlToPlaintextPipe } from './htmlToPlaintext.pipe';

@NgModule({
  declarations: [
    ReplaceLineBreaksPipe,
    HtmlToPlaintextPipe
  ],
  exports: [
    ReplaceLineBreaksPipe,
    HtmlToPlaintextPipe
  ]
})
export class SharedPipesModule { }
