import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Subscriber } from "rxjs/Subscriber";

import * as moment from "moment";

@Injectable()
export class StopwatchService {
    private startDate: Date = null;

    private priorTimedMillis: number = 0;

    private stopwatchInterval: any = null;

    private onStopwatchTickSubscribers: Subscriber<number>[] = [];

    constructor() {
    }

    public startStopwatch(): void {
        if (this.stopwatchInterval) {
            return;
        }

        this.startDate = new Date();

        this.stopwatchInterval =
            setInterval(() => {
                let startTime = moment(this.startDate);
                let now = moment();

                let stopwatchMillis: number = this.priorTimedMillis + now.diff(startTime);

                this.onStopwatchTickSubscribers.forEach(s => s.next(stopwatchMillis));
            },
            1);
    }

    public stopStopwatch(): void {
        if (this.stopwatchInterval) {
            clearInterval(this.stopwatchInterval);
            this.stopwatchInterval = null;

            let startTime = moment(this.startDate);
            let now = moment();

            this.priorTimedMillis += now.diff(startTime);
            this.startDate = null;
        }
    }

    public onStopwatchTick(): Observable<number> {
        return new Observable(observer => {
            this.onStopwatchTickSubscribers.push(observer);

            return {
                unsubscribe() {
                    let observerIndex: number = this.onStopwatchTickSubscribers.indexOf(observer);

                    if (observerIndex === -1) {
                        console.error("Observer attempted to unsubscribe but was not found in subscriptions");
                        return;
                    }

                    this.onStopwatchTickSubscribers.splice(observerIndex, 1);
                },
            };
        });
    }
}