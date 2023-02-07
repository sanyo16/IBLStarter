const fs = require("fs");

const configFile = 'process-configuration.json';
const processData = require(`../${configFile}`);

const getEncryptionKey = require('../services/vaultService').getEncryptionKey;
const encrypt = require('../services/cryptoService').encrypt;

const encryptConfigurations = () =>
{
    return getEncryptionKey()
        .then(encryptionKey => {
            processData.processes.forEach(process => {
                process.configuredComponents.forEach(component => {
                    component.configurations = 
                        encrypt(component.configurations, encryptionKey);
                });
            });

            return JSON.stringify(processData);
        })
};

encryptConfigurations()
    .then(encryptedData =>
        fs.writeFile(configFile, encryptedData, (err) => {
            if (err) 
                throw err;
            console.log('The file has been saved!');
        }));

