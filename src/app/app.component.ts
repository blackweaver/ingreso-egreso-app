import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ingresosEgresos';

  constructor(private authService: AuthService) {
    this.authService.initAuthListener().subscribe((res) => {
      console.log(res?.email);
      console.log(res?.uid);
    })
  }
}
