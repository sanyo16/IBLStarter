import { getAllComponents, getComponentData } from '../../../lib/components';
import { getComponent } from '../../../services/componentFactory';
import Layout from '../../../components/layout';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import dynamic from 'next/dynamic';


export default function Component({componentData}) {    
    
    const router = useRouter();
    const { processId, componentId } = router.query;

    const IBLComponent = getComponent(processId, componentId);
    const InitializerComponent = dynamic(() => IBLComponent.getAPI.then(factory => factory(componentId).initialize()));
    
    return ( 
        <div>
            <InitializerComponent 
                 callApi={ (method, data) => fetch("/api/execute", {
                    method: "POST",
                    body: JSON.stringify({ "process" : processId, "component" : componentId, "method" : method, "data" : data }),
                 })}
                 endComponentInit={() => {console.log("end this")}} />
        </div>
    );

}

export async function getStaticPaths() 
{
    return {
      paths: getAllComponents(),
      fallback: false
    }
}
  
export async function getStaticProps({ params }) 
{  
  const componentData = await getComponentData(params)

  return {
    props: {
      componentData
    }
  }
}
