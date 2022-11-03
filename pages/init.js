import componentData from '../process-configuration.json';
import { getComponent } from '../services/componentFactory';
import { ethers } from "ethers";
import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((res) => res.json());

async function deployContracts(compiledContracts) {  
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    
    for (let [contractFileName, compiledContract] 
        of Object.entries(compiledContracts)) 
    {            
        await provider.send("eth_requestAccounts", []);                

        compiledContract = JSON.parse(compiledContract);
        const factory = new ethers.ContractFactory(
            compiledContract.abi, 
            compiledContract.bytecode, provider.getSigner());

        const contract = await factory.deploy();        
        await contract.deployed();

        console.log(`Deployment of ${contractFileName} successful! Contract Address: ${contract.address}`);
    };
}

export default function ApplicationInit() {
        
    const { data, error } = useSWR('/api/contractdata', fetcher);
    
    if (error) return <div>Failed to load contract data</div>;    
    if (!data) return <div>Loading contract data...</div>;        
    
    return (
        <div>        
            <button onClick={() => { deployContracts(data) }}>Initialize application</button>
        </div>
    );
}
