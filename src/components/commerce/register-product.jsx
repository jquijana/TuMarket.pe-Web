import React, { useEffect, useState, Fragment } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { url_constants, headers } from '../../utils/Constants';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

toast.configure();
export default function LstProducts({ commerce }) {
    const { register, errors, handleSubmit } = useForm();
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const [productId, setProductId] = useState(null);
    const [productName, setProductName] = useState("");
    const [productDesc, setProductDesc] = useState("");
    const [productPrice, setProductPrice] = useState("");


    useEffect(() => {
        if (commerce.id) {
            axios.get(`${url_constants.products}?marketId=${commerce.id}`, { headers: headers })
                .then(function (response) {
                    setProducts(response.data);
                }).catch(function (error) {
                    console.log('Error : ' + error);
                    return;
                });
        }
    }, [commerce.id]);

    const onSubmit = async (data, event) => {
        setIsLoading(true);
        if (!commerce.id) {
            toast.info('* Primero registre su negocio!');
            return;
        }

        const body = {
            id: productId,
            name: data.productName.trim(),
            description: data.productDesc.trim(),
            marketId: commerce.id,
            price: {
                priceUnit: data.productPrice
            },
            images: []
        }

        await axios.post(`${url_constants.products}`, body, { headers: headers })
            .then(function (response) {
                setProductId(null);
                setProductName("");
                setProductDesc("");
                setProductPrice("");

                if (!body.id) {
                    setProducts([
                        ...products,
                        response.data
                    ]);
                } else {
                    const productsFilter = products.filter(x => x.id !== body.id);
                    setProducts([
                        ...productsFilter,
                        response.data
                    ]);
                }

                toast.success('Producto registrado exitosamente');
                event.target.reset();
            }).catch(function (error) {
                toast.error('Algo salió mal!  :( ');
                return;
            });

        setIsLoading(false);
    }

    const onDeleteProduct = (e, productId) => {
        e.preventDefault();
        axios.delete(`${url_constants.products}/${productId}`, { headers: headers })
            .then(function (response) {
                const result = products.filter(x => x.id !== productId);
                setProducts(result);
                toast.success('Producto eliminado');
            }).catch(function (error) {
                toast.error('Algo salió mal!  :( ');
                return;
            });
    }

    const onEditProduct = (e, data) => {
        e.preventDefault();
        setProductId(data.id);
        setProductName(data.name);
        setProductDesc(data.description);
        setProductPrice(Number(data.price.priceUnit));
    }

    return (
        <Fragment>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group">
                    <label>Nombre del Producto</label>
                    <input name="productName"
                        value={productName}
                        onChange={opt => setProductName(opt.target.value)}
                        ref={register({ required: { value: true, message: '* Nombre es requerido' } })}
                        className="form-control"
                        placeholder="Nombre del Producto" />
                    <small className="form-text text-left text-danger">{errors?.productName?.message}</small>
                </div>
                <div className="form-group">
                    <label>Descripción</label>
                    <textarea name="productDesc"
                        value={productDesc}
                        onChange={opt => setProductDesc(opt.target.value)}
                        ref={register({ required: { value: false } })}
                        className="form-control"
                        placeholder="Ingrese una breve descripcion de su negocio">
                    </textarea>
                    <small className="form-text text-right text-muted">Máx 250 caracteres</small>
                </div>
                <div className="row">
                    <div className="col-6 col-lg-4 form-group">
                        <label>Precio unitario</label>
                        <input name="productPrice" type="string"
                            value={productPrice}
                            onChange={opt => setProductPrice(opt.target.value)}
                            ref={register({ required: { value: true, message: '* Precio es requerido' } })}
                            className="form-control"
                            placeholder="En soles, Ejem : 12.5" />
                        <small className="form-text text-left text-danger">{errors?.productPrice?.message}</small>
                    </div>
                    <div className="col-6 offset-lg-2 text-right form-group">
                        <button className="btn btn-save" disabled={isLoading} style={{ marginTop: '32px' }}><i className="icon-plus"></i>&nbsp;Añadir
                            {isLoading &&
                                <div className="spinner">
                                    <div className="bounce1"></div>
                                    <div className="bounce2"></div>
                                </div>}
                        </button>
                    </div>
                </div>
            </form>
            <div className="col-12 tab" style={{ padding: 0 }}>
                <p className="line-bottom">Productos / Servicios</p>
                <div className="row products">
                    <div className="col-12 col-lg-6">
                        {
                            products.map(data => (
                                <div key={data.id} className="item">
                                    <div className="close" style={{ marginLeft: '4px' }}>
                                        <button style={{ border: "none" }}><i className="icon-edit-1" onClick={(e) => { onEditProduct(e, data) }}></i></button>
                                    </div>
                                    <div className="title">{data.name}</div>
                                    <div className="quantity">S/.</div>
                                    <div className="price">{data.price.priceUnit}</div>
                                    <div className="close" style={{ marginLeft: '4px' }}>
                                        <button style={{ border: "none" }}><i className="icon-quit" onClick={(e) => { onDeleteProduct(e, data.id) }}></i></button>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </Fragment>);
}