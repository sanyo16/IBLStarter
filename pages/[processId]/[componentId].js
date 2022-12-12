import Layout from '../../components/layout';
import { getAllComponents, getComponentData, getComponentDataFromInit } from '../../lib/components';
import { getComponent } from '../../services/componentFactory';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic'

const Component = ({componentData, componentDataFromInit, updateData, inputData}) =>
{
    const router = useRouter();
    const { processId, componentId } = router.query;

    const IBLComponent = getComponent(processId, componentId);
    const DynamicComponent = dynamic(
        () => IBLComponent.getAPI
            .then(factory => factory(componentId).getComponent())
    );

    const buildInputData = () => {
        var data = {};
        componentData.inputMappings.forEach(inputMapping => {
            data[inputMapping.inputName] = inputData[inputMapping.outputName];               
        });

        return data;
    } 

    const componentProps = {
        saveOutputCallback: updateData,
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
