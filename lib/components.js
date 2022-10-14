import path from 'path';
import componentData from '../process-configuration.json';


export function getAllProcesses() 
{                    
    return componentData.processes.map((process) => {
        return {
          params: {
            processId: process.name
          }
        };
      });
}

export function getProcessData(processId) {    
    return {
        name: processId,
        components: componentData.processes.filter(p => p.name == processId)[0]['components']
    };
}

export function getAllComponents() 
{                    
    const paths = [];
    componentData.processes.forEach((process, index, array) => 
    {
        process.components.forEach((component, i, list) => {          
          paths.push({
              params: {
                  processId: process.name,
                  componentId: component.name              
              }
          })
        });
    });
    
    return paths;
}

export function getComponentData(params) {
    var processComponents = componentData.processes
        .filter(p => p.name == params.processId)[0]['components'];
  
    var component = processComponents.filter(c => c.name == params.componentId)[0];
    
    function getNextComponent() 
    {
        const totalComponents = processComponents.length;
        const positionOfCurrent = processComponents.map(c => c.name).indexOf(component.name);

        //No next for last element:
        if (positionOfCurrent + 1 == totalComponents) 
            return "";
        
        return processComponents[positionOfCurrent + 1].name;
    }
    
    return {
        id: component.name,
        importFrom: component.importFrom,
        nextComponent: getNextComponent()
    };
}
