import { CurrencyPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

export interface StatCardConfig {
  label: string;
  value: string | number;
  icon: string;
  cssClass?: string; // Pro speciální barvy jako 'gold'
  suffix?: string; // Např. 'Kč'
}

@Component({
  selector: 'app-statistic-card',
  imports: [MatIconModule, CurrencyPipe],
  templateUrl: './statistic-card.component.html',
  styleUrl: './statistic-card.component.scss',
  standalone: true,
})
export class StatisticCardComponent {
  config = input.required<StatCardConfig>();
  isLoading = input<boolean>(false);
}
