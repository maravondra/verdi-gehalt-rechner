import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface YearlyData {
  year: number;
  salary: number;
  increase: number;
}

interface ComparisonResult {
  salary2023: number;
  tsystems: {
    increase: number;
    newSalary: number;
    percent: number;
    yearlyData: YearlyData[];
    totalIncrease2023to2026: number;
  };
  dt: {
    increase: number;
    newSalary: number;
    percent: number;
    yearlyData: YearlyData[];
    totalIncrease2023to2026: number;
  };
  difference: number;
  totalDifference2026: number;
}

@Component({
  selector: 'app-calculator-page',
  imports: [FormsModule, RouterLink, DecimalPipe],
  templateUrl: './calculator-page.component.html',
  styleUrl: './calculator-page.component.scss', // <-- Zde: styleUrl místo styleUrls a bez hranatých závorek []
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalculatorPageComponent {

  readonly defaultSalary = signal<number>(history.state?.salary ?? 0);
  
  readonly result = computed(() => {
    const salary = this.defaultSalary();

    // Validace přímo v computed (pokud není platové zadání, vrátíme null nebo prázdný stav)
    if (!salary || salary <= 0) {
      return null;
    }

    const generateYearlyData = (baseSalary: number, multiplier: number) => {
      const newSalary = baseSalary * multiplier;
      const years: YearlyData[] = [];
      
      for (let year = 2023; year <= 2026; year++) {
        years.push({
          year,
          salary: year === 2023 ? baseSalary : newSalary,
          increase: year === 2023 ? 0 : newSalary - baseSalary,
        });
      }
      return { years, newSalary, increase: newSalary - baseSalary };
    };

    const ts = generateYearlyData(salary, 1.04); // T-Systems 4%
    const dt = generateYearlyData(salary, 1.06); // DT 6%

    const differenceIncrease = dt.increase - ts.increase;

    return {
      salary2023: salary,
      tsystems: {
        increase: ts.increase,
        newSalary: ts.newSalary,
        percent: 4,
        yearlyData: ts.years,
        totalIncrease2023to2026: ts.increase, // V tvé logice se od 2024 plat nemění
      },
      dt: {
        increase: dt.increase,
        newSalary: dt.newSalary,
        percent: 6,
        yearlyData: dt.years,
        totalIncrease2023to2026: dt.increase,
      },
      difference: differenceIncrease,
      totalDifference2026: differenceIncrease * 3, // 2024, 2025, 2026
    };
  });


  resetForm(): void {
   
  }
}
