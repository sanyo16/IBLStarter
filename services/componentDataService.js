const fs = require('fs');
const dataFolder = "componentData";

const writeContent = (path, content) => {
    try {
        fs.writeFileSync(path, content, { flag: 'a+' });
    } catch (err) {
        console.error(`Error occured when writing file ${path}: ${err}`);
    }
};

const saveComponentData = (componentName, data) => {
    try {
        if (!fs.existsSync(dataFolder)) {
            fs.mkdirSync(dataFolder);
        }
    } catch (err) {
        console.error(`Failed to create directory ${dataFolder}: ${err}`);
        return;
    }

    writeContent(`${dataFolder}/${componentName}.json`, JSON.stringify(data));
}

module.exports = {  
    writeContent,
    saveComponentData
};
