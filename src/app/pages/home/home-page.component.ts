import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-home-page',
  imports: [RouterLink, FormsModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {

  router = inject(Router)

  resetForm() {
    throw new Error('Method not implemented.');
  }
  calculateSalary() {
    this.router.navigate(['/rechner'], { queryParams: { salary: this.salary2023() } });
  }
  salary2023 = signal<number | null>(null);

}
