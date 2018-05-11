const app = require('express')();
const request = require('request');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const _ = require('lodash');
const multipart = require('connect-multiparty');
const fs = require('fs');

let server = null;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(methodOverride());
app.use(multipart());

const jsessionid = `26252C0B086EC939349A464012AF1047`; // for example
const urlServer = `https://ip:port`;

app.all('/*', function (req, res) {
    let options = {
        url: `${urlServer}/${req.params['0']}`,
        strictSSL: false,
        method: req.method,
        pool: {maxSockets: Infinity},
        headers: {
            'Cookie': `JSESSIONID=${jsessionid}`,
            'Content-Type': 'application/json'
        }
    };
    if (req.query && !_.isEmpty(req.query)) {
        let query = req.query;
        let queryFinal = {};
        _.forEach(query, (value, key) => {
            if (value == 'null') {
                queryFinal[key] = null;
            } else if (value == 'true') {
                queryFinal[key] = true;
            } else if (value == 'false') {
                queryFinal[key] = false;
            } else if (!value || value == '') {
                queryFinal[key] = null;
            } else {
                queryFinal[key] = value;
            }
        });
        options.qs = queryFinal;
    }
    if (req.body && !_.isEmpty(req.body)) {
        let body = req.body;
        let bodyFinal = {};
        if (!_.isArray(body)) {
            _.forEach(body, (value, key) => {
                if (value == 'null') {
                    bodyFinal[key] = null;
                } else if (value == 'true') {
                    bodyFinal[key] = true;
                } else if (value == 'false') {
                    bodyFinal[key] = false;
                } else if (!value) {
                    bodyFinal[key] = null;
                } else {
                    bodyFinal[key] = value;
                }
            });
        } else {
            bodyFinal = body;
        }

        options.body = JSON.stringify(bodyFinal);
    }
    if (req.files && !_.isEmpty(req.files) && req.files.file) {
        options.formData = {};
        options.formData[req.files.file.fieldName] = fs.createReadStream(req.files.file.path);
        options.headers['Content-Type'] = 'multipart/form-data';
    }

    let r = request(options, (error, response, body) => {
        if (error) {
            console.log('error',error);
        }
        console.log('response.statusCode',response.statusCode);
    });
    // req.pipe(r,{end: false}).pipe(res);
    r.pipe(res);



});

server = app.listen(4100, function () {
    console.log('Example app listening on port 4100!');
});
