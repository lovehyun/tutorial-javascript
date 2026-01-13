import dotenv from 'dotenv';
dotenv.config({ quiet: true });

import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

// const res = await ai.models.list();
// console.log(res);
// const names = res.pageInternal.map(m => m.name);
// console.log(names);

const pager = await ai.models.list(); // Pager(비동기 순회 가능)
for await (const model of pager) {
    console.log(model.name); // 모델명만
}

// 내부적으로...
// while (다음 페이지가 있으면) {
//   await fetch(다음 페이지);
//   for (각 모델) {
//     yield model;
//   }
// }
