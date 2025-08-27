// weather.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WeatherService {
  cityName: string = 'London'; // 預設城市
  constructor(private http: HttpClient) {}

  // default London
  private currentLocation = { lat: 51.5072, lon: -0.1276 };

  initLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          this.currentLocation = {
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
          };
          console.log('User location set:', this.currentLocation);

          this.getCityName(this.currentLocation.lat, this.currentLocation.lon);
        },
        (err) => {
          console.warn('定位失敗，使用預設倫敦:', err);
        }
      );
    } else {
      console.warn('瀏覽器不支援 geolocation，使用預設倫敦');
    }
  }

  // 呼叫 Open-Meteo Geocoding API 轉城市名稱
  getCityName(lat: number, lon: number) {
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;
    this.http.get(url).subscribe((res: any) => {
      this.cityName = res.city || res.locality;
      console.log('City:', this.cityName);
    });
  }

  // 呼叫 Open-Meteo API
  getWeather(): Observable<any> {
    const { lat, lon } = this.currentLocation;
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min&timezone=GMT`;
    return this.http.get(url);
  }
}
