import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { url_constants, headers } from '../../utils/Constants'
import Header from '../template/header';
import Footer from '../template/footer';
import Promotion from './promotion';
import Category from './category';
import Subcategory from './subcategory';
import CommerceNearest from '../commerce/commerce-nearest';
import Search from '../common/search';
import { Link } from 'react-router-dom';

function Home() {
    const [category, setCategory] = useState(null);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        axios.get(`${url_constants.categories}`, { headers: headers })
            .then(function (response) {
                setCategories(response.data);
                localStorage.setItem("categories", JSON.stringify(response.data));
            }).catch(function (error) {
                console.log('Error : ' + error);
                return;
            });
    }, []);

    return (
        <div className="page-container">
            <div className="content-wrap">
                <Header />
                <Promotion />

                <section className="container mt-lg-main">
                    <div className="row">

                        <div className="col-12 d-block d-sm-none">
                            <div className="col-12">
                                <div className="search">
                                    <Search />
                                </div>
                            </div>
                            <div className="col-12 d-block d-sm-none">
                                <div className="location">
                                    <Link to="/location"><div className="material-icons ico-location">location_on</div><span>Encuentra lugares cerca de ti</span></Link>
                                </div>
                            </div>
                        </div>

                        <div className="col-12 col-lg-3">
                            <div className="panel">
                                <div className="label-categories d-none d-sm-block">
                                    Encuentra todo lo que buscas en un solo lugar
                                </div>
                                <Category categories={categories} categorySelected={data => setCategory(data)} />
                            </div>
                        </div>

                        <div className="col-12 col-lg-9 row-subcategory">
                            <div className="panel">
                                <div className="row">

                                    <div className="col-12 d-none d-sm-block">
                                        <div className="search">
                                            <Search />
                                        </div>
                                    </div>
                                    <div className="col-12 d-none d-sm-block">
                                        <div className="location">
                                            <Link to="/location"><div className="material-icons ico-location">location_on</div><span>Encuentra lugares cerca de ti</span></Link>
                                        </div>
                                    </div>
                                    <Subcategory category={category} />
                                </div>
                            </div>
                            <CommerceNearest category={category} />
                        </div>
                    </div>
                </section>
            </div>
            <Footer />
        </div>
    );
}

export default Home;