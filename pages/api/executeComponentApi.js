import { getComponentWithoutProcess } from "../../services/componentFactory";

const handler = (req, res) =>
{
    const params = JSON.parse(req.body);    
    const IBLComponent = getComponentWithoutProcess(params.component);
    IBLComponent.getAPI
        .then(factory => {
            const api = factory(params.component);
            const data = api[params.method](params.data);

            res.status(200).json(data);
        })
        .catch(err => {
            if (err && err.code && err.message) {
                res.status(err.code).json({ error: err.message });
            } else {
                res.status(500).json({ error: "Internal Server Error" });
            }
        });
};

export default handler;
