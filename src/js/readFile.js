import fs from 'fs';
import matter from 'gray-matter';
import marked from 'marked';
import path from 'path';

const readFile = (filePathAndName) => {
    const rawFile = fs.readFileSync(filePathAndName, 'utf8');
    const parsed = matter(rawFile);

    // Verificar que la fecha es válida antes de procesarla
    const fecha = parsed.data.fecha;
    const isValidDate = /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(fecha);

    if (!isValidDate) {
        console.error(`Fecha no válida en el archivo: ${filePathAndName}`);
        return null; // O manejar el caso de fecha no válida según tus necesidades
    }

    const html = marked(parsed.content);

    // Extrae el nombre del archivo de la ruta del archivo sin la extensión
    const filename = path.basename(filePathAndName, '.md');

    // Agrega el nombre del archivo al objeto que estás devolviendo
    return { ...parsed, html, filename };
};

export default readFile;