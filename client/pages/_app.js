import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';
import Header from '../components/header';
import React from "react";
import  ReactMarkdown from 'react-markdown';
import ReactDom from "react-dom";

const AppComponent =  ({Component , pageProps , currentUser}) =>{

    return (
    <div>
        <Header currentUser={currentUser}/>
        <div className='container'>
            <Component currentUser = {currentUser} {...pageProps} />
        </div>
    </div>
)}

AppComponent.getInitialProps =  async (appContext) => {
    const client = buildClient(appContext.ctx);
    const {data} = await client.get('/api/users/currentuser');
    let pageProps = {};
    if(appContext.Component.getInitialProps){
        // quick check to make sure this is not undefined
        // pass the client as the second argument to the get initial prop
        pageProps = await appContext.Component.getInitialProps(appContext.ctx, client, data.currentUser);

    }

    return {
        pageProps,
        ...data
    }

}

export default AppComponent;
