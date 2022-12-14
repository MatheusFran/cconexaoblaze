
const Connection = require('tedious').Connection;
const Request = require('tedious').Request;
const TYPES = require('tedious').TYPES;

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

    executeStatement1()
})
connection.connect()





function executeStatement1() {
    let request = new Request("SELECT numero FROM dbo.resultados ORDER BY horario", function (err) {
        if (err) {
            console.log(err);
        }
    });
    request.on('row', function (columns) {
        columns.forEach(function (column) {
            console.log(column.value);
        });
    });

    connection.execSql(request);
}  