import { getAllComponents, getComponentData } from '../../../lib/components';
import { getComponent } from '../../../services/componentFactory';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

const Component = ({componentData}) =>
{
    const router = useRouter();
    const { processId, componentId } = router.query;

    const IBLComponent = getComponent(processId, componentId);
    const InitializerComponent = dynamic(
        () => IBLComponent.getAPI.then(
            factory => factory(componentId).initialize()
        )
    );

    const executeApiCall = (method, data) => fetch(
        "/api/execute",
        {
            method: "POST",
            body: JSON.stringify({
                process: processId,
                component: componentId,
                method: method,
                data: data
            }),
        }
    );

    const onEndComponentInit = () => console.log("end this");

    return (
        <div>
            <InitializerComponent callApi={ executeApiCall }
                endComponentInit={ onEndComponentInit } />
        </div>
    );

}

export const getStaticPaths = () => ({
    paths: getAllComponents(),
    fallback: false
});

export const getStaticProps = ({ params }) =>
    ({props: {componentData: getComponentData(params)}});

export default Component;
