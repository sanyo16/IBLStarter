const fs = require('fs');
const dataFolder = "componentData";

const writeContent = (path, content)  =>
    fs.writeFile(
        path,
        content,
        { flag: "a+" },
        err => err && 
            console.error(`Error occured when writing file ${path}: ${err}`)
    );

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
