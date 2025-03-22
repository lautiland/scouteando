import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, forkJoin, of, from } from 'rxjs';
import { map, switchMap, tap, catchError } from 'rxjs/operators';
import { take } from 'rxjs/operators';
import moment from 'moment';
import localforage from 'localforage';

@Injectable({ providedIn: 'root' })
export class DriveService {
  private apiUrl = 'https://www.googleapis.com/drive/v3/files';
  private exportUrl = 'https://www.googleapis.com/drive/v3/files/';
  private memoryCache = new Map<string, { data: any, expires: number }>();
  private preloadedArticles = new Map<string, any>();
  private readonly CACHE_TTL = 300000; // 5 minutos
  private readonly BATCH_SIZE = 5; // Tamaño reducido de lote para mejor rendimiento

  private driveCache = localforage.createInstance({
    name: 'DriveCache',
    storeName: 'articles'
  });

  constructor(private http: HttpClient) {
    this.initializeCache();
    this.configureLocalForage();
  }

  private async configureLocalForage(): Promise<void> {
    await localforage.ready();
    localforage.config({
      driver: [
        localforage.INDEXEDDB,
        localforage.LOCALSTORAGE,
        localforage.WEBSQL
      ],
      name: 'DriveCache',
      storeName: 'articles'
    });
  }

  private async initializeCache(): Promise<void> {
    await this.driveCache.ready();
  }

  getFilesByCategory(categoryId: string): Observable<any[]> {
    const cacheKey = `category-${categoryId}`;

    return from(this.getCacheData(cacheKey)).pipe(
      switchMap(cachedData => {
        if (cachedData) {
      
          return of(cachedData);
        }
    
        return this.fetchAndProcessData(categoryId, cacheKey);
      })
    );
  }

  private async getCacheData(cacheKey: string): Promise<any> {
    const memoryData = this.memoryCache.get(cacheKey);
    if (memoryData && memoryData.expires > Date.now()) {
  
      return memoryData.data;
    }

    const diskData = await this.driveCache.getItem<{ data: any, expires: number }>(cacheKey);
    if (diskData && diskData.expires > Date.now()) {
  
      this.memoryCache.set(cacheKey, { data: diskData.data, expires: diskData.expires });
      return diskData.data;
    }


    return null;
  }

  private fetchAndProcessData(categoryId: string, cacheKey: string): Observable<any[]> {
    const query = encodeURIComponent(
      `'${categoryId}' in parents and mimeType='application/vnd.google-apps.document' and trashed=false`
    );

    const fields = [
      'id',
      'name',
      'modifiedTime',
      'lastModifyingUser/displayName',
      'owners/displayName'
    ].join(',');

    const url = `${this.apiUrl}?q=${query}&key=${environment.drive.apiKey}&fields=files(${fields})`;


    return this.http.get<{ files: any[] }>(url).pipe(
      switchMap(res => this.processFilesInBatches(res.files)),
      map(files => this.formatFiles(files)),
      tap(data => {
    
        this.updateCache(cacheKey, data);
      }),
      catchError(error => {
        console.error('Error fetching data:', error);
        return of([]);
      })
    );
  }

  preloadArticlesInCategory(categoryId: string): void {
    const cacheKey = `category-${categoryId}`;
    
    this.cacheValid(cacheKey).then(isValid => {
      if (!isValid) {
        this.getFilesByCategory(categoryId).pipe(
          take(1),
          switchMap(files => {
            const preloadObservables = files.map(file => 
              this.getArticleContent(file.id).pipe(
                take(1),
                tap(article => {
                  if (article) {
                    this.preloadedArticles.set(article.id, article);
                    this.updateCache(`article-${article.id}`, article);
                  }
                })
              )
            );
            return forkJoin(preloadObservables);
          }),
          catchError(error => {
            console.error('Error preloading articles:', error);
            return of([]);
          })
        ).subscribe();
      }
    });
  }

  private formatFiles(files: any[]): any[] {
    return files.map(file => ({
      id: file.id,
      nombre: file.name,
      ultimaModificacion: moment(file.modifiedTime).format('DD/MM/YYYY HH:mm'),
      ultimoUsuario: file.lastModifyingUser?.displayName || 
                    file.owners?.[0]?.displayName || 
                    'Autor no identificado',
      primerParrafo: file.content || 'Contenido no disponible'
    }));
  }

  private processFilesInBatches(files: any[]): Observable<any[]> {
    const batches = [];
    for (let i = 0; i < files.length; i += this.BATCH_SIZE) {
      const batch = files.slice(i, i + this.BATCH_SIZE).map(file => 
        this.getDocumentContent(file.id, 'text/plain').pipe(
          map(content => ({
            ...file,
            content: this.extractFirstParagraph(content)
          })),
          catchError(error => {
            console.error('Error loading file content:', error);
            return of({ ...file, content: 'No se pudo cargar el contenido' });
          })
        )
      );
      batches.push(forkJoin(batch));
    }
    return batches.length > 0 ? forkJoin<any[]>(batches).pipe(map(b => ([] as any[]).concat(...b))) : of([]);
  }

  private async updateCache(key: string, data: any): Promise<void> {
    const cacheEntry = {
      data: data,
      expires: Date.now() + this.CACHE_TTL
    };

    this.memoryCache.set(key, cacheEntry);
    await this.driveCache.setItem(key, cacheEntry);
  }

  getArticleContent(fileId: string): Observable<any> {
    return from(this.tryGetPreloadedArticle(fileId)).pipe(
      switchMap(article => article ? of(article) : this.fetchArticleContent(fileId))
    );
  }

  private async tryGetPreloadedArticle(fileId: string): Promise<any> {
    if (this.preloadedArticles.has(fileId)) {
      const article = this.preloadedArticles.get(fileId);
      this.preloadedArticles.delete(fileId);
      return article;
    }
    return null;
  }

  private fetchArticleContent(fileId: string): Observable<any> {
    return forkJoin({
      metadata: this.http.get<any>(
        `${this.apiUrl}/${fileId}?key=${environment.drive.apiKey}&fields=id,name,modifiedTime,lastModifyingUser`
      ).pipe(catchError(() => of(null))),
      content: this.getDocumentContent(fileId, 'text/html').pipe(catchError(() => of('')))
    }).pipe(
      map(({ metadata, content }) => ({
        id: metadata?.id || fileId,
        nombre: metadata?.name || 'Artículo no encontrado',
        ultimaModificacion: metadata?.modifiedTime ? 
          moment(metadata.modifiedTime).format('DD/MM/YYYY') : 'Fecha desconocida',
        ultimoUsuario: metadata?.lastModifyingUser?.displayName || 'Autor desconocido',
        contenidoHTML: content
      }))
    );
  }

  preloadArticle(fileId: string): void {
    if (!this.preloadedArticles.has(fileId)) {
      this.getArticleContent(fileId).pipe(
        take(1),
        tap(article => {
          if (article) {
            this.preloadedArticles.set(fileId, article);
            this.updateCache(`article-${fileId}`, article);
          }
        }),
        catchError(() => of(null))
      ).subscribe();
    }
  }

  preloadCategory(categoryId: string): void {
    const cacheKey = `category-${categoryId}`;
    if (!this.cacheValid(cacheKey)) {
      this.getFilesByCategory(categoryId).pipe(
        take(1),
        catchError(() => of([]))
      ).subscribe();
    }
  }

  preloadAllCategories(): void {
    const categories = Object.keys(environment.drive.folders.categorias) as Array<keyof typeof environment.drive.folders.categorias>;
    categories.forEach(categoryId => {
      const cacheKey = `category-${environment.drive.folders.categorias[categoryId].id}`;
      this.cacheValid(cacheKey).then(isValid => {
        if (!isValid) {
      
          this.getFilesByCategory(environment.drive.folders.categorias[categoryId].id).pipe(take(1)).subscribe();
        }
      });
    });
  }

  private getDocumentContent(fileId: string, mimeType: string): Observable<string> {
    const url = new URL(`${this.exportUrl}${fileId}/export`);
    url.searchParams.set('mimeType', mimeType);
    url.searchParams.set('key', environment.drive.apiKey);
    
    return this.http.get(url.toString(), { 
      responseType: 'text',
      headers: { 'Cache-Control': 'max-age=3600' } 
    });
  }

  private extractFirstParagraph(content: string): string {
    try {
      const cleanContent = content
        .replace(/\s+/g, ' ')
        .replace(/<\/?[^>]+(>|$)/g, '');
      
      return cleanContent.slice(0, 200).trim() + 
        (cleanContent.length > 200 ? '...' : '');
    } catch (error) {
      return 'Contenido no disponible';
    }
  }

  private async cacheValid(key: string): Promise<boolean> {
    const memoryCache = this.memoryCache.get(key);
    if (memoryCache && memoryCache.expires > Date.now()) {
      return true;
    }

    try {
      const diskCache = await localforage.getItem<{ expires: number }>(key);
      if (diskCache && diskCache.expires && diskCache.expires > Date.now()) {
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error checking disk cache:', error);
      return false;
    }
  }
}