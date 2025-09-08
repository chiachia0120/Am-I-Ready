import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { v4 as uuid } from 'uuid';
import { PlanItem, ChecklistItem, PlanState } from '../models';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class PlanService {
  private readonly _state$ = new BehaviorSubject<PlanState>({
    dateISO: new Date().toISOString().slice(0, 10),
    activities: [
      { id: uuid(), title: 'Go to work', selected: false },
      { id: uuid(), title: 'Go to school', selected: false },
      { id: uuid(), title: 'Do exercise', selected: false },
      { id: uuid(), title: 'Go shopping', selected: false },
      { id: uuid(), title: 'Meet someone', selected: false },
    ],
    checklist: [],
    generatedAt: null,
  });

  readonly state$ = this._state$.asObservable();
  private lastRemoved: PlanItem | null = null;

  constructor(private store: StorageService) {
    this.restore();
  }

  private async restore() {
    const saved = await this.store.get<PlanState>('FALSE');
    if (saved) {
      this._state$.next(saved);
    } else {
      const defaults: PlanState = {
        dateISO: new Date().toISOString().slice(0, 10),
        activities: [
          { id: uuid(), title: 'Go to work', selected: false },
          { id: uuid(), title: 'Go to school', selected: false },
          { id: uuid(), title: 'Do exercise', selected: false },
          { id: uuid(), title: 'Go shopping', selected: false },
          { id: uuid(), title: 'Meet someone', selected: false },
        ],
        checklist: [],
        generatedAt: null,
      };
      this._state$.next(defaults);
      this.persist();
    }
  }

  private persist() {
    this.store.set('FALSE', this._state$.value);
  }

  private patch(p: Partial<PlanState>) {
    this._state$.next({ ...this._state$.value, ...p });
    this.persist();
  }

  get plans$() {
    return this._state$.asObservable().pipe(map((s) => s.activities));
  }

  addActivity(title: string) {
    const item: PlanItem = { id: uuid(), title: title.trim(), selected: false };
    if (!item.title) return;
    this.patch({ activities: [...this._state$.value.activities, item] });
  }

  toggleActivity(id: string) {
    const activities = this._state$.value.activities.map((a) =>
      a.id === id ? { ...a, selected: !a.selected } : a
    );
    this.patch({ activities });
  }

  removeActivity(id: string) {
    const current = this._state$.value;
    const itemToRemove = current.activities.find((a) => a.id === id) || null;

    if (itemToRemove) {
      this.lastRemoved = itemToRemove;
    }

    this._state$.next({
      ...current,
      activities: current.activities.filter((a) => a.id !== id),
    });
  }

  restoreActivity(id: string) {
    if (!this.lastRemoved) return;

    const current = this._state$.value;
    this._state$.next({
      ...current,
      activities: [...current.activities, this.lastRemoved],
    });

    this.lastRemoved = null;
  }

  setChecklist(items: { label: string; icon: string }[]) {
    const checklist: ChecklistItem[] = items.map((item) => ({
      id: uuid(),
      label: item.label,
      icon: item.icon,
      selected: false,
      required: false,
    }));

    this.patch({ checklist, generatedAt: new Date().toISOString() });
  }

  toggleChecklistItem(id: string) {
    const checklist = this._state$.value.checklist.map((c) =>
      c.id === id ? { ...c, selected: !c.selected } : c
    );
    this.patch({ checklist });
  }

  addChecklistItem(label: string) {
    const current = this._state$.value;
    const newItem: ChecklistItem = {
      id: crypto.randomUUID(),
      label: label.trim(),
      selected: false,
      icon: 'create-outline',
      custom: true,
    };
    this._state$.next({
      ...current,
      checklist: [...current.checklist, newItem],
    });
  }

  clearChecklist() {
    this.patch({ checklist: [], generatedAt: null });
  }

  setWeather(weather: any) {
    this.patch({ weather });
  }
}
