
import { Component } from '@angular/core';
import { NavController, ToastController , NavParams} from 'ionic-angular';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';


@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})

export class ChatPage {

  socket:any
  chat_input:string;
  chats = [];
  messages = [];
  nickname = '';
  message = '';

  constructor(public navCtrl: NavController, public toastCtrl:ToastController, public navParams: NavParams) {
    console.log(this.navParams);
    this.nickname= this.navParams.data.username;

    this.socket = io('http://localhost:3000');
    this.socket.on('message', (msg) => {
      console.log("message", msg);
      this.chats.push(msg);
    });


    this.getMessages().subscribe(message => {
      this.messages.push(message);
    });

  }
  ionViewWillLeave() {
    // this.socket.disconnect();
  }
  send(msg) {
    if(msg !=''){
      let user = this.navParams.data.username;
      this.socket.emit('message', user+': '+ msg);
    }
    this.chat_input ='';
  }
  getMessages() {
    let observable =new Observable(observer => {
      this.socket.on('message', (data) => {
        observer.next(data);
      });
    })
    return observable;
  }
}
