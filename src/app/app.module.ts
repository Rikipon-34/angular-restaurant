import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [],
  imports: [CommonModule, HttpClientModule],
  exports: [RouterModule],
  providers: [HttpClientModule],
  bootstrap: [],
})
export class AppModule {}
