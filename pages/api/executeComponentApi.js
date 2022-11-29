import { getComponent, getComponentWithoutProcess } from '../../services/componentFactory';


const handler = (req, res) =>
{
    const params = JSON.parse(req.body);    
    const IBLComponent = getComponentWithoutProcess(params.component);
    IBLComponent.getAPI.then(factory => {
        const api = factory(params.component);
        const data = api[params.method](params.data);

        res.status(200).json(data);
    });
};

export default handler;
