import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-programs-offered',
  standalone: false,
  templateUrl: './programs-offered.component.html',
  styleUrl: './programs-offered.component.css'
})
export class ProgramsOfferedComponent {
  programs = [
    { key: 'programs_offered.buttons.diploma', url: 'https://www.mediu.edu.my/diploma-programs' },
    { key: 'programs_offered.buttons.bachelor', url: 'https://www.mediu.edu.my/bachelor-programs' },
    { key: 'programs_offered.buttons.master', url: 'https://www.mediu.edu.my/master-programs' },
    { key: 'programs_offered.buttons.phd', url: 'https://www.mediu.edu.my/phd-programs' }
  ];
}
