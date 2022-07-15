import React from 'react';

export const Carousel = () => {

    const imageSrc1 = "https://www.treehugger.com/thmb/mK82QAOvfR8s0fBfMRPtITb4Y98=/768x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/__opt__aboutcom__coeus__resources__content_migration__mnn__images__2019__01__BlackAndWhiteYakStandingInFrontOfMountainVista-f0e87cab9e11494492d2c12ad2b6e3a3.jpg";
    const imageSrc2 = "http://www.nelsonroadvet.com/wp-content/uploads/2012/03/iStock_000002404301XSmall.jpg";
    const imageSrc3 = "https://animaltalk.co.za/wp-content/uploads/2021/07/shane-aldendorff-3b3O75X0Jzg-unsplash.jpg";

    return (
        <div id="carouselExampleInterval" className="carousel slide" data-bs-ride="carousel" style={{
            flex: 1,
        }}>
            <div className="carousel-inner">
                <div className="carousel-item active">
                <img src={imageSrc1} className="d-block w-100" alt="First slide" />
                </div>
                <div className="carousel-item">
                <img src={imageSrc2} className="d-block w-100" alt="Second slide" />
                </div>
                <div className="carousel-item">
                <img src={imageSrc3} className="d-block w-100" alt="Third slide" />
                </div>
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleInterval" data-bs-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleInterval" data-bs-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
            </button>
        </div>
    );
};