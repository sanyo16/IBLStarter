const fs = require("fs");

const configFile = 'process-configuration.json';
const processData = require(`../${configFile}`);

const getEncryptionKey = require('../services/vaultService').getEncryptionKey;
const encrypt = require('../services/cryptoService').encrypt;

const encryptConfigurations = () => getEncryptionKey()
    .then(encryptionKey => {
        processData.processes.forEach(process => {
            process.configuredComponents.forEach(component => {
                component.configurations = 
                    encrypt(component.configurations, encryptionKey);
            });
        });

        return JSON.stringify(processData);
    })
    .catch(error => {
        console.error('An error occurred while encrypting configurations:', error);
    });

encryptConfigurations()
    .then(encryptedData =>
        fs.writeFile(configFile, encryptedData, (err) => {
            if (err) 
                console.log(`The ${configFile} file could not be saved!`, err);
            console.log(`The ${configFile} file has been saved!`);
        })
    );

