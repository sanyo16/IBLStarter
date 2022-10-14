import Head from 'next/head';
import Layout, { siteTitle } from '../components/layout';
import utilStyles from '../styles/utils.module.css';
import { getAllProcesses } from '../lib/components';
import Link from 'next/link';

export async function getStaticProps() {
  const processes = getAllProcesses();
  
  return {
    props: {
      processes,
    },
  };
}


export default function Home({processes}) {  
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>      

      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>        
        <ul className={utilStyles.list}>
          {processes.map(( process ) => (
            <li className={utilStyles.listItem} key={process.params.processId}>
              <Link href={`/${process.params.processId}`}>
                <a>{process.params.processId}</a>
              </Link>            
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  );
}
