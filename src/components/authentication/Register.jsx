import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import Firebase from '../common/firebase';
import { AuthContext } from '../context/authContext';

export default function Register(props) {
    const { currentUser } = useContext(AuthContext);
    const { register, errors, handleSubmit } = useForm();
    const [messageValidation, setMessageValidation] = useState(null);

    const onRegisterUserSubmit = async (data, event) => {
        event.preventDefault();
        const response = await Firebase.register(data.name.trim(), data.email.trim(), data.password);
        if (response.code === 'successful') {
            props.history.replace('/registro')
        } else {
            setMessageValidation(response.data);
        }
    }

    if (currentUser) {
        props.history.replace('/');
    }

    return (
        <form onSubmit={handleSubmit(onRegisterUserSubmit)}>
            <div className="group">
                <label htmlFor="email" className="label">Correo electrónico</label>
                <input id="email" name="email" type="text" className="input"
                    ref={register({ required: { value: true, message: '* Email es requerido' } })}
                />
                <small className="form-text text-left text-danger">{errors?.email?.message}</small>
            </div>
            <div className="group">
                <label htmlFor="name" className="label">Nombre y apellido</label>
                <input id="name" name="name" type="text" className="input"
                    ref={register({ required: { value: true, message: '* Nombres es requerido' } })}
                />
                <small className="form-text text-left text-danger">{errors?.name?.message}</small>
            </div>
            <div className="group">
                <label htmlFor="password" className="label">Contraseña</label>
                <input id="password" name="password" type="password" className="input" data-type="password"
                    ref={register({ required: { value: true, message: '* Password es requerido' } })}
                />
                <small className="form-text text-left text-danger">{errors?.password?.message}</small>
            </div>{
                messageValidation &&
                <div className="group">
                    <small className="form-text text-left text-danger">{messageValidation}</small>
                </div>
            }
            <div className="group mt-20">
                <button type="submit" className="button">Registrar</button>
            </div>
        </form>

    );
}