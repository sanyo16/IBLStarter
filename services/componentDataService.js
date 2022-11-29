const fs = require('fs');

const writeContent = (path, content)  => {
    console.log(content);
    fs.writeFile(path, JSON.stringify(content), err => {
        if (err)
            throw err;

        return true;
    });
}

export const saveComponentData = (componentName, data) => {
    
    const directory = "componentData";
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory);
    }
    writeContent(`${directory}/${componentName}.json`, data);
}
