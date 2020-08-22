import React from 'react';
import { Link } from 'react-router-dom';

function Category({ categories, categorySelected }) {
    return (
        <div id="content-category">
            {
                categories.map(data => (
                    < Link key={data.id} to="#" id={data.id} onClick={() => categorySelected(data)}>
                        <div className="category">
                            <i className={data.image}></i>
                            <p>{data.name}</p>
                        </div>
                    </Link>
                ))
            }
        </div >
    );
}

export default Category;