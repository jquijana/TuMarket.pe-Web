import React, { useState } from 'react';
import "./slider.scss"


export default function Slider({ images }) {
    const [x, setX] = useState(0);

    const handleIzquierda = () => {
        x === 0 ? setX(-100 * (images.length - 1)) : setX(x + 100);
    }

    const handleDerecha = () => {
        x === -100 * (images.length - 1) ? setX(0) : setX(x - 100);
    }

    return (
        <div className="slider">
            {
                images.map((item, index) => {
                    return (
                        <div key={index} className="slide" style={{ transform: `translateX(${x}%)` }}>
                            <img src={item} style={{ width: '100%', height: 'auto' }} alt="imagen" />
                        </div>
                    )
                })
            }
            <button id="irIzquierda" onClick={handleIzquierda}><i className="icon-back"></i></button>
            <button id="irDerecha" onClick={handleDerecha}><i className="icon-next"></i></button>
        </div>
    )
}
