module.exports = {
    "extends": "airbnb",
    "env": {
        "browser": false,
    },
    "plugins": [
        "import",
    ],
    "rules": {
        // windows Git can be configured to automatically replace CRLF with LF
        "linebreak-style": "off",
        "no-console": "off",
        "max-len": "off",
        "no-plusplus": "off",
    },
};