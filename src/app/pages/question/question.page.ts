import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonicModule,
  LoadingController,
  ToastController,
} from '@ionic/angular';
import { UserPreferences } from '../../../shared/models';
import { UserPreferencesService } from '../../../shared/services';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  templateUrl: './question.page.html',
  styleUrls: ['./question.page.scss'],
})
export class QuestionPage implements OnInit {
  constructor(
    private prefService: UserPreferencesService,
    private loadingCtrl: LoadingController,
    private toast: ToastController
  ) {}
  preferences: UserPreferences = {};
  currentIndex = 0;

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
    { value: 2, label: 'Skip' },
  ];

  ngOnInit() {
    this.preferences = this.prefService.getPreferences() ?? {};
  }

  next() {
    if (this.currentIndex < this.questions.length - 1) {
      this.currentIndex++;
    }
  }

  prev() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  save() {
    if (this.preferences) {
      this.loadingCtrl
        .create({
          message: 'Saving your preferences...',
          spinner: 'crescent',
        })
        .then((loading) => {
          loading.present();

          this.prefService.setPreferences(this.preferences);

          setTimeout(() => {
            loading.dismiss();

            this.toast
              .create({
                message: 'Saved successfully!',
                duration: 1000,
                color: 'success',
                position: 'bottom',
              })
              .then((toast) => toast.present());
          }, 1000);
        });
    }
  }
}
