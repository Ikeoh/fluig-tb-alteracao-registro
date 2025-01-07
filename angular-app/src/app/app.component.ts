import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  providers: [
    {
      provide: APP_BASE_HREF,
      useValue: '/portal/p/1/teste'
    }
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'fluig-tb-alteracao-registro-app';
}
