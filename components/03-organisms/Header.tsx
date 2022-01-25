import {Component} from "react";
import LogoPaul from "../01-atoms/LogoPaul";
import MainNavigation from "../01-atoms/MainNavigation";

class Header extends Component{
    render () {
        return (
            <header className="shadow-md flex justify-between">
                <LogoPaul/>
                <MainNavigation/>
            </header>
        )
    }
}

export default Header