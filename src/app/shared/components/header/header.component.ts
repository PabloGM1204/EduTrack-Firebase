import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/core/interfaces/user';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent  implements OnInit {
  
  @Input() user: User | undefined;
  constructor(
    private router: Router
  ) { }

  ngOnInit() {}

  onProfile(){
    this.router.navigate(['/profile'])
  }

}
