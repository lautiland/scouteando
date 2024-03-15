import { create } from 'domain'
import fs from 'fs'
import glob from 'glob'
import matter from 'gray-matter'
import marked from 'marked'
import mkdirp from 'mkdirp'
import path from 'path'

const readFile = (filename) => {
    const rawFile = fs.readFileSync(filename, 'utf8');
    const parsed = matter(rawFile);

    // Verificar que la fecha es válida antes de procesarla
    const fecha = parsed.data.fecha;
    const isValidDate = /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(fecha);

    if (!isValidDate) {
        console.error(`Fecha no válida en el archivo: ${filename}`);
        return null; // O manejar el caso de fecha no válida según tus necesidades
    }

    const html = marked(parsed.content);

    return { ...parsed, html };
};

const templatize = (template, {titulo, categoria, autor, fecha, content}) =>
	template
		.replace(/<!-- TITULO -->/g, titulo)
		.replace(/<!-- CATEGORIA -->/g, categoria)
		.replace(/<!-- CONTENT -->/g, content)
		.replace(/<!-- AUTOR -->/g, autor)
		.replace(/<!-- FECHA -->/g, fecha)

const saveFile = (filename, contents) => {
	const dir = path.dirname(filename)
	mkdirp.sync(dir)
	fs.writeFileSync(filename, contents)
}

const getOutputFilename = (id, outPath) => {
	const basename = path.basename(id.toString())
	const newfilename = basename + '.html'
	const outfile = path.join(outPath, newfilename)
	return outfile
}

const insertArticleInCategory = (file, categorias) => {
	// Crear un elemento HTML para el artículo
	const articuloElemento = `
	<div class="cuadro">
		<article>
			<h3>${file.data.titulo}</h3>
			<p>${file.data.descripcion}</p>

			<div class="centrar">
				<form>
					<button type="reset" onclick="location.href='articulos/${file.data.id}.html'">
						Leer mas
					</button>
				</form>
			</div>
		</article>
	</div>`;

	// Crear el comentario de la categoría
	const comentarioCategoria = `<!-- ARTICULOS ${file.data.categoria.toUpperCase()}-->`;

	// Leer el archivo HTML de la categoría
	const categoriaPath = path.join(process.cwd(), `${file.data.categoria}.html`);
	let categoriaTemplate = '';

	if (fs.existsSync(categoriaPath)) {
		categoriaTemplate = fs.readFileSync(categoriaPath, 'utf8');
	} else {
		// Copiar el template de la categoria y nombrarlo como el archivo de la categoria
		const templatePath = path.join(process.cwd(), 'src/templates/categoria_template.html');
		categoriaTemplate = fs.readFileSync(templatePath, 'utf8');
		categoriaTemplate = categoriaTemplate.replace(/<!-- CATEGORIA -->/g, categorias[file.data.categoria]);
		categoriaTemplate = categoriaTemplate.replace(/<!-- ARTICULOS -->/g, comentarioCategoria);
		fs.writeFileSync(categoriaPath, categoriaTemplate);
	}

	// Insertar el elemento del artículo en el lugar correcto en tu HTML
	categoriaTemplate = categoriaTemplate.replace(comentarioCategoria, articuloElemento + comentarioCategoria);

	// Guardar los cambios en el archivo de la categoría
	fs.writeFileSync(categoriaPath, categoriaTemplate);
}

const processFile = (filename, template, outPath, categorias) => {
	const file = readFile(filename)
	const outfilename = getOutputFilename(file.data.id, outPath)

	insertArticleInCategory(file, categorias);

	const templatized = templatize(template, {
		titulo: file.data.titulo,
		categoria: file.data.categoria,
		autor: file.data.autor,
		fecha: file.data.fecha,
		content: file.html,
	})

	saveFile(outfilename, templatized)
	console.log(`📝 ${outfilename}`) 
}

const deleteFilesCategory = (categorias) => {
	Object.keys(categorias).forEach((categoria) => {
		const categoriaPath = path.join(process.cwd(), `${categoria}.html`);
		if (fs.existsSync(categoriaPath)) {
			fs.unlinkSync(categoriaPath);
		}
	});
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
        // Usar el id del artículo como id
        article.id = article.data.id;
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

    return recentArticles.map(({ data: { titulo, descripcion }, id }) => ({
        titulo,
        descripcion,
        id,
    }));
}
  
const generateIndex = (templatePath, recentArticles) => {
	// Eliminar el archivo index.html si existe
	const indexPath = path.join(process.cwd(), 'index.html');
	if (fs.existsSync(indexPath)) {
	  	fs.unlinkSync(indexPath);
	}
  
	// Leer el template
	let template = fs.readFileSync(templatePath, 'utf8');
  
	// Crear el contenido para las entradas recientes
	const recentEntries = recentArticles.map(article => `
	<div class="container col-sm-12 col-md-6 col-lg-3 mb-4">
		<article class="row cuadro h-100">
			<div class="row align-self-start display-inline-block">
				<h3>${article.titulo}</h3>
				<p>${article.descripcion}</p>
			</div>
			<div class="col align-self-end centrar">
				<form>
					<button type="reset" onclick="location.href='articulos/${article.id}.html'">
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

const main = () => {
	
	const categorias = {"organizacion":"Organización", "teoria":"Teoría", "campismo":"Campismo", "historia":"Historia"};
	const srcPath = path.resolve('src')
	const outPath = path.resolve('articulos')
	const template = fs.readFileSync(path.join(srcPath, 'templates/articulo_template.html'), 'utf8')
	const filenames = glob.sync(srcPath + '/articulos/**/*.md')

	deleteFilesCategory(categorias)
	const recentArticles = getRecentArticles(path.join(srcPath, 'articulos'));
	generateIndex(path.join(srcPath, 'templates/index_template.html'), recentArticles);
	filenames.forEach((filename) => {
		processFile(filename, template, outPath, categorias)
	})
}

main()