import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-security-pin-verification',
  imports: [FormsModule, RouterLink],
  styleUrl: './security-pin-verification.css',
  templateUrl: './security-pin-verification.html',
})
export class SecurityPinVerification implements OnInit {
  private readonly route = inject(ActivatedRoute);
   private readonly http = inject(HttpClient);
  readonly uniqueWord = signal('');
  readonly pinInput = signal('');
  readonly errorMessage = signal<string | null>(null);
  showVerificationForm = signal(false);

  ngOnInit(): void {
    const routeUniqueWord = this.route.snapshot.paramMap.get('uniqueWord');
    this.uniqueWord.set(routeUniqueWord ?? '');
    this.getOriginalUrl(this.uniqueWord());
  }

  verifyPin(event: Event): void {
    event.preventDefault();

    const uniqueWordValue = this.uniqueWord().trim();
    const pinValue = this.pinInput().trim();

    if (!uniqueWordValue) {
      this.errorMessage.set('Unique word is missing from the route.');
      return;
    }

    if (!/^\d{6}$/.test(pinValue)) {
      this.errorMessage.set('Enter a valid 6-digit PIN.');
      return;
    }

     this.errorMessage.set(null);
     this.getOriginalUrl(this.uniqueWord(), pinValue);
  
  }


    async getOriginalUrl(uniqueWord: string, securityPin?: string): Promise<void> {
       try {
      const response: any = await firstValueFrom(
        this.http.get(`https://open-bills-services.onrender.com/api/v1/verify-shorten-url/${uniqueWord}?securityPin=${securityPin || ''}`)
      );
  
      console.log('Response from API:', response);
    
          if(response?.hasSecurityPin && response?.originalUrl === null) {
            this.showVerificationForm.set(true);
          }else{
            this.showVerificationForm.set(false);
            window.location.assign(response?.originalUrl);
          }
      
  
    } catch (err) {
      console.error('Error retrieving original URL:', err);
        this.errorMessage.set('Unable to retrieve the original URL. Please check the unique word and PIN, and try again.');

    }
    }
}
