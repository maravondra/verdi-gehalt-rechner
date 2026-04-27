import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';

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
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
})
export class App {
  salary2023 = signal<number | null>(null);
  result = signal<ComparisonResult | null>(null);

  calculateSalary() {
    const salary = this.salary2023();

    if (!salary || salary <= 0) {
      alert('Bitte füllen Sie alle Felder aus!');
      return;
    }

    // T-Systems: 4% Erhöhung nur im Jahr 2024, dann gleich bleibend
    const tsystemsYears: YearlyData[] = [];
    const ts2024Salary = salary * 1.04;
    for (let year = 2023; year <= 2026; year++) {
      if (year === 2023) {
        tsystemsYears.push({
          year: year,
          salary: salary,
          increase: 0,
        });
      } else {
        tsystemsYears.push({
          year: year,
          salary: ts2024Salary,
          increase: ts2024Salary - salary,
        });
      }
    }

    // Deutsche Telekom: 6% Erhöhung nur im Jahr 2024, dann gleich bleibend
    const dtYears: YearlyData[] = [];
    const dt2024Salary = salary * 1.06;
    for (let year = 2023; year <= 2026; year++) {
      if (year === 2023) {
        dtYears.push({
          year: year,
          salary: salary,
          increase: 0,
        });
      } else {
        dtYears.push({
          year: year,
          salary: dt2024Salary,
          increase: dt2024Salary - salary,
        });
      }
    }

    // 2024 Berechnung
    const tsystemsIncrease = salary * 0.04;
    const tsystemsNewSalary = ts2024Salary;

    const dtIncrease = salary * 0.06;
    const dtNewSalary = dt2024Salary;

    // Differenz - immer gegen das 2023 Gehalt
    const differenceIncrease = dtIncrease - tsystemsIncrease; // Unterschied pro Jahr: €900

    // Total Unterschied: Summe über alle Jahre (2024, 2025, 2026)
    // Jedes Jahr ist der Unterschied gleich (€900), also 3 Jahre × €900 = €2.700
    const totalDifference2026 = differenceIncrease * 3; // 3 Jahre von 2024-2026

    this.result.set({
      salary2023: salary,
      tsystems: {
        increase: tsystemsIncrease,
        newSalary: tsystemsNewSalary,
        percent: 4,
        yearlyData: tsystemsYears,
        totalIncrease2023to2026: tsystemsYears[3].salary - salary,
      },
      dt: {
        increase: dtIncrease,
        newSalary: dtNewSalary,
        percent: 6,
        yearlyData: dtYears,
        totalIncrease2023to2026: dtYears[3].salary - salary,
      },
      difference: differenceIncrease,
      totalDifference2026: totalDifference2026,
    });
  }

  resetForm() {
    this.salary2023.set(null);
    this.result.set(null);
  }
}
