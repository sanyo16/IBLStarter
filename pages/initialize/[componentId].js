import { getAllComponents, getUniqueComponents } from '../../lib/components';
import { getComponentWithoutProcess } from '../../services/componentFactory';
import Router, { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import EmptyInitializeComponent from '../../components/EmptyInitializeComponent';

const Component = ({uniqueComponents}) =>
{
    const router = useRouter();
    const { componentId } = router.query;

    const IBLComponent = getComponentWithoutProcess(componentId);

    const InitializerComponent = dynamic(
        () => IBLComponent.getAPI.then(
            getComponentApi => {
                const api = getComponentApi(componentId);

                return typeof api.initialize === "function"  ?
                    api.initialize() : EmptyInitializeComponent;
            }
        )
    );

    const executeApiCall = (method, data) => fetch(
        "/api/executeComponentApi",
        {
            method: "POST",
            body: JSON.stringify({
                component: componentId,
                method: method,
                data: data
            }),
        }
    );

    const onEndComponentInit = (data) => {

        //Save the data of the initialization steps
        fetch("/api/saveComponentData", {
            method: "POST",
            body: JSON.stringify({
                component: componentId,
                data: data
            }),
        })
        .then(() => {
            const componentKeys = Object.keys(uniqueComponents);
            const nextComponent = componentKeys.indexOf(componentId) + 1;
            
            router.push(
                !uniqueComponentKeys[nextComponent] ? "/" : 
                    `/initialize/${uniqueComponentKeys[nextComponent]}`
            );            
        })
        .catch((error) => {
            console.error(`Error saving component data: ${error}`);
        });
    };

    const uniqueComponent = uniqueComponents[componentId];

    return (
        <div>
            <h2>Initialize { uniqueComponent && uniqueComponent.name } </h2>
            <InitializerComponent callApi={ executeApiCall }
                endComponentInit={ onEndComponentInit } />
        </div>
    );

}

export const getStaticPaths = () => ({
    paths: getAllComponents(),
    fallback: false
});

export const getStaticProps = () =>
    ({ props: { uniqueComponents : getUniqueComponents() } });

export default Component;
