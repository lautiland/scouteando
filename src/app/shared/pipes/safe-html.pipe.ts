import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import DOMPurify from 'dompurify';

@Pipe({ 
    name: 'safeHtml' ,
    standalone: true
})
export class SafeHtmlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(html: string): SafeHtml {
    const clean = DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['p', 'strong', 'em', 'u', 'a', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'img', 'div', 'span', 'br', 'table', 'tr', 'td', 'th'],
      ALLOWED_ATTR: ['href', 'style', 'src', 'alt', 'class', 'target']
    });
    
    // Convertir saltos de línea en <br> para consistencia
    return this.sanitizer.bypassSecurityTrustHtml(
      clean.replace(/\n/g, '<br>')
    );
  }
}