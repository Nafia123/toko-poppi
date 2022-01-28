import React from 'react';
import LogoPall from '../01-atoms/LogoPall';
import Logo from '../01-atoms/Logo';
import MainNavigation from '../01-atoms/MainNavigation';

export default function Header({ pallLogo = false }: { pallLogo?: boolean }) {
  return (
    <header className="shadow-md flex justify-between">
      {pallLogo
        ? <LogoPall />
        : <Logo />}
      <MainNavigation />
    </header>
  );
}
