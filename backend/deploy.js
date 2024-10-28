var FtpDeploy = require("ftp-deploy");
var ftpDeploy = new FtpDeploy();

var config = {
    user: "ftp6027124",
    password: process.env.FTP_PASSWORD,
    host: "ftp.world4you.com",
    port: 21,
    localRoot: __dirname,
    remoteRoot: "/api/juspuzzle/",
    // NOTE: depending on what you need to upload, one is faster
    // include: ["vendor/**/*", "index.php"],
    include: ["index.php"],
    // delete ALL existing files at destination before uploading, if true
    deleteRemote: false,
    // Passive mode is forced (EPSV command is not sent)
    forcePasv: true
};
 
// use with promises
ftpDeploy
    .deploy(config)
    .then(res => console.log("finished:", res))
    .catch(err => console.log(err));
