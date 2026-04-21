const fs = require('fs');

const routesPath = "c:/Users/Rohith/OneDrive/Desktop/skillswap/src/app/app.routes.ts";
let routes = fs.readFileSync(routesPath, 'utf8');

if(!routes.includes("LandingComponent")) {
  routes = routes.replace(
    "import { NotFoundComponent } from './components/shared/not-found/not-found.component';",
    "import { NotFoundComponent } from './components/shared/not-found/not-found.component';\nimport { LandingComponent } from './components/landing/landing.component';\nimport { InboundReviewComponent } from './components/swap/inbound-review/inbound-review.component';"
  );
  routes = routes.replace(
    "{ path: '', pathMatch: 'full', redirectTo: 'skills' },",
    "{ path: '', component: LandingComponent },\n\t{ path: 'swap/inbound/:id', component: InboundReviewComponent, canActivate: [authGuard] },"
  );
  fs.writeFileSync(routesPath, routes);
  console.log("Updated routes");
}
