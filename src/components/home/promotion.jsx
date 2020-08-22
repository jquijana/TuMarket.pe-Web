import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

function Promotion() {
    return (
        <Fragment>
            <div className="alert-header d-none d-sm-block">
                ¿Te gustaría que tu negocio llegue a más personas? <Link to={`/registro`}  >Inscríbete</Link>
            </div>
            <div className="alert-header d-block d-sm-none">
                ¿Tienes un negocio? <Link to={`/registro`}  >Inscríbete</Link>
            </div>
        </Fragment>
    );
}

export default Promotion;