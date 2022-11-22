import { getComponent } from '../../services/componentFactory';


export default async function handler(req, res) 
{  
    var params = JSON.parse(req.body);
    console.log(params);
    var IBLComponent = getComponent(params.process, params.component);
    var data = await IBLComponent.getAPI.then(factory => factory(params.component)[params.method](params.data));
    res.status(200).json(data);
}
