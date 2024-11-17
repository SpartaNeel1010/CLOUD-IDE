// import { io } from "socket.io-client";
// // import jwt_decode from 'jsonwebtoken';


// const queryParams = new URLSearchParams(window.location.search);
// const projID = queryParams.get('projID');
// const token= localStorage.getItem('authToken')
// console.log(token)
          

//     // Step 3: Decode the payload (second part of JWT) using base64
// const payloadBase64 = token.split('.')[1]; // The second part of the token
// const user = JSON.parse(atob(payloadBase64));

// // Step 4: Now `payload` contains the decoded data
// console.log(user._id);


// const socket=io(`http://localhost:3000/?projID=${projID}&userID=${user._id}`);
// // console.log(`http://localhost:3000/?projID=${projID}&userID=${user._id}`)


// export default socket;