const fs = require('fs');
const componentDataFolder = "componentData";

const writeContent = (path, content)  => {
    console.log(content);
    fs.writeFile(path, JSON.stringify(content), err => {
        if (err)
            throw err;

        return true;
    });
}

export const saveComponentData = (componentName, data) => {
    
    if (!fs.existsSync(componentDataFolder)) {
        fs.mkdirSync(componentDataFolder);
    }
    writeContent(`${componentDataFolder}/${componentName}.json`, data);
}
