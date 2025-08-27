export interface Weather {
  city: string;
  condition: 'sun' | 'rain' | 'cloud' | 'cold';
  high: number;
  low: number;
}
