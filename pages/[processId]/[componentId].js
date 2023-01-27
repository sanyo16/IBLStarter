import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Link from 'next/link';
import dynamic, { noSSR } from 'next/dynamic'
import Layout from '../../components/layout';
import { getAllComponents, getComponentData, getComponentDataFromInit } from '../../lib/components';
import { getComponent } from '../../services/componentFactory';
import { useAppContext } from '../../context/AppContext';
import crypto from 'crypto';

const Component = ({componentData, componentDataFromInit}) =>
{
    const router = useRouter();
    const { processId, componentId } = router.query;
    const [state, dispatch] = useAppContext();

    const IBLComponent = getComponent(processId, componentId);
    const DynamicComponent = dynamic(
        () => IBLComponent.getAPI
            .then(factory => factory(componentId).getComponent())
    );

    const saveOutput = output => {
        for (let [outputName, outputValue] of Object.entries(output)) {
            dispatch({
                type: "add_output",
                value: { name: outputName, value: outputValue }
            });
        }
    };

    const buildInputData = () => {
        var data = {};
        componentData.inputMappings.forEach(inputMapping => {
            data[inputMapping.inputName] = state[inputMapping.outputName];               
        });

        return data;
    };

    const componentProps = {
        saveOutputCallback: saveOutput,
        configurations : componentData.configurations,        
        inputData : buildInputData(),
        componentDataFromInit: componentDataFromInit
    };

    return (
        <Layout>
            Process:
            {processId}
            <br />
            Component:
            <DynamicComponent {...componentProps}/>
            <Link href={`/${processId}/${componentData.nextComponent}`}>
                <a>Continue</a>
            </Link>
        </Layout>
    )
};

export async function getServerSideProps(context) 
{    
    const { params } = context;    
    const componentData = getComponentData(params);    
    const algorithm = 'aes-256-cbc';
    const secretKey = process.env.ENCRYPTION_KEY;
    
    const iv = Buffer.from(componentData.configurations.iv, 'hex');
    const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);

    let decryptedConfigurations = decipher.update(componentData.configurations.data, 'hex', 'utf8');
    decryptedConfigurations += decipher.final('utf8');    

    componentData.configurations = JSON.parse(decryptedConfigurations);
  
    return {
        props: {
            componentData: componentData,
            componentDataFromInit: getComponentDataFromInit(params.componentId)
        }
    }
};

export default Component;
