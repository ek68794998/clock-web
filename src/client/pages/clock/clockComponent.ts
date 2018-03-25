import { Component, OnInit, ViewChild } from "@angular/core";
import { MatTable } from "@angular/material";
import { TranslateService } from "@ngx-translate/core";

import * as moment from "moment-timezone";

class WorldClockDataRow {
    public displayName: string;

    public shortName: string;

    public time: moment.Moment;
}

@Component({
    moduleId: `${module.id}`,
    templateUrl: "clockComponent.html",
    styleUrls: [ "clockComponent.scss" ],
})
export class ClockComponent implements OnInit {
    private static readonly bufferMillis: number = 3;

    private static readonly millisInSecond: number = 1000;

    private readonly worldClockColumns: string[] = [
        "displayName",
        "fullName",
        "offset",
        "time",
    ];

    private currentTime: Date;

    private currentTimeZone: string;

    private worldClocks: WorldClockDataRow[] = [];

    private worldClocksDirty: boolean = false;

    @ViewChild("worldClocksTable")
    private worldClocksTable: MatTable<WorldClockDataRow[]>;

    private worldClockTimeZones: string[] = [ "Etc/UTC", "Asia/Tokyo", "America/Argentina/Buenos_Aires" ]; // TODO From cookies or default

    constructor() {
        // TODO Load real gov't time from: https://www.time.gov/actualtime.cgi?disablecache=1521781911578&__lzbc__=tsemd5
    }

    ngOnInit(): void {
        this.currentTime = new Date();
        this.currentTimeZone = moment.tz.guess();

        let now = moment.tz(this.currentTime, this.currentTimeZone);

        this.rebuildWorldClocks();
        this.startUpdateLoop();
    }

    private rebuildWorldClocks(): void {
        let now = moment.tz(this.currentTime, this.currentTimeZone);

        this.worldClocks.length = 0;
        this.worldClockTimeZones.forEach(timeZoneName => {
            let time: moment.Moment = moment(now.tz(timeZoneName));

            let shortName: string = timeZoneName;
            let shortNameStartIndex: number = timeZoneName.lastIndexOf("/");
            if (shortNameStartIndex) {
                shortName = timeZoneName.substr(shortNameStartIndex + 1);
            }

            shortName = shortName.replace(/_/g, " ");

            let longName: string = timeZoneName;
            let abbr: string = time.format("z");
            if (abbr != shortName && abbr != longName && !abbr.match(/^[+-]?[0-9]+/)) {
                longName += ` (${abbr})`;
            }

            this.worldClocks.push({
                displayName: longName,
                shortName: shortName,
                time: time,
            });
        });
    }

    private startUpdateLoop(): void {
        let millisUntilSecond: number = ClockComponent.millisInSecond - new Date().getMilliseconds();
        setTimeout(() => { this.updateTicks(); this.startUpdateLoop(); }, millisUntilSecond + ClockComponent.bufferMillis);
    }

    private updateTicks(): void {
        let now: Date = new Date();
        let diff: number = now.getTime() - this.currentTime.getTime();

        if (this.worldClocksDirty) {
            this.worldClocksDirty = false;
            this.rebuildWorldClocks();
        }

        this.currentTime = now;
        this.worldClocks.forEach(dataRow => {
            dataRow.time = dataRow.time.add(diff, "ms");
        });
    }
}
