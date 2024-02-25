import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/core/services/api/api.service';
import { AuthService } from 'src/app/core/services/api/strapi/auth.service';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.page.html',
  styleUrls: ['./loading.page.scss'],
})
export class LoadingPage implements OnInit {

  constructor(
    private apiSvc: AuthService,
    private router: Router,
    private screen: ScreenOrientation
  ) { }

  ngOnInit() {
    this.screen.lock(this.screen.ORIENTATIONS.LANDSCAPE)
    this.apiSvc.isLogged$.subscribe();
    setTimeout(() => {
      this.router.navigate(['/home'])
    }, 3000)
  }

}
