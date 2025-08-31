import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import {
  PlanService,
  WeatherService,
  GeminiService,
} from '../../../shared/services';
import { Observable } from 'rxjs';
import { PlanState, PlanItem } from '../../../shared/models';
import { take, map } from 'rxjs/operators';
import { mapWeatherCode } from '../../../shared/utils/weather-mapper';

@Component({
  selector: 'app-plan',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  templateUrl: './plan.page.html',
  styleUrls: ['./plan.page.scss'],
})
export class PlanPage implements OnInit {
  newTitle = '';
  state$: Observable<PlanState>;
  selectedCount$!: Observable<number>;
  activities$!: Observable<PlanItem[]>;
  constructor(
    private planService: PlanService,
    private toast: ToastController,
    private router: Router,
    private weatherService: WeatherService,
    private geminiService: GeminiService
  ) {
    this.state$ = this.planService.state$;
  }

  ngOnInit() {
    this.activities$ = this.planService.plans$;
    this.selectedCount$ = this.activities$.pipe(
      map((list) => (list ?? []).filter((a) => a.selected).length)
    );
    this.weatherService.initLocation();
  }

  addActivity(value: any) {
    const title = (value ?? '').toString().trim();
    if (!title) return;
    this.planService.addActivity(title);
  }

  toggleActivity(item: PlanItem) {
    this.planService.toggleActivity(item.id);
  }

  removeActivity(item: PlanItem) {
    this.planService.removeActivity(item.id);
  }

  generateChecklist() {
    this.activities$.pipe(take(1)).subscribe((activities) => {
      const selectedPlans = activities.filter((a) => a.selected);
      console.log('Selected Plans:', selectedPlans);

      if (selectedPlans.length === 0) {
        this.toast
          .create({
            message: 'No plan selected!',
            duration: 1000,
          })
          .then((t) => t.present());
        return;
      }

      this.weatherService.getWeather().subscribe(async (weather) => {
        console.log('Weather info:', weather);
        console.log('Selected plans:', selectedPlans);

        const weatherData = {
          temperature_now: weather.current_weather.temperature,
          temperature_max: weather.daily.temperature_2m_max[0],
          temperature_min: weather.daily.temperature_2m_min[0],
          description: mapWeatherCode(weather.current_weather.weathercode),
          weatherCode: weather.current_weather.weathercode,
          windspeed: weather.current_weather.windspeed,
          is_day: weather.current_weather.is_day,
          // icon: this.mapWeatherIcon(weather.current_weather.weathercode)
        };

        this.planService.setWeather(weatherData);

        const payload = {
          plans: selectedPlans.map((p) => p.title),
          weather: weatherData,
        };

        console.log('payload :>> ', payload);
        // this.geminiService.generateChecklist(payload).then((checklist) => {
        //   console.log('Checklist:', checklist);

        //   // 存進 PlanService
        //   this.planService.setChecklist(checklist);

        //   // 顯示提示
        //   this.toast
        //     .create({
        //       message: 'Checklist generated!',
        //       duration: 1000,
        //     })
        //     .then((t) => t.present());

        //   // 跳轉到 checklist 頁面
        //   this.router.navigateByUrl('/pages/checklist');
        // });
      });
    });
  }
}
