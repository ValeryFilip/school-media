import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createServer } from 'http';
import { readFile } from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = process.env.PORT || 3000;

// Простой статический сервер для Astro
const server = createServer(async (req, res) => {
  try {
    // Обрабатываем статические файлы
    let filePath = join(__dirname, 'dist', req.url === '/' ? '/index.html' : req.url);
    
    try {
      const content = await readFile(filePath);
      res.writeHead(200);
      res.end(content);
    } catch (error) {
      // 404 для несуществующих файлов
      res.writeHead(404);
      res.end('Not Found');
    }
  } catch (error) {
    console.error('Server error:', error);
    res.writeHead(500);
    res.end('Internal Server Error');
  }
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



