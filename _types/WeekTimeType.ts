import { MenuItemData } from './MenuItemModel';

export interface WeekTimeType {
  monday: [{
    from: string,
    to: string,
    lunchBreak: string
  }]
  tuesday: [{
    from: string,
    to: string,
    lunchBreak: string
  }]
  wednesday: [{
    from: string,
    to: string,
    lunchBreak: string
  }]
  thursday: [{
    from: string,
    to: string,
    lunchBreak: string
  }]
  friday: [{
    from: string,
    to: string,
    lunchBreak: string
  }]
  saturday: [{
    from: string,
    to: string,
    lunchBreak: string
  }]
  sunday: [{
    from: string,
    to: string,
    lunchBreak: string
  }]
}

export interface WeekMenuType {
  monday: {
    menuItems: {
      data: MenuItemData[]
    }
  }
  tuesday: {
    menuItems: {
      data: MenuItemData[]
    }
  }
  wednesday: {
    menuItems: {
      data: MenuItemData[]
    }
  }
  thursday:{
    menuItems: {
      data: MenuItemData[]
    }
  }
  friday: {
    menuItems: {
      data: MenuItemData[]
    }
  }
  saturday: {
    menuItems: {
      data: MenuItemData[]
    }
  }
  sunday: {
    menuItems: {
      data: MenuItemData[]
    }
  }
}
