import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/core/interfaces/user';
import { AuthService } from 'src/app/core/services/api/strapi/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  user: any | undefined;

  constructor(
    private auth: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.auth.me().subscribe(_ => {
      this.user = {
        name: _.name,
        email: _.email
      }
    })
  }

  onSingOut(){
    this.auth.logOut().subscribe(_=>{
      this.router.navigate(['/login']);
      this.user = undefined;
    })
  }

  onDeleteAccount(){
    this.auth.logOut().subscribe(_ => {
      this.router.navigate(['/login']);
    })
    this.auth.deleteAccount(this.user!.id!).subscribe(_=> {
      this.user = undefined;
    })
  }

}
