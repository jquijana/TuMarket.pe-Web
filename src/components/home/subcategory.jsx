import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

function Subcategory({ category }) {
    if (category === null) {
        return <div></div>;
    }

    return (
        <Fragment>
            {
                category.items.map(data => (
                    <div className="col-6 col-lg-3 xs-p-05" key={data.id}>
                        <Link to={`/${category.id}/comercios/${data.id}`}  >
                            <div className="card-subcategory" style={{ backgroundImage: `url(${data.image})` }}>
                                <div className="title">{data.name}</div>
                            </div>
                        </Link>
                    </div>
                ))
            }
        </Fragment >
    );
}

export default Subcategory;