const API = process.env.NODE_ENV === 'production' ? 'https://winston-movie-list.herokuapp.com/' : 'http://localhost:5000/';

export function fetchData(data) {
  const title = data.trim().split(' ').join('%20')
  const url = API+"movies/list/"+title
  console.log(url);
  return fetch(url);
}

export async function postData(url = '', data = {}) {
  const response = await fetch(url, {
    method: "post",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
  
    body: data
  })
  // .then( (response) => { 
  //   console.log('bruh',response);
  // });
  return response;
}

export function fetchNewUser(){
  return fetch(API+"movies/userID/");
}

export function fetchRated(userID){
  return fetch(API+"movies/user/"+userID);
}