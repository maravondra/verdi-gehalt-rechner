import { ChangeDetectionStrategy, Component, OnInit, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { StatisticCardComponent } from '../statistic-card/statistic-card.component';
import { CommonModule, registerLocaleData, CurrencyPipe, DatePipe } from '@angular/common';
import localeDe from '@angular/common/locales/de';

// Zaregistrujeme německá data pod oběma identifikátory pro jistotu
registerLocaleData(localeDe, 'de');
registerLocaleData(localeDe, 'de-DE'); // <-- Přidej tento řádek

interface YearlyGroup {
  year: number;
  totalDifferent: number;
  months: TimelineRow[];
}

export interface TimelineRow {
  year: number;
  month: number;
  tsi: number;
  different: number;
  dt: number;
  TsiNote?: string;
  DTENote?: string;
}

export interface MetricState {
  tsi: number;
  different: number;
  TsiNote?: string;
  DTENote?: string;
}

@Component({
  selector: 'app-calculator-page',
  imports: [FormsModule, RouterLink, StatisticCardComponent, CurrencyPipe, DatePipe, CommonModule],
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
    }, 500); // 5000 milisekund = 5 sekund
  }

  calculateSalaryLossIn2026TSI(): number {
    let totaDif = 0;
    this.timelineData().forEach((row) => {
      totaDif += row.different;
    });
    return totaDif;
  }

  calculateSalaryIn2026DTE(): number {
    let salaryInJuli2024 = this.defaultSalary() + this.inflationPremie;
    let salaryInOktober2024 = salaryInJuli2024 + salaryInJuli2024 * this.rateTelekom;
    let salaryInAugust2025 = salaryInOktober2024 + this.increaseSallary;
    return salaryInAugust2025;
  }

  createDate(year: number, month: number): Date {
    // Month v JS Date je indexovaný od 0 (0 = leden, 11 = prosinec)
    return new Date(year, month - 1, 1);
  }

  // Reaktivní výpočet celé tabulky pomocí Angular Signals
  // 1. Původní lineární výpočet měsíců (zůstává stejný)
  readonly timelineData = computed<TimelineRow[]>(() => {
    const data: TimelineRow[] = [];
    let currentState: MetricState = { tsi: this.defaultSalary(), different: 0 };

    for (let year = 2024; year <= 2026; year++) {
      for (let month = 1; month <= 12; month++) {
        let note = '';
        currentState.TsiNote = undefined;
        currentState.DTENote = undefined;
        if (year === 2024) {
          if (month === 7) {
            currentState.different += 1550;
            currentState.DTENote = 'Inflationsausgleichsprämie 1.550€ ';
          } else if (month === 8) {
            currentState.different -= 1550;
          } else if (month === 10) {
            currentState.different += this.defaultSalary() * 0.06;
            currentState.DTENote = 'Erhöhug 6%';
          } else if (month === 12) {
            currentState.tsi += 1550;
            currentState.different -= 1550;
            currentState.TsiNote = 'Inflationsausgleichsprämie 1.550€ ';
          }
        } else if (year === 2025) {
          if (month === 1) {
            currentState.tsi -= 1550;
            currentState.different += 1550;
          } else if (month === 9) {
            currentState.tsi += 190;
            currentState.TsiNote = 'Erhöhung 190 €';
            currentState.DTENote = 'Erhöhung 190 €';
          }
        } else if (year === 2026) {
          if (month === 6) {
            currentState.tsi += this.defaultSalary() * 0.04;
            currentState.different -= 149.6;
            currentState.TsiNote = 'Erhöhug 4%';
          }
        }

        const finalTsi = Math.round(currentState.tsi * 100) / 100;
        const finalDifferent = Math.round(currentState.different * 100) / 100;
        const finalDt = Math.round((finalTsi + finalDifferent) * 100) / 100;

        data.push({
          year,
          month,
          tsi: finalTsi,
          different: finalDifferent,
          dt: finalDt,
          TsiNote: currentState.TsiNote,
          DTENote: currentState.DTENote,
        });
      }
    }
    return data;
  });

  // 2. NOVÝ: Seskupení podle let a výpočet roční sumy "Different"
  readonly yearlySummary = computed<YearlyGroup[]>(() => {
    const monthsData = this.timelineData();
    const groupsMap = new Map<number, TimelineRow[]>();

    // Rozřazení měsíců do mapy podle let
    monthsData.forEach((row) => {
      if (!groupsMap.has(row.year)) {
        groupsMap.set(row.year, []);
      }
      groupsMap.get(row.year)!.push(row);
    });

    // Transformace mapy na pole s výpočtem sumy
    return Array.from(groupsMap.entries()).map(([year, months]) => {
      // Sečteme sloupec 'different' pro daný rok
      const totalDifferent = months.reduce((sum, row) => sum + row.different, 0);

      return {
        year,
        totalDifferent: Math.round(totalDifferent * 100) / 100, // ošetření float nepřesnosti
        months,
      };
    });
  });
}
