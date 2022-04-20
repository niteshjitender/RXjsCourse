import {Component, OnInit} from '@angular/core';
import {Course} from "../model/course";
import {interval, noop, Observable, of, throwError, timer} from 'rxjs';
import {catchError, delayWhen, map, retryWhen, shareReplay, tap, filter, finalize} from 'rxjs/operators';
import { createHttpObservable } from '../common/util';


@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    /*
    //Imperative design
    beginnerCourses: Course[] ;
    advancedCourses: Course[] ;
    */

    //Reactive Design
    beginnerCourses$: Observable<Course[]> ;
    advancedCourses$: Observable<Course[]> ;


    constructor() {

    }

    ngOnInit() {
        /*
        const http$ = createHttpObservable('/api/courses') ;

        const courses$ = http$
            .pipe(
                map(res => Object.values(res["payload"]))
            );

        //filter operation not of RxJs
        //This is the imperative design practice
        courses$.subscribe(
            courses => {
                
                this.beginnerCourses = courses
                    .filter(course => course.category === 'BEGINNER') ;
                
                this.advancedCourses = courses
                    .filter(course => course.category === 'ADVANCED') ;
            },
            noop,
            () => console.log('Completed')
        );

        //We should avoid to add lots of logic in subscribe because it is resulting
        //in the same callback hell
        */


        //Reactive design designconst http$ = createHttpObservable('/api/courses') ;

        const http$ = createHttpObservable('/api/courses') ;
        const courses$:Observable<Course[]> = http$
            .pipe(
                /*
                tap(() => console.log('HTTP request executed')),
                map(res => Object.values(res["payload"])),
                shareReplay(), //prevents from multiple requests
                catchError(err => 
                    // //recover from error
                    // of([
                    //     // We put some offline available data here to show that
                    //     {
                    //         id: 0,
                    //         description: "RxJs In Practice Course",
                    //         iconUrl: 'https://s3-us-west-1.amazonaws.com/angular-university/course-images/rxjs-in-practice-course.png',
                    //         courseListIcon: 'https://angular-academy.s3.amazonaws.com/main-logo/main-page-logo-small-hat.png',
                    //         longDescription: "Understand the RxJs Observable pattern, learn the RxJs Operators via practical examples",
                    //         category: 'BEGINNER',
                    //         lessonsCount: 10
                    //     }
                    // ])
                    
                    // handling error localy
                    {
                        console.log("Error occured", err) ;
                        //catcth error must be return an recovery obsevable
                        return throwError(err) ; //RxJs operator
                    }
                    ),
                    // Cleanup operations : this will be to close network connections & release memory or some these kind of operations
                    // This function execute when above the above observable completes or errors out
                    finalize(() => {
                        console.log('Finalize executed') ;
                    })

                    */


                    //if we want catch and finalize only executed once per http request then the order is as follows:  
                    catchError(err =>{
                        console.log("Error occured", err) ;
                        return throwError(err) ; //RxJs operator
                    }),
                    finalize(() => {
                        console.log('Finalize executed') ;
                    }),
                    tap(() => console.log('HTTP request executed')),
                    map(res => Object.values(res["payload"])),
                    shareReplay()            
            );

        this.beginnerCourses$ = courses$.
            pipe(
                // map((courses:Course[]) => courses
                //     .filter(course => course.category === 'BEGINNER'))
                map(courses => courses
                .filter(course => course.category === 'BEGINNER'))
            );

        this.advancedCourses$ = courses$.
            pipe(
                map((courses:Course[]) => courses
                    .filter((course:Course) => course.category === 'ADVANCED'))
            );

        //Now the main problem above is that we are making taking http requests
        // at the backend, swe use shareReplay to overcome this, above it added
        // tap operator is used to produce sideeffects in our observable chain

        //if subscribe one more time, still our request is one
        courses$.subscribe() ;
    }

}
