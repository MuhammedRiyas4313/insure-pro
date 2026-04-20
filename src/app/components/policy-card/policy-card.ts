import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Policy } from '../../models/policy';

@Component({
  selector: 'app-policy-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './policy-card.component.html',
  styleUrl: './policy-card.component.css'
})
export class PolicyCardComponent {
  policy = input.required<Policy>();
  isAdmin = input<boolean>(false);
  
  onEdit = output<Policy>();
  onDelete = output<Policy>();
}
