import React from 'react';
import styles from './LogoComponent.module.scss';

const LogoComponent = () => {
    return (
        <div className='logo'>
            <h1 className={styles.title}>SynthJS</h1>
        </div>
    );
};

export default LogoComponent;
