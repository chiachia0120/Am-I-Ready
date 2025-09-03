import { Injectable } from '@angular/core';
import { UserPreferences } from '../models';

const KEY = 'user_preferences';

@Injectable({
  providedIn: 'root',
})
export class UserPreferencesService {
  constructor() {}

  setPreferences(pref: UserPreferences) {
    localStorage.setItem(KEY, JSON.stringify(pref));
  }

  getPreferences(): UserPreferences | null {
    const saved = localStorage.getItem(KEY);
    return saved ? JSON.parse(saved) : null;
  }

  clearPreferences() {
    localStorage.removeItem(KEY);
  }
}
