import { Component, OnInit } from '@angular/core';
import { fromEvent, Observable, interval, BehaviorSubject, timer, combineLatest, of, concat } from 'rxjs';
import { throttle, tap, map, scan, mapTo, bufferTime, last, filter, switchMap, distinctUntilChanged, throttleTime, shareReplay, combineAll, take, concatAll, concatMap, delay, expand, debounceTime, distinct } from 'rxjs/operators';


// const clicks = fromEvent(document, 'click');
// const ones = clicks.pipe(mapTo(1));
// const seed = 0;
// const count = ones.pipe(scan((acc, one) => acc + one, seed));
// count.subscribe(x => console.log(x));




@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {

  ngOnInit() {
    //this.counterSubject = new BehaviorSubject<number>(this.counter);
    //this.counterSubject.next(this.counter);

  }

  firstTimer = timer(0, 1000).pipe(
    tap(x => console.log("first timer pumping out nums: ", x))
  );
  title = 'ClickCountStream';
  counter = 0;
  // counterSubject : BehaviorSubject<number>;
  counterSubject: BehaviorSubject<number> = new BehaviorSubject<number>(this.counter);
  counterDataStream$ = this.counterSubject.asObservable().pipe(
    tap(x => console.log("Diong counter data stream: ", x))
  );

  clicks$ = fromEvent(document, 'click');

mouseEventClientX = this.clicks$.pipe(map(
  (ev : MouseEvent)=> ev.clientX)
);


lastClientXInTwoSeconds = this.mouseEventClientX.pipe(
  throttleTime(2000)
);


lastClientXIntervalTwoSeconds = this.mouseEventClientX.pipe(
  map(x=> interval(2000))
);


combinedClientXAndTimer = combineLatest(this.firstTimer, this.mouseEventClientX).pipe(
  tap(x=> console.log("combined timer and client ", x))
)


//Only different mouse clicks
// distinctClick = this.clicks$.pipe(distinct(), tap(x=>console.log("got a new one", x)))
distinctClickScreenX = this.mouseEventClientX.pipe(
   distinct(), 
   tap(x => console.log("Distinct click tap out on client X val:", x))
   );

   //wait four seconds for the inner observable to complete then you can console out
clientXhighOrderIntervalMulti = this.mouseEventClientX.pipe(
  concatMap(clientX => interval(2000).pipe(take(2),tap(x=> console.log("got client X: " + clientX + " and interval " + x))))
);


clientXhighOrderIntervalSwitchMap = this.mouseEventClientX.pipe(
  switchMap(clientX => interval(2000).pipe(take(2),tap(x=> console.log("got client X: " + clientX + " and interval " + x))))
);

  debouncedClicks1000 = this.clicks$.pipe(
    debounceTime(1000),
    tap(x => console.log("Debounced click event:", x))
    );

debouncedClientX = this.mouseEventClientX.pipe(
  debounceTime(2000),
  
)

  higherOrder = this.clicks$.pipe(

    map(v =>

      interval(1000).pipe(
        take(10)
      ),

    ),
    tap(x => console.log("click event plus inner interval == highorder ", x)),
    shareReplay()
  );
  concatAllHighOrder = this.higherOrder.pipe(
    // combineAll(),
    concatAll(),
  ).pipe(
    tap(x => console.log("concatAll high order of click waiting for interval 1000: ", x))
  );


  switchMappedHighOrder = this.higherOrder.pipe(
    switchMap(value => value),
    tap(x => console.log("switch mapped higher order: ", x))
  );

  combineAllHigherOrder = this.higherOrder.pipe(
    combineAll()
  ).pipe(

    tap(x => console.log("Combine ALL on high order of click waiting for interval 1000", x))

  );


  combineClickAndTimerStream = combineLatest(this.firstTimer.pipe(take(10)), this.clicks$).pipe(
    tap(x => console.log("Combined Latest init component timer n click event", x))
  );

  toCounterDataStream = this.clicks$.pipe(map((ev, idex) => {
    console.log("doing event for index");
    console.log(ev);
    console.log(idex);
    console.log("this.counter: " + this.counter);
    this.counterSubject.next(this.counter++);
    return ev.timeStamp;
  }));

  ones$ = this.clicks$.pipe(mapTo(1));

  // , shareReplay()

  blah$ = this.ones$.pipe(scan((state, value) => state + value));


  concatMapTimerWithInnerClickCounterfromBlah = this.firstTimer.pipe(
    concatMap(x => this.blah$.pipe(
      tap(x => console.log("blah output : ", x))
    ))
  ).pipe(
    tap(x => console.log("concatMapTimerWithInnerClickCounterfromBlah : ", x))
  );

  concatMapClickCounterfromBlahWithInnerTimer = this.blah$.pipe(
    concatMap(x => this.firstTimer.pipe(
      tap(x => console.log("timer output : ", x))
    ))
  ).pipe(
    tap(x => console.log("concatMapClickCounterfromBlahWithInnerTimer : ", x))
  );



  powerOfTwo = this.ones$.pipe(
    expand(x => of(2 * x).pipe(delay(1000))
    )
    , take(10));

  buffered$ = this.blah$.pipe(
    bufferTime(2000),
    switchMap(x => x),


    //in that two seconds how many values were emitted
    // map(array => array.length)
    // filter((items) => items.length > 0),
    // scan(
    //   (acc, items) => {
    //   return [...acc, ...items];
    // }, [])
  );

  throttledClicks$ = this.blah$.pipe(
    // filter(Boolean),
    // distinctUntilChanged(),
    throttleTime(2000)

  );


  // this.blah$.pipe(
  //   bufferTime(2000),
  //   switchMap(numArray => { return numArray[numArray.length -1]})
  // );




  //lastBufferedValue$ 
  // this.buffered$.pipe(last(),
  // map(data => data[data.length-1]));




  //   last(num => num % 2 === 0),
  // tap(x=> console.log(x)));

  // .pipe(
  //   bufferTime(2000),
  //   tap(x=> console.log("buffer time" , x)),
  //   last (num => num % 2 === 0)
  // );
  // cnt$ = this.ones$.pipe(
  //   scan(
  //     (acc,one), acc +onemptied, 0)
  //   )

  // tap(val => console.log("BEFORE MAP: ", val)),
  // map(x => this.counter + 1),
  // tap(val => console.log(`AFTER MAP: ${val}`)),

  // );



  resultTHrottled$ = this.clicks$.pipe(
    throttle(ev => interval(1000)),
    tap(x => console.log(x)
    ));





  setCounter(newCount: number) {
    console.log("Set Counter: ", newCount);
    this.counterSubject.next(newCount);
  }
}
