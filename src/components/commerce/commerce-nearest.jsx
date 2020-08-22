import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { url_constants, headers } from '../../utils/Constants'
import { Link } from 'react-router-dom';

export default function CommerceNearest({ category }) {
    const [commerces, setCommerces] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [messageLocation, setMessageLocation] = useState(true);

    useEffect(() => {
        setCommerces([]);
        setIsLoading(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const filterByCategory = (category === null) ? "" : `&category=${category.id}`;
                    axios.get(`${url_constants.commerces}/nearest?latitude=${latitude}&longitude=${longitude}${filterByCategory}`, { headers: headers })
                        .then(function (response) {
                            setMessageLocation(false);
                            setIsLoading(false);
                            setCommerces(response.data);
                            localStorage.setItem("commerces", JSON.stringify(response.data));
                        }).catch(function (error) {
                            console.log('Error : ' + error);
                            return;
                        });
                },
                (error) => {
                    console.log(error);
                }
            )
        }
    }, [category])


    return (
        <div className="panel" style={{ marginTop: '10px', marginBottom: '10px' }}>
            <span className="text-green"> Comercios cerca de mi :</span>
            <div className="row">
                {messageLocation &&
                    <span style={{ textAlign: 'center', color: '#f89367', fontWeight: 'bold' }}>Active su ubicación, para ver negocios más cercanos</span>
                }
                {isLoading &&
                    <div className="spinner" style={{ width: '100%', textAlign: 'center' }} >
                        <div style={{ backgroundColor: '#fb9367' }} className="bounce1"></div>
                        <div style={{ backgroundColor: '#fb9367' }} className="bounce2"></div>
                        <div style={{ backgroundColor: '#fb9367' }} className="bounce3"></div>
                    </div>
                }
                {
                    commerces.map(data => (
                        <div key={data.id} className="col-12 col-lg-6">
                            <Link
                                key={data.id}
                                to={{
                                    pathname: `/comercios/${data.id}`,
                                    state: { commerce: data }
                                }}
                            >
                                <div className="commerce">
                                    <div className="commerce-img" style={(data.images && data.images.length > 0) ? { backgroundImage: `url(${data.images[0].url})` } : {}}></div>
                                    <div className="commerce-body">
                                        <p className="title">{data.name}</p>
                                        <div className="d-flex calification-stars">
                                            <i className="icon-star"></i>
                                            <i className="icon-star"></i>
                                            <i className="icon-star"></i>
                                            <i className="icon-star"></i>
                                            <i className="icon-star"></i>
                                        </div>
                                        <p className="address"><i className="icon-location"></i>{data.ubigeo ? data.ubigeo.address : 'Sin dirección'}</p>
                                        <p className="address"><i className="icon-shooter"></i>{data.ubigeo ? 'A ' + data.ubigeo.distance + ' km' : 'Sin ubicación'}</p>
                                        <div className="text-center"><button className="btn">Ver más información</button></div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))
                }
            </div>
        </div >
    );
}

