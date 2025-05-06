require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const unzipper = require('unzipper');
const xml2js = require('xml2js');

async function getCorpCodeByName(targetName = '삼성전자') {
  const url = `https://opendart.fss.or.kr/api/corpCode.xml?crtfc_key=${process.env.DART_API_KEY}`;

  try {
    // ZIP 파일 다운로드
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const zipPath = './corpCode.zip';
    fs.writeFileSync(zipPath, response.data);

    // ZIP 파일 추출
    const directory = await unzipper.Open.file(zipPath);
    const xmlFile = directory.files.find(file => file.path.endsWith('.xml'));
    const content = await xmlFile.buffer();

    // XML 파싱
    xml2js.parseString(content, (err, result) => {
      if (err) throw err;

      const list = result.result.list;
      const match = list.find(item => item.corp_name[0] === targetName);

      if (match) {
        console.log(`[${targetName}]의 corp_code: ${match.corp_code[0]}`);
      } else {
        console.log(`${targetName}을 찾을 수 없습니다.`);
      }
    });
  } catch (err) {
    console.error('오류 발생:', err.message);
  }
}

getCorpCodeByName('삼성전자');
