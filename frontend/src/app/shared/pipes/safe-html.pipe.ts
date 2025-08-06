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
      ALLOWED_TAGS: ['p', 'strong', 'em', 'u', 'a', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'img', 'div', 'span', 'table', 'tr', 'td', 'th', 'blockquote', 'code', 'pre'],
      ALLOWED_ATTR: ['href', 'style', 'src', 'alt', 'class', 'target']
    });
    
    // No convertir saltos de línea en <br> para evitar saltos de línea no deseados
    return this.sanitizer.bypassSecurityTrustHtml(clean);
  }
}