// redux/friends/slice.js

// this is our friends-wannabees sub-reducer
// in here- we MUST make copies for every array and object
// no mutating allowed!

export default function friendsWannabeesReducer(friends = [], action) {
    if (action.type === "friends-wannabees/accept") {
        // const newFriendsWannabees = friendsWannabees.map( do your logic here)
        // return newFriendsWannabees;
    }

    return friends;
}

// Actions go below

export function makeFriend(id) {
    return {
        type: "/friends-wannabees/accept",
        payload: { id },
    };
}

// #2 MAP - works only on Arrays
// useful for cloning, looping and changing each element in the array
// map is just a loop
// the really cool thing about it, is that by default it return a new array

// #3 FILTER an array method
// GREAT for removing things from an array
// its also a loop that creates a copy of the array that youre looping on
