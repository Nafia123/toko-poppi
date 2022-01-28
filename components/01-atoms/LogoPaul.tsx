import Image from "next/image";
import Link from "next/link";

export function LogoPaul(){
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

export default LogoPaul