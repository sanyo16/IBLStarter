import { saveComponentData } from '../../services/componentDataService';

const handler = (req, res) =>
{    
    const params = JSON.parse(req.body);       
    saveComponentData(params.component, params.data);
    
    return res.status(200).json({message: "Saved component data"});
};

export default handler;
