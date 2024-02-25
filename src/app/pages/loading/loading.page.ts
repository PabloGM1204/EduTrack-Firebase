import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/core/services/api/api.service';
import { AuthService } from 'src/app/core/services/api/strapi/auth.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.page.html',
  styleUrls: ['./loading.page.scss'],
})
export class LoadingPage implements OnInit {

  constructor(
    private apiSvc: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.apiSvc.isLogged$.subscribe();
    setTimeout(() => {
      this.router.navigate(['/home'])
    }, 3000)
  }

}
