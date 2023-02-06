const fs = require('fs');

const getEncryptionKey = () => 
{
    const vault = require("node-vault")({
        apiVersion: "v1",
        endpoint: "http://127.0.0.1:8200",
    });
    
    let role_id;
    fs.readFile('role_id', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        role_id = data;
    });

    // Read the role ID and secret ID from the secret backend
    return vault.write("auth/approle/role/dev-role/secret-id")
        .then(secret => {
            return vault.approleLogin({
                role_id: role_id,
                secret_id: secret.data.secret_id,
            })
                .then(result => {
                    vault.token = result.auth.client_token;
        
                    return vault.read("secret/data/ibl")
                        .then(result => result.data.encryptionkey)
                        .catch(err => console.error("/data",err));
                });
            });
};

module.exports = {
    getEncryptionKey
};
