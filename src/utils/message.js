const generateMessage = (username,message) =>{
    const Message = {
        username,
        text:message,
        createdAt:new Date().getTime()
    }
    return Message
}

const generateLocationMessage = (username,url) =>{
    const URL = {
       username,
       url:url,
       createdAt:new Date().getTime() 
    }
    return URL;
}

module.exports = {
    generateMessage:generateMessage,
    generateLocationMessage:generateLocationMessage
};