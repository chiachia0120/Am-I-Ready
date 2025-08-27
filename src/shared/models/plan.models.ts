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
  required?: boolean;
  icon: string;
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
