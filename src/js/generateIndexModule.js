import path from 'path';
import fs from 'fs';
import glob from 'glob';

import readFile from './readFile.js';

const generateIndex = (templatePath, srcPath) => {
	// Eliminar el archivo index.html si existe
	const indexPath = path.join(process.cwd(), 'index.html');
	if (fs.existsSync(indexPath)) {
	  	fs.unlinkSync(indexPath);
	}
  
	// Leer el template
	let template = fs.readFileSync(templatePath, 'utf8');
  
	// Crear el contenido para las entradas recientes
    // Obtén una lista de todas las carpetas en el directorio de origen
    const categoryFolders = fs.readdirSync(srcPath).filter(file => fs.statSync(path.join(srcPath, file)).isDirectory());

    // Itera sobre cada carpeta de categoría y obtén los artículos recientes
    const recentArticles = categoryFolders.flatMap(folder => getRecentArticles(path.join(srcPath, folder)));

    const recentEntries = recentArticles.map(article => `
        <div class="container col-sm-12 col-md-6 col-lg-3 mb-4">
            <article class="row cuadro h-100">
                <div class="row align-self-start display-inline-block">
                    <h3>${article.titulo}</h3>
                    <p>${article.descripcion}</p>
                </div>
                <div class="col align-self-end centrar">
                    <form>
                        <button type="reset" onclick="location.href='${article.categoria}/${article.filename}.html'">
                            Leer más
                        </button>
                    </form>
                </div>
            </article><br>
        </div>
    `).join('');
  
	if (recentEntries) {
	  template = template.replace('<!-- ARTICULOS RECIENTES -->', recentEntries);
	}
  
	// Guardar el nuevo index.html
	fs.writeFileSync(indexPath, template);

}

const getRecentArticles = (directory) => {
    // Leer todos los archivos en el directorio
    const files = glob.sync(path.join(directory, '*.md'));

    // Leer y parsear cada archivo
    const articles = files.map(filename => {
        const article = readFile(filename);
        if (!article) {
            console.error(`No se pudo leer el archivo correctamente: ${filename}`);
        }
        return article;
    });

    // Filtrar los artículos con fechas válidas y obtener los más recientes
    const validArticles = articles.filter(article => {
        if (!article) {
            return false;
        }
        return !isNaN(new Date(article.data.fecha));
    });

    // Ordenar los artículos por fecha (más reciente primero)
    validArticles.sort((a, b) => {
        const dateA = new Date(a.data.fecha.split('/').reverse().join('-'));
        const dateB = new Date(b.data.fecha.split('/').reverse().join('-'));
        return dateB - dateA;
    });

    // Obtener los más recientes
    const recentArticles = validArticles.slice(0, 8);

    return recentArticles.map(({ data: { titulo, categoria, descripcion }, filename }) => ({
        titulo,
        categoria,
        descripcion,
        filename,
    }));
}

export default generateIndex;