import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Subscriber } from "rxjs/Subscriber";

import * as moment from "moment";

@Injectable()
export class StopwatchService {
    private lapMillis: number[] = [];

    private onTickSubscribers: Subscriber<number>[] = [];

    private priorTimedMillis: number = 0;

    private startDate: Date = null;

    private stopwatchInterval: any = null;

    constructor() {
    }

    public get isRunning(): boolean {
        return !!this.stopwatchInterval;
    }

    public get laps(): number[] {
        return this.lapMillis.slice(0);
    }

    public getElapsedMillis(): number {
        if (!this.startDate) {
            return 0;
        }

        let startTime = moment(this.startDate);
        let now = moment();

        return this.priorTimedMillis + now.diff(startTime);
    }

    public lap(): void {
        let currentLapMillis: number = this.getElapsedMillis();
        this.lapMillis.forEach(millis => currentLapMillis -= millis);

        this.lapMillis.push(currentLapMillis);
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

    public reset(): void {
        this.stop();
        this.startDate = null;
        this.priorTimedMillis = 0;
        this.lapMillis = [];

        this.onTickSubscribers.forEach(s => s.next(0));
    }

    public start(): void {
        if (this.stopwatchInterval) {
            return;
        }

        this.startDate = new Date();

        this.stopwatchInterval =
            setInterval(
                () => this.onTickSubscribers.forEach(s => s.next(this.getElapsedMillis())),
                1);
    }

    public stop(): void {
        if (this.stopwatchInterval) {
            clearInterval(this.stopwatchInterval);
            this.stopwatchInterval = null;

            let startTime = moment(this.startDate);
            let now = moment();

            this.priorTimedMillis += now.diff(startTime);
            this.startDate = null;
        }
    }
}