const fs = require('fs');

const formPath = 'c:/Users/Rohith/OneDrive/Desktop/skillswap/src/app/components/reviews/review-form/review-form.component.ts';
let form = fs.readFileSync(formPath, 'utf8');
if (!form.includes('RouterLink') && form.includes('@angular/router')) {
  form = form.replace(/import { ActivatedRoute, Router } from '@angular\/router';/, "import { ActivatedRoute, Router, RouterLink } from '@angular/router';");
  form = form.replace(/imports: \[CommonModule, FormsModule, ReactiveFormsModule\]/, "imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink]");
  fs.writeFileSync(formPath, form);
}
