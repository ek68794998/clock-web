import { Component } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

import { StopwatchService } from "../../services/stopwatchService";

import * as moment from "moment";

class StopwatchTime {
    hours: number = 0;

    minutes: number = 0;

    seconds: number = 0;

    milliseconds: number = 0;
}

@Component({
    moduleId: `${module.id}`,
    templateUrl: "stopwatchComponent.html",
    styleUrls: [ "stopwatchComponent.scss" ],
})
export class StopwatchComponent {
    private stopwatchMillis: number = 0;

    private stopwatchTime: StopwatchTime;

    private stopwatchHours: number;

    private stopwatchMinutes: number;

    private stopwatchSeconds: number;

    private stopwatchMilliseconds: number;

    private stopwatchLaps: StopwatchTime[] = [];

    constructor(private stopwatchService: StopwatchService, private translate: TranslateService) {
        this.updateStopwatch(this.stopwatchMillis = this.stopwatchService.getElapsedMillis());

        stopwatchService
            .onTick()
            .subscribe(millis => this.updateStopwatch(millis));
    }

    private static getStopwatchTime(millis: number): StopwatchTime {
        let duration = moment.duration(millis);

        let hours: number = duration.asHours();
        let minutes: number = duration.asMinutes();

        return {
            hours: Math.floor(hours),
            minutes: (hours > 0 || minutes > 0) ? duration.minutes() : 0,
            seconds: duration.seconds(),
            milliseconds: duration.milliseconds(),
        };
    }

    private lapStopwatch(): void {
        this.stopwatchService.lap();

        let lapValues: StopwatchTime[] = [];
        this.stopwatchService.laps.forEach(lapMillis => {
            let lap = StopwatchComponent.getStopwatchTime(lapMillis);
            lapValues.push(lap);

            console.log(lapMillis, lap);
        });

        this.stopwatchLaps = lapValues;
    }

    private resetStopwatch(): void {
        this.stopwatchService.reset();
        this.stopwatchLaps = [];
        this.stopwatchTime = new StopwatchTime();
    }

    private startStopwatch(): void {
        this.stopwatchService.start();
    }

    private stopStopwatch(): void {
        this.stopwatchService.stop();
    }

    private updateStopwatch(millis: number): void {
        this.stopwatchMillis = millis;
        this.stopwatchTime = StopwatchComponent.getStopwatchTime(millis);
    }
}
