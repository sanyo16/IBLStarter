import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Link from 'next/link';
import dynamic, { noSSR } from 'next/dynamic'
import Layout from '../../components/layout';
import { getAllComponents, getComponentData, getComponentDataFromInit } from '../../lib/components';
import { getComponent } from '../../services/componentFactory';
import { useAppContext } from '../../context/AppContext';

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
    }

    const buildInputData = () => {
        var data = {};
        componentData.inputMappings.forEach(inputMapping => {
            data[inputMapping.inputName] = state[inputMapping.outputName];               
        });

        return data;
    } 

    const componentProps = {
        saveOutputCallback: saveOutput,
        configurations : componentData.configurations,        
        inputData : buildInputData(),
        componentDataFromInit: componentDataFromInit
    }

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
}

export const getStaticPaths = () => ({
    paths: getAllComponents(),
    fallback: false
});

export const getStaticProps = ({ params }) => ({
    props: {
        componentData: 
            getComponentData(params), 
        componentDataFromInit: 
            getComponentDataFromInit(params.componentId)
    }
});

export default Component;
