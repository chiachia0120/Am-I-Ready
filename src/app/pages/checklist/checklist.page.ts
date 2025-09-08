import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { pairwise, map, Observable, startWith, Subscription } from 'rxjs';
import { PlanService, WeatherService } from '../../../shared/services';
import { ChecklistItem } from '../../../shared/models/plan.models';
import { IonItemSliding } from '@ionic/angular';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  templateUrl: './checklist.page.html',
  styleUrls: ['./checklist.page.scss'],
})
export class ChecklistPage implements OnInit {
  showSorted = false;
  showMiniWeather = false;
  @ViewChild('weatherCard', { static: false }) weatherCard!: ElementRef;

  private allDoneSub?: Subscription;

  constructor(
    private planService: PlanService,
    private weatherService: WeatherService
  ) {}

  checklist: ChecklistItem[] = [];

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

  ngOnInit() {
    this.allDoneSub = this.allDone$
      .pipe(startWith(false), pairwise())
      .subscribe(([prev, curr]) => {
        if (!prev && curr) {
          this.showSorted = true;
          setTimeout(() => (this.showSorted = false), 3000);
        }
      });

    this.planService.state$.subscribe((s) => {
      this.checklist = s.checklist;
    });
  }

  ngOnDestroy() {
    this.allDoneSub?.unsubscribe();
  }

  toggleChecklistItem(item: ChecklistItem) {
    this.planService.toggleChecklistItem(item.id);
  }

  mapWeatherIcon(code: number): string {
    return `assets/icon/${code}.svg`;
  }

  onScroll() {
    const card = document.querySelector('.weather-footer') as HTMLElement;
    if (card) {
      const rect = card.getBoundingClientRect();
      this.showMiniWeather = rect.bottom <= 0;
    }
  }

  addItem(label: any) {
    const title = (label ?? '').toString().trim();
    if (!title) return;
    this.planService.addChecklistItem(title);
  }

  startEdit(item: ChecklistItem, slidingItem: IonItemSliding) {
    const checklist = this.planService['_state$'].value.checklist.map((i) =>
      i.id === item.id ? { ...i, editing: true } : i
    );
    this.planService['patch']({ checklist });
    slidingItem.close();
  }

  editItem(item: ChecklistItem, event: any) {
    const newValue = (event.target as HTMLInputElement).value ?? '';
    if (newValue.trim()) {
      item.label = newValue.trim();
    }
    item.editing = false;
  }

  deleteItem(item: ChecklistItem, slidingItem: IonItemSliding) {
    this.checklist = this.checklist.filter((i) => i.id !== item.id);
    slidingItem.close();
  }
}
