import componentData from "../process-configuration.json";
const componentDataFolder = "componentData";

export const getAllProcesses = () => componentData.processes.map((process) => ({
    params: { processId: process.uri }
}));

export const getProcessData = (processId) => ({
    name: processId,
    configuredComponents: componentData.processes
        .filter(p => p.uri === processId)[0]["configuredComponents"]
});

export const getAllComponents = () =>
    componentData.processes.flatMap((process) =>
        process.configuredComponents.map((component) => ({
            params: {
                processId: process.uri,
                componentId: component.name,
            }
        }))
    );

export const getComponentData = (params) =>
{
    const process = componentData.processes.find(
        process => process.uri === params.processId
    );
    
    if (!process) {
        console.error(`Process with ID ${params.processId} not found.`);
        return;
    }
    
    const processComponents = process.configuredComponents;    
    const component = processComponents.find(
        component => component.name === params.componentId
    );
    
    if (!component) {
        console.error(`Component with ID ${params.componentId} not found in process ${params.processId}.`);
        return;
    }

    const getNextComponent = () =>
    {
        const totalComponents = processComponents.length;
        const positionOfCurrent = processComponents
            .map(component => component.name)
            .indexOf(component.name);

        return processComponents[positionOfCurrent + 1]?.name || "";
    };

    return {
        id: component.name,
        importPath: component.importPath,
        inputMappings: component.inputMappings,
        configurations: component.configurations,
        output: component.output,
        nextComponent: getNextComponent()
    };
}

export const getUniqueComponents = () =>
    componentData.processes.reduce((result, process) => {
        process.configuredComponents.forEach((component) => {
            if (!result[component.name]) {
                result[component.name] = component;
            }
        });
        return result;
    }, {});

export const getComponentDataFromInit = (componentName, callback) => {
    const fs = require("fs");
    const dataFile = `${componentDataFolder}/${componentName}.json`;
    
    fs.access(dataFile, fs.constants.F_OK, (err) => {
        if (err) {
            console.error(`Error accessing ${dataFile}: ${err}`);
            callback({});
        } else {
            fs.readFile(dataFile, (err, data) => {
                if (err) {
                    console.error(`Error reading ${dataFile}: ${err}`);
                    callback({});
                } else {
                    callback(JSON.parse(data));
                }
            });
        }
    });
}
