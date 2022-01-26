import Link from 'next/link';

export function MainNavigation() {
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


