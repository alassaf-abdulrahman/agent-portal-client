import { Component, inject, OnInit } from '@angular/core';
import { Agent } from '../../models/agent.model';
import { AgentService } from '../../services/agent.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  translate = inject(TranslateService);
  agent: Agent | null = null;

  constructor(private Service: AgentService) { }

  ngOnInit(): void {

    this.Service.getAgentInfo().subscribe(data => {
      this.agent = data;
    });
  }
}
