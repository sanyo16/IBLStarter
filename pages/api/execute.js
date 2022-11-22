import { getComponent } from '../../services/componentFactory';


const handler = (req, res) =>
{
    const params = JSON.parse(req.body);
    getComponent(params.process, params.component)
        .then(IBLComponent => IBLComponent.getAPI.then(factory => {
            const api = factory(params.component);
            const data = api[params.method](params.data);

            res.status(200).json(data);
        }));
};

export default handler;
