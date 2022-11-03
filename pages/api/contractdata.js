import path from 'path';
const fs = require('fs-extra');

export default async function handler(req, res) {  
    const contractsFolder = path.join(process.cwd(), 'build');
    var list = fs.readdirSync(contractsFolder);
    var results = {};

    list.forEach(function (file) {
        const fileContents = fs.readFileSync(`${contractsFolder}/${file}`, 'utf8');
        results[file] = fileContents;
    });  
  
  res.status(200).json(results);
}
