import Head from "next/head";
import Header from "../../components/03-organisms/Header";
import Footer from "../../components/03-organisms/Footer";
import Hero from "../../components/03-organisms/Hero";

const Paul = () => {
    return (
        <div>
            <Head>
                <title>Bestel uw maaltijd</title>
                <link rel="icon" href="/toko-poppi-logo.png" />
            </Head>
            <Header/>
            <section  className="grid grid-cols-6">
                <section className="col-span-5">
                    <Hero/>

                </section>
                <section className="col-span-1">

                </section>
            </section>
            <Footer/>
        </div>
    )
}

export default Paul