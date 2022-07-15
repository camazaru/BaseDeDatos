const { Socket } = require('dgram')
const express = require('express')
const app = express()
const path = require('path')
const fs = require('fs')
const { Server: IOServer } = require('socket.io')
const expressServer = app.listen(8080, () => { console.log('Servidor conectado puerto 8080') })
const io = new IOServer(expressServer)
let productos = []
const database = require('./database')

const createTable = async() => {
    try {
        await database.dbConnectionmySQL.schema.dropTableIfExists('productos')
        await database.dbConnectionmySQL.schema.hasTable('productos').then(function(exists) {
            if (!exists) {
                console.log("Creando tabla...")
                return database.dbConnectionmySQL.schema.createTable('productos', function(t) {
                    t.increments('id').primary();
                    t.string('title', 100).notNullable();
                    t.integer('price').notNullable();
                    t.string('thumbnail', 100).notNullable();
                });
            } else {
                console.log("Tabla ya existe")

            }
        });
    
    } catch (err) {

        console.log(err)
        database.dbConnectionmySQL.destroy()

    }
}
createTable()

const save = async(Objeto) => {
    console.log(Objeto)
        try {
        const InsertProduct = await database.dbConnectionmySQL ('productos').insert(Objeto, 'id')
        console.log("El id del producto insertado es: ", `${ InsertProduct[0]}`);

        } catch (err) {
        console.log(err)
        database.dbConnectionmySQL.destroy()
    }
}

const getAll = async() => {
    try {
        const resultReadProductos = await database.dbConnectionmySQL
            .from('productos').select('title', 'price', 'thumbnail')
            return resultReadProductos
    } catch (err) {
        console.log(err)
        database.dbConnectionmySQL.destroy()
    }
}




// SQLITE MENSAJES

const createTableMensaje = async() => {
    try {
        await database.dbConnectionSQL3.schema.dropTableIfExists('mensajes')
        await database.dbConnectionSQL3.schema.hasTable('mensajes').then(function(exists) {
            if (!exists) {
                console.log("Creando tabla mensajes...")
                return database.dbConnectionSQL3.schema.createTable('mensajes', function(t) {
                    t.increments('idMensaje').primary();
                    t.string('email', 100).notNullable();
                    t.string('horaenvio', 100).notNullable();
                    t.string('message', 100).notNullable();
                });
            } else {
                console.log("Tabla ya existe")

            }
        });
    
    } catch (err) {

        console.log(err)
        database.dbConnectionSQL3.destroy()

    }
}
createTableMensaje()


const saveMsn = async(Objeto) => {
    console.log(Objeto)
        try {
        const InsertMsn = await database.dbConnectionSQL3 ('mensajes').insert(Objeto, 'idMensaje')
        console.log("El id del Mensaje insertado es: ", `${ InsertMsn [0]}`);

        } catch (err) {
        console.log(err)
        database.dbConnectionSQL3.destroy()
    }
}



const msnAll = async() => {
    try {
        const resultReadMsn = await database.dbConnectionSQL3
            .from('mensajes').select('IdMensaje', 'email', 'horaenvio', 'message')
            return resultReadMsn

    } catch (err) {
        console.log(err)
        database.dbConnectionSQL3.destroy()
    }
}




let messagesArray = []
app.use(express.static(path.join(__dirname, '../public')))

io.on('connection', socket => {
    console.log(`Usuario Nuevo Conectado ${socket.id}`)
    socket.on('client:product', async productInfo => {
        await save(productInfo)
       productos =  await getAll()
       io.emit('server:productos', productos)
         })
        socket.emit('server:productos', productos)
 
 
    socket.on('client:menssage', async msnInfo => {
    await saveMsn(msnInfo)
    messagesArray = await msnAll()
    io.emit('server:menssage', messagesArray)


    })
    socket.emit('server:menssage', messagesArray)
})

