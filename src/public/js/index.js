import mongoose from "mongoose";
import studentModel from "/src/models/student.js"
import userModel from "../../models/users";

console.log('Hola');
const socket = io();
let user;
let chatBox = document.getElementById('chatBox');

Swal.fire({
    title:"Indentificate",
    input: "text",
    text: "Ingresa el usuario para identificarte en el chat",
    inputValidator: (value) => {
        return !value && '¡Necesitas escribir un nombre de usuario para continuar!'
    },
    allowOutsideClick:false
}) .then(result=>{
    user=result.value
});

chatBox.addEventListener('keyup',evt=>{
    if(evt.key==="Enter"){
        if(chatBox.value.trim().length>0){
            socket.emit("message",{user:user,message:chatBox.value});
            chatBox.value="";
        }
    }    
})

/*Socket listeners */
socket.on ('messageLogs', data=>{
    let log = document.getElementById('messageLogs');
    let messages = "";
    data.forEach(message => {
        messages = messages+`${message.user} dice: ${message.message}</br>`
    })
    log.innerHTML = messages;
})


const enviroment= async() =>{
    await mongoose.connect('mongodb+srv://carlosbarrera:7y3h45jDXwxwvAEp@cluster0.l0gzu15.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    await studentModel.create({
        first_name: "Carlos",
        last_name: "Barrera",
        email: "carlos.barrera@est.fi.uncoma.edu.ar",
        gender: "Male",
    })
}

/*const enviroment= async() =>{
    await mongoose.connect('mongodb+srv://carlosbarrera:7y3h45jDXwxwvAEp@cluster0.l0gzu15.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    let response = await userModel.find().explain('executionStats');
    console.log(response);
}*/

export default enviroment;