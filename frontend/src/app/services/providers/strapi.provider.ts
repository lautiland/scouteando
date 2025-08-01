import { Injectable } from '@angular/core';
import { ContentProvider, Article, Category } from '../../interfaces/content.interface';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class StrapiProvider implements ContentProvider {
  
  private baseUrl: string;
  private apiToken: string = 'b7ba3d82e35166ba660a01279423d8e057d7c409e8b43932d5352982fa09e389019c093571195b7df31da7344660da5bd0b428cb498fea36d4a3977d1adf1beb448ed301b011a850c087908a9d2fddff2de4463dc586a9250214cb8c9ff96b53d25f991115ae848270d0219ad62a5b87b7b17557d4f120dc259a162bd064f965';

  constructor() {
    this.baseUrl = `${environment.content.strapiUrl}/api`;
    console.log(`🔗 StrapiProvider inicializado con URL: ${this.baseUrl}`);
  }

  private getHeaders(): HeadersInit {
    return {
      'Authorization': `Bearer ${this.apiToken}`,
      'Content-Type': 'application/json'
    };
  }

  async getArticles(): Promise<Article[]> {
    try {
      console.log(`📚 Strapi: Cargando todos los artículos`);
      const url = `${this.baseUrl}/articulos?populate=*`;
      
      const response = await fetch(url, {
        headers: this.getHeaders()
      });
      
      if (!response.ok) {
        console.error(`❌ Strapi: Error ${response.status} - ${response.statusText}`);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`✅ Strapi: ${data.data?.length || 0} artículos cargados`);
      
      return data.data?.map((item: any) => this.mapStrapiToArticle(item)) || [];
    } catch (error) {
      console.error(`❌ Error cargando artículos de Strapi:`, error);
      return [];
    }
  }

  async getArticlesByCategory(categorySlug: string): Promise<Article[]> {
    try {
      console.log(`📚 Strapi: Cargando artículos para categoría "${categorySlug}"`);
      const url = `${this.baseUrl}/articulos?filters[categoria][slug][$eq]=${categorySlug}&populate=*`;
      
      const response = await fetch(url, {
        headers: this.getHeaders()
      });
      
      if (!response.ok) {
        console.error(`❌ Strapi: Error ${response.status} - ${response.statusText}`);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`✅ Strapi: ${data.data?.length || 0} artículos encontrados para "${categorySlug}"`);
      
      return data.data?.map((item: any) => this.mapStrapiToArticle(item)) || [];
    } catch (error) {
      console.error(`❌ Error cargando artículos de Strapi para categoría ${categorySlug}:`, error);
      return [];
    }
  }

  async getArticleBySlug(slug: string): Promise<Article | null> {
    try {
      console.log(`📄 Strapi: Buscando artículo con slug "${slug}"`);
      const url = `${this.baseUrl}/articulos?filters[slug][$eq]=${slug}&populate=*`;
      
      const response = await fetch(url, {
        headers: this.getHeaders()
      });
      
      if (!response.ok) {
        console.error(`❌ Strapi: Error ${response.status} - ${response.statusText}`);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.data && data.data.length > 0) {
        console.log(`✅ Strapi: Artículo "${slug}" encontrado`);
        return this.mapStrapiToArticle(data.data[0]);
      }
      
      console.log(`⚠️ Strapi: Artículo "${slug}" no encontrado`);
      return null;
    } catch (error) {
      console.error(`❌ Error buscando artículo en Strapi con slug ${slug}:`, error);
      return null;
    }
  }

  async getCategories(): Promise<Category[]> {
    try {
      console.log(`🏷️ Strapi: Cargando categorías`);
      const url = `${this.baseUrl}/categorias`;
      
      const response = await fetch(url, {
        headers: this.getHeaders()
      });
      
      if (!response.ok) {
        console.error(`❌ Strapi: Error ${response.status} - ${response.statusText}`);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`✅ Strapi: ${data.data?.length || 0} categorías cargadas`);
      
      return data.data?.map((item: any) => this.mapStrapiToCategory(item)) || [];
    } catch (error) {
      console.error(`❌ Error cargando categorías de Strapi:`, error);
      return [];
    }
  }

  async getCategoryBySlug(slug: string): Promise<Category | null> {
    try {
      console.log(`🏷️ Strapi: Buscando categoría con slug "${slug}"`);
      const url = `${this.baseUrl}/categorias?filters[identificador][$eq]=${slug}`;
      console.log(`🔍 URL construida: ${url}`);
      
      const response = await fetch(url, {
        headers: this.getHeaders()
      });
      
      if (!response.ok) {
        console.error(`❌ Strapi: Error ${response.status} - ${response.statusText}`);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`📊 Respuesta de Strapi:`, data);
      
      if (data.data && data.data.length > 0) {
        console.log(`✅ Strapi: Categoría "${slug}" encontrada`);
        const mappedCategory = this.mapStrapiToCategory(data.data[0]);
        console.log(`🔄 Categoría mapeada:`, mappedCategory);
        return mappedCategory;
      }
      
      console.log(`⚠️ Strapi: Categoría "${slug}" no encontrada`);
      return null;
    } catch (error) {
      console.error(`❌ Error buscando categoría en Strapi con slug ${slug}:`, error);
      return null;
    }
  }

  private mapStrapiToArticle(strapiItem: any): Article {
    const attributes = strapiItem.attributes || strapiItem;
    return {
      id: strapiItem.id?.toString() || attributes.slug,
      title: attributes.title || attributes.titulo,
      slug: attributes.slug,
      excerpt: attributes.excerpt || attributes.resumen || '',
      content: attributes.content || attributes.contenido || '',
      category: attributes.categoria?.data?.attributes?.slug || attributes.category?.data?.attributes?.slug || '',
      author: attributes.autor?.data?.attributes?.name || attributes.author?.data?.attributes?.name || attributes.autor || attributes.author || 'Autor desconocido',
      createdAt: new Date(attributes.publishedAt || attributes.createdAt || new Date().toISOString()),
      updatedAt: new Date(attributes.updatedAt || attributes.publishedAt || attributes.createdAt || new Date().toISOString()),
      imageUrl: attributes.image?.data?.attributes?.url || attributes.imagen?.data?.attributes?.url || ''
    };
  }

  private mapStrapiToCategory(strapiItem: any): Category {
    const attributes = strapiItem.attributes || strapiItem;
    return {
      id: strapiItem.id?.toString() || attributes.identificador || attributes.slug,
      name: attributes.nombre || attributes.name,
      slug: attributes.identificador || attributes.slug,
      description: attributes.descripcion || attributes.description || ''
    };
  }

  private calculateReadingTime(content: string): number {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  }
}
