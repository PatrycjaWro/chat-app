import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';
import { ChatMessage } from '../model/chat-message.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  user: firebase.User;
  chatMessages: AngularFirestoreCollection<ChatMessage>;
  chatMessages$: Observable<ChatMessage[]>;

  chatMessage: ChatMessage;
  userName$: Observable<string>;
  userName: string;

  constructor(private db: AngularFirestore, private afAuth: AngularFireAuth) {
    // this.afAuth.authState.subscribe(auth => {
    //   if (auth !== undefined && auth !== null) {
    //     this.user = auth;
    //   }
    //   // this.getUser().subscribe(a => {
    //   //   this.userName = a.displayName;
    //   // });
    // });
  }

  // getUser() {
  //   const userId = this.user.uid;
  //   const path = `/users/${userId}`;
  //   return this.db.object(path);
  // }

  // getUsers() {
  //   const path = '/users';
  //   return this.db.list(path);
  // }

  sendMessage(msg: string) {
    const timestamp = this.getTimeStamp();
    // const email = this.user.email;
    const email = 'email@example.pl'; // todo
    this.userName = 'test dawid';

    this.chatMessages$ = this.getMessages();
    this.chatMessages.add({
      message: msg,
      timeSent: new Date(timestamp),
      userName: this.userName,
      email
    });

    console.log('sendMessage called');
  }

  getMessages(): Observable<ChatMessage[]> {
    // query to create our message feed binding
    this.chatMessages = this.db.collection<ChatMessage>('messages', ref => ref.orderBy('timeSent').limit(25));
    this.chatMessages$ = this.chatMessages.valueChanges();
    return this.chatMessages$;

    // return this.db.list('messages', {
    //   query: {
    //     limitToLast: 25,
    //     orderByKey: true
    //   }
    // });
  }

  getTimeStamp() {
    const now = new Date();
    const date = now.getUTCFullYear() + '/' + (now.getUTCMonth() + 1) + '/' + now.getUTCDate();
    const time = now.getUTCHours() + ':' + now.getUTCMinutes() + ':' + now.getUTCSeconds();

    return date + ' ' + time;
  }
}
