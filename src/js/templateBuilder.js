import fs from 'fs';
import path from 'path';

const generateTemplates = (templatePath) => {
    // Leer el template original
    const originalTemplate = fs.readFileSync(templatePath, 'utf8');

    // Definir los nombres de los nuevos templates
    const newTemplates = ['index_template.html', 'categoria_template.html', 'articulo_template.html'];

    // Definir las constantes
    const constants = {
        LOGO_SVG_B_PATH: 'src/media/logo_black.svg',
        LOGO_SVG_W_PATH: 'src/media/logo_white.svg',
        LOGO_ICO_PATH: 'src/media/logo.ico',
        RESET_CSS_PATH: 'src/css/reset.css',
        STYLES_CSS_PATH: 'src/css/styles.css',
        BOOTSTRAP_CSS_PATH: 'src/css/bootstrap.min.css',
        BOOTSTRAP_JS_PATH: 'src/js/bootstrap.bundle.min.js',
        INDEX_PATH: 'index.html',
        ORGANIZACION_PATH: 'organizacion.html',
        TEORIA_PATH: 'teoria.html',
        CAMPISMO_PATH: 'campismo.html',
        HISTORIA_PATH: 'historia.html',
        INSTAGRAM_ICO_PATH: 'src/media/instagram.ico',
        TWITTERX_ICO_PATH: 'src/media/twitterx.ico',
        PINTEREST_ICO_PATH: 'src/media/pinterest.ico',
        YOUTUBE_ICO_PATH: 'src/media/youtube.ico',
    };

    // Definir el fragmento de código HTML para index_template.html
    const sectionsHTML = {
        'index_template.html': `
        <h2 class="col-12">Te damos la bienvenida a este gran juego: La Vida Scout</h2>
        <div class="col-sm-12 col-md-12 col-lg-12">
            <article>
                <p class="bienvenida">
                    Venimos a compartir con vos un espacio dedicado al apasionante mundo del movimiento scout. Este sitio está diseñado para explorar en profundidad los aspectos fundamentales del escultismo, desde sus valores hasta su estructura organizativa, pasando por su rica historia y por las obras literarias que han guiado a generaciones de scouts. En este lugar, encontrarás información objetiva y detallada sobre el movimiento scout, diseñada para informar y educar a aquellos interesados en este noble legado. 
                </p>
            </article><br>
        </div><br>
        <div id="carouselExampleInterval" class="carousel slide col-sm-10 col-md-8 m-auto" data-bs-ride="carousel">
            <div class="carousel-inner">
                <div class="carousel-item active" data-bs-interval="4500">
                    <img src="src/media/frase_1.jpg" class="d-block w-100" alt="un joven haciendo una actividad scout">
                    <div class="carousel-caption slider_contenido">
                        <h5 class="m-auto fs-1">"Tratad de dejar este mundo en mejores condiciones de como lo encontrasteis" -BP</h5>
                    </div>
                </div>
                <div class="carousel-item" data-bs-interval="4500">
                    <img src="src/media/frase_2.jpg" class="d-block w-100" alt="muchos scout posando para una foto">
                    <div class="carousel-caption slider_contenido">
                        <h5 class="m-auto fs-1">“... la verdadera manera de obtener la felicidad es haciendo felices a los demás.” -BP</h5>
                    </div>
                </div>
                <div class="carousel-item" data-bs-interval="4500">
                    <img src="src/media/frase_3.jpg" class="d-block w-100" alt="un evento nacional scout con baile">
                    <div class="carousel-caption slider_contenido">
                        <h5 class="m-auto fs-1">“Ser scout es hablar de tus aventuras sin parar de sonreir." -BP</h5>
                    </div>
                </div>
                <div class="carousel-item" data-bs-interval="4500">
                    <img src="src/media/frase_4.jpg" class="d-block w-100" alt="un evento nacional scout">
                    <div class="carousel-caption slider_contenido">
                        <h5 class="m-auto fs-1">“Una dificultad deja de serlo tan pronto como sonrías ante ella y la afrontas.” -BP</h5>
                    </div>
                </div>
                <div class="carousel-item" data-bs-interval="4500">
                    <img src="src/media/frase_5.jpg" class="d-block w-100" alt="una fogata scout">
                    <div class="carousel-caption slider_contenido">
                        <h5 class="m-auto fs-1"><br>estad listos, estad listas.</h5>
                    </div>
                </div>
            </div>
        </div>
        <div class="row justify-content-evenly"><br>
            <h2 id="recientes" class="col-12">Entradas recientes</h2>
                <!-- ARTICULOS RECIENTES -->
            <br>
            <br>
        </div>
        `,
        'categoria_template.html': `
            <div class="row justify-content-between">
                <h2 class="col-12">
                    <!-- CATEGORIA -->
                </h2><br>
                <div class="col-12">
                    <!-- ARTICULOS -->
                </div>
            </div>
        `,
        'articulo_template.html': `
            <div row justify-content-between>
                <div class="col-12 cuadro">
                    <h3 class="col-12 text-center">
                        <!-- TITULO -->
                    </h3>
                    <article>
                        <!-- CONTENT -->
                        <p class="text-end fst-italic text-black-50">
                            ~ <!-- AUTOR --> <br>
                            <!-- FECHA -->
                        </p>
                    </article><br>
                </div><br>
            </div>
        `
    };

    // Generar los nuevos templates
    newTemplates.forEach((templateName) => {
        let newTemplate = originalTemplate;

        // Reemplazar el comentario <!-- SECTION --> con el fragmento de código HTML
        newTemplate = newTemplate.replace('<!-- SECTION -->', sectionsHTML[templateName]);

        // Reemplazar los comentarios <!-- NOMBRE_CONSTANTE --> con los valores de las constantes
        for (const [constantName, constantValue] of Object.entries(constants)) {
            const comment = `${constantName}`;
            const value = templateName === 'articulo_template.html' ? `../${constantValue}` : constantValue;
            newTemplate = newTemplate.replace(new RegExp(comment, 'g'), value);
        }

        // Escribir el nuevo template en un archivo
        const newTemplatePath = path.join(path.dirname(templatePath), templateName);
        fs.writeFileSync(newTemplatePath, newTemplate, 'utf8');
    })
}
export default generateTemplates;