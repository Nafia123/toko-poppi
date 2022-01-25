import {Component} from "react";
import Image from 'next/image';
import styles from '../../styles/Hero.module.css';

class Hero extends Component{
    render() {
        return (
            <section className={`bg-scroll ${styles.heroSection}`}>
                <div className={styles.heroText}>
                    <h1>WAsssup</h1>
                </div>
            </section>
        )
    }
}
export default Hero