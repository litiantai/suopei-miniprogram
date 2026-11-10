import {api,toast} from '../../utils/api';
import type {AppState,User} from '../../types';
Page({
 data:{busy:false,pending:false,name:'',identity:''},
 async onLoad(){if(wx.getStorageSync('session'))await this.refresh();},
 applyUser(user:User){
  getApp<AppState>().globalData.user=user;
  if(user.active){wx.reLaunch({url:'/pages/tasks/index'});return;}
  this.setData({pending:true,name:user.name==='微信员工待核对'?'':user.name,identity:user.username});
 },
 async login(){
  if(this.data.busy)return;
  this.setData({busy:true});
  try{
   const code=await new Promise<string>((resolve,reject)=>wx.login({timeout:10000,success:r=>r.code?resolve(r.code):reject(new Error('微信登录未返回凭证，请重试')),fail:()=>reject(new Error('微信登录失败，请重试'))}));
   const result=await api<{token:string;user:User}>('/auth/wechat','POST',{code});
   wx.setStorageSync('session',result.token);this.applyUser(result.user);
  }catch(error){toast(error);}finally{this.setData({busy:false});}
 },
 input(e:WechatMiniprogram.Input){this.setData({name:e.detail.value});},
 async saveName(){
  try{const user=await api<User>('/auth/wechat/profile','POST',{name:this.data.name.trim()});this.applyUser(user);toast('姓名已提交，请主管分配角色');}catch(error){toast(error);}
 },
 async refresh(){
  this.setData({busy:true});
  try{this.applyUser(await api<User>('/auth/me'));}catch(error){wx.removeStorageSync('session');this.setData({pending:false});toast(error);}finally{this.setData({busy:false});}
 },
 async logout(){try{await api('/auth/logout','POST');}catch{}wx.removeStorageSync('session');getApp<AppState>().globalData.user=null;this.setData({pending:false,name:'',identity:''});}
});
