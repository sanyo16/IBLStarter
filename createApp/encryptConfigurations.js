require('dotenv').config();
const crypto = require('crypto');
const fs = require("fs");

const configFile = 'process-configuration.json';
const processData = require(`../${configFile}`);

function encryptConfigurations() 
{
    const algorithm = 'aes-256-cbc';
    const secretKey = process.env.ENCRYPTION_KEY;

    processData.processes.forEach(process => {
        process.configuredComponents.forEach(component => {
            const iv = crypto.randomBytes(16);
            const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
            
            let configurationsString = JSON.stringify(component.configurations);
            let encryptedConfigurations = cipher.update(configurationsString, 'utf8', 'hex');
            encryptedConfigurations += cipher.final('hex');
            
            component.configurations = {
                data: encryptedConfigurations,
                iv: iv.toString('hex')
            };
        });
    });

    return JSON.stringify(processData);
};

fs.writeFile(configFile, encryptConfigurations(), (err) => {
    if (err) 
        throw err;
    console.log('The file has been saved!');
});
