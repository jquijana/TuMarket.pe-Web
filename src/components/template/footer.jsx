import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
    return (
        <footer>
            <div className="container footer d-none d-sm-block">2020 - TúCompras.pe</div>
            <div className="d-block d-sm-none">
                <div className="nav-footer d-flex">
                    <span className="material-icons"><Link
                        style={{ color: 'white' }}
                        to={{
                            pathname: `/`
                        }}
                    >home</Link></span>
                    <span className="material-icons"> <Link
                        style={{ color: 'white' }}
                        to={{
                            pathname: `/location`
                        }}
                    > location_on</Link></span>
                    <span className="material-icons"> <Link
                        style={{ color: 'white' }}
                        to={{
                            pathname: `/menu`
                        }}
                    >person</Link></span>
                </div>
            </div>
        </footer>
    );
}

export default Footer;