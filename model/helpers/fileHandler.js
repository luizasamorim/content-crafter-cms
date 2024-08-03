const fsPromises = require('fs').promises;
const path = require('path');
const dirName = 'storage';

async function read(fileName) {
  try {
    const filePath = path.join(dirName, fileName);
    await createDirectoryIfNotExists(dirName);
    
    // Verifica se o arquivo existe
    try {
      await fsPromises.access(filePath);
    } catch (error) {
      // Se o arquivo não existir, cria um arquivo vazio
      if (error.code === 'ENOENT') {
        await fsPromises.writeFile(filePath, '');
        return {};
      }
      throw error; // Lança erro se for um erro diferente de "ENOENT"
    }

    //verifica se o arquivo é vazio
    const stats = await fsPromises.stat(filePath);
    if (stats.size === 0) { 
      return []
    }
    
    const fileData = await fsPromises.readFile(filePath, 'utf8');
    return JSON.parse(fileData);
  } catch (error) {
    throw error;
  }
}

async function write(fileName, data) {
  try {
    const filePath = path.join(dirName, fileName);
    await fsPromises.writeFile(filePath, JSON.stringify(data));
  } catch (error) {
    throw error;
  }
}

async function createDirectoryIfNotExists(directory) {
  try {
    await fsPromises.access(directory);
  } catch (error) {
    if (error.code === 'ENOENT') {
      await fsPromises.mkdir(directory, { recursive: true });
    } else {
      throw error;
    }
  }
}

module.exports = { read, write };