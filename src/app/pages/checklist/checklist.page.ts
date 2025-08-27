import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { map, Observable } from 'rxjs';
import { PlanService, WeatherService } from '../../../shared/services';
import { ChecklistItem } from '../../../shared/models/plan.models';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  templateUrl: './checklist.page.html',
  styleUrls: ['./checklist.page.scss'],
})
export class ChecklistPage implements OnInit {
  showSorted = false;
  constructor(
    private planService: PlanService,
    private weatherService: WeatherService
  ) {}

  get checklist$(): Observable<ChecklistItem[]> {
    return this.planService.state$.pipe(map((s) => s.checklist));
  }

  get weather$(): Observable<any> {
    return this.planService.state$.pipe(map((s) => s.weather));
  }

  get cityName(): string {
    return this.weatherService.cityName;
  }
  get progress$(): Observable<number> {
    return this.planService.state$.pipe(
      map((s) => {
        const list = s.checklist ?? [];
        if (!list || list.length === 0) return 0;
        console.log('list :>> ', list);
        const done = list.filter((i) => i.selected).length;
        return done / list.length;
      })
    );
  }

  get allDone$(): Observable<boolean> {
    return this.planService.state$.pipe(
      map((s) => s.checklist.length > 0 && s.checklist.every((i) => i.selected))
    );
  }

  ngOnInit() {}

  toggleChecklistItem(item: ChecklistItem) {
    this.planService.toggleChecklistItem(item.id);
    this.allDone$.subscribe((all) => {
      if (all) {
        this.showSorted = true;

        // 可選：幾秒後自動關閉
        setTimeout(() => (this.showSorted = false), 2000);
      }
    });
  }

  mapWeatherIcon(code: number): string {
    return `assets/icon/${code}.svg`;
  }
}
