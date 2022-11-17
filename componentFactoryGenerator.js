const componentData = require('./process-configuration.json');
const fs = require("fs");

const mainContent = `import dynamic from 'next/dynamic'

let processMap = {};

export function getComponent(process, component) {
    return processMap[process][component];
}
`;

let processedProcesses = []

const importStatement = ( process, component, importFrom ) => 
{
    let content = "";
    if (!processedProcesses.includes(process)) {
        content = `\nprocessMap["${process}"] = {};\n`
        processedProcesses.push(process);
    }
         
    return content.concat(
        `\nprocessMap["${process}"]["${component}"] = 
            {
                "Component" : dynamic(() => import("${importFrom}")),
                "InitPromise" : import("${importFrom}").then(module => module.Init),
                "InitServerPromise" : import("${importFrom}").then(module => module.InitServer)
            }\n`
    )
}

function writeContent(path, content) {
    fs.writeFile(path, content, { flag: "a+" }, err => {
        if (err) throw err;          
        return true;
    });
}

function generateComponentFactory() 
{    
    const directory = "services";
    if (!fs.existsSync(directory)){
        fs.mkdirSync(directory);
    }

    const path = `${directory}/componentFactory.js`;
    writeContent(path, mainContent);

    componentData.processes.forEach((process, index, array) => 
    {
        process.components.forEach((component, i, list) => {                            
            const content = importStatement(
                process.name, 
                component.name, 
                component.importFrom
            );

            writeContent(path, content);
        });
    });
}

generateComponentFactory();
