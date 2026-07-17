import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

export interface StatCardConfig {
  label: string;
  value: number;
  icon: string;
  cssClass?: string; // Pro speciální barvy jako 'gold'
  suffix?: string; // Např. 'Kč'
}

@Component({
  selector: 'app-statistic-card',
  imports: [MatIconModule, CurrencyPipe, DecimalPipe],
  templateUrl: './statistic-card.component.html',
  styleUrl: './statistic-card.component.scss',
  standalone: true,
})
export class StatisticCardComponent {
  config = input.required<StatCardConfig>();
  isLoading = input<boolean>(false);
  isEuro = input<boolean>(false);
  isMinusActivation = input<boolean>(false);
  removeMinus = input<boolean>(false);
  showIcon = input<boolean>(true);
  shoowingPlus = input<boolean>(false);

  valueClass = computed(() => {
    // Pokud není mínus aktivované, vrátí jen základní třídu
    if (!this.isMinusActivation()) return 'value';

    // Bezpečný převod na číslo (pokud je to string, převede ho, pokud null/undefined, dá 0)
    const rawValue = this.config()?.value;
    const val = rawValue !== undefined && rawValue !== null ? Number(rawValue) : 0;

    // Pojistka pro případ, že by string obsahoval text, který nelze převést (NaN)
    if (isNaN(val)) return 'value text-gray-700';

    if (val < 0) return 'value text-red-700';
    if (val > 0) return 'value text-green-700';
    return 'value text-gray-700';
  });

  correctionOfValue = computed(() => {
    const rawValue = this.config()?.value;

    if (this.removeMinus()) {
      if (rawValue < 0) {
        return Math.abs(rawValue);
      }
    }

    return rawValue;
  });
}
