import React from 'react';

import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo.js';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Rank from './components/Rank/Rank';
import './App.css';
import { Component } from 'react';
import ParticlesBg from 'particles-bg'




const initialState = {
  input: '',
  imageURL: '',
  box: {},
  route: 'signin',
  user:
    {
        id: '',
        name: "",
        email: "",
        password: '',
        entries: 0,
        joined: ''
    },
}


const returnClarifaiRequestOptions = (imageUrl) => {

  // Your PAT (Personal Access Token) can be found in the portal under Authentification
  const PAT = '0d1c8e71e323444c9306799bfabeac71';
  // Specify the correct user_id/app_id pairings
  // Since you're making inferences outside your app's scope
  const USER_ID = '4pioyp24vjrr';       
  const APP_ID = 'Test';
  // Change these to whatever model and image URL you want to use
  const MODEL_ID = 'face-detection';
  
  const IMAGE_URL = imageUrl;

  const raw = JSON.stringify({
    "user_app_id": {
        "user_id": USER_ID,
        "app_id": APP_ID
    },
    "inputs": [
        {
            "data": {
                "image": {
                    "url": IMAGE_URL
                }
            }
        }
    ]
});


const requestOptions = {
  method: 'POST',
  headers: {
      'Accept': 'application/json',
      'Authorization': 'Key ' + PAT
  },
  body: raw
};
console.log("Request Options Output: ", requestOptions)
return requestOptions;


}

class App extends Component {
  constructor(){
    super();
    this.state = initialState;
  }

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      password: data.password,
      entries: data.entries,
      joined: data.joined

    }})

  }

  calculateFaceLocation = (data) => {
    console.log("Data ", data)
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box; 
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height, 
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    } 
  } 

  displayFaceBox = (box) => {
    console.log("BOX", box);
    this.setState({box: box});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    console.log("Button Submit")
    this.setState({imageURL: this.state.input});
    console.log("imageURL: ", this.state.input)
    fetch("https://api.clarifai.com/v2/models/" + "face-detection" +  "/outputs", returnClarifaiRequestOptions(this.state.input))
        .then(response => response.json())

    // fetch('http://localhost:3000/imageurl',{
    //           method: 'post',
    //           headers: {'Content-Type': 'application/json'},
    //           body: JSON.stringify({
    //             input: this.state.input,
    //           })  
    //         })
            .then(response => {
              if (response){
                console.log('you made it to response')
                console.log("RESPONSE", response)
                fetch('http://localhost:3000/image',{
                  method: 'put',
                  headers: {'Content-Type': 'application/json'},
                  body: JSON.stringify({
                    id: this.state.user.id 
                  })
                })
                  .then(response => response.json())
                  .then(count => {
                    this.setState(Object.assign(this.state.user, {entries: count}))
                  })
                  .catch(console.log)
              }
              console.log('response... ', response)
              this.displayFaceBox(this.calculateFaceLocation(response))
            })
            .catch(err=>console.log(err));
    
      
    
  }

  onRouteChange = (route) => {
    if (route === 'signout'){
      this.setState(initialState)
      this.setState({isSignedin: false}) 
    }else if (route === 'home'){
      this.setState({isSignedin: true})
    }
    this.setState({route: route});
  }

  render(){
    const {isSignedin, imageURL,route, box} = this.state;  
    return (

      <div className="App">
        <ParticlesBg className="particles" type="cobweb" bg={true}/>
        <Navigation isSignedIn={isSignedin} onRouteChange={this.onRouteChange} />
        {route === 'home' 
          ?<div>
            <Logo />
            <Rank name={this.state.user.name} entries={this.state.user.entries}/>
            <ImageLinkForm 
              onInputChange={this.onInputChange} 
              onButtonSubmit={this.onButtonSubmit}
            />
            <FaceRecognition box={box} imageURL={imageURL}/>
          </div> 
          : (
            this.state.route === 'signin'
            ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
            : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
          )

    }
       
      </div>
    );

  }

}

export default App;
