const users = [];


const addUser = ({id,username,room}) => {
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();

    if(!username || !room){
        return {
            error:"Username and room are required!"
        }
    }
    const existingUser = users.find((user)=>{
        return user.username===username && user.room===room;
    })
    if(existingUser){
        return {
            error:"Username is in use"
        }
    }
    const user = {id,username,room};
    users.push(user);
    return {user};
}

const removeUser = (id) => {
    const index = users.findIndex((user)=>{
        return user.id===id;
    })
    if(index===-1){
        return {
            error:"Can't remove User!"
        }
    }
    return users.splice(index,1)[0];
}

const getUser = (id) => {
    const index = users.findIndex((user)=>{
        return user.id===id;
    })
    if(index===-1){
        return {
            error:"No user found!"
        }
    }
    return users[index];
}

const getUsersInRoom = (room) => {
    const usersArray=[];
    users.find((user)=>{
        if(user.room===room){
            usersArray.push(user);
        }
    })
    
    return usersArray;
}

// const user = addUser({
//     id:22,
//     username:"Animesh",
//     room:"home"
// })
// const user1 = addUser({
//     id:23,
//     username:"Ashraf",
//     room:"home"
// })
// const user2 = addUser({
//     id:24,
//     username:"Rohit",
//     room:"home"
// })
// console.log(getUser(27));
// console.log(users);
// console.log(getUsersInRoom("siuth"));

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}