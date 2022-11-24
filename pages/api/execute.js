import { getComponent, getComponentWithoutProcess } from '../../services/componentFactory';


const handler = (req, res) =>
{
    const params = JSON.parse(req.body);    
    const IBLComponent = getComponentWithoutProcess(params.component);
    IBLComponent.getAPI.then(factory => {
        const api = factory(params.component);
        var data = api[params.method](params.data);        
        data = data ? data : { message: "Server side logic execution completed." }

        res.status(200).json(data);
    });
};

export default handler;
