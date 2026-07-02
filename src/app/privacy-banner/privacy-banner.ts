import { isPlatformBrowser } from '@angular/common';
import { Component, inject, PLATFORM_ID, signal } from '@angular/core';

@Component({
  selector: 'app-privacy-banner',
  imports: [],
  templateUrl: './privacy-banner.html',
  styleUrl: './privacy-banner.scss',
})
export class PrivacyBanner {
  isVisible = signal<boolean>(false);

  private platformId = inject(PLATFORM_ID);
  private readonly STORAGE_KEY = 'privacyBannerDismissed';

  ngOnInit() {
    // Bezpečné ověření platformy před sáhnutím na localStorage
    if (isPlatformBrowser(this.platformId)) {
      const isDismissed = localStorage.getItem(this.STORAGE_KEY);
      this.isVisible.set(isDismissed !== 'true');
    }
  }

  closeBanner() {
    this.isVisible.set(false);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.STORAGE_KEY, 'true');
    }
  }
}
