import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

// Optionnel : si votre HttpService n'a pas `providedIn: 'root'`, vous pouvez l'importer ici
// import { HttpService } from './http.service';

@NgModule({
    imports: [
        HttpClientModule // Permet l'injection de HttpClient dans l'appli
    ],
    // declarations: [], // au besoin si vous avez des composants, directives, pipes
    // providers: [HttpService], // si vous n'utilisez pas @Injectable({providedIn: 'root'})
})
export class CoreModule { }
