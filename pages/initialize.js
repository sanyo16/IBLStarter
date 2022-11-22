import componentData from '../process-configuration.json';
import { getComponent } from '../services/componentFactory';

const initializeComponents = async () => {

    //Get all components
    componentData.processes.forEach((process, index, array) => 
    {
        process.components.forEach(async (component, i, list) => {
            
            var IBLComponent = getComponent(process.name, component.name);            

            let data = await invokeServerLogic(process.name, component.name);            

            console.log(`DATA ${component.name} ` + data);

            await IBLComponent.InitPromise.then(init => init ? init(data) : {});
        });
    });
}

const invokeServerLogic = async (process, component) => {
    {        
        var result = await fetch("/api/execute", {
                method: "POST",
                body: JSON.stringify({ "process" : process, "component" : component }),
              });
        return result.json();
    }
}

export default function ApplicationInit() {    
    return ( 
        <div>
            <button onClick={() => { initializeComponents() }}>Initialize application</button>
        </div>
    );
}
