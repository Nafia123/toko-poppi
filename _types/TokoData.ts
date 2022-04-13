import { DateTime } from 'luxon';
import { MenuItemObject } from './MenuItemModel';
import { CompanyFormData } from '../components/03-organisms/PaymentView';
import {WeekMenuType, WeekTimeType} from './WeekTimeType';

interface MenuItemData {
  attributes: MenuItemObject
}
export interface GqlData{
  menuItems: {
    data: MenuItemData[]
  }
  shopInfo: {
    data: {
      attributes: CompanyFormData
    }
  }
  limitOrder:{
    data: {
      attributes: {
        Limit: number
      }
    }
  }
  orders: {
    data: Array<{ attributes: { deliveryTime: DateTime } }>
  }
  weekMenu: {
    data: {
      attributes: WeekMenuType
    }
  }
  orderDay: {
    data: {
      attributes: WeekTimeType
    }
  }
}
