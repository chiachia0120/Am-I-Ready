export interface PlanItem {
  id: string;
  title: string;
  selected: boolean;
  pinned?: boolean;
}

export interface ChecklistItem {
  id: string;
  label: string;
  selected: boolean;
  icon?: string;
  custom?: boolean; // true = 使用者新增
  editing?: boolean; // true = 編輯中
}

export interface PlanState {
  dateISO: string;
  activities: PlanItem[];
  checklist: ChecklistItem[];
  weather?: {
    temperature_now: number;
    temperature_max: number;
    temperature_min: number;
    description: string;
    weatherCode: string;
  };
  generatedAt?: string | null;
}
