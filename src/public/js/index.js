console.log("IN CLIENT");

const userName = document.querySelector(".userName");
const chatMessage = document.querySelector(".chatMessage");
var uuid = "";
//* Si el servidor de Socket.IO está en un puerto diferente del frontend, 
//* debes especificarlo al inicializar la conexión.
// const socket = io("http://el-servidor.com:3000");
// En nuestro caso solo con io() es suficiente ya que el servidor de Socket.IO está en el mismo puerto que el frontend.
const socket = io();

var messages = [];

const updateMessagges = (newMessages) => {
  messages = [...newMessages];

  chatMessage.innerHTML = messages
    .map((message) => {
      if (message.info === "connection") {
        return `<p class="connection">${message.message}</p>`;
      } else {
        return `
        <div class="messageUser">
          <h5>${message.name}</h5>
          <p>${message.message}</p>
        </div>
      `;
      }
    })
    .join("");
};


// Mostrar el formulario de entrada de usuario
Swal.fire({
  title: "Ingrese su información",
  html: `
      <input type="text" id="swal-input-name" class="swal2-input" placeholder="Nombre">
      <input type="text" id="swal-input-id" class="swal2-input" placeholder="ID">
    `,
  focusConfirm: false,
  showCancelButton: true,
  confirmButtonText: "Ingresar",
  preConfirm: () => {
    const name = Swal.getPopup().querySelector("#swal-input-name").value;
    const id = Swal.getPopup().querySelector("#swal-input-id").value;
    if (!name || !id) {
      Swal.showValidationMessage(`Por favor ingrese ambos campos`);
    }
    return { name: name, id: id };
  },
}).then((result) => {
  console.log("-->", result);
  const { name, id } = result.value;
  uuid = id;
  if (result.isConfirmed) {
    userName.textContent = name;
    socket.emit(`userConnect`, { user: name, id });
  }
});

socket.on("serverUserConnect", (data) => {
  console.log(".....", data);
  chatMessage.innerHTML = "";
  updateMessagges(data);
});

const btnMessage = document.getElementById("btnMessage");
const inputMessage = document.getElementById("inputMessage");

btnMessage.addEventListener("click", (e) => {
  e.preventDefault();
  // console.log("tocando boton")
  const message = inputMessage.value;
  // console.log("tocando boton -> ", message)
  // console.log("-----> ", userName.innerHTML)
  socket.emit("userMessage", { message, user: userName.innerHTML });
  inputMessage.value = "";
});

socket.on("serverUserMessage", (data) => {
  chatMessage.innerHTML = "";
  updateMessagges(data);
});


//* EXTRA - TYPING
const typing = document.querySelector(".typing");

inputMessage.addEventListener("keypress", () => {
  // console.log("-- keypress --")
  socket.emit("typing", { user: userName.innerHTML });
});

socket.on("typing", (data) => {
  // console.log("::", data);
  typing.textContent = `...${data.user} esta escribiendo`
});
// socket.on(`client${uuid}`)

// SOCKET ASYNC -> socketState
/*
Los eventos de Socket.IO son asíncronos, por lo que no podemos esperar a que se resuelva 
una promesa para continuar con el flujo de la aplicación.
Para manejar esto, podemos usar un callback o simplemente emitir un evento con un nombre
específico para que el servidor lo escuche y responda.
*/
