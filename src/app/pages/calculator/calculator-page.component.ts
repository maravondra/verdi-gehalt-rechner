import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { StatisticCardComponent } from '../statistic-card/statistic-card.component';

@Component({
  selector: 'app-calculator-page',
  imports: [FormsModule, RouterLink, StatisticCardComponent],
  templateUrl: './calculator-page.component.html',
  styleUrl: './calculator-page.component.scss', // <-- Zde: styleUrl místo styleUrls a bez hranatých závorek []
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalculatorPageComponent implements OnInit {
  isLoading = signal(false);
  readonly defaultSalary = signal<number>(history.state?.salary ?? 0);

  ngOnInit(): void {
    this.isLoading.set(true);

    // Simulace asynchronního načítání dat (např. z API) po dobu 5 sekund
    setTimeout(() => {
      this.isLoading.set(false);
    }, 2500); // 5000 milisekund = 5 sekund
  }
}
