const axios = require('axios');
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../assets/images');
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}

async function downloadIcon() {
  try {
    const response = await axios({
      url: 'https://raw.githubusercontent.com/expo/expo/master/templates/expo-template-blank/assets/icon.png',
      method: 'GET',
      responseType: 'stream'
    });

    const writer = fs.createWriteStream(path.join(dir, 'icon.png'));
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  } catch (error) {
    console.error('Erro ao baixar ícone:', error);
  }
}

downloadIcon().then(() => {
  console.log('Ícone baixado com sucesso!');
}); 