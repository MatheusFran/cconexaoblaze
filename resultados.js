const Sequelize = require('sequelize');
const database = require('./db.js');


const Resultado = database.define('resultado',{
    id:{
        type:Sequelize.INTEGER,
        indetity:true,
        allowNull:false,
        primaryKey:true
    },
    numero:{
        type:Sequelize.INTEGER,
        allowNull:false
    },
    cor:{
        type:Sequelize.INTEGER,
        allowNull:false
    },
    horario:{
        type:Sequelize.TIME(0),
        allowNull:false
    },
    data:{
        type:Sequelize.DATE,
        allowNull:false
    }
})

module.exports=Resultado;