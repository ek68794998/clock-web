import { Component } from "@angular/core";

import { StopwatchService } from "../../services/stopwatchService";

@Component({
    moduleId: `${module.id}`,
    templateUrl: "stopwatchComponent.html",
    styleUrls: [ "stopwatchComponent.scss" ],
})
export class StopwatchComponent {
    private stopwatchMillis: number = 0;

    constructor(private stopwatchService: StopwatchService) {
        stopwatchService
            .onTick()
            .subscribe(millis => this.stopwatchMillis = millis);
    }
}
