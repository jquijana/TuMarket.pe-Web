import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import HeaderReturn from '../template/headerReturn';
import Footer from '../template/footer';
import { url_constants, headers } from '../../utils/Constants'
import Slider from "../common/slider/slider";

export default function Detail(props) {
    const [products, setProducts] = useState([]);
    //const [data, setData] = useState([]);
    //const [images, setImages] = useState([]);
    const [productsSelected, setProductsSelected] = useState([]);
    //const commerce = props.location.state ? props.location.state.commerce : null;

    const data = props.location.state.commerce;
    const images = data.images.map(x => x.url);

    useEffect(() => {
        /*if (!commerce) {
              axios.get(`${url_constants.commerces}/obtenerMarket/${commerce.id}`, { headers: headers })
                  .then(function (response) {
                      console.log(response.data);
                      setData(response.data);
                      setImages(response.data.images.map(x => x.url));
                  }).catch(function (error) {
                      console.log('Error : ' + error);
                      return;
                  });
        } else {
            setData(commerce);
            setImages(commerce.images.map(x => x.url));
        }*/

        axios.get(`${url_constants.products}?marketId=${data.id}`, { headers: headers })
            .then(function (response) {
                setProducts(response.data);
            }).catch(function (error) {
                console.log('Error : ' + error);
                return;
            });
    }, [data]);

    const onSelectProduct = (event) => {
        const product = products.find(x => x.id === event.target.value);
        if (event.target.checked) {
            setProductsSelected([...productsSelected, {
                id: product.id,
                name: product.name,
                price: product.price.priceUnit
            }]);

        } else {
            const productsFilter = productsSelected.filter(x => x.id !== event.target.value);
            setProductsSelected(productsFilter);
        }
    }

    /*const generateMessageProduc = () => {
        let message = "";
        productsSelected.forEach(data => {
            message += message + `🛒 : ${data.name},   S/. : ${data.price}<br/>`
        });
        return message;
    }*/

    return (
        <div className="page-container">
            <div className="content-wrap">
                <HeaderReturn />
                <section className="container">
                    <div className="row">

                        <div className="col-12 row-subcategory">
                            <div className="panel">
                                <div className="row">

                                    <div className="col-12">
                                        <div className="col-12 d-none d-sm-block">

                                            <div className="back-commerce"><a href="/" className="icon-return"><i className="icon-arrow"></i>&nbsp;volver</a></div>
                                        </div>
                                        <div className="col-12 p-xs-0">
                                            <div className="row">
                                                <div className="col-12 col-lg-6 text-center" style={{ paddingRight: '0px', paddingLeft: '0px' }} >
                                                    <Slider images={images} />
                                                </div>
                                                <div className="col-12 col-lg-6">
                                                    <div className="commerce-detail">
                                                        <p className="title">{data.name}</p>
                                                        <div className="d-flex calification-stars">
                                                            <i className="icon-star"></i>
                                                            <i className="icon-star"></i>
                                                            <i className="icon-star"></i>
                                                            <i className="icon-star"></i>
                                                            <i className="icon-star"></i>
                                                            <div className="votes">({data.qualification ? data.qualification.votes : 0} votos)</div>
                                                        </div>
                                                        <p className="label">Descripción</p>
                                                        <p className="content">{data.description}</p>
                                                        <p className="label">Dirección</p>
                                                        <p className="content">{data.ubigeo ? data.ubigeo.address : 'Sin dirección'}</p>
                                                    </div>
                                                </div>
                                                <div className="col-12 tab">
                                                    <p className="line-bottom">Tenemos para ti</p>
                                                    <div className="row products">
                                                        {
                                                            products.map(data => (
                                                                <div className="col-12 col-lg-4" key={data.id} >
                                                                    <div className="item">
                                                                        {/*<div className="title"><i className="icon-previous"></i> <div>{data.name}</div></div>*/}
                                                                        <div className="title">
                                                                            <input value={data.id} type="checkbox" onChange={onSelectProduct} />
                                                                            <div>{data.name}</div>
                                                                        </div>
                                                                        {/* <div className="quantity">
                                                                            <span class="material-icons">arrow_drop_up</span>
                                                                            <input type="number" />
                                                                            <span class="material-icons">arrow_drop_down</span>
                                                                        </div> */}
                                                                        <div className="quantity">S/.</div>
                                                                        <div className="price">{data.price ? data.price.priceUnit : 0}</div>
                                                                    </div>
                                                                </div>
                                                            ))
                                                        }
                                                    </div>
                                                    <div className="col-12 text-right">
                                                        <Link to={{
                                                            pathname: `https://wa.me/${data.contact.cellphone}/?text=Hola *${data.name.trim()}* Vengo de https://tucompras.pe y quiero hacer un pedido :  
                                                        ` }} target="_blank">
                                                            <button className="btn send-whatsapp">Realizar pedido</button>
                                                        </Link>
                                                    </div>
                                                </div>
                                                <div className="col-12 tab">
                                                    <p className="line-bottom">Mis recomendaciones</p>
                                                    <div style={{ fontSize: '12px', fontWeight: 'normal', padding: '10px 20px' }}></div>
                                                </div>
                                            </div>
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
