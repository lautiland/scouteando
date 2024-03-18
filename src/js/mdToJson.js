import fs from 'fs';
import matter from 'gray-matter';
import marked from 'marked';
import path from 'path';

const mdToJson = (folderPath) => {
    const files = fs.readdirSync(folderPath);
    const articles = [];

    files.forEach((file) => {
        if (path.extname(file) === '.md') {
            const filePath = path.join(folderPath, file);
            const article = readFile(filePath);
            if (article) {
                delete article.content;
                delete article.isEmpty;
                delete article.excerpt;
                articles.push(article);
            }
        }
    });

    // Ordena los artículos por fecha de más reciente a más antiguo y luego por id de menor a mayor
    articles.sort((a, b) => {
        const dateA = a.data.fecha.split("/").reverse().join();
        const dateB = b.data.fecha.split("/").reverse().join();

        if (dateA > dateB) return -1;
        if (dateA < dateB) return 1;

        // Si las fechas son iguales, ordena por id de menor a mayor
        if (a.data.id < b.data.id) return -1;
        if (a.data.id > b.data.id) return 1;

        return 0;
    });

    const jsonContent = JSON.stringify(articles, null, 2);
    const jsonFilePath = path.join(folderPath, 'articulos.json');

    fs.writeFileSync(jsonFilePath, jsonContent, 'utf8');
    return jsonFilePath;
};

const readFile = (filePathAndName) => {
    const rawFile = fs.readFileSync(filePathAndName, 'utf8');
    const parsed = matter(rawFile);

    const fecha = parsed.data.fecha;
    const isValidDate = /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(fecha);

    if (!isValidDate) {
        console.error(`Fecha no válida en el archivo: ${filePathAndName}`);
        return null;
    }

    const html = marked(parsed.content);
    const filename = path.basename(filePathAndName, '.md');

    return { ...parsed, html, filename };
};

export default mdToJson;