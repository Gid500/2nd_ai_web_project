import React from 'react';
import CatImageUploadForm from './components/CatImageUploadForm';
import DogImageUploadForm from './components/DogImageUploadForm';

function Home() {
    return (
        <>
            <h1>Home Page</h1>
            <CatImageUploadForm />
            <DogImageUploadForm />
        </>
    );
}

export default Home;