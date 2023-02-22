import { useRouter } from "next/router";
import Link from "next/link";
import dynamic from "next/dynamic"
import Layout from "../../components/layout";
import { getComponentData, getComponentDataFromInit } from "../../lib/components";
import { getComponent } from "../../services/componentFactory";
import { useAppContext } from "../../context/AppContext";
import crypto from "crypto";
import { getEncryptionKey } from "../../services/vaultService";
import { decrypt } from "../../services/cryptoService";

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
        for (const [outputName, outputValue] of Object.entries(output)) {
            dispatch({
                type: "addOutput",
                value: { name: outputName, value: outputValue }
            });
        }
    };

    const buildInputData = () => 
        componentData.inputMappings.reduce((result, inputMapping) => {
            result[inputMapping.inputName] = state[inputMapping.outputName];
            return result;
        }, {});

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

export const getServerSideProps = (context) => {
    const { params } = context;
    const componentData = getComponentData(params);
    if (!componentData) {
        return {
            notFound: true,
        }
    };
    const algorithm = "aes-256-cbc";
  
    return getEncryptionKey().then((secretKey) => {
        componentData.configurations = 
            decrypt(componentData.configurations, secretKey);
  
        return new Promise((resolve, reject) => {
            getComponentDataFromInit(params.componentId, (dataFromInit) => {
                resolve({
                    props: {
                        componentData: componentData,
                        componentDataFromInit: dataFromInit,
                    },
                });
            });
        });
    });
};

export default Component;
