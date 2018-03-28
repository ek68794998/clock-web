import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute } from "@angular/router";
import { MatTable } from "@angular/material";
import { TranslateService } from "@ngx-translate/core";
import { DragulaService } from "ng2-dragula";

import * as moment from "moment-timezone";

enum ClockMode {
    currentTime,

    specifiedTime,
}

class WorldClockDataRow {
    public displayName: string;

    public id: string;

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

    private static readonly worldClockBagName: string = "world-clock-drag";

    private readonly worldClockColumns: string[] = [
        "displayName",
        "fullName",
        "offset",
        "time",
    ];

    private currentTime: moment.Moment;

    private initialized: boolean = false;

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
        private dragulaService: DragulaService) {

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

        this.dragulaService.setOptions(ClockComponent.worldClockBagName, {
            moves: (el: HTMLElement, source: HTMLElement, handle: HTMLElement, sibling: HTMLElement) =>
                this.dragulaCanMove(ClockComponent.worldClockBagName, el, source, handle, sibling),
            accepts: (el: HTMLElement, target: HTMLElement, source: HTMLElement, sibling: HTMLElement) =>
                this.dragulaCanAccept(ClockComponent.worldClockBagName, el, target, source, sibling),
        });

        this.dragulaService.drop.subscribe(data => {
            let bag: string = data[0];
            let el: HTMLElement = data[1];
            let target: HTMLElement = data[2];
            let source: HTMLElement = data[3];
            let sibling: HTMLElement = data[4];

            this.dragulaOnDrop(bag, el, target, source, sibling);
        });
    }

    ngOnDestroy(): void {
        this.routeParamsSub.unsubscribe();
    }

    private dragulaCanAccept(bag: string, el: Element, target: Element, source: Element, sibling: Element): boolean {
        if (bag == ClockComponent.worldClockBagName) {
            // Only allow standard, non-header rows to be dragged onto
            return !sibling || sibling.tagName.toLowerCase() === "mat-row";
        }

        return true;
    }

    private dragulaCanMove(bag: string, el: Element, source: Element, handle: Element, sibling: Element): boolean {
        if (bag == ClockComponent.worldClockBagName) {
            // Only allow standard, non-header rows to be dragged
            return el && el.tagName.toLowerCase() === "mat-row";
        }

        return true;
    }

    private dragulaOnDrop(bag: string, el: Element, target: Element, source: Element, sibling: Element): void {
        let newTimeZoneList: string[] = [];

        let rows: HTMLCollection = source.children;
        for (let i = 0; i < rows.length; i++) {
            let row: Element = rows[i];
            if (!this.dragulaCanMove(bag, row, target, source, sibling)) {
                continue;
            }

            let timeZoneAttribute = row.attributes["time-zone"];
            if (!timeZoneAttribute || !timeZoneAttribute.value) {
                continue;
            }

            newTimeZoneList.push(timeZoneAttribute.value);
        }

        this.worldClockTimeZones = newTimeZoneList;
        this.rebuildWorldClocks();
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
            let abbr: string = time.format("z");
            if (abbr != shortName && abbr != longName && !abbr.match(/^[+-]?[0-9]+/)) {
                longName += ` (${abbr})`;
            }

            this.worldClocks.push({
                id: timeZoneName,
                displayName: longName,
                shortName: shortName,
                time: time,
            });
        });

        console.log("Re-rendering rows?", this.initialized);
        if (this.initialized) {
            this.worldClocksTable.renderRows();
        }
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
