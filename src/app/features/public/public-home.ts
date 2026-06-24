import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DownloadItem } from '../../shared/download-item';
import { DownloadItemModel } from '../../core/models/download-item.model';

@Component({
  selector: 'app-public-home',
  standalone: true,
  imports: [RouterLink, DownloadItem],
  styleUrl: './public-home.scss',
  template: `
    <div class="home-page">
      <header class="home-header">
        <a class="home-brand" href="#hero">Ohm's Gate</a>

        <nav class="home-nav">
          <a href="#overview">Overview</a>
          <a href="#download">Download</a>
          <a href="#about">About</a>
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
            <h1>Ohm’s Gate</h1>
            <p class="overview-description">
              Ohm’s Gate is a personal software project focused on creating an interactive and accessible digital environment for learning through direct experimentation. The project is designed around the idea that complex systems are understood better when users can explore, test, and manipulate them in a practical way rather than only study them theoretically. Its long-term goal is to combine intuitive interaction, structured simulation, and guided exploration into a single experience that can be adapted for both individual use and educational contexts.
            </p>
          </div>
        </section>

        <section id="download" class="download-section">
          <div class="section-heading">
            <p class="section-kicker">Download</p>
            <h2>Get the standard public build</h2>
            <p>
              Install the public version of Ohm’s Gate and explore the sandbox experience.
            </p>
          </div>

          <div class="download-panel">
            <div class="download-meta">
              <p><strong>{{ publicBuild.deploymentName }}</strong></p>
              <p>Version {{ publicBuild.version }} · {{ publicBuild.platform }}</p>
            </div>

            <app-download-item
              [id]="publicBuild.id"
              [label]="'Download standard build'"
              (downloadRequested)="onDownloadRequested($event)"
            />
          </div>
        </section>

        <section id="about" class="about-section">
          <div class="section-heading">
            <p class="section-kicker">About</p>
            <h2>Built for structured educational deployment</h2>
          </div>

          <div class="about-grid">
            <article class="about-card">
              <h3>Public access</h3>
              <p>
                Visitors can discover the project and download the standard version
                through a clear and product-focused interface.
              </p>
            </article>

            <article class="about-card">
              <h3>Teacher resources</h3>
              <p>
                Authenticated users access protected builds and teacher-oriented tools
                through a separate secure area.
              </p>
            </article>

            <article class="about-card">
              <h3>Deployment logic</h3>
              <p>
                The portal is designed around clear distribution flows, restricted access,
                and educational deployment scenarios.
              </p>
            </article>
          </div>
        </section>
      </main>

      <footer class="home-footer">
        <p>Ohm’s Gate Portal</p>
        <p>Public access and protected educational deployment.</p>
      </footer>
    </div>
  `,
})
export class PublicHome {
  protected publicBuild: DownloadItemModel = {
    id: 1,
    deploymentName: 'Ohms Gate Standard Build',
    version: '1.0.0',
    platform: 'Windows',
    accessType: 'Student',
    estimatedInstances: 0,
    downloadUrl: '/downloads/ohms-gate-standard-1.0.0.zip',
  };

  onDownloadRequested(id: number): void {
    if (id === this.publicBuild.id) {
      window.open(this.publicBuild.downloadUrl, '_blank');
    }
  }
}