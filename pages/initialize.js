import componentData from '../process-configuration.json';
import { getComponent } from '../services/componentFactory';

const IBLComponent = getComponent("createNFT", "GenerateNFT");

export default function ApplicationInit({data}) {    
    return ( 
        <div>            
            <button onClick={() => { IBLComponent.InitPromise.then(init => init(data)) }}>Initialize application</button>
        </div>
    );
}


export async function getServerSideProps(context) {
    let data;    
    await IBLComponent.InitServerPromise.then(init => { data = init(); });
    
    return {
      props: { data }
    }
}
