import '../styles/globals.css'

import React from 'react';
import { ComponentStory, ComponentMeta} from "@storybook/react";

import {MenuItem} from "../components/03-organisms/MenuItem";
import {MenuItemObject} from "../_types/MenuItemModel";


export default {
    title:"MenuItem",
    component: MenuItem
} as ComponentMeta<typeof MenuItem>

export const Primary: ComponentStory<typeof MenuItem> = () => {
    return (
        <div>
<!--             <MenuItem data={data}/>
            <MenuItem data={data}/>
            <MenuItem data={data}/> -->
        </div>
    )
}

const data:MenuItemObject = {
    menuDish: [{
        dishName: "Dal makhni",
        dishDescription: "Gesplitste bruine kikkererwten, zwarte bonen en kidney bonen gekook in een pot in de oven"
    }],
    menuName: "Amritsar",
    menuPrice: "8,00"
}
