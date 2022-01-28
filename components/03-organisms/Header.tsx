import {Component} from "react";
import LogoPaul from "../01-atoms/LogoPaul";
import {MainNavigation} from "../01-atoms/MainNavigation";

export function Header (){
        return (
            <header className="shadow-md flex justify-between">
                <LogoPaul/>
                <MainNavigation/>
            </header>
        )
}
