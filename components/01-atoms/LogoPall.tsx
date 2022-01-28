import Image from 'next/image';
import Link from 'next/link';

export default function LogoPall() {
  return (
    <div className="ml-5 ">
      <Link href="/">
        <a href="/">
          <Image src="/logo-combo.png" alt="Toko Poppi" width={269.625} height={96.375} />
        </a>
      </Link>
    </div>
  );
}
