import path from 'path';
import fs from 'fs';

const CANTIDAD_ARTICULOS_RECIENTES = 8;

const generateIndex = (templatePath, jsonFilePath) => {
    // Eliminar el archivo index.html si existe
    const indexPath = path.join(process.cwd(), 'index.html');
    if (fs.existsSync(indexPath)) {
        fs.unlinkSync(indexPath);
    }

    // Leer el template
    let template = fs.readFileSync(templatePath, 'utf8');

    // Leer el archivo .json
    const allArticles = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));

    // Seleccionar los primeros 'x' artículos
    const articles = allArticles.slice(0, CANTIDAD_ARTICULOS_RECIENTES);

    const recentEntries = articles.map(article => `
        <div class="container col-sm-12 col-md-6 col-lg-3 mb-4">
            <article class="row cuadro h-100">
                <div class="row align-self-start display-inline-block">
                    <h3>${article.data.titulo}</h3>
                    <p>${article.data.descripcion}</p>
                </div>
                <div class="col align-self-end centrar">
                    <form>
                        <button type="reset" onclick="location.href='${article.data.categoria}/${article.filename}.html'">
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

export default generateIndex;