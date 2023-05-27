import React from 'react';

import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo.js';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';

import Rank from './components/Rank/Rank';
import './App.css';



import { Component } from 'react';
import ParticlesBg from 'particles-bg'





const returnClarifaiRequestOptions = (imageUrl) => {

    // Your PAT (Personal Access Token) can be found in the portal under Authentification
    const PAT = '115d43f07eef4e90b68d13b80933528c';
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


  return requestOptions;


  }


class App extends Component {
  constructor(){
    super();
    this.state = {
      input: '',
      imageURL: '',
      box: {},
      route: 'home',
      isSignein: false,
    }
  }


  calculateFaceLocation = (data) => {
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
    console.log(box);
    this.setState({box: box});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    console.log("This Input: ", this.state.input)
    this.setState({imageURL: this.state.input});
    fetch("https://api.clarifai.com/v2/models/" + 'face-detection'  +  "/outputs", returnClarifaiRequestOptions(this.state.input))
        .then(response => response.json())
        .then(response =>{this.displayFaceBox(this.calculateFaceLocation(response));
        })
        .catch(err => console.log(err))
       
        // .then(response => {
        //   console.log('hi', response)
        //   if (response){
        //     console.log("This.state.user", this.state.user)
        //     fetch('http://localhost:3000/image',{
        //       method: 'put',
        //       headers: {'Content-Type': 'application/json'},
        //       body: JSON.stringify({
        //         id: this.state.user.id 
        //       })
        //     })
        //       .then(response => response.json())
        //       .then(count =>{
        //         this.setState(Object.assign(this.state.user, {entries: count}))
        //       })
        //   }
        //   this.displayFaceBox(this.calculateFaceLocation(response))
        // })
        // .catch(err=>console.log(err));
  
    
    
  }

  render(){    
    console.log("Image URL: ", this.state.imageURL);
    return (

      <div className="App">
        <ParticlesBg className="particles" type="cobweb" bg={true}/>
        <Navigation />
        <Logo />
        <Rank/>
        <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
        <FaceRecognition box={this.state.box} imageURL={this.state.imageURL}/>
       
   
  
      </div>
    );

  }

}

export default App;
