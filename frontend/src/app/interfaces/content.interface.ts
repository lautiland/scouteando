// Interfaces para el sistema de contenido
export interface Article {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
  imageUrl?: string;
  author?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
}

// Interface para el proveedor de datos
export interface ContentProvider {
  getArticlesByCategory(categorySlug: string): Promise<Article[]>;
  getArticleBySlug(slug: string): Promise<Article | null>;
  getCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | null>;
}

// Tipos de proveedores disponibles
export type ProviderType = 'markdown' | 'strapi' | 'drive';

// Configuración del environment
export interface ContentConfig {
  provider: ProviderType;
  baseUrl?: string;
  apiKey?: string;
  markdownPath?: string;
  strapiUrl?: string;
}
