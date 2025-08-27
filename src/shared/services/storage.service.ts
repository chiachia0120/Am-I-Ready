import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({ providedIn: 'root' })
export class StorageService {
  async set<T>(key: string, value: T) {
    await Preferences.set({ key, value: JSON.stringify(value) });
  }
  async get<T>(key: string): Promise<T | null> {
    const { value } = await Preferences.get({ key });
    return value ? (JSON.parse(value) as T) : null;
  }
  async remove(key: string) {
    await Preferences.remove({ key });
  }
}
