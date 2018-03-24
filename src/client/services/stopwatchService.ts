import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Subscriber } from "rxjs/Subscriber";

import * as moment from "moment";

@Injectable()
export class StopwatchService {
    private startDate: Date = null;

    private priorTimedMillis: number = 0;

    private stopwatchInterval: any = null;

    private onTickSubscribers: Subscriber<number>[] = [];

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

                this.onTickSubscribers.forEach(s => s.next(stopwatchMillis));
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

    public onTick(): Observable<number> {
        return new Observable(observer => {
            this.onTickSubscribers.push(observer);

            return {
                unsubscribe() {
                    let observerIndex: number = this.onTickSubscribers.indexOf(observer);

                    if (observerIndex === -1) {
                        console.error("Observer attempted to unsubscribe but was not found in subscriptions");
                        return;
                    }

                    this.onTickSubscribers.splice(observerIndex, 1);
                },
            };
        });
    }
}