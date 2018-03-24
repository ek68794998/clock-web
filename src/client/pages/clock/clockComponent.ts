import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

import * as moment from "moment-timezone";

@Component({
    moduleId: `${module.id}`,
    templateUrl: "clockComponent.html",
    styleUrls: [ "clockComponent.scss" ],
})
export class ClockComponent implements OnInit {
    private static readonly bufferMillis: number = 3;

    private static readonly millisInSecond: number = 1000;

    private currentTime: Date;

    private currentTimeZone: string;

    private worldClocks: { [key: string]: moment.Moment } = {};

    private get timeZones(): string[] {
        return Object.keys(this.worldClocks);
    }

    constructor() {
        // TODO Load real gov't time from: https://www.time.gov/actualtime.cgi?disablecache=1521781911578&__lzbc__=tsemd5
    }

    ngOnInit(): void {
        this.currentTime = new Date();
        this.currentTimeZone = moment.tz.guess();

        let now = moment.tz(this.currentTime, this.currentTimeZone);

        [ "Etc/UTC", "Asia/Tokyo", "America/Sao_Paulo" ].forEach(timeZoneName => {
            this.worldClocks[timeZoneName] = moment(now.tz(timeZoneName));
        });

        this.startUpdateLoop();
    }

    private startUpdateLoop(): void {
        let millisUntilSecond: number = ClockComponent.millisInSecond - new Date().getMilliseconds();
        setTimeout(() => { this.updateTicks(); this.startUpdateLoop(); }, millisUntilSecond + ClockComponent.bufferMillis);
    }

    private updateTicks(): void {
        let now: Date = new Date();
        let diff: number = now.getTime() - this.currentTime.getTime();

        this.currentTime = now;
        Object.keys(this.worldClocks).forEach(key => {
            let m: moment.Moment = this.worldClocks[key];
            this.worldClocks[key] = m.add(diff, "ms");
        });
    }
}
