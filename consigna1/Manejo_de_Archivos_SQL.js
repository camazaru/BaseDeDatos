const knex = require('knex')
const config = {
  client: 'sqlite3',
  useNullAsDefault : 'true',
  connection: {
    filename: "./productos.sqlite"
  }
};
const databaseConnection = knex(config)

createTable = async() => {
try {
await databaseConnection.schema.hasTable('productos').then(function(exists) {
    if (!exists) {
        console.log('Creando Tabla, espere.....')
      return databaseConnection.schema.createTable('productos',  producttable => {
        producttable.increments('productoID').primary()
        producttable.string('title', 100).notNullable()
        producttable.integer('price').notNullable()
        producttable.string('thumbnail', 100).notNullable()
      } );
    } 
    else{
        console.log('Tabla ya existe')
        }
  });

  databaseConnection.destroy()

} catch (err) {
    console.log(err)
    databaseConnection.destroy()
}
}

createTable()

class Contenedor {
  constructor() {}
  async save(Objeto) {
      try {
          const idInsert = await databaseConnection('productos').insert(Objeto, "productoid")
          console.log(`El id insertado es: ${idInsert[0]}`)
          databaseConnection.destroy()

      } catch (err) {
          console.log(err)
          databaseConnection.destroy()
      }
  }

  async getByid(index) {
      try {
          const camposProductos = ['productoid as id', 'title', 'price', 'thumbnail']
          const resultReadProductos = await databaseConnection
              .from('productos').select(camposProductos)
              .where({ productoid: `${index}` })
          databaseConnection.destroy()
          if (resultReadProductos.length == 0) {
              console.log(`El id ${index} del producto no se encuentraen la base de datos`)

          } else {
              console.log(resultReadProductos)
          }
      } catch (err) {
          console.log(err)
          databaseConnection.destroy()
      }
  }

  async getAll() {
      try {
          const camposProductos = ['productoid as id', 'title', 'price', 'thumbnail']
          const resultReadProductos = await databaseConnection
              .from('productos').select(camposProductos)
          databaseConnection.destroy()
          if (resultReadProductos.length == 0) {
              console.log(`La base de datos esta vacia`)

          } else {
              console.log(resultReadProductos)
          }
      } catch (err) {
          console.log(err)
          databaseConnection.destroy()
      }
  }

  async deletebynumber(IndexEliminar) {
      try {
          const resultReadProductos = await databaseConnection
              .from('productos').where({ productoid: `${IndexEliminar}` }, )
              .del()
          databaseConnection.destroy()
          if (resultReadProductos == 0) {
              console.log(`El id no existe en la Base de Datos`)
          } else {
              console.log(`El id ${IndexEliminar} fue eliminado`)
          }
      } catch (err) {
          console.log(err)
          databaseConnection.destroy()
      }
  }

  async deleteall() {
      try {
          const resultReadProductos = await databaseConnection
              .from('productos').truncate()
          databaseConnection.destroy()
          console.log(resultReadProductos)

          console.log(`Se eliminaron todos los registos de la Base de Datos`)
      } catch (err) {
          console.log(err)
          databaseConnection.destroy()
      }
  }
}

const contenedor = new Contenedor()
contenedor.save({ title: 'Producto1', price: '99.99', thumbnail: '1' })
  //contenedor.getByid(1)
  //contenedor.getAll()
  //contenedor.deletebynumber(1)
  //contenedor.deleteall()


 