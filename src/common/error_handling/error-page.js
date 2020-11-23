import React from 'react'
import styles from '../styles/project-style.css';

class ErrorPage extends React.Component {

    render() {
            return <h1 className={styles.errorTitle}>Page not found.</h1>;
    }
}

export default ErrorPage
