import Layout from '../components/layout';
import { getAllProcesses, getProcessData } from '../lib/components';
import utilStyles from '../styles/utils.module.css';
import Link from 'next/link';

export default function Process({ processData }) {  
  return (
    <Layout>
        {processData.name}   
        <ul className={utilStyles.list}>
          {processData.components.map(({ name }) => (
            <li className={utilStyles.listItem} key={name}>
              <Link href={`/${processData.name}/${name}`}>
                <a>{processData.name}/{name}</a>
              </Link>          
            </li>
          ))}
        </ul>             
    </Layout>
  )
}

export async function getStaticPaths() {
    const components = getAllProcesses()    

    return {
      paths: components,
      fallback: false
    }
  }
  
export async function getStaticProps({ params }) {
  const processData = await getProcessData(params.processId)  

  return {
    props: {
      processData
    }
  }
}
