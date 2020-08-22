import React, { useState, useCallback, useRef, useEffect } from "react";
import { url_constants, headers, mapsKey } from '../../utils/Constants'
import axios from 'axios';
import { GoogleMap, useLoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";
import { Combobox, ComboboxInput, ComboboxPopover, ComboboxList, ComboboxOption } from "@reach/combobox";
import "@reach/combobox/styles.css";

const libraries = ["places"];
const mapContainerStyle = {
    height: "100vh",
    width: "100vw",
};
const options = {
    disableDefaultUI: true,
    zoomControl: true,
};

export default function Location() {
    const { isLoaded, loadError } = useLoadScript({ googleMapsApiKey: mapsKey, libraries });
    const [markers, setMarkers] = useState([]);
    const [selected, setSelected] = useState(null);
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setLatitude(latitude);
                setLongitude(longitude);
            },
            (error) => {
                console.log(error);
                //alert("Habilite su ubicación, o ingrese su dirección");
                return;
            }
        )
    }

    useEffect(() => {
        if (latitude && longitude) {
            axios.get(`${url_constants.commerces}/nearest?latitude=${latitude}&longitude=${longitude}&limit=50`, { headers: headers })
                .then(function (response) {
                    const markers = response.data.map(data => {
                        const url = (data.images && data.images.length > 0) ? data.images[0].url : null;
                        const ubigeo = (data.ubigeo) ? data.ubigeo : null;
                        return {
                            id: data.id,
                            name: data.name,
                            ubigeo: ubigeo,
                            image: url,
                            lat: + data.ubigeo.latitude,
                            lng: + data.ubigeo.longitude,
                        }
                    });
                    setMarkers(markers);
                }).catch(function (error) {
                    console.log('Error : ' + error);
                    return;
                });
        }
    }, [latitude, longitude]);


    /*     const onMapClick = useCallback((e) => {
            setMarkers((current) => [
                ...current,
                {
                    lat: e.latLng.lat(),
                    lng: e.latLng.lng(),
                    time: new Date(),
                },
            ]);
        }, []); */

    const mapRef = useRef();
    const onMapLoad = useCallback((map) => {
        mapRef.current = map;
    }, []);

    const panTo = useCallback(({ lat, lng }) => {
        mapRef.current.panTo({ lat, lng });
        mapRef.current.setZoom(17);
    }, []);

    if (loadError) return "Error";
    if (!isLoaded) return "Loading...";

    return (
        <div className="page-container">
            <div className="content-wrap">
                <header>
                    <div className="navbar fixed-top bg-orange shadow-sm">
                        <div className="container d-flex justify-content-between">
                            {/* <div className="d-block d-sm-none"> */}
                            <div className="d-flex" style={{ width: '100%' }}>
                                <a href="/" className="icon-return"><i className="icon-arrow"></i></a>
                                <div className="search" style={{ width: '100%' }}>
                                    <Search panTo={panTo} />
                                </div>
                            </div>
                        </div>
                        {/* </div> */}
                    </div>
                </header >
                <section className="container">
                    <div className="row">
                        <div className="panel">
                            <div className="row">
                                {<GoogleMap
                                    id="map"
                                    mapContainerStyle={mapContainerStyle}
                                    zoom={15}
                                    center={{
                                        lat: latitude,
                                        lng: longitude,
                                    }}
                                    options={options}
                                    // onClick={onMapClick}
                                    onLoad={onMapLoad}
                                >
                                    {markers.map((marker) => (
                                        <Marker
                                            key={`${marker.id}`}
                                            position={{ lat: marker.lat, lng: marker.lng }}
                                            onClick={() => {
                                                setSelected(marker);
                                            }}
                                            icon={{
                                                url: `/favicon.png`,
                                                //origin: new window.google.maps.Point(0, 0),
                                                //anchor: new window.google.maps.Point(15, 15),
                                                scaledSize: new window.google.maps.Size(30, 30),
                                            }}
                                        />
                                    ))}

                                    {selected ? (
                                        <InfoWindow
                                            className="commerce"
                                            position={{ lat: selected.lat, lng: selected.lng }}
                                            onCloseClick={() => {
                                                setSelected(null);
                                            }}
                                        >
                                            <div className="commerce">
                                                <div className="commerce-img" style={selected ? { backgroundImage: `url(${selected.image})` } : {}}></div>
                                                <div className="commerce-body">
                                                    <p className="title">{selected.name}</p>
                                                    <div className="d-flex calification-stars">
                                                        <i className="icon-star"></i>
                                                        <i className="icon-star"></i>
                                                        <i className="icon-star"></i>
                                                        <i className="icon-star"></i>
                                                        <i className="icon-star"></i>
                                                    </div>
                                                    <p className="address"><i className="icon-location"></i>{selected.ubigeo ? selected.ubigeo.address : 'Sin dirección'}</p>
                                                    <p className="address"><i className="icon-shooter"></i>{selected.ubigeo ? + selected.ubigeo.distance + ' km' : 'Sin ubicación'}</p>
                                                    {/*  <div className="text-center">
                                                        <button className="btn">
                                                            <Link
                                                                style={{ color: 'white' }}
                                                                to={{
                                                                    pathname: `/comercios/${selected.id}`,
                                                                    state: { commerceId: selected.id }
                                                                }}
                                                            >Ver más</Link>
                                                        </button>
                                                    </div> */}

                                                </div>
                                            </div>
                                        </InfoWindow>
                                    ) : null}
                                </GoogleMap>}
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

function Search({ panTo }) {
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
    };

    const handleSelect = async (address) => {
        setValue(address, false);
        clearSuggestions();

        try {
            const results = await getGeocode({ address });
            const { lat, lng } = await getLatLng(results[0]);
            panTo({ lat, lng });
        } catch (error) {
            console.log("😱 Error: ", error);
        }
    };

    return (
        <Combobox onSelect={handleSelect}>
            <ComboboxInput
                value={value}
                onChange={handleInput}
                disabled={!ready}
                style={{ width: '100%' }}
                className="form-control input-search"
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