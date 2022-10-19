import Layout from '../../components/layout';
import { getAllComponents, getComponentData } from '../../lib/components';
import { getComponent } from '../../services/componentFactory';
import { useRouter } from 'next/router';
import { useState, useEffect, useReducer, useContext } from 'react';
import Link from 'next/link';
import { useAppContext } from '../../context/AppContext';

export default function Component({componentData}) {
  const router = useRouter()
  const { processId, componentId } = router.query;

  const projectId = '2EzgP7X1wAAUHih5gjnc2G1TAUI';
  const projectSecret = '67a27140a4dda85b990faa333b3bfeb0';
  const authorization = "Basic " + btoa(projectId + ":" + projectSecret); 

  const gatewayDetails = {
    apiURL: "https://ipfs.infura.io:5001/api/v0",
    authorization: authorization,
    fileURL: "https://skywalker.infura-ipfs.io/ipfs"
  }
    
  const [ state, dispatch ] = useAppContext();

  useEffect(() => {
    if (componentData.arguments[0]) {
        //Need to check if it's in global state or not
        console.log("MYINPUT:" + state[componentData.arguments[0].name]);
    }        

  }, [componentData.arguments])

  const DynamicComponent = getComponent(processId, componentId);

  const setFileUrl = (url) => { 
      if (componentData.output[0])          
          dispatch({ type: "add_output", value: { name: componentData.output[0].name, value: url }});
  };

  const componentProps = {
    setUrl : setFileUrl,
    gateway : gatewayDetails
  }

  return (
    <Layout>
        Process:
        {processId} 
        <br />
        Component:
          <DynamicComponent { ...componentProps } />
        <Link href={`/${processId}/${componentData.nextComponent}`}>
            <a>Continue</a> 
        </Link>
    </Layout>
  )
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
