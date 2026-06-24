import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './core/service/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  private authService = inject(AuthService);

  ngOnInit(): void {
    this.authService.restoreSession();
    // temporar pentru test dashboard
  //   this.authService.saveSession(
  //   {
  //     accessToken: 'fake-token',
  //     user: {
  //       id: '1',
  //       firstName: 'Test',
  //       lastName: 'User',
  //       email: 'test@example.com',
  //       role: 'teacher',
  //     },
  //   },
  //   true
  // );
  }

  

}

