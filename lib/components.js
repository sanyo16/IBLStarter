import componentData from '../process-configuration.json';
const componentDataFolder = "componentData";

export const getAllProcesses = () => componentData.processes.map((process) => ({
    params: { processId: process.name }
}));

export const getProcessData = (processId) => ({
    name: processId,
    configuredComponents: componentData.processes
        .filter(p => p.name === processId)[0]['configuredComponents']
});

export const getAllComponents = () =>
{
    const paths = [];
    componentData.processes.forEach((process) =>
        process.configuredComponents.forEach((component) => paths.push({
            params: {
                processId: process.name,
                componentId: component.name
            }
        }))
    );

    return paths;
}

export const getComponentData = (params) =>
{
    const processComponents = componentData.processes.filter(
        process => process.name === params.processId
    )[0]['configuredComponents'];

    const component = processComponents.filter(
        component => component.name === params.componentId
    )[0];

    const getNextComponent = () =>
    {
        const totalComponents = processComponents.length;
        const positionOfCurrent = processComponents
            .map(component => component.name)
            .indexOf(component.name);

        return (positionOfCurrent + 1 === totalComponents) ?
            "" : processComponents[positionOfCurrent + 1].name;
    };

    return {
        id: component.name,
        importFrom: component.importFrom,
        inputMappings: component.inputMappings,
        configurations: component.configurations,
        output: component.output,
        nextComponent: getNextComponent()
    };
}

export const getUniqueComponents = () =>
{g
    const result = {};

    componentData.processes.forEach(
        process => process.configuredComponents
            .forEach(component => result[component.name] = component)
    )

    return result;
}

export const getComponentDataFromInit = (componentName) => {
    const fs = require('fs');
    const dataFile = `${componentDataFolder}/${componentName}.json`;
    
    return fs.existsSync(dataFile) ? 
        JSON.parse(fs.readFileSync(dataFile)) : {};
}
