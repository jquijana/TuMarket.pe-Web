import React, { useState, useCallback, useRef, useEffect, useContext } from "react";
import { url_constants, headers, mapsKey } from '../../utils/Constants'
import axios from 'axios';
import HeaderReturn from '../template/headerReturn';
import LstProducts from '../commerce/register-product';
import Images from '../commerce/register-image';
import Footer from '../template/footer';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from '../context/authContext';
import { GoogleMap, useLoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";
import { Combobox, ComboboxInput, ComboboxPopover, ComboboxList, ComboboxOption } from "@reach/combobox";
import "@reach/combobox/styles.css";

const libraries = ["places"];
toast.configure();

export default function (props) {
    const { isLoaded, loadError } = useLoadScript({ googleMapsApiKey: mapsKey, libraries });
    const { currentUser } = useContext(AuthContext);
    const { register, errors, handleSubmit } = useForm();

    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [commerce, setCommerce] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const [markers, setMarkers] = useState([]);
    const [viewMarker, setViewMarker] = useState(null);
    const [latitude, setLatitude] = useState(-13.1605503);
    const [longitude, setLongitude] = useState(-74.2279566);


    const [commerceId, setCommerceId] = useState(null);
    const [commerceName, setCommerceName] = useState("");
    const [commerceDescription, setCommerceDescription] = useState("");
    const [commerceCellphone, setCommerceCellphone] = useState("");
    const [categorySelected, setCategorySelected] = useState("");
    const [subCategorySelected, setSubCategorySelected] = useState("");
    const [addressSelected, setAddressSelected] = useState(null);

    if (!currentUser) {
        props.history.replace('/login');
    }

    const mapRef = useRef();
    const onMapLoad = useCallback((map) => {
        mapRef.current = map;
    }, []);

    const panTo = useCallback(({ lat, lng, address }) => {
        setMarkers([
            {
                lat: lat,
                lng: lng,
            },
        ]);
        setAddressSelected(address);
        setLatitude(lat);
        setLongitude(lng);
        mapRef.current.panTo({ lat, lng });
        mapRef.current.setZoom(17);
    }, []);

    useEffect(() => {
        setCategories(JSON.parse(localStorage.getItem("categories")));
        if (props.location.state && props.location.state.commerce) {
            const data = props.location.state.commerce;
            setCommerce(data);
            setCommerceId(data.id);
            setCommerceName(data.name);
            setCommerceDescription(data.description);
            setCommerceCellphone(data.contact ? data.contact.cellphone.substring(2) : "");
            setAddressSelected(data.ubigeo.address);
            setLatitude(data.ubigeo.latitude);
            setLongitude(data.ubigeo.longitude);
            setMarkers([
                {
                    lat: data.ubigeo.latitude,
                    lng: data.ubigeo.longitude,
                },
            ]);
            selectCategory(data.category.id)
            setSubCategorySelected(data.category.item.id)
        }
    }, [props.location.state]);

    const selectCategory = ((categoryId) => {
        if (categoryId) {
            setCategorySelected(categoryId)
            setSubCategorySelected("");
            const data = JSON.parse(localStorage.getItem("categories"));
            const subcategories = data.find(x => x.id === categoryId).items;
            setSubCategories(subcategories);
        } else {
            setSubCategories([]);
        }
    });

    const selectSubCategory = ((item) => {
        if (item) {
            setSubCategorySelected(item);
        }
    });


    if (loadError) return "Error";
    if (!isLoaded) return "Loading...";

    const onSubmit = async (data, event) => {
        if (!addressSelected) {
            toast.warning('Seleccione dirección válida');
            return;
        }

        setIsLoading(true);
        const body = {
            id: commerceId,
            userId: currentUser.uid,
            name: data.name,
            description: data.description,
            category: {
                id: data.category,
                item: {
                    id: data.subcategory
                }
            },
            ubigeo: {
                latitude: latitude,
                longitude: longitude,
                address: addressSelected
            },
            images: [],
            contact: {
                cellphone: `51${data.phone}`,
            }
        }

        await axios.post(`${url_constants.commerces}`, body, { headers: headers })
            .then(function (response) {
                setCommerceId(response.data.id);
                setCommerce(response.data);
                toast.success('Su negocio fue registrado exitosamente');
            }).catch(function (error) {
                toast.error('Algo salió mal!  :( ');
                return;
            });
        setIsLoading(false);
    }

    return (
        <div className="page-container">
            <div className="content-wrap">
                <HeaderReturn />
                <section className="container mt-lg-main">
                    <div className="row">

                        <div className="col-12 col-lg-3">
                            <div className="col-12 panel d-none d-sm-block">
                                <div className="back-commerce"><i className="icon-arrow"></i> <div>Volver</div></div>
                            </div>
                        </div>

                        <div className="col-12 col-lg-9">
                            <ul className="nav nav-tabs" id="myTab" role="tablist">
                                <li className="nav-item">
                                    <a className="nav-link active" id="home-tab" data-toggle="tab" href="#home" role="tab" aria-controls="home" aria-selected="false">Negocio</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" id="profile-tab" data-toggle="tab" href="#profile" role="tab" aria-controls="profile" aria-selected="false">Productos</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" id="aditional-tab" data-toggle="tab" href="#aditional" role="tab" aria-controls="aditional" aria-selected="false">Imágenes</a>
                                </li>
                            </ul>
                            <div className="tab-content panel" id="myTabContent">
                                <div className="tab-pane fade  show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                                    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                                        <div className="form-group">
                                            <label>Nombre del Negocio</label>
                                            <input name="name"
                                                value={commerceName}
                                                onChange={e => { setCommerceName(e.target.value) }}
                                                ref={register({ required: { value: true, message: '* Nombre es requerido' } })}
                                                className="form-control"
                                                placeholder="Este nombre se verá en nuestra plataforma" />
                                            <small className="form-text text-left text-danger">{errors?.name?.message}</small>
                                        </div>
                                        <div className="form-group">
                                            <label>Descripción</label>
                                            <textarea name="description"
                                                value={commerceDescription}
                                                onChange={e => { setCommerceDescription(e.target.value) }}
                                                ref={register({ required: { value: false } })}
                                                className="form-control"
                                                placeholder="Ingrese una breve descripcion de su negocio"></textarea>
                                            <small className="form-text text-right text-muted">Máx 250 caracteres</small>
                                        </div>
                                        <div className="row">
                                            <div className="col-12 col-lg-6 form-group">
                                                <label>Categoria</label>
                                                <select name="category"
                                                    value={categorySelected}
                                                    ref={register({ required: { value: true, message: '* Categoria es requerido' } })}
                                                    className="selectpicker form-control"
                                                    onChange={opt => selectCategory(opt.target.value)}>
                                                    <option value="" >seleccione</option>
                                                    {
                                                        categories.map(data => (
                                                            < option key={data.id} id={data.id} value={data.id}>{data.name}</option>
                                                        ))
                                                    }
                                                </select>
                                                <small className="form-text text-left text-danger">{errors?.category?.message}</small>
                                            </div>
                                            <div className="col-12 col-lg-6 form-group">
                                                <label>Rubro</label>
                                                <select name="subcategory"
                                                    value={subCategorySelected}
                                                    ref={register({ required: { value: true, message: '* Rubro es requerido' } })}
                                                    className="selectpicker form-control"
                                                    onChange={opt => selectSubCategory(opt.target.value)}>
                                                    <option value="">seleccione</option>
                                                    {
                                                        subCategories.map(data => (
                                                            < option key={data.id} id={data.id} value={data.id}>{data.name}</option>
                                                        ))
                                                    }
                                                </select>
                                                <small className="form-text text-left text-danger">{errors?.subcategory?.message}</small>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label>Whatsapp</label>
                                            <input name="phone"
                                                value={commerceCellphone}
                                                onChange={e => { setCommerceCellphone(e.target.value) }}
                                                ref={register({ required: { value: true, message: '* Teléfono es requerido' } })}
                                                className="form-control"
                                                placeholder="Whattsap para recibir pedidos" />
                                            <small className="form-text text-left text-danger">{errors?.phone?.message}</small>
                                        </div>
                                        <div className="form-group">
                                            <div>
                                                <label>Dirección : </label>
                                            </div>
                                            <Search panTo={panTo} address={addressSelected} setAddressSelected={setAddressSelected} />
                                            {!addressSelected && <small className="form-text text-left text-danger">*Dirección es requerido</small>}
                                        </div>
                                        <div className="form-group" >
                                            {<GoogleMap
                                                id="map"
                                                mapContainerStyle={{
                                                    height: "20vh",
                                                    width: "100%",
                                                }}
                                                zoom={15}
                                                center={{
                                                    lat: latitude,
                                                    lng: longitude,
                                                }}
                                                options={{
                                                    disableDefaultUI: true,
                                                    zoomControl: true,
                                                }}
                                                onLoad={onMapLoad}
                                            >
                                                {markers.map((marker) => (
                                                    <Marker
                                                        key={`${marker.id}`}
                                                        position={{ lat: marker.lat, lng: marker.lng }}
                                                        onClick={() => {
                                                            setViewMarker(marker);
                                                        }}
                                                        icon={{
                                                            url: `/favicon.png`,
                                                            //origin: new window.google.maps.Point(0, 0),
                                                            //anchor: new window.google.maps.Point(15, 15),
                                                            scaledSize: new window.google.maps.Size(30, 30),
                                                        }}
                                                    />
                                                ))}

                                                {viewMarker ? (
                                                    <InfoWindow
                                                        position={{ lat: viewMarker.lat, lng: viewMarker.lng }}
                                                        onCloseClick={() => {
                                                            setViewMarker(null);
                                                        }}
                                                    >
                                                        <div>
                                                            <h4><span role="img" aria-label="bear"><i className="icon-ubicacion"></i></span>{" "}Mi ubicación</h4>
                                                        </div>
                                                    </InfoWindow>
                                                ) : null}
                                            </GoogleMap>}
                                        </div>
                                        <div className="text-right-center">
                                            <button className="btn btn-save" disabled={isLoading} >Guardar
                                                    {isLoading && <div className="spinner">
                                                    <div className="bounce1"></div>
                                                    <div className="bounce2"></div>
                                                    <div className="bounce3"></div>
                                                </div>}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                                <div className="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
                                    <LstProducts commerce={commerce} />
                                </div>
                                <div className="tab-pane fade" id="aditional" role="tabpanel" aria-labelledby="aditional-tab">
                                    <Images commerce={commerce} />
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

function Search({ panTo, address, setAddressSelected }) {
    const {
        ready,
        value,
        suggestions: { status, data },
        setValue,
        clearSuggestions,
    } = usePlacesAutocomplete({
        requestOptions: {
            location: { lat: () => 43.6532, lng: () => -79.3832 },
            radius: 100 * 1000,
        },
    });

    const handleInput = (e) => {
        setValue(e.target.value);
        setAddressSelected(e.target.value);
    };

    const handleSelect = async (address) => {
        setValue(address, false);
        clearSuggestions();

        try {
            const results = await getGeocode({ address });
            const { lat, lng } = await getLatLng(results[0]);
            panTo({ lat, lng, address });
        } catch (error) {
            console.log("😱 Error: ", error);
        }
    };

    return (
        <Combobox onSelect={handleSelect}>
            <ComboboxInput
                value={address ? address : value}
                onChange={handleInput}
                disabled={!ready}
                className="form-control"
                placeholder="Ingrese su dirección ..."
            />
            <ComboboxPopover>
                <ComboboxList>
                    {status === "OK" &&
                        data.map(({ id, description }) => (
                            <ComboboxOption key={id} value={description} />
                        ))}
                </ComboboxList>
            </ComboboxPopover>
        </Combobox>
    );
}