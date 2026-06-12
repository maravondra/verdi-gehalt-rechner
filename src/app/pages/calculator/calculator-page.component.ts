import { ChangeDetectionStrategy, Component, OnInit, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { StatisticCardComponent } from '../statistic-card/statistic-card.component';
import { CurrencyPipe } from '@angular/common';

export interface TimelineRow {
  year: number;
  month: number;
  tsi: number;
  different: number;
  dt: number;
  note?: string;
}

export interface MetricState {
  tsi: number;
  different: number;
}

@Component({
  selector: 'app-calculator-page',
  imports: [FormsModule, RouterLink, StatisticCardComponent, CurrencyPipe],
  templateUrl: './calculator-page.component.html',
  styleUrl: './calculator-page.component.scss', // <-- Zde: styleUrl místo styleUrls a bez hranatých závorek []
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalculatorPageComponent implements OnInit {
  isLoading = signal(false);
  readonly defaultSalary = signal<number>(history.state?.salary ?? 0);

  private readonly rateTSystem = 0.04; // 15% Gehaltserhöhung für T-System
  private readonly rateTelekom = 0.06; // 10% Gehaltserhöhung für Telekom

  private readonly inflationPremie = 1555; // Inflationserhöhung von 1555€

  private readonly increaseSallary = 190;

  ngOnInit(): void {
    this.isLoading.set(true);

    // Simulace asynchronního načítání dat (např. z API) po dobu 5 sekund
    setTimeout(() => {
      this.isLoading.set(false);
    }, 2500); // 5000 milisekund = 5 sekund
  }

  calculateSalaryIn2026TSI(): number {
    let salaryInJuli2024 = this.defaultSalary() + this.inflationPremie;
    let salaryInOktober2024 = salaryInJuli2024 + salaryInJuli2024 * this.rateTSystem;
    let salaryInAugust2025 = salaryInOktober2024 + this.increaseSallary;
    return salaryInAugust2025;
  }

  calculateSalaryIn2026DTE(): number {
    let salaryInJuli2024 = this.defaultSalary() + this.inflationPremie;
    let salaryInOktober2024 = salaryInJuli2024 + salaryInJuli2024 * this.rateTelekom;
    let salaryInAugust2025 = salaryInOktober2024 + this.increaseSallary;
    return salaryInAugust2025;
  }

  // Reaktivní výpočet celé tabulky pomocí Angular Signals
  readonly timelineData = computed<TimelineRow[]>(() => {
    const data: TimelineRow[] = [];

    // Inicializace stavu, který budeme v čase mutovat pro účely simulace
    let currentState: MetricState = {
      tsi: this.defaultSalary(),
      different: 0,
    };

    const startYear = 2024;
    const endYear = 2026;

    for (let year = startYear; year <= endYear; year++) {
      for (let month = 1; month <= 12; month++) {
        let note = '';

        // Aplikace modifikátorů na základě konkrétního roku a měsíce
        if (year === 2024) {
          if (month === 7) {
            currentState.different += 1550;
            note = '+1.550 €';
          } else if (month === 9) {
            const currentDt = currentState.tsi + currentState.different;
            const increase = currentDt * 0.06; // 6% z celkového DT
            currentState.different += increase;
            note = '6%';
          } else if (month === 12) {
            currentState.tsi += 1550;
            currentState.different -= 1550;
            note = 'Přesun 1.550 € do TSI';
          }
        } else if (year === 2025) {
          if (month === 8) {
            currentState.tsi += 190;
            currentState.different -= 190;
            note = '190';
          } else if (month === 10) {
            currentState.different += 190;
            note = '190 €';
          }
        } else if (year === 2026) {
          if (month === 6) {
            // 4% navýšení ze základu TSI (3740 * 0.04 = 149.6)
            // V tabulce: TSI stoupne o 150 (zaokrouhleno) z 3740 na 3890
            // Different klesne o 149.6 (z 213 na 63.4)
            currentState.tsi += 150;
            currentState.different -= 149.6;
            note = '4%';
          }
        }

        // Zaokrouhlení na 2 desetinná místa pro eliminaci JS float nepřesností
        const finalTsi = Math.round(currentState.tsi * 100) / 100;
        const finalDifferent = Math.round(currentState.different * 100) / 100;
        const finalDt = Math.round((finalTsi + finalDifferent) * 100) / 100;

        data.push({
          year,
          month,
          tsi: finalTsi,
          different: finalDifferent,
          dt: finalDt,
          note,
        });
      }
    }

    return data;
  });
}
