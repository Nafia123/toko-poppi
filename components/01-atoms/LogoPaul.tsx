import {Component} from "react";
import Image from "next/image";
import Link from "next/link";

class LogoPaul extends Component{
    render () {
        return (
            <div className="ml-5 ">
                <Link href="/">
                   <a>
                       <Image src="/logo-combo.png" alt="Toko Poppi" width={269.625} height={96.375}/>
                   </a>
                </Link>
            </div>
        )
    }
}

export default LogoPaul