export interface User{id:string;name:string;username:string;permissions:string[];mustChangePassword:boolean;}
export type {Task,WorkOrder} from './generated/api';
export interface AppState{globalData:{user:User|null};}
