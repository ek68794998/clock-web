import { Component } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

import { StopwatchService } from "../../services/stopwatchService";

import * as moment from "moment";

@Component({
    moduleId: `${module.id}`,
    templateUrl: "stopwatchComponent.html",
    styleUrls: [ "stopwatchComponent.scss" ],
})
export class StopwatchComponent {
    private stopwatchMillis: number = 0;

    private stopwatchHours: number;

    private stopwatchMinutes: number;

    private stopwatchSeconds: number;

    private stopwatchMilliseconds: number;

    constructor(private stopwatchService: StopwatchService, private translate: TranslateService) {
        this.updateStopwatch(this.stopwatchMillis = this.stopwatchService.getElapsedMillis());

        stopwatchService
            .onTick()
            .subscribe(millis => this.updateStopwatch(millis));
    }

    private updateStopwatch(millis: number): void {
        this.stopwatchMillis = millis;

        let duration = moment.duration(millis);

        let hours: number = duration.asHours();
        this.stopwatchHours =
            (hours > 0)
                ? Math.floor(duration.asHours())
                : 0;

        let minutes = duration.asMinutes();
        this.stopwatchMinutes =
            (hours > 0 || minutes > 0)
                ? duration.minutes()
                : 0;

        this.stopwatchSeconds = duration.seconds();
        this.stopwatchMilliseconds = duration.milliseconds();
    }
}
