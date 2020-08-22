import React, { useContext, useState, useEffect } from 'react';
import HeaderReturn from '../template/headerReturn';
import axios from 'axios';
import Footer from '../template/footer';
import { Link } from 'react-router-dom';
import { url_constants, headers } from '../../utils/Constants'
import { AuthContext } from '../context/authContext';
import Firebase from '../common/firebase';

export default (props) => {
    const { currentUser } = useContext(AuthContext);
    const [commerces, setCommerces] = useState([]);

    useEffect(() => {
        if (currentUser) {
            axios.get(`${url_constants.commerces}/byUser/${currentUser.uid}`, { headers: headers })
                .then(function (response) {
                    setCommerces(response.data);
                }).catch(function (error) {
                    console.log('Error : ' + error);
                    return;
                });
        }
    }, [currentUser]);


    const onLogout = async (event) => {
        event.preventDefault();
        await Firebase.logout()
            .then(response => {
                props.history.replace('/')
            })
            .catch(error => {
                console.log("error", error);
            });
    }

    return (
        <div className="page-container">
            <div className="content-wrap">
                <HeaderReturn />
                <section className="container">
                    <div className="row">
                        <div className="col-12 offset-lg-4 col-lg-4">
                            <div className="user-menu text-center">
                                <div className="img-profile">
                                    <span className="icon-usuario"><span className="path1"></span><span className="path2"></span></span>
                                </div>
                                {!currentUser &&
                                    <Link
                                        to={{
                                            pathname: `/login`,
                                        }}
                                    ><button type="submit" className="btn btn-yellow">Iniciar sesión</button>
                                    </Link>
                                }
                                {currentUser &&
                                    <h5>{currentUser.displayName}</h5>
                                }
                                <ul className="menu-lu">
                                    <li><div className="material-icons">add_circle</div>
                                        <div><Link style={{ color: '#3031359c' }} to={{ pathname: `/registro` }}>Crear negocio</Link></div>
                                    </li>
                                    <li data-toggle="collapse" href="#collapse" role="button" aria-expanded="false" aria-controls="collapse">
                                        <div className="material-icons">store</div><div> Mis negocios</div><div className="material-icons left">keyboard_arrow_right</div>
                                    </li>
                                    <div id="collapse">
                                        <ul className="submenu-lu collapse show">
                                            {commerces.map(data => (
                                                <li key={data.id} >
                                                    <Link to={{ pathname: `/comercios/${data.id}/edit`, state: { commerce: data } }}>
                                                        <i className="icon-edit-1"></i>&nbsp;&nbsp;{data.name}
                                                    </Link>
                                                </li>
                                            ))
                                            }
                                        </ul>
                                    </div>
                                    <li></li>
                                </ul>

                            </div>
                            <div style={{ textAlign: 'center', margin: '10px' }}>
                                {currentUser &&
                                    <button onClick={onLogout} className="btn btn-orange">Cerrar sesión</button>
                                }
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <Footer />
        </div >
    );
}
