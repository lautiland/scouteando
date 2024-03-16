import fs from 'fs'
import glob from 'glob'
import mkdirp from 'mkdirp'
import path from 'path'
import rimraf from 'rimraf'

import generateIndex from './js/generateIndexModule.js'
import readFile from './js/readFile.js'

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

const getOutputFilename = (basename, categoria) => {
    // Asegúrate de que la categoría no tenga caracteres no deseados que puedan causar problemas en los nombres de los archivos
    const safeCategoria = categoria.replace(/[^a-z0-9]/gi, '_').toLowerCase();

    // Usa el nombre base del archivo en la ruta de salida
    return path.join(safeCategoria, `${basename}.html`);
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
					<button type="reset" onclick="location.href='${file.data.categoria}/${file.data.filename}.html'">
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

const processFile = (filename, template, categorias) => {
    const file = readFile(filename)
    if (!file) {
        console.error(`No se pudo leer el archivo: ${filename}`);
        return;
    }

    const basename = path.basename(filename, '.md')
	file.data.filename = basename;
    const outfilename = getOutputFilename(basename, file.data.categoria)

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
        const categoriaDir = path.join(process.cwd(), categoria);

        if (fs.existsSync(categoriaPath)) {
            fs.unlinkSync(categoriaPath);
        }

        if (fs.existsSync(categoriaDir)) {
            rimraf.sync(categoriaDir);
        }
    });
}

const main = () => {
	
	const categorias = {"organizacion":"Organización", "teoria":"Teoría", "campismo":"Campismo", "historia":"Historia"};
	
	const srcPath = path.resolve('src')
	const template = fs.readFileSync(path.join(srcPath, 'templates/articulo_template.html'), 'utf8')
	const filenames = glob.sync(srcPath + '/articulos/**/*.md')

	deleteFilesCategory(categorias);

	generateIndex(path.join(srcPath, 'templates/index_template.html'), srcPath);
	filenames.forEach((filename) => {
		processFile(filename, template, categorias)
	})
}

main()