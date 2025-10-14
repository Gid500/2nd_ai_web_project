import React from 'react'
import '../asset/css/Footer.css'

function Footer() {
    return (
        <footer className='footer-container'>
            <div className='footer-inner'>
                <div className='footer-left'>
                    <h2 className='footer-logo'>REIVA</h2>
                    <p className='footer-desc'>
                        Simple & Modern Fashion Platform<br/>
                        Your style begins here.
                    </p>
                </div>

                <div className='footer-right'>
                    <ul>
                        <li>About</li>
                        <li>Terms</li>
                        <li>Privacy</li>
                        <li>Contact</li>
                    </ul>
                </div>
            </div>

            <p className='footer-bottom'>
                © 2025 REIVA. All rights reserved.
            </p>
        </footer>
    );
}

export default Footer;
