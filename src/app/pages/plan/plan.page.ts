import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import {
  PlanService,
  WeatherService,
  GeminiService,
  UserPreferencesService,
} from '../../../shared/services';
import { Observable } from 'rxjs';
import { PlanState, PlanItem } from '../../../shared/models';
import { take, map } from 'rxjs/operators';
import { mapWeatherCode } from '../../../shared/utils/weather-mapper';
import { LoadingController } from '@ionic/angular';
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
    private loadingCtrl: LoadingController,
    private planService: PlanService,
    private toast: ToastController,
    private router: Router,
    private weatherService: WeatherService,
    private geminiService: GeminiService,
    private prefService: UserPreferencesService
  ) {
    this.state$ = this.planService.state$;
  }

  get preferences() {
    return this.prefService.getPreferences();
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
    this.activities$.pipe(take(1)).subscribe(async (activities) => {
      const selectedPlans = activities.filter((a) => a.selected);
      if (selectedPlans.length === 0) {
        this.toast
          .create({
            message: 'No plan selected!',
            duration: 1000,
          })
          .then((t) => t.present());
        return;
      }

      const loading = await this.loadingCtrl.create({
        message: 'Generating checklist...',
        spinner: 'circles',
      });
      await loading.present();

      const prefs = this.preferences;
      let filteredPrefs: Record<string, string> | null = null;

      if (prefs) {
        filteredPrefs = Object.entries(prefs).reduce((acc, [key, value]) => {
          if (value !== 2) {
            acc[key] = value === 0 ? 'Yes' : 'No';
          }
          return acc;
        }, {} as Record<string, string>);
      }

      this.weatherService.getWeather().subscribe({
        next: async (weather) => {
          const weatherData = {
            temperature_now: weather.current_weather.temperature,
            temperature_max: weather.daily.temperature_2m_max[0],
            temperature_min: weather.daily.temperature_2m_min[0],
            description: mapWeatherCode(weather.current_weather.weathercode),
            weatherCode: weather.current_weather.weathercode,
            windspeed: weather.current_weather.windspeed,
            is_day: weather.current_weather.is_day,
          };

          this.planService.setWeather(weatherData);

          const payload = {
            plans: selectedPlans.map((p) => p.title),
            weather: weatherData,
            preferences: filteredPrefs,
          };

          try {
            const checklist = await this.geminiService.generateChecklist(
              payload
            );
            this.planService.setChecklist(checklist);

            this.toast
              .create({ message: 'Checklist generated!', duration: 1000 })
              .then((t) => t.present());
            this.router.navigateByUrl('/pages/checklist');
          } catch (err) {
            this.toast
              .create({
                message: 'Failed to generate checklist',
                duration: 1500,
              })
              .then((t) => t.present());
          } finally {
            loading.dismiss();
          }
        },
        error: async () => {
          loading.dismiss();
          this.toast
            .create({ message: 'Failed to fetch weather', duration: 1500 })
            .then((t) => t.present());
        },
      });
    });
  }
}
