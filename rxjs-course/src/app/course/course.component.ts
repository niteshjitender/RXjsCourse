import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Course} from "../model/course";
import {
    debounceTime,
    distinctUntilChanged,
    startWith,
    tap,
    delay,
    map,
    concatMap,
    switchMap,
    withLatestFrom,
    concatAll, shareReplay
} from 'rxjs/operators';
import {merge, fromEvent, Observable, concat} from 'rxjs';
import {Lesson} from '../model/lesson';
import { createHttpObservable } from '../common/util';


@Component({
    selector: 'course',
    templateUrl: './course.component.html',
    styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit, AfterViewInit {


    courseId: string ;
    course$: Observable<Course>;
    lessons$: Observable<Lesson[]>;


    @ViewChild('searchInput', { static: true }) input: ElementRef;

    constructor(private route: ActivatedRoute) {


    }

    ngOnInit() {

        // const courseId = this.route.snapshot.params['id'];
        this.courseId = this.route.snapshot.params['id'];

        // this.course$ = createHttpObservable(`/api/courses/${courseId}`) ;
        this.course$ = createHttpObservable(`/api/courses/${this.courseId}`) ;
        
        // this.lessons$ = createHttpObservable(`/api/lessons?courseId=${courseId}&pageSize=100`) 
        //     .pipe(
        //         map(res => res["payload"])
        //     );

        // this.lessons$ = this.loadLessons() ;
        

    }

    ngAfterViewInit() {
        //For search operations
        const searchLessons$ = fromEvent<any>(this.input.nativeElement, 'keyup')
            .pipe(
                map(event => event.target.value),
                //here when key is up it will send request to backend,
                //to overcome this we use debounceTime
                debounceTime(400),
                //removing duplicacy
                distinctUntilChanged(),
                //Here although we are using debounceTime and distinctUntilChanged, still we are making unwanted requests
                //In case of concatMap the requests are made one after
                //What we want is if the user type new search request then current search request mus immediately cancelled 
                // and new search request must be sent to backend
                // concatMap(search => this.loadLessons(search))
                switchMap(search => this.loadLessons(search))

            );
            // .subscribe(console.log) ;

            const intialLessons$ = this.loadLessons() ;
            this.lessons$ = concat(intialLessons$, searchLessons$);
    }

    loadLessons(search = ''):Observable<Lesson[]> {
        return createHttpObservable(`/api/lessons?courseId=${this.courseId}&pageSize=100&filter=${search}`) 
        .pipe(
            map(res => res["payload"])
        );
    }




}
