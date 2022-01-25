import {Component} from "react";
import Link from 'next/link';

class MainNavigation extends Component{
    render () {
        return (
           <nav>
               <ul className="flex justify-center items-center">
                   <li >
                       <Link href="/">
                           <a>Home</a>
                       </Link>
                   </li>
                   <li>
                       <Link href="/">
                           <a>WebShop (Coming Soon)</a>
                       </Link>
                   </li>
                   <li>
                       <Link href="/">
                           <a>Contact</a>
                       </Link>
                   </li>
               </ul>

           </nav>
     )
    }
}


export default MainNavigation