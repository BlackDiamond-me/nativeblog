import fs from 'fs';
import { XMLParser } from 'fast-xml-parser';

async function generateStaticSite() {
    // ΑΝΤΙΚΑΤΑΣΤΗΣΕ ΤΟ URL ΜΕ ΤΟ ΔΙΚΟ ΣΟΥ BLOG
    const RSS_URL = "https://project-econews.blogspot.com/feeds/posts/default";
    
    try {
        const response = await fetch(RSS_URL);
        const xmlData = await response.text();
        const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_" });
        const jObj = parser.parse(xmlData);
        const entries = Array.isArray(jObj.feed.entry) ? jObj.feed.entry : [jObj.feed.entry];

        if (!fs.existsSync('./dist')) fs.mkdirSync('./dist');

        let indexLinks = "";
        for (const entry of entries) {
            const title = entry.title['#text'] || entry.title;
            const content = entry.content['#text'] || entry.content;
            const id = entry.id.split('-').pop();
            const fileName = `post-${id}.html`;

            const postHtml = `<!DOCTYPE html><html lang="el"><head><meta charset="UTF-8"><title>${title}</title><style>body{font-family:sans-serif;max-width:800px;margin:auto;padding:20px;}img{max-width:100%;height:auto;}</style></head><body><nav><a href="index.html">← Αρχική</a></nav><h1>${title}</h1><div>${content}</div></body></html>`;

            fs.writeFileSync(`./dist/${fileName}`, postHtml);
            indexLinks += `<li><a href="${fileName}">${title}</a></li>`;
        }

        const indexHtml = `<!DOCTYPE html><html lang="el"><head><meta charset="UTF-8"><title>My Blog</title></head><body><h1>Articles</h1><ul>${indexLinks}</ul></body></html>`;
        fs.writeFileSync('./dist/index.html', indexHtml);
        console.log("Build complete!");
    } catch (e) { console.error(e); process.exit(1); }
}
generateStaticSite();
