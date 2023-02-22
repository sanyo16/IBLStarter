const writeContent = require("../services/componentDataService").writeContent;
const componentData = require("../process-configuration.json");
const fs = require("fs");

const mainContent = `import dynamic from "next/dynamic"

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

const generateComponentFactory = () =>
{
    const directory = "services";
    try {
        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory);
        }
    } catch (err) {
        console.error(`Failed to create directory ${directory}: ${err}`);
        return;
    }

    const path = `${directory}/componentFactory.js`;
    writeContent(path, mainContent);

    componentData.processes.forEach((process) =>
        process.configuredComponents.forEach((component) => writeContent(
            path,
            importStatement(
                process.uri,
                component.name,
                component.importPath
            )
        ))
    );
}

generateComponentFactory();
