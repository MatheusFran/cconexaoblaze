
const { WebSocket } = require("ws");
const moment = require("moment/moment");
const TYPES = require('tedious').TYPES;
const Connection = require('tedious').Connection;
const Request = require('tedious').Request;

const config = {
    server: "cyberplataforma_producaodouble.sqlserver.dbaas.com.br",
    options: { trustServerCertificate: true, },
    authentication: {
        type: "default",
        options: {
            userName: "cyberplataforma_producaodouble",
            password: "producaodonvcia",

        }
    }
}

const connection = new Connection(config)

connection.on('connect', function (err) {
    if (err) { console.log('Error:', err) }
    else { console.log('conectado') }
    executarSQL()
})
connection.connect()
function executarSQL(n, c, h, d) {
    let request = new Request("INSERT dbo.resultados (numero, cor, horario, data) VALUES (@numero, @cor, @horario, @data);", function (err) {
        if (err) {
            console.log(err);
        }
    });
    request.addParameter('numero', TYPES.Int, n);
    request.addParameter('cor', TYPES.Int, c);
    request.addParameter('horario', TYPES.VarChar, h);
    request.addParameter('data', TYPES.Date, d);

    connection.execSql(request);
}
//Conexão com a blaze
function resultadoBlaze() {
    const blaze = new WebSocket("wss://api-v2.blaze.com/replication/?EIO=3&transport=websocket");

    const msg1 = '420["cmd",{"id":"authenticate","payload":{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODk2NTMyNiwiYmxvY2tzIjpbXSwiaWF0IjoxNjY2MzcxOTUzLCJleHAiOjE2NzE1NTU5NTN9.Ce1FHtlRR-tEkVgjIl54G7QVKpQbUzbYWP618daUS0I"}}]'
    const msg2 = '421["cmd",{"id":"subscribe","payload":{"room":"double_v2"}}]';
    const msg3 = '422["cmd",{"id":"subscribe","payload":{"room":"crash_v2"}}]';
    const msg4 = '423["cmd",{"id":"authenticate","payload":{"token":"eyJhbGciOiJIUzI1NipIsInR5cCI6IkpXVCJ9.eyJpZCI6ODk2NTMyNiwiYmxvY2tzIjpbXSwiaWF0IjoxNjY2MzcxOTUzLCJleHAiOjE2NzE1NTU5NTN9.Ce1FHtlRR-tEkVgjIl54G7QVKpQbUzbYWP618daUS0I"}}]'
    const msgreconnection = '2';
    var lastcrash = '';
    var lastnumero = '';


    blaze.onopen = function (event) {
        console.log('CONEXÃO ABERTA')
        blaze.send(msg1);
        blaze.send(msg2);
        blaze.send(msg3);
        blaze.send(msg4);
        setInterval(() => { blaze.send(msgreconnection) }, 25000);

        blaze.onmessage = function (event) {
            let response = event.data
            if (response.length >= 86) {
                response = response.replace('42', '')

                let json = JSON.parse(response)
                //let crash = json[1]['payload']['crash_point']
                let ndouble = json[1]['payload']['roll']
                let cordouble = json[1]['payload']['color']
                let idjogada = json[1]['payload']['id']
                if (ndouble | cordouble != undefined && lastnumero != idjogada) {
                    let dia = moment().format('YYYY-MM-DD');
                    let hora = moment().format('HH:mm:ss');
                  executarSQL(ndouble,cordouble,hora,dia)
                    console.log(ndouble)
                    lastnumero = idjogada;
                }
            }
        }
    };




    blaze.onclose = function (event) {
        console.log('A CONEXÃO CAIU')
        resultadoBlaze();
    };
    blaze.onerror = function (err) {
        console.log('==============ERRO NA CONEXÃO===========')
        console.error(err)
    };


}

resultadoBlaze();




