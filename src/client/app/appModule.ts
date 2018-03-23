import { NgModule }                         from "@angular/core";
import { BrowserModule }                    from "@angular/platform-browser";
import { BrowserAnimationsModule }          from "@angular/platform-browser/animations";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule, Routes }             from "@angular/router";
import { HttpClient, HttpClientModule }     from "@angular/common/http";
import { NgbModule }                        from "@ng-bootstrap/ng-bootstrap";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader }              from "@ngx-translate/http-loader";

import {
    APP_BASE_HREF,
    PlatformLocation,
    DecimalPipe,
} from "@angular/common";

import {
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    MatToolbarModule,
} from "@angular/material";

import { AppComponent } from "./appComponent";
import { ClockComponent } from "../pages/clock/clockComponent";
import { SettingsComponent } from "../pages/settings/settingsComponent";
import { StopwatchComponent } from "../pages/stopwatch/stopwatchComponent";
import { TimerComponent } from "../pages/timer/timerComponent";
import { TimeZonesComponent } from "../pages/timezones/timeZonesComponent";

const isDebug: boolean = (process.env.NODE_ENV === "dev");
const appRoutes: Routes = [
    {
        path: "clock",
        pathMatch: "full",
        component: ClockComponent,
    },
    /*
    {
        path: "timezones",
        pathMatch: "full",
        component: TimeZonesComponent,
    },
    {
        path: "timer",
        pathMatch: "full",
        component: TimerComponent,
    },
    */
    {
        path: "stopwatch",
        pathMatch: "full",
        component: StopwatchComponent,
    },
    /*
    {
        path: "settings",
        pathMatch: "full",
        component: SettingsComponent,
    },
    */
    { path: "**", redirectTo: "clock" },
];

export function getBaseHref(platformLocation: PlatformLocation): string {
    return platformLocation.getBaseHrefFromDOM();
}

export function createTranslateLoader(http: HttpClient, baseHref: string) {
    baseHref = baseHref.replace(/(^\/+|\/+$)/, "");
    return new TranslateHttpLoader(http, "./i18n/", ".json");
}

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forRoot(
            appRoutes,
            { enableTracing: isDebug }),
        HttpClientModule,
        NgbModule.forRoot(),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [ HttpClient, APP_BASE_HREF ],
            },
        }),
        MatButtonModule,
        MatIconModule,
        MatListModule,
        MatSidenavModule,
        MatToolbarModule,
    ],
    declarations: [
        AppComponent,
        ClockComponent,
        SettingsComponent,
        StopwatchComponent,
        TimerComponent,
        TimeZonesComponent,
    ],
    providers: [
        {
            provide: APP_BASE_HREF,
            useFactory: getBaseHref,
            deps: [ PlatformLocation ],
        },
        DecimalPipe,
    ],
    bootstrap: [ AppComponent ],
})
export class AppModule {
}
