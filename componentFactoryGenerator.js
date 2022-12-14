const componentData = require('./process-configuration.json');
const fs = require("fs");

const mainContent = `import dynamic from 'next/dynamic'

let processMap = {};

export const getComponent = (process, component) => 
    processMap[process][component];
    
export const getComponentWithoutProcess = (componentName) =>
{
    for (const process in processMap) {
        if (processMap[process].hasOwnProperty(componentName)) {
            return processMap[process][componentName];
        }
    }
    
    return null;
}
`;

const processedProcesses = []

const importStatement = ( process, component, importFrom ) =>
{
    let content = "";
    if (!processedProcesses.includes(process)) {
        content = `\nprocessMap["${process}"] = {};\n`
        processedProcesses.push(process);
    }

    return content.concat(
        `\nprocessMap["${process}"]["${component}"] = {                
            "getAPI" : import("${importFrom}").then(module => module.getAPI)
        }\n`
    );
}

const writeContent = (path, content)  =>
    fs.writeFile(path, content, { flag: "a+" }, err => {
        if (err)
            throw err;

        return true;
    });

const generateComponentFactory = () =>
{
    const directory = "services";
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory);
    }

    const path = `${directory}/componentFactory.js`;
    writeContent(path, mainContent);

    componentData.processes.forEach((process) =>
        process.configuredComponents.forEach((component) => writeContent(
            path,
            importStatement(
                process.name,
                component.name,
                component.importFrom
            )
        ))
    );
}

generateComponentFactory();
