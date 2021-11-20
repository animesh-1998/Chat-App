const socket = io();

const msgForm = document.querySelector('#message-form');
const text = document.querySelector('#form-input');
const msgFormButton = document.querySelector('#form-button');
const locationSharingButton = document.querySelector('#send-location');
const renderingDiv = document.querySelector('#message-rendering');
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationMessageTemplate = document.querySelector('#locationMessage-template').innerHTML;
const sidebar = document.querySelector('#sidebar');
const sidebarTemplate = document.querySelector('#sidebar-Template').innerHTML;

const queryString = new URLSearchParams(location.search.substring(1));
const username = queryString.get('username');
const room = queryString.get('room');

socket.on('message',(msg)=>{
    const html = Mustache.render(messageTemplate,{
        username:msg.username,
        message:msg.text,
        createdAt:moment(msg.createdAt).format('h:mm a')
    });
    renderingDiv.insertAdjacentHTML('beforeend',html);
})

socket.on('roomUsers',({room,users})=>{
    const html = Mustache.render(sidebarTemplate,{
        room:room,
        users:users
    })
    sidebar.innerHTML=html;
})

socket.on('locationMessage',(location)=>{
    const html = Mustache.render(locationMessageTemplate,{
        username:location.username,
        locationURL:location.url,
        createdAt:moment(location.createdAt).format('h:mm a')
    }) 
    renderingDiv.insertAdjacentHTML('beforeend',html);
})



msgForm.addEventListener('submit',(e)=>{
    msgFormButton.disabled = true;
    e.preventDefault();
    const message = text.value;
    socket.emit('sending',message,(delivered)=>{
        console.log("The message was delivered!",delivered);
        msgFormButton.disabled = false;
        msgForm.reset();
    });
})


locationSharingButton.addEventListener('click',()=>{
    if(!navigator.geolocation){
        return alert('Your browser does not support location sharing');
    }
    locationSharingButton.disabled = true;
    navigator.geolocation.getCurrentPosition((position)=>{
        socket.emit('sendlocation',{
            latitude:position.coords.latitude,
            longitude:position.coords.longitude
        },()=>{
            console.log("Location Shared!");
            locationSharingButton.disabled = false;
        })
        

    })
    
})

socket.emit('join',{username,room},(error)=>{
    if(error){
        alert(error);
        location.href='/';
    }
});