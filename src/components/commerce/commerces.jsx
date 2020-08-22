import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { url_constants, headers } from '../../utils/Constants'
import HeaderSearch from '../template/headerSearch';
import Footer from '../template/footer';
import Search from '../common/search';

function Commerces(props) {
    const [commerces, setCommerces] = useState([]);

    useEffect(() => {
        axios.get(`${url_constants.commerces}?category=${props.match.params.categoryId}&item=${props.match.params.id}&latitude=-13.1767726&longitude=-74.2012146`, { headers: headers })
            .then(function (response) {
                setCommerces(response.data);
            }).catch(function (error) {
                console.log('Error : ' + error);
                return;
            });
    }, [props]);

    return (
        <div className="page-container">
            <div className="content-wrap">
                <HeaderSearch />
                <section className="container">
                    <div className="row">

                        <div className="col-12 col-lg-3">
                            <div className="panel">
                                <div className="label-categories d-none d-sm-block">
                                    Encuentra todo lo que buscas en un solo lugar
                                    </div>
                            </div>
                        </div>

                        <div className="col-12 col-lg-9 row-subcategory">
                            <div className="panel">
                                <div className="row">

                                    <div className="col-12 d-none d-sm-block">
                                        <div className="search">
                                            <Search />
                                        </div>
                                    </div>
                                    <div className="col-12 d-none d-sm-block">
                                        <div className="location">
                                            <i className="icon-ubicacion"></i><span>Encuentra lugares cerca de ti</span>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="row">
                                        {
                                            commerces.map(data => (
                                                <div key={data.id} className="col-12 col-lg-6 xs-p-05">
                                                    <Link
                                                        key={data.id}
                                                        to={{
                                                            pathname: `/comercios/${data.id}`,
                                                            state: { commerce: data }
                                                        }}
                                                    >
                                                        <div className="commerce">
                                                            <div className="commerce-img" style={data.images.length > 0 ? { backgroundImage: `url(${data.images[0].url})` } : {}}></div>
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
                                                                <p className="address"><i className="icon-shooter"></i>{data.ubigeo ? 'A ' + data.ubigeo.distance : 'Sin ubicación'}</p>
                                                                <div className="text-center"><button className="btn">Ver más información</button></div>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                </div>
                                            ))
                                        }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

            </div>
            <Footer />
        </div >
    );
}

export default Commerces;