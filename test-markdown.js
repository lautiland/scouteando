// Test de procesamiento de markdown
import { marked } from 'marked';

const testMarkdown = `
## Texto de la Promesa

> "Yo, **Nombre y Apellido**, por mi honor prometo hacer cuanto de mí dependa para cumplir mis deberes para con Dios, la Patria, los demás y conmigo mismo/a, ayudar siempre al prójimo y vivir la Ley Scout."

Lo importante del texto es la adhesión voluntaria.
`;

const markedOptions = {
  breaks: false,
  gfm: true,
  pedantic: false
};

const result = marked.parse(testMarkdown, markedOptions);
console.log('HTML generado:');
console.log(result);
