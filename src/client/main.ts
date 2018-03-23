import { enableProdMode }         from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";

import { AppModule } from "./app/appModule";

if (process.env.NODE_ENV === "prod") {
    enableProdMode();
}

export function main() {
    platformBrowserDynamic().bootstrapModule(AppModule);
}

document.addEventListener("DOMContentLoaded", main, false);