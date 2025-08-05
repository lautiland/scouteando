import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ContentProvider, Article, Category } from '../../interfaces/content.interface';
import { marked } from 'marked';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class MarkdownProvider implements ContentProvider {
  
  private basePath: string;
  
  constructor(private http: HttpClient) {
    this.basePath = environment.content.markdownPath;
    console.log(`📁 MarkdownProvider: Usando ruta base "${this.basePath}"`);
  }

  async getArticlesByCategory(categorySlug: string): Promise<Article[]> {
    try {
      // Cargar el índice de artículos para la categoría
      const indexUrl = `${this.basePath}/${categorySlug}/index.json`;
      console.log(`📋 MarkdownProvider: Cargando índice desde "${indexUrl}"`);
      const index = await this.http.get<any>(indexUrl).toPromise();
      
      const articles: Article[] = [];
      
      for (const articleInfo of index.articles) {
        try {
          const articleUrl = `${this.basePath}/${categorySlug}/${articleInfo.file}`;
          console.log(`📄 MarkdownProvider: Cargando artículo desde "${articleUrl}"`);
          const markdown = await this.http.get(articleUrl, { responseType: 'text' }).toPromise();
          
          if (markdown) {
            const article = await this.parseMarkdownToArticle(markdown, articleInfo, categorySlug);
            articles.push(article);
          }
        } catch (error) {
          console.warn(`No se pudo cargar el artículo: ${articleInfo.file}`, error);
        }
      }
      
      return articles.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    } catch (error) {
      console.error(`Error cargando artículos de la categoría ${categorySlug}:`, error);
      return [];
    }
  }

  async getArticleById(id: string): Promise<Article | null> {
    try {
      // Buscar en todas las categorías
      const categories = await this.getCategories();
      
      for (const category of categories) {
        const articles = await this.getArticlesByCategory(category.slug);
        const article = articles.find(a => a.id === id);
        if (article) {
          return article;
        }
      }
      
      return null;
    } catch (error) {
      console.error(`Error buscando artículo con ID ${id}:`, error);
      return null;
    }
  }

  async getCategories(): Promise<Category[]> {
    try {
      const categoriesUrl = `${this.basePath}/categories.json`;
      console.log(`🏷️ MarkdownProvider: Cargando categorías desde "${categoriesUrl}"`);
      const categoriesData = await this.http.get<any>(categoriesUrl).toPromise();
      
      console.log(`✅ MarkdownProvider: ${categoriesData?.categories?.length || 0} categorías cargadas exitosamente`);
      
      return categoriesData.categories.map((cat: any) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        imageUrl: cat.imageUrl
      }));
    } catch (error) {
      console.error(`❌ MarkdownProvider: Error cargando categorías desde "${this.basePath}/categories.json":`, error);
      return [];
    }
  }

  async getCategoryBySlug(slug: string): Promise<Category | null> {
    try {
      const categories = await this.getCategories();
      return categories.find(cat => cat.slug === slug) || null;
    } catch (error) {
      console.error(`Error buscando categoría con slug ${slug}:`, error);
      return null;
    }
  }

  private async parseMarkdownToArticle(markdown: string, articleInfo: any, categorySlug: string): Promise<Article> {
    // Parsear el frontmatter (metadatos YAML al inicio del archivo)
    const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
    const match = markdown.match(frontmatterRegex);
    
    let frontmatter: any = {};
    let content = markdown;
    
    if (match) {
      try {
        // Parsear YAML simple (título, fecha, etc.)
        const frontmatterText = match[1];
        const lines = frontmatterText.split('\n');
        
        lines.forEach(line => {
          const colonIndex = line.indexOf(':');
          if (colonIndex > -1) {
            const key = line.substring(0, colonIndex).trim();
            const value = line.substring(colonIndex + 1).trim().replace(/['"]/g, '');
            frontmatter[key] = value;
          }
        });
        
        content = match[2];
      } catch (error) {
        console.warn('Error parseando frontmatter:', error);
      }
    }

    // Reducir niveles de headers en 2 (h1→h3, h2→h4, etc.) para evitar conflictos con estilos globales
    content = this.reduceHeaderLevels(content);

    // Convertir markdown a HTML
    const htmlContent = await marked(content);
    
    // Generar excerpt del contenido
    const excerpt = this.generateExcerpt(content);
    
    return {
      id: articleInfo.id || this.generateSlug(frontmatter.title || articleInfo.title || 'sin-titulo'),
      title: frontmatter.title || articleInfo.title || 'Sin título',
      content: htmlContent,
      excerpt: frontmatter.excerpt || excerpt,
      category: categorySlug,
      createdAt: frontmatter.date ? new Date(frontmatter.date) : new Date(),
      updatedAt: frontmatter.updated ? new Date(frontmatter.updated) : new Date(),
      imageUrl: frontmatter.image || articleInfo.imageUrl,
      author: frontmatter.author || 'Autor desconocido'
    };
  }

  private generateExcerpt(content: string, maxLength: number = 150): string {
    // Remover markdown básico y generar excerpt
    const cleanText = content
      .replace(/#{1,6}\s+/g, '') // Remover headers
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remover bold
      .replace(/\*(.*?)\*/g, '$1') // Remover italic
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Remover links
      .replace(/`([^`]+)`/g, '$1') // Remover code inline
      .trim();
    
    if (cleanText.length <= maxLength) {
      return cleanText;
    }
    
    return cleanText.substring(0, maxLength).trim() + '...';
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[áàäâ]/g, 'a')
      .replace(/[éèëê]/g, 'e')
      .replace(/[íìïî]/g, 'i')
      .replace(/[óòöô]/g, 'o')
      .replace(/[úùüû]/g, 'u')
      .replace(/[ñ]/g, 'n')
      .replace(/[ç]/g, 'c')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .replace(/^-|-$/g, '');
  }

  /**
   * Reduce los niveles de headers en 2 (h1→h3, h2→h4, etc.)
   * para evitar conflictos con estilos globales de h1 y h2
   */
  private reduceHeaderLevels(content: string): string {
    return content
      .replace(/^######\s+/gm, '######## ') // h6 → h8 (no existe, será texto normal)
      .replace(/^#####\s+/gm, '####### ')  // h5 → h7 (no existe, será texto normal) 
      .replace(/^####\s+/gm, '###### ')    // h4 → h6
      .replace(/^###\s+/gm, '##### ')     // h3 → h5
      .replace(/^##\s+/gm, '#### ')       // h2 → h4
      .replace(/^#\s+/gm, '### ');        // h1 → h3
  }
}
