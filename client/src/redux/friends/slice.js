// a mini / sub-reducer that handles changes to the global state - but only specific to the friends
//friends=[] is a property inside global state, we're using default
// export default function friendsReducer(friends = []) {
//     if (action.type === "friends/accept") {
//         const newFriends = friends.map;
//         // do your mapping here
//         // check if the id of the users match the id of the user you just clicked
//         // if it does copy the user and change its accepted calue to true
//     }
//     return friends;
// }

// how to avoid mutation
// var obj = {
//     name: "Layla",
// };

// // #1 spread operator (works for objects & arrays)
// var newObj = { ...obj };

// var newObj = { ...obj, last: "Arias " };

// var arr = [1, 2, 3];
// var newArr = [...arr];
// var newArr = [...arr, 4];

// #2 MAP - works only on Arrays
// useful for cloning, looping and changing each element in the array
// map is just a loop
// the really cool thing about it, is that by default it return a new array

// #3 FILTER an array method
// GREAT for removing things from an array
// its also a loop that creates a copy of the array that youre looping on
