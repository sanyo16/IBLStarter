import Layout from '../../components/layout';
import { getAllComponents, getComponentData, getComponentDataFromInit } from '../../lib/components';
import { getComponent } from '../../services/componentFactory';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Link from 'next/link';
import { useAppContext } from '../../context/AppContext';
import dynamic from 'next/dynamic'

const Component = ({componentData, componentDataFromInit}) =>
{
    const router = useRouter();
    const { processId, componentId } = router.query;

    const projectId = '2EzgP7X1wAAUHih5gjnc2G1TAUI';
    const projectSecret = '67a27140a4dda85b990faa333b3bfeb0';
    const authorization = "Basic " + btoa(projectId + ":" + projectSecret);

    const gatewayDetails = {
        apiURL: "https://ipfs.infura.io:5001/api/v0",
        authorization: authorization,
        fileURL: "https://skywalker.infura-ipfs.io/ipfs"
    }

    const [state, dispatch] = useAppContext();

    useEffect(
        () => {
            componentData.arguments[0] &&
                console.log("MYINPUT:" + state[componentData.arguments[0].name]);
        },
        [state]
    );

    const IBLComponent = getComponent(processId, componentId);
    const DynamicComponent = dynamic(
        () => IBLComponent.getAPI
            .then(factory => factory(componentId).getComponent())
    );

    const setFileUrl = (url) => componentData.output[0] &&
        dispatch({
            type: "add_output",
            value: { name: componentData.output[0].name, value: url }
        });

    const componentProps = {
        setUrl : setFileUrl,
        gateway : gatewayDetails,
        //[state[componentData.arguments[0].name]]: state[componentData.output[0].name]
        ipfsFileUrl: componentData.arguments[0] ?
            state[componentData.arguments[0].name] : "NONE",
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

export const getStaticProps = ({ params }) =>
    ({props: {componentData: getComponentData(params), componentDataFromInit: getComponentDataFromInit(params.componentId)}});

export default Component;
