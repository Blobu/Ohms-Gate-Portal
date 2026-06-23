import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-public-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <h1>Ohms Gate Portal</h1>
    <p>Zona publica a aplicatiei.</p>

    <a routerLink="/auth/login">Login</a>
    <a routerLink="/auth/register">Register</a>
  `,
})
export class PublicHome {}