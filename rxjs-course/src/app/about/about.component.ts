import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { response } from 'express';
import { concat, fromEvent, interval, merge, noop, Observable, of, timer } from 'rxjs';
import { map } from 'rxjs/operators';
import { createHttpObservable } from '../common/util';

@Component({
  selector: 'about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor() { }

  ngOnInit() {

    /*
    //What is the stream?
    // Notions of streams of value, in javascript is almost all things
    // synchronous(request, timout in frontend, user interaction click, mousover events)

    //Streams of value (Multivalue streams, they will never be complete)
    document.addEventListener('click', evt => {
      console.log(evt) ;
    })

    //eg 2 stream of values (Multivalue streams, they will never be complete)
    let counter = 0 ;
    setInterval(() => {
      console.log(counter);
      counter ++ ;
    },1000) ;

    //eg 3 of streams (Can be complete)
    setTimeout(()=>{
      console.log("finished...") ;
    },3000) ;
    */

  /*
    //Rxjs library, what is it & why we use it?
    // Let's combine the streams called callback hell
    // here we are combining streams uisng multiple callbacks for better way we use Rxjs library
    // RxJs = Reactive extensions for javascript (combining streams maintainable way, scalable, readabale)


    document.addEventListener('click', evt => {
      console.log(evt) ;

      setTimeout(() => {
        console.log("finished...") ;

        let counter = 0 ;
        setInterval(() => {
          console.log(counter) ;
          counter ++ ;
        },1000) ;
      },3000) ;
    })
    */

    //Notion of Rxjs observables RxJs
    //$ at the end means it is variable of Rxjs observables
    //Observable<number> means it is emitting the number
    /*
    const interval$ = interval(1000) ; // definition of stream of values (acting as blueprint)

    // An observable only become streama when we subscribe to it
    interval$.subscribe(val => console.log("stream 1 " + val)) ;

    //creating new stream, both streams are independent
    interval$.subscribe(val => console.log("stream 2 " + val)) ;

    */
    
    /*
    //Here interval is definition of streams = observables
    const interval$ = timer(3000, 1000) ;
    // An observable only become stream when we subscribe to it
    interval$.subscribe(val => console.log("stream 1 " + val)) ;


    //Here click is definition of streams = observables
    const click$ = fromEvent(document, 'click') ;
    //Streams of mouse event
    click$.subscribe(evt => {
      console.log(evt) ;
    }) ;
    */


    /*
    //An observable is a blueprint of streams
    const click$ = fromEvent(document, 'click') ;
    //Streams of mouse event
    //parameters of susbcribe method
    click$.subscribe(
      evt => console.log(evt), // value
      err => console.log(err),  // When error occurs -> errorHandling Logic
      () => console.log("completed") // When stream is completed
      );
    
    //completion & error are exclusive means either error or completed
    //some time streams never complete and no error like interval$ observable
    //Observable is a notion of completion or cancellation

    //Unsubscribe from observable after some time
    const interval$ = timer(3000, 1000) ;
    const sub = interval$.subscribe(val => console.log("stream 1 " + val)) ;
    setTimeout(() => sub.unsubscribe(),5000) ;

    */


    /*
    //http call
    // fetch('/api/courses') ;
    //Promise is immediately executed once we define it & 
    // an observable not trigger any request at definition it only trigger when susbcribed
    
    //Turning above http call to backend to RxJs stream
    //Converting the above to observable, we should maintain the observable contract
    const http$ = Observable.create(observer => {
      
      // //Internal implementation of observerable
      // observer.next() // emit new value
      // observer.error() // emit error
      // observer.complete() // emit complete
      

      fetch('/api/courses')
        .then((response) => {
          return response.json() ; // sending json body from response object
        })
        .then(body => { //Receiving json body from response object
          observer.next(body) ;
          observer.complete() ;
        })
        .catch((err) => { // Incase of error, calling catch in promise chain
          observer.error(err) ;
        })
    }) ;

    http$.subscribe(
      courses => console.log(courses),
      // () => {}, //error handler, to make it more readable we can use 'noop'
      noop,
      () => console.log('completed')
    )

    //The only advantage of converting promise based fetch call that is already fetching the data from backend is that
    // is that by converting that to observable so we can use RxJs operators with it
    */
    
    /*
    //RxJs map operator
    const http$ = createHttpObservable('/api/courses') ;

    //Whenever we need to derive new observable from current observable
    //we nee to use RxJs operators.
    //The pipe function allows us to chain multiple operators in order
    //to produce new observable

    const courses$ = http$
      .pipe(
        map(res => Object.values(res["payload"]))
      );

    courses$.subscribe(
      courses => console.log(courses),
      noop,
      () => console.log('Completed')
    );
    */


    /*
    //Observable concatenation
    const source1$ = of(1,2,3) ; // Of function is used to define different kinds of observable
    const source2$ = of(4,5,6) ;
    //sequential concatenation first source1 observable emits values & then source2 observable emits values
    const source3$ = of(7,8,9) ; 
    
    const result$ = concat(source1$, source2$, source3$) ;

    // result$.subscribe(
    //   val => console.log(val)) ;

    //alternative of above subscription and output statement
    // result$.subscribe(console.log) ;

    //if any observable never ends then value of other observable never emitted
    const sourcetry$ = interval(1000) ;
    const result2$ = concat(sourcetry$, source2$) ;
    result2$.subscribe(console.log)
    */

    /*
    //merge observables
    const interval1$ = interval(1000) ;
    const interval2$ = interval1$.pipe(map(val => 10*val)) ;
    const result$ = merge(interval1$, interval2$) ;
    result$.subscribe(console.log) ;
    */
    

    //Unsubsubscription of HTTP Observables
    //let we want to unsubscribe below observable after 5 sec ;
    // const interval1$ = interval(1000) ;
    //sub is the subscription object
    // const sub = interval1$.subscribe(console.log) ;
    // setTimeout(() =>sub.unsubscribe(),5000) ;
    //lets add logic to make createHttpObservable cancelable in utils.ts

    const http$ = createHttpObservable('/api/courses/') ;
    const sub = http$.subscribe(console.log) ;

    setTimeout(() =>sub.unsubscribe(),0) ;
  }

}
