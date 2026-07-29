import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-home-page',
  imports: [FormsModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {
  router = inject(Router);

  resetForm() {
    throw new Error('Method not implemented.');
  }
  calculateSalary() {
    const salaryValue = this.salary2023(); // Přečte hodnotu ze signalu

    // Pokud je salary null nebo undefined, neposíláme neplatný parametr
    if (salaryValue === null || salaryValue === undefined) {
      this.router.navigate(['/rechner']);
      return;
    }

    this.router.navigate(['/rechner'], {
      // Zajistíme, že se posílá čisté číslo/string bez neplatných znaků
      queryParams: { salary: Math.round(salaryValue) },
    });
  }
  salary2023 = signal<number | null>(null);
}
