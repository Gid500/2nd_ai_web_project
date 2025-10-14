import React from 'react'
import '../asset/css/Footer.css'

function Footer() {
    return (
        <footer className='footer-container'>
            <div className='footer-inner'>
                <div className='footer-side'>
                    <ul>
                        <li>MAIN</li>
                        <li>STYLE</li>
                        <li>고객센터</li>
                        <li>MY</li>
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
