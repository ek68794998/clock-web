import { Component, ViewEncapsulation } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

@Component({
    moduleId: `${module.id}`,
    encapsulation: ViewEncapsulation.None,
    selector: "div#app",
    templateUrl: "appComponent.html",
    styleUrls: [ "../assets/appStyles.scss", "appComponent.scss" ],
})
export class AppComponent {
    private static readonly userLanguageParamKey = "hl";

    private static readonly languageMapping: { [key: string]: string; } = {
        "en": "en-US",
        "ja": "ja-JP",
    };

    private static readonly availableLanguages: string[] = [ "en-US" ];

    protected readonly menuOptions: any[] = [
        {
            route: "clock",
            label: "clock.title",
            icon: "access_time",
        },
        /*
        {
            route: "timezones",
            label: "timezones.title",
            icon: "language",
        },
        {
            route: "timer",
            label: "timer.title",
            icon: "hourglass_empty",
        },
        */
        {
            route: "stopwatch",
            label: "stopwatch.title",
            icon: "timer",
        },
        /*
        {
            route: "settings",
            label: "settings.title",
            icon: "settings",
        },
        */
    ];

    constructor(private translate: TranslateService) {
        let defaultLanguage: string = AppComponent.availableLanguages[0];
        let language: string = this.getUserLanguage();

        if (language in AppComponent.languageMapping) {
            language = AppComponent.languageMapping[language];
        }

        console.log("Language:", language);

        if (!language || AppComponent.availableLanguages.indexOf(language) < 0) {
            language = defaultLanguage;
        }

        translate.addLangs(AppComponent.availableLanguages);
        translate.setDefaultLang(defaultLanguage);
        translate.use(language);
    }

    private static getUrlParameter(name): string {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");

        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
        var results = regex.exec(location.search);

        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    };

    private getUserLanguage(): string {
        const overrideLanguage: string =
            AppComponent.getUrlParameter(AppComponent.userLanguageParamKey);

        if (overrideLanguage) {
            return overrideLanguage;
        }

        if ("locale" in document) {
            return document["locale"].toString();
        }

        const browserLanguage = this.translate.getBrowserLang();
        if (browserLanguage) {
            return browserLanguage
        }

        return navigator.languages && navigator.languages.length > 0
                    ? navigator.languages[0]
                    : (navigator.language || navigator["userLanguage"]);
    }
}
