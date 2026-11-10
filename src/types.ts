export interface User{id:string;name:string;username:string;permissions:string[];mustChangePassword:boolean;active:boolean;onboarding?:'pending'|'approved';authProvider?:'password'|'wechat';}
export type {Task,WorkOrder} from './generated/api';
export interface AppState{globalData:{user:User|null};}
