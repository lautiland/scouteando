import fs from 'fs';
import mkdirp from 'mkdirp';
import path from 'path';

const templatize = (template, { titulo, categoria, autor, fecha, content }) => template
	.replace(/<!-- TITULO -->/g, titulo)
	.replace(/<!-- CATEGORIA -->/g, categoria)
	.replace(/<!-- CONTENT -->/g, content)
	.replace(/<!-- AUTOR -->/g, autor)
	.replace(/<!-- FECHA -->/g, fecha)
const saveFile = (filename, contents) => {
	const dir = path.dirname(filename);
	mkdirp.sync(dir);
	fs.writeFileSync(filename, contents);
};
const getOutputFilename = (basename, categoria) => {
	// Asegúrate de que la categoría no tenga caracteres no deseados que puedan causar problemas en los nombres de los archivos
	const safeCategoria = categoria.replace(/[^a-z0-9]/gi, '_').toLowerCase();

	// Usa el nombre base del archivo en la ruta de salida
	return path.join(safeCategoria, `${basename}.html`);
};
const insertArticleInCategory = (file, categorias) => {
	// Crear un elemento HTML para el artículo
	const articuloElemento = `
	<div class="cuadro">
		<article>
			<h3>${file.data.titulo}</h3>
			<p>${file.data.descripcion}</p>

			<div class="centrar">
				<form>
					<button type="reset" onclick="location.href='${file.data.categoria}/${file.filename}.html'">
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
};
export const processArticles = (jsonFilePath, templatePath, categorias) => {
	// Leer el archivo JSON
	const articles = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));

	// Leer el template
	const template = fs.readFileSync(templatePath, 'utf8');

	// Procesar cada artículo
	articles.forEach((article) => {
		const file = article;
		const basename = file.filename;
		const outfilename = getOutputFilename(basename, file.data.categoria);

		insertArticleInCategory(file, categorias);

		const templatized = templatize(template, {
			titulo: file.data.titulo,
			categoria: file.data.categoria,
			autor: file.data.autor,
			fecha: file.data.fecha,
			content: file.html,
		});

		saveFile(outfilename, templatized);
		console.log(`📝 ${outfilename}`);
	});
};

export default processArticles;