import { Component, ViewEncapsulation } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

@Component({
    moduleId: `${module.id}`,
    encapsulation: ViewEncapsulation.None,
    selector: "div#app",
    templateUrl: "appComponent.html",
    styleUrls: [ "../../../node_modules/dragula/dist/dragula.min.css", "../assets/appStyles.scss", "appComponent.scss" ],
})
export class AppComponent {
    private static readonly userLanguageParamKey = "hl";

    private static readonly languageMapping: { [key: string]: string; } = {
        "en": "en-US",
    };

    private static readonly availableLanguages: string[] = [ "en-US" ];

    private readonly menuOptions: any[] = [
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

    private get menuKeys(): string[] {
        return Object.keys(this.menuOptions);
    }

    constructor(private translate: TranslateService) {
        let defaultLanguage: string = AppComponent.availableLanguages[0];
        let language: string = this.getUserLanguage();

        if (!language || AppComponent.availableLanguages.indexOf(language) < 0) {
            language = defaultLanguage;
        }

        translate.addLangs(AppComponent.availableLanguages);
        translate.setDefaultLang(defaultLanguage);
        translate.use(language);
    }

    private getUserLanguage(): string {
        let language: string = null;
        if ("locale" in document) {
            language = document["locale"].toString();
        } else {
            let browserLanguage = this.translate.getBrowserLang();
            if (browserLanguage) {
                language = browserLanguage;
            } else {
                language =
                    navigator.languages && navigator.languages.length > 0
                        ? navigator.languages[0]
                        : (navigator.language || navigator["userLanguage"]);
            }
        }

        return language;
    }
}
