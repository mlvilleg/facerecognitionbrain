import React from "react";
import './ImageLinkForm.css';



const ImageLinkForm = () => {
    return (
        <div>

            <p className="f3">
                {"This Magic Brain will detect faces in your photo"}
            </p>

            <div className="center">

                <div className="form center pa4 br shadow-4">
                    <input className="f4 pa2 w-70 center bg-light-yellow" type='text'/>
                    <button className="w-30 grow f4 link ph3 pv2 dib white bg-blue">Detect</button>
                </div>

            </div>

        </div>
    )
}

export default ImageLinkForm