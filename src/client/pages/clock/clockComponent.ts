import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

import * as moment from "moment";

@Component({
    moduleId: `${module.id}`,
    templateUrl: "clockComponent.html",
    styleUrls: [ "clockComponent.scss" ],
})
export class ClockComponent implements OnInit {
    private static readonly millisInSecond: number = 1000;

    private currentTime: Date = new Date();

    constructor() {
        // TODO Load real gov't time from: https://www.time.gov/actualtime.cgi?disablecache=1521781911578&__lzbc__=tsemd5
    }

    ngOnInit(): void {
        this.startUpdateLoop();
    }

    private startUpdateLoop(): void {
        let millisUntilSecond: number = ClockComponent.millisInSecond - new Date().getMilliseconds();
        setTimeout(() => { this.updateTicks(); this.startUpdateLoop(); }, millisUntilSecond);
    }

    private updateTicks(): void {
        this.currentTime = new Date();
        console.log("Tick millis:", new Date().getMilliseconds());
    }
}
