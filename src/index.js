import path from 'path'

import templateBuilder from './js/templateBuilder.js'
import mdToJson from './js/mdToJson.js'
import deleteFilesCategory from './js/deleteFilesCategory.js'
import generateIndex from './js/generateIndex.js'
import processArticles from './js/processArticles.js'

const main = () => {
	
	const categorias = {"organizacion":"Organización", "teoria":"Teoría", "campismo":"Campismo", "historia":"Historia"};
	const srcPath = path.resolve('src')
	const articlesPath = path.join(srcPath, 'articulos')
	const pageTemplatePath = path.join(srcPath, 'templates/page_template.html')
	const articleTemplatePath = path.join(srcPath, 'templates/articulo_template.html')
	const indexTemplatePath = path.join(srcPath, 'templates/index_template.html')
	const jsonPath = mdToJson(articlesPath)

	deleteFilesCategory(categorias)
	templateBuilder(pageTemplatePath)
	generateIndex(indexTemplatePath, jsonPath)
	processArticles(jsonPath, articleTemplatePath, categorias)
}

main()