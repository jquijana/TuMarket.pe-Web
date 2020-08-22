import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { url_constants, headers } from '../../utils/Constants';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Firebase from '../common/firebase';

toast.configure();
export default function Images({ commerce }) {
    const { register, errors, handleSubmit } = useForm();
    const [images, setImages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [nameBtnUpload, setNameBtnUpload] = useState("Añadir Imágen");

    useEffect(() => {
        if (commerce && commerce.images) {
            const imagesLst = commerce.images.map(image => (
                {
                    id: image.id,
                    url: image.url
                }
            ))
            setImages(imagesLst);
        }
    }, [commerce]);

    const onSubmit = (data, event) => {
        event.preventDefault();
        setIsLoading(true);
        if (!commerce || !commerce.id) {
            toast.info('* Primero registre su negocio!');
            setIsLoading(false);
            return;
        }

        const uploadTask = Firebase.storage.ref(`markets/${commerce.id}/${data.files[0].name}`).put(data.files[0]);
        uploadTask.on("state_changed",
            snapshot => {
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );

                setNameBtnUpload(`Subiendo Imagen : "${progress}%`);
                if (progress === 100) {
                    setNameBtnUpload("Añadir Imágen");
                    setIsLoading(false);
                }
            },
            error => {
                console.log(error);
                setIsLoading(false);
            },
            () => {
                Firebase.storage
                    .ref(`markets/${commerce.id}`)
                    .child(data.files[0].name)
                    .getDownloadURL()
                    .then(url => {
                        const imagesNew = [
                            ...images,
                            {
                                id: images.length + 1,
                                url: url
                            }];
                        commerce.images = imagesNew;
                        setImages(imagesNew);
                        axios.post(`${url_constants.commerces}`, commerce, { headers: headers })
                            .then(function (response) {
                                toast.success('Imagen cargada exitosamente');
                            }).catch(function (error) {
                                toast.error('Algo salió mal!  :( ');
                                return;
                            });
                    });
            }
        );
    }

    const onDeleteImage = (imagenId) => {
        const imagesNew = commerce.images.filter(x => x.id !== imagenId);
        commerce.images = imagesNew;
        axios.post(`${url_constants.commerces}`, commerce, { headers: headers })
            .then(function (response) {
                setImages(imagesNew);
                toast.success('Imagen eliminada');
            }).catch(function (error) {
                toast.error('Algo salió mal!  :( ');
                return;
            });
    }

    return (<div className="row">
        <div className="col-12 col-lg-8">
            <div className="img-upload text-center">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <p>* Sube varias imagenes de tu negocio</p>
                    <input className="btn btn-orange"
                        name="files"
                        type="file"
                        ref={register({ required: { value: true, message: '* Seleccione imagen' } })}
                    />
                    <small className="form-text text-left text-danger">{errors?.files?.message}</small>
                    <button className="btn btn-save m-20" disabled={isLoading}><i className="icon-plus"></i> {nameBtnUpload}
                        {isLoading &&
                            <div className="spinner">
                                <div className="bounce1"></div>
                                <div className="bounce2"></div>
                                <div className="bounce3"></div>
                            </div>}
                    </button>
                </form>
            </div>
        </div>
        {images.length > 0 &&
            <div className="col-12 col-lg-4">
                <div className="list-img">
                    <ul>
                        {images.map(image => (
                            <li key={image.id}>
                                <div>
                                    <button className="remove-img" style={{ border: 'none' }} onClick={() => { onDeleteImage(image.id) }}  >x</button>
                                    <img src={image.url} alt="" />
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        }
    </div>
    )
}