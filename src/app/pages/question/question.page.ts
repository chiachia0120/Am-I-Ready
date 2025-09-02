import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { UserPreferences } from '../../../shared/models';
import { UserPreferencesService } from '../../../shared/services';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  templateUrl: './question.page.html',
  styleUrls: ['./question.page.scss'],
})
export class QuestionPage implements OnInit {
  constructor(private prefService: UserPreferencesService) {}
  preferences: UserPreferences = {};

  questions: { key: keyof UserPreferences; label: string }[] = [
    {
      key: 'needsStudyOrWork',
      label:
        'Do you usually need to bring study or work materials when going out?',
    },
    {
      key: 'preparesForOthers',
      label:
        'Do you usually need to prepare for someone else when going out (for example, children, pets, or others)?',
    },
    {
      key: 'carriesMedicineOrSnacks',
      label: 'Do you usually carry medication or snacks with you?',
    },
    {
      key: 'carryStyle',
      label:
        'Do you prefer to bring many things “just in case”, or only essentials?',
    },
    {
      key: 'sensitiveToNoise',
      label: 'Do you feel sensitive to loud sounds or noisy environments?',
    },
  ];

  options = [
    { value: 0, label: 'Yes' },
    { value: 1, label: 'No' },
    { value: 2, label: 'Prefer not to say' },
  ];

  ngOnInit() {
    this.preferences = this.prefService.getPreferences() ?? {};
  }

  save() {
    if (this.preferences) {
      this.prefService.setPreferences(this.preferences);
      console.log('Preferences saved:', this.preferences);
    }
  }
}
