import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-calculator-page',
  imports: [FormsModule, RouterLink],
  templateUrl: './calculator-page.component.html',
  styleUrl: './calculator-page.component.scss', // <-- Zde: styleUrl místo styleUrls a bez hranatých závorek []
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalculatorPageComponent {


}
