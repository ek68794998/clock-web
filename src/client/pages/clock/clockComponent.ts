import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute } from "@angular/router";
import { MatTable } from "@angular/material";
import { TranslateService } from "@ngx-translate/core";

import * as moment from "moment-timezone";

enum ClockMode {
    currentTime,

    specifiedTime,
}

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
export class ClockComponent implements OnInit, OnDestroy {
    private static readonly bufferMillis: number = 3;

    private static readonly millisInSecond: number = 1000;

    protected readonly worldClockColumns: string[] = [
        "displayName",
        "fullName",
        "offset",
        "time",
    ];

    protected readonly language: string;

    protected initialized: boolean = false;

    private currentTime: moment.Moment;

    private mode: ClockMode;

    private myTimeZone: string;

    private routeParamsSub: any;

    private worldClocks: WorldClockDataRow[] = [];

    private worldClocksDirty: boolean = false;

    @ViewChild("worldClocksTable")
    private worldClocksTable: MatTable<WorldClockDataRow[]>;

    private worldClockTimeZones: string[] = [ "Etc/UTC", "Asia/Tokyo", "America/Argentina/Buenos_Aires" ]; // TODO From cookies or default

    constructor(
        private route: ActivatedRoute,
        private httpClient: HttpClient,
        translate: TranslateService) {

        this.language = translate.currentLang;

        // TODO Load real gov't time from: https://www.time.gov/actualtime.cgi?disablecache=1521781911578&__lzbc__=tsemd5
    }

    ngOnInit(): void {
        this.routeParamsSub = this.route.params.subscribe(params => {
            this.mode = ClockMode.currentTime;
            this.myTimeZone = moment.tz.guess();
            this.currentTime = moment();

            if ("time" in params) {

                let parsedTimeZone: string = this.myTimeZone;
                if ("zone" in params) {
                    let timeZones: string[] = moment.tz.names();
                    let fuzzyMatchIndex: number = timeZones.findIndex(e => {
                        return params.zone == e.replace(/[\/\s]/g, "_");
                    });

                    if (fuzzyMatchIndex >= 0) {
                        parsedTimeZone = timeZones[fuzzyMatchIndex];
                    } else {
                        console.error("Invalid time zone:", params.zone, "-- defaulting to local time zone");
                    }
                }

                let time: string = params.time;
                if (time !== "now") {
                    // Parse using a custom default, then revert the default to the... default.
                    moment.tz.setDefault(parsedTimeZone);
                    let timeMoment: moment.Moment = moment(time, [ "YYYY-MM-DD[T]hh:mm:ss", "YYYY-MM-DD" ]);
                    moment.tz.setDefault(this.myTimeZone);

                    if (timeMoment.isValid()) {
                        this.currentTime = moment(timeMoment).tz(this.myTimeZone);
                        this.mode = ClockMode.specifiedTime;
                    } else {
                        console.error("Invalid time:", time, "-- defaulting to current time");
                    }
                }
            }

            this.rebuildWorldClocks();

            if (this.mode == ClockMode.currentTime) {
                this.startUpdateLoop();
            }

            this.initialized = true;
        });
    }

    ngOnDestroy(): void {
        this.routeParamsSub.unsubscribe();
    }

    private rebuildWorldClocks(): void {
        this.worldClocks.length = 0;
        this.worldClockTimeZones.forEach(timeZoneName => {
            let time: moment.Moment = moment(this.currentTime).tz(timeZoneName);

            let shortName: string = timeZoneName;
            let shortNameStartIndex: number = timeZoneName.lastIndexOf("/");
            if (shortNameStartIndex) {
                shortName = timeZoneName.substr(shortNameStartIndex + 1);
            }

            shortName = shortName.replace(/_/g, " ");

            let longName: string = timeZoneName;
            let abbr: string = time.locale(this.language).format("z");
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
        let now: moment.Moment = moment();
        let diff: number = now.diff(this.currentTime);

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
