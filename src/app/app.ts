import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface ComparisonResult {
  salary2023: number;
  tsystems: {
    increase: number;
    newSalary: number;
    percent: number;
  };
  dt: {
    increase: number;
    newSalary: number;
    percent: number;
  };
  difference: number;
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

    // T-Systems: 4% Erhöhung
    const tsystemsIncrease = salary * 0.04;
    const tsystemsNewSalary = salary + tsystemsIncrease;

    // Deutsche Telekom: 6% Erhöhung
    const dtIncrease = salary * 0.06;
    const dtNewSalary = salary + dtIncrease;

    // Differenz
    const differenceIncrease = dtIncrease - tsystemsIncrease;

    this.result.set({
      salary2023: salary,
      tsystems: {
        increase: tsystemsIncrease,
        newSalary: tsystemsNewSalary,
        percent: 4,
      },
      dt: {
        increase: dtIncrease,
        newSalary: dtNewSalary,
        percent: 6,
      },
      difference: differenceIncrease,
    });
  }

  resetForm() {
    this.salary2023.set(null);
    this.result.set(null);
  }
}


