import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pages',
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule],
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'],
})
export class PagesComponent implements OnInit {
  constructor(private router: Router) {}
  showSplash = true;

  ngOnInit() {
    setTimeout(() => {
      this.showSplash = false;
      this.router.navigateByUrl('/pages/plan');
    }, 2000);
  }
}
