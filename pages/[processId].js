import Layout from '../components/layout';
import { getAllProcesses, getProcessData } from '../lib/components';
import utilStyles from '../styles/utils.module.css';
import Link from 'next/link';

const Process = ({ processData }) => (
    <Layout>
        {processData.name}
        <ul className={utilStyles.list}>
            {
                processData.configuredComponents.map(({ name }) => (
                    <li className={utilStyles.listItem} key={name}>
                        <Link href={`/${processData.name}/${name}`}>
                            <a>{processData.name}/{name}</a>
                        </Link>
                    </li>
                ))
            }
        </ul>
    </Layout>
);

export const getStaticPaths = () => ({
    paths: getAllProcesses(),
    fallback: false
});

export const getStaticProps = ({ params }) =>
    ({props: {processData: getProcessData(params.processId)}});

export default Process;
