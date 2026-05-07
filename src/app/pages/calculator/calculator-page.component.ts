import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
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
  imports: [FormsModule, RouterLink],
  templateUrl: './calculator-page.component.html',
  styleUrl: './calculator-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalculatorPageComponent {

  readonly salary = signal<number>(history.state?.salary ?? 0);

  salary2023 = signal<number | null>(null);
  result = signal<ComparisonResult | null>(null);

  calculateSalary(): void {
    const salary = this.salary2023();

    if (!salary || salary <= 0) {
      alert('Bitte fuellen Sie alle Felder aus!');
      return;
    }

    const tsystemsYears: YearlyData[] = [];
    const ts2024Salary = salary * 1.04;
    for (let year = 2023; year <= 2026; year++) {
      if (year === 2023) {
        tsystemsYears.push({
          year,
          salary,
          increase: 0,
        });
      } else {
        tsystemsYears.push({
          year,
          salary: ts2024Salary,
          increase: ts2024Salary - salary,
        });
      }
    }

    const dtYears: YearlyData[] = [];
    const dt2024Salary = salary * 1.06;
    for (let year = 2023; year <= 2026; year++) {
      if (year === 2023) {
        dtYears.push({
          year,
          salary,
          increase: 0,
        });
      } else {
        dtYears.push({
          year,
          salary: dt2024Salary,
          increase: dt2024Salary - salary,
        });
      }
    }

    const tsystemsIncrease = salary * 0.04;
    const dtIncrease = salary * 0.06;
    const differenceIncrease = dtIncrease - tsystemsIncrease;
    const totalDifference2026 = differenceIncrease * 3;

    this.result.set({
      salary2023: salary,
      tsystems: {
        increase: tsystemsIncrease,
        newSalary: ts2024Salary,
        percent: 4,
        yearlyData: tsystemsYears,
        totalIncrease2023to2026: tsystemsYears[3].salary - salary,
      },
      dt: {
        increase: dtIncrease,
        newSalary: dt2024Salary,
        percent: 6,
        yearlyData: dtYears,
        totalIncrease2023to2026: dtYears[3].salary - salary,
      },
      difference: differenceIncrease,
      totalDifference2026,
    });
  }

  resetForm(): void {
    this.salary2023.set(null);
    this.result.set(null);
  }
}
