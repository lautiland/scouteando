import path from 'path'

import generateIndex from './js/generateIndex.js'
import mdToJson from './js/mdToJson.js'
import deleteFilesCategory from './js/deleteFilesCategory.js'
import processArticles from './js/processArticles.js'

const main = () => {
	
	const categorias = {"organizacion":"Organización", "teoria":"Teoría", "campismo":"Campismo", "historia":"Historia"};
	const srcPath = path.resolve('src')
	const articlesPath = path.join(srcPath, 'articulos')
	const articleTemplatePath = path.join(srcPath, 'templates/articulo_template.html')
	const jsonPath = mdToJson(articlesPath)

	deleteFilesCategory(categorias)

	generateIndex(path.join(srcPath, 'templates/index_template.html'), jsonPath)
	processArticles(jsonPath, articleTemplatePath, categorias)
}

main()