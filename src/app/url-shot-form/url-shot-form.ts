
import { HttpClient } from '@angular/common/http';
import { Component, inject, Sanitizer, signal } from '@angular/core';
import { FormField, form, required, validate } from '@angular/forms/signals';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';


interface UrlShortenerFormModel {
  url: string;
  usePin: boolean;
}

interface ShortenResult {
  shortUrl: string;
  securityPin: string | null;
}

@Component({
  imports: [FormField],
  selector: 'app-url-shot-form',
  styleUrl: './url-shot-form.css',
  templateUrl: './url-shot-form.html',
})
export class UrlShotForm  {
  private readonly http = inject(HttpClient);
  private readonly sanitizer = inject(Sanitizer);
  private readonly route = inject(ActivatedRoute);
  readonly submittedData = signal<UrlShortenerFormModel | null>(null);
  readonly shortenResult = signal<ShortenResult | null>(null);
  readonly submitError = signal<string | null>(null);
  readonly isSubmitting = signal(false);
  urlModel = signal<UrlShortenerFormModel>({
    url: '',
    usePin: false,
  });

  urlForm = form(this.urlModel, (path) => {
    required(path.url, { message: 'URL is required' });
    validate(path.url, ({ value }) => {
      const input = value().trim();

      // Keep URL format validation simple and user-friendly.
      if (input.length === 0) {
        return null;
      }

      try {
        new URL(input);
        return null;
      } catch {
        return {
          kind: 'urlFormat',
          message: 'Enter a valid URL (example: https://example.com)',
        };
      }
    });
  });


  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();

    const formValue = this.urlModel();
    const normalizedUrl = formValue.url.trim();
    console.log(formValue);

    console.log('Normalized URL:', normalizedUrl);
    if (!normalizedUrl) {
      this.submitError.set('URL is required');
      return;
    }

    this.submitError.set(null);
    this.isSubmitting.set(true);

    try {
      const response = await firstValueFrom(
        this.http.post('https://open-bills-services.onrender.com/api/v1/shorten-url', {
          url: normalizedUrl,
          hasSecurityPin: formValue.usePin,
        }),
      );
      if (response && typeof response === 'object') {
        const responseObj = response as {
          originalUrl: string;
          uniqueWord: string;
          shortUrl: string;
          securityPin?: string | null;
        };
        this.resetForm();
        this.shortenResult.set({
          shortUrl: responseObj.shortUrl,
          securityPin: responseObj.securityPin || null,
        });
      }
    
      this.submittedData.set({
        url: normalizedUrl,
        usePin: formValue.usePin,
      });
    } catch {
      this.submitError.set('Unable to shorten URL. Please check API server and try again.');
    } finally {
      this.isSubmitting.set(false);
    }

  }



resetForm() {
  this.urlModel.set({
    url: '',
    usePin: false,
  });
  this.submittedData.set(null);
  this.shortenResult.set(null);
  this.submitError.set(null);
  this.isSubmitting.set(false);
}
 


}
