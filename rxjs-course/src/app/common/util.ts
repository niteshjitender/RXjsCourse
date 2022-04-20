import { Observable } from "rxjs";

/*
export function createHttpObservable(url: string){
    return Observable.create(observer => {
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
    });
}
*/

//making this cancellable
export function createHttpObservable(url: string){
    return Observable.create(observer => {

    //This is the part of the fech API
    const controller = new AbortController() ;
    //If it emits a value of true then the request is cancelled by the browser
    const signal = controller.signal ;

    fetch(url, {signal})
        .then((response) => {
            // return response.json() ; // sending json body from response object
            //In case of other errors below is the logic for the handelling it
            if(response.ok){
                return response.json() ;
            }
            else{
                observer.error('Request failed with status code: ' + response.status) ;
            }
        })
        .then(body => { //Receiving json body from response object
            observer.next(body) ;
            observer.complete() ;
        })
        .catch((err) => { // Incase of error, calling catch in promise chain
            //These erros only trigger in case of fatal error means from which browser can not recover eg - DNS error, Network error
            observer.error(err) ;
        });

        //If want to cancel our request, we just have to do
        // controller.abort() ;
        //We want to call the abort only when it is unsubscribed, so below is the cancellation function
        return () => controller.abort() ;
    });

    
}

