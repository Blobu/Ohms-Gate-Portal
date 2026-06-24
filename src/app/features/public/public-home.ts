import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DownloadItemModel } from '../../core/models/download-item.model';

@Component({
  selector: 'app-public-home',
  standalone: true,
  imports: [RouterLink],
  styleUrl: './public-home.scss',
  template: `
    <div class="home-page">
      <header class="home-header">
        <a class="home-brand" href="#hero">Ohm's Gate</a>

        <nav class="home-nav">
          <a href="#overview">Overview</a>
          <a href="#download">Download</a>
          <a href="#features">About</a>
        </nav>

        <div class="home-auth">
          <a routerLink="/auth/login" class="home-auth__link">Sign in</a>
          <a routerLink="/auth/register" class="home-auth__button">Register</a>
        </div>
      </header>

      <main>
        <section id="hero" class="hero-section">
          <div class="hero-animation">
            Logo animation placeholder
          </div>
        </section>

        <section id="overview" class="overview-section">
          <div class="overview-copy">
            <p class="section-kicker">Immersive classroom</p>
            <h1>Ohm's Gate</h1>
            <p class="overview-description">
              Ohm's Gate is a personal software project focused on creating an interactive and
              accessible digital environment for learning through direct experimentation. The
              project is designed around the idea that complex systems are understood better when
              users can explore, test, and manipulate them in a practical way rather than only
              study them theoretically. Its long-term goal is to combine intuitive interaction,
              structured simulation, and guided exploration into a single experience that can be
              adapted for both individual use and educational contexts.
            </p>
          </div>
        </section>

        <section id="download" class="download-section">
          <div class="section-heading">
            <p class="section-kicker">Download</p>
            <h2>Get the standard public build</h2>
            <p>
              Install the public version of Ohm's Gate and experience the sandbox.
            </p>
          </div>

          <div class="download-actions">
            <button type="button" class="download-button" (click)="downloadWindows()">
              Windows
            </button>

            <button type="button" class="download-button" (click)="downloadQuest()">
              Oculus Quest
            </button>
          </div>
        </section>

        <section id="features" class="features-section">
          <div class="section-heading">
            <p class="section-kicker">Features</p>
            <h2>Learn while playing</h2>
          </div>

          <div class="features-grid">
            <article class="features-card">
              <h3>Hand Tracking</h3>
              <p>
                Physically grab, snap, and wire components
              </p>
            </article>

            <article class="features-card">
              <h3>Logic & Electrical Simulation</h3>
              <p>
                Ohm's Gate is being designed to simulate both Logic Gates and electric circuits in the same environment
              </p>
            </article>

            <article class="features-card">
              <h3>AI Lab Partner</h3>
              <p>
                Gizmo, a cute companion that helps you around while carrying your inventory.
              </p>
            </article>
          </div>
        </section>
      </main>

      <footer class="home-footer">
        <p>Ohm's Gate Portal</p>
        <p>Public access and protected educational deployment.</p>
      </footer>
    </div>
  `,
})
export class PublicHome {
  protected windowsBuild: DownloadItemModel = {
    id: 1,
    deploymentName: 'Ohms Gate Standard Build',
    version: '1.0.0',
    platform: 'Windows',
    accessType: 'Student',
    estimatedInstances: 0,
    downloadUrl: 'http://localhost:3000/downloads/windows',
  };

  protected questBuild: DownloadItemModel = {
    id: 2,
    deploymentName: 'Ohms Gate Standard Build',
    version: '1.0.0',
    platform: 'Quest 2/3',
    accessType: 'Student',
    estimatedInstances: 0,
    downloadUrl: 'http://localhost:3000/downloads/quest',
  };

  downloadWindows(): void {
    window.open(this.windowsBuild.downloadUrl, '_blank');
  }

  downloadQuest(): void {
    window.open(this.questBuild.downloadUrl, '_blank');
  }
}
