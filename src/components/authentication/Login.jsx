import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import Firebase from '../common/firebase';
import { AuthContext } from '../context/authContext';
import Register from '../authentication/Register';

export default (props) => {
    const { currentUser } = useContext(AuthContext);
    const { register, errors, handleSubmit } = useForm();
    const [messageValidation, setMessageValidation] = useState(null);

    const onLoginSubmit = async (data, event) => {
        event.preventDefault();
        await Firebase.login(data.email, data.password)
            .then(response => {
                console.log("response", response);
                props.history.replace('/')
            })
            .catch(error => {
                setMessageValidation("Usuario / Password incorrecto");
                console.log("error", error);
            });
    }

    if (currentUser) {
        props.history.replace('/');
    }

    return (
        <div className="page-container" style={{ backgroundColor: '#f6f6f6' }}>
            <div className="content-wrap">
                <div className="login">
                    <div className="d-flex">
                        <div className="login-img">
                            <div>
                                <svg className="cart-svg" width="140" height="140" viewBox="0 0 32 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10.3101 21.9807H10.3115C10.3127 21.9807 10.314 21.9805 10.3152 21.9805H27.3125C27.731 21.9805 28.0989 21.6855 28.2139 21.258L31.9639 7.31273C32.0447 7.01208 31.988 6.68887 31.811 6.43933C31.6338 6.18979 31.3567 6.04297 31.0625 6.04297H8.14795L7.47778 2.83861C7.38233 2.38284 7.00195 2.05859 6.5625 2.05859H0.9375C0.419678 2.05859 0 2.5045 0 3.05469C0 3.60487 0.419678 4.05078 0.9375 4.05078H5.81055C5.9292 4.61861 9.01758 19.3852 9.19531 20.2347C8.19898 20.6949 7.5 21.7504 7.5 22.9766C7.5 24.6243 8.76172 25.9648 10.3125 25.9648H27.3125C27.8303 25.9648 28.25 25.5189 28.25 24.9688C28.25 24.4186 27.8303 23.9727 27.3125 23.9727H10.3125C9.79566 23.9727 9.375 23.5257 9.375 22.9766C9.375 22.4282 9.79419 21.982 10.3101 21.9807ZM29.8196 8.03516L26.6052 19.9883H11.0645L8.56445 8.03516H29.8196Z" fill="white"></path>
                                    <path d="M9.375 28.9531C9.375 30.6008 10.6367 31.9414 12.1875 31.9414C13.7383 31.9414 15 30.6008 15 28.9531C15 27.3054 13.7383 25.9648 12.1875 25.9648C10.6367 25.9648 9.375 27.3054 9.375 28.9531ZM12.1875 27.957C12.7043 27.957 13.125 28.404 13.125 28.9531C13.125 29.5023 12.7043 29.9492 12.1875 29.9492C11.6707 29.9492 11.25 29.5023 11.25 28.9531C11.25 28.404 11.6707 27.957 12.1875 27.957Z" fill="white"></path>
                                    <path d="M22.625 28.9531C22.625 30.6008 23.8867 31.9414 25.4375 31.9414C26.9883 31.9414 28.25 30.6008 28.25 28.9531C28.25 27.3054 26.9883 25.9648 25.4375 25.9648C23.8867 25.9648 22.625 27.3054 22.625 28.9531ZM25.4375 27.957C25.9543 27.957 26.375 28.404 26.375 28.9531C26.375 29.5023 25.9543 29.9492 25.4375 29.9492C24.9207 29.9492 24.5 29.5023 24.5 28.9531C24.5 28.404 24.9207 27.957 25.4375 27.957Z" fill="white"></path>
                                </svg>
                                <svg className="message-svg" width="70" height="70" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg"><g clipPath="url(#clip0)">
                                    <path d="M4.35601 24.6579L2.49149 24.6985L3.78192 23.3819C4.4777 22.672 4.90197 21.7591 5.00001 20.7767C3.11909 19.6278 1.72856 18.0928 0.963394 16.3143C0.198774 14.5372 0.0646518 12.5655 0.575554 10.6123C1.18856 8.26868 2.699 6.11186 4.82854 4.53907C7.14268 2.83003 10.0493 1.89001 13.2344 1.82072C17.2466 1.73344 20.6531 2.78595 23.0852 4.86439C25.2762 6.73689 26.5163 9.29994 26.5768 12.0815C26.6062 13.4328 26.3531 14.7539 25.8246 16.0079C25.2777 17.3055 24.4608 18.4681 23.3967 19.4633C21.0542 21.654 17.699 22.858 13.6939 22.9452C12.2071 22.9775 10.6514 22.8174 9.25847 22.4917C7.97592 23.8341 6.21544 24.6175 4.35601 24.6579ZM13.2672 3.32961C6.88073 3.46855 3.04289 7.27437 2.0724 10.9846C1.15532 14.4907 2.69059 17.7514 6.17928 19.707L6.56909 19.9255L6.5668 20.3647C6.56222 21.234 6.3684 22.0755 6.00534 22.8402C6.92285 22.5147 7.74938 21.9426 8.38956 21.1705L8.7079 20.7865L9.19522 20.9175C10.5628 21.2849 12.1488 21.4692 13.6611 21.4363C21.6094 21.2634 25.1272 16.4833 25.0321 12.1151C24.981 9.76242 23.928 7.59097 22.0672 6.00078C19.9303 4.17455 16.8872 3.25086 13.2672 3.32961Z" fill="#5C8001"></path></g><defs><clipPath id="clip0"><rect y="0.572266" width="26.3201" height="25.7111" transform="rotate(-1.24628 0 0.572266)" fill="white"></rect></clipPath></defs>
                                </svg>
                                <div className="login-text-logo">TúCompras<span style={{ color: '#5c7f01' }}>.pe</span></div>
                            </div>
                        </div>
                        <div className="login-body">

                            <div className="login-wrap">
                                <div className="login-html">
                                    <input id="tab-1" type="radio" name="tab" className="sign-in" checked /><label htmlFor="tab-1" className="tab">Ingresar</label>
                                    <input id="tab-2" type="radio" name="tab" className="sign-up" /><label htmlFor="tab-2" className="tab">Crear cuenta</label>
                                    <div className="login-form">
                                        <div className="sign-in-htm">
                                            <form onSubmit={handleSubmit(onLoginSubmit)}>
                                                <div className="group">
                                                    <label htmlFor="email" className="label">Usuario </label>
                                                    <input id="email" name="email" type="text" className="input"
                                                        ref={register({ required: { value: true, message: '* Email es requerido' } })}
                                                    />
                                                    <small className="form-text text-left text-danger">{errors?.email?.message}</small>
                                                </div>
                                                <div className="group">
                                                    <label htmlFor="password" className="label">Contraseña</label>
                                                    <input id="password" name="password" type="password" className="input" data-type="password"
                                                        ref={register({ required: { value: true, message: '* Password es requerido' } })}
                                                    />
                                                    <small className="form-text text-left text-danger">{errors?.password?.message}</small>
                                                </div>
                                                {
                                                    messageValidation &&
                                                    <div className="group">
                                                        <small className="form-text text-left text-danger">{messageValidation}</small>
                                                    </div>
                                                }
                                                <div className="group mt-20">
                                                    <button type="submit" className="button">Iniciar sesión</button>
                                                </div>
                                                {/* <div className="text-center text-gray">Ingresa con</div> 
                                                <div className="group social-login">
                                                    <button className="button gmail">Gmail</button>
                                                    <button className="button facebook">Facebook</button>
                                                </div>
                                                */}
                                            </form>
                                        </div>
                                        <div className="sign-up-htm">
                                            <Register {...props} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}