const socket = io()
const ProductosForm = document.querySelector('#ProductosForm')
const titleInput = document.querySelector('#Producto')
const priceInput = document.querySelector('#Precio')
const imgPool = document.querySelector('#Miniatura')

const messageForm = document.querySelector('#messageForm')
const emailInput = document.querySelector('#emailInput')
const messageInput = document.querySelector('#messageInput')

function renderProductos(productos) {
    fetch('./productos.hbs').then(response => {
        response.text().then((plantilla) => {
            const template = Handlebars.compile(plantilla);
            let html = template({ productos });
            $("#gridProductos tbody").html(html)
            titleInput.value = ""
            priceInput.value = ""
            imgPool.value = ""
        })
    })
}

socket.on('server:productos', productos => {
    renderProductos(productos)
})

ProductosForm.addEventListener('submit', event => {
    event.preventDefault()

    const productInfo = {
        title: titleInput.value,
        price: priceInput.value,
        thumbnail: imgPool.value
    }

    sendProductos(productInfo)
})

function sendProductos(productInfo) {
    socket.emit('client:product', productInfo)
}

function sendMessage(messageInfo) {
    socket.emit('client:menssage', messageInfo)
}

function renderMessage(messagesInfo) {
    fetch('./messagesPool.hbs').then(response => {
        response.text().then((plantillamensajes) => {
            const template = Handlebars.compile(plantillamensajes);
            let html = template({ messagesInfo });
                      
            $("#messangesPool").html(html)
            titleInput.value = ""
            priceInput.value = ""
            imgPool.value = ""
        })
    })
}

messageForm.addEventListener('submit', event => {
    event.preventDefault()
    if (emailInput.value == "") {
        alert('Ingrese correo para participar en el chat.')
        return
    }
    if (messageInput.value == "") {
        alert('Ingresar un mensaje.')
        return
    }

    const now = new Date()
    const fecha = now.toLocaleDateString("es-MX")
    const horas = (" " +
            ("0" + now.getHours()).slice(-2) + ":" +
            ("0" + now.getMinutes()).slice(-2) + ":" +
            ("0" + now.getSeconds()).slice(-2))

    const messageInfo = {
            email: emailInput.value,
            horaenvio: fecha + horas,
            message: messageInput.value

            
        }


    sendMessage(messageInfo)
    messageInput.value = ""
})

socket.on('server:menssage', renderMessage)
