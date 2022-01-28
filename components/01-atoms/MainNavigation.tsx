import Link from 'next/link';

export default function MainNavigation() {
  return (
    <nav>
      <ul className="flex justify-center items-center">
        <li>
          <Link href="/">
            <a href="/">Home</a>
          </Link>
        </li>
        <li>
          <Link href="/">
            <a href="/">WebShop (Coming Soon)</a>
          </Link>
        </li>
        <li>
          <Link href="/">
            <a href="/">Contact</a>
          </Link>
        </li>
      </ul>

    </nav>
  );
}
