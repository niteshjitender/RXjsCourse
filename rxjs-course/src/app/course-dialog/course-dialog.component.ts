import {AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import {Course} from "../model/course";
import {FormBuilder, Validators, FormGroup} from "@angular/forms";
import * as moment from 'moment';
import {concat, fromEvent} from 'rxjs';
import {concatMap, distinctUntilChanged, exhaustMap, filter, mergeMap} from 'rxjs/operators';
import {fromPromise} from 'rxjs/internal-compatibility';

@Component({
    selector: 'course-dialog',
    templateUrl: './course-dialog.component.html',
    styleUrls: ['./course-dialog.component.css']
})
export class CourseDialogComponent implements OnInit, AfterViewInit {

    form: FormGroup;
    course:Course;

    @ViewChild('saveButton', { static: true }) saveButton: ElementRef;

    @ViewChild('searchInput', { static: true }) searchInput : ElementRef;

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<CourseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) course:Course ) {

        this.course = course;

        this.form = fb.group({
            description: [course.description, Validators.required],
            category: [course.category, Validators.required],
            releasedAt: [moment(), Validators.required],
            longDescription: [course.longDescription,Validators.required]
        });

    }

    ngOnInit() {

        /*
        //Form Draft Pre-Save Example and the RxJs Filter Operator
        // this.form.valueChanges.subscribe(console.log) ;

        this.form.valueChanges
            .pipe(
                filter(() => this.form.valid)
            )
            .subscribe(changes => {
                //Converting this promise to observable by calling function fromPromise

                const saveCourse$= fromPromise(fetch(`/api/courses/${this.course.id}`,{
                        method: 'PUT',
                        body: JSON.stringify(changes),
                        headers: {
                            'content-type': 'application/json'
                        }
                    })
                    // .then() ;
                );
                saveCourse$.subscribe() ;
                //The above method is susbcribe in subscribe that is not good and one more thing is that
                //multiple call are sent to backend at same time, means multiple update simuntaneously that 
                //is wrong changes in db
            });
            */


            /*
            //The RxJs concatMap Operator - In Depth Explanation and Practical Example
            this.form.valueChanges
                .pipe(
                    filter(() => this.form.valid),
                    concatMap(changes => this.saveCourse(changes))
                )
                .subscribe(
                //     changes => {
                //     const saveCourse$ = this.saveCourse(changes) ;
                //     saveCourse$.subscribe() ;
                // }
                )
            */
            
            
            //The RxJs mergeMap Operator - In Depth Explanation
            //It is performing http request in parallel
            //If order is important then use concatMap else mergeMap
            this.form.valueChanges
            .pipe(
                filter(() => this.form.valid),
                mergeMap(changes => this.saveCourse(changes))
            )
            .subscribe()

    }

    saveCourse(changes){
        return fromPromise(fetch(`/api/courses/${this.course.id}`,{
            method: 'PUT',
            body: JSON.stringify(changes),
            headers: {
                'content-type': 'application/json'
            }
        }));
    }

    ngAfterViewInit() {

        //The RxJs exhaustMap Operator - In Depth Explanation
        //Here we want to prevent multiple request of save button if user clicks it multiple times
        //We can ignore these repeated click by using exhaustMap operator
        fromEvent(this.saveButton.nativeElement, 'click')
            .pipe(
                // multiple repeated requests
                // concatMap(() => this.saveCourse(this.form.value))
                exhaustMap(() => this.saveCourse(this.form.value))
            )
            .subscribe() ;
    }



    close() {
        this.dialogRef.close();
    }

}
