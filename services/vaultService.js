const fs = require("fs");
const VAULT_IP_ADDRESS = process.env.VAULT_IP_ADDRESS || "127.0.0.1";

const vault = require("node-vault")({
    apiVersion: "v1",
    endpoint: `http://${VAULT_IP_ADDRESS}:8200`,
});

const getEncryptionKey = () => fs.promises.readFile("role_id", "utf8")
    .then(role_id => vault.write("auth/approle/role/dev-role/secret-id")
        .then(secret => vault.approleLogin({
            role_id: role_id.trim(),
            secret_id: secret.data.secret_id,
        }))
        .then(result => {
            vault.token = result.auth.client_token;

            return vault.read("secret/data/ibl");
        })
        .then(result => result.data.encryptionkey)
        .catch(err => console.error(err))
    ).catch(() => "642e5597-cd3b-2f40-5cdd-17837a931631");

module.exports = {
    getEncryptionKey
};
