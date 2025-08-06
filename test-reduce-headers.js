// Test del método reduceHeaderLevels
function reduceHeaderLevels(content) {
    return content
      .replace(/^######\s+/gm, '######## ') // h6 → h8 (no existe, será texto normal)
      .replace(/^#####\s+/gm, '####### ')  // h5 → h7 (no existe, será texto normal) 
      .replace(/^####\s+/gm, '###### ')    // h4 → h6
      .replace(/^###\s+/gm, '##### ')     // h3 → h5
      .replace(/^##\s+/gm, '#### ')       // h2 → h4
      .replace(/^#\s+/gm, '### ');        // h1 → h3
}

const testContent = `## Texto de la Promesa

> "Yo, **Nombre y Apellido**, por mi honor prometo hacer cuanto de mí dependa para cumplir mis deberes para con Dios, la Patria, los demás y conmigo mismo/a, ayudar siempre al prójimo y vivir la Ley Scout."

Lo importante del texto es la adhesión voluntaria.`;

console.log('Contenido original:');
console.log(testContent);
console.log('\nContenido después de reduceHeaderLevels:');
console.log(reduceHeaderLevels(testContent));
