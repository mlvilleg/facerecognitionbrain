


// const returnClarifaiRequestOptions = (imageUrl) => {

//     // Your PAT (Personal Access Token) can be found in the portal under Authentification
//     const PAT = '0d1c8e71e323444c9306799bfabeac71';
//     // Specify the correct user_id/app_id pairings
//     // Since you're making inferences outside your app's scope
//     const USER_ID = '4pioyp24vjrr';       
//     const APP_ID = 'Test';
//     // Change these to whatever model and image URL you want to use
//     const MODEL_ID = 'face-detection';
    
//     const IMAGE_URL = imageUrl;

//     const raw = JSON.stringify({
//       "user_app_id": {
//           "user_id": USER_ID,
//           "app_id": APP_ID
//       },
//       "inputs": [
//           {
//               "data": {
//                   "image": {
//                       "url": IMAGE_URL
//                   }
//               }
//           }
//       ]
//   });

 
//   const requestOptions = {
//     method: 'POST',
//     headers: {
//         'Accept': 'application/json',
//         'Authorization': 'Key ' + PAT
//     },
//     body: raw
//   };
//   console.log("Request Options Output: ", requestOptions)
//   return requestOptions;


//   }


//   const handleApiCall = (req,res) => {
//     const {input} = req.body;
//     console.log("imageurl: ", input)
//     fetch("https://api.clarifai.com/v2/models/" + "face-detection" +  "/outputs", returnClarifaiRequestOptions(input))
//         .then(response => {
//             console.log(response)
//             res.json(response);
//         })
//         .catch(err => res.status(400).json('unable to work with api'))
//   }




  const handleImage = (req,res, db)=>{
    const {id} = req.body;
    db('users').where('id', '=', id)
    .increment('entries',1)
    .returning('entries')
    .then(console.loge)
    .then(entries => {
        console.log("Entries", entries[0].entries)
        res.json(entries[0].entries)
    })
    .catch(err => res.status(400).json("Unable to get entries")) 

}



export { handleImage};