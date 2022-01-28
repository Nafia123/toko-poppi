import Image from 'next/image';
import Link from 'next/link';

export default function Logo() {
  return (
    <div className="ml-5 ">
      <Link href="/">
        <a href="/">
          <Image src="/toko-poppi-logo.png" alt="Toko Poppi" width={79.5} height={96.375} />
        </a>
      </Link>
    </div>
  );
}
