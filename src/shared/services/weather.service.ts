import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WeatherService {
  // default London
  cityName: string = 'London';
  private currentLocation = { lat: 51.5072, lon: -0.1276 };
  constructor(private http: HttpClient) {}

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
          console.warn(
            'Failed to retrieve location, using default city London',
            err
          );
        }
      );
    } else {
      console.warn(
        'Browser does not support geolocation, using default city London'
      );
    }
  }

  // Call Open-Meteo Geocoding API to get city name
  getCityName(lat: number, lon: number) {
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;
    this.http.get(url).subscribe((res: any) => {
      this.cityName = res.city || res.locality;
      console.log('City:', this.cityName);
    });
  }

  // Call Open-Meteo API
  getWeather(): Observable<any> {
    const { lat, lon } = this.currentLocation;
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min&timezone=GMT`;
    return this.http.get(url);
  }
}
