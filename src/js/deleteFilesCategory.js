import fs from "fs";
import path from "path";
import rimraf from "rimraf";


export const deleteFilesCategory = (categorias) => {
	Object.keys(categorias).forEach((categoria) => {
		const categoriaPath = path.join(process.cwd(), `${categoria}.html`)
		const categoriaDir = path.join(process.cwd(), categoria)

		if (fs.existsSync(categoriaPath)) {
			fs.unlinkSync(categoriaPath)
		}

		if (fs.existsSync(categoriaDir)) {
			rimraf.sync(categoriaDir)
		}
	})
}

export default deleteFilesCategory;