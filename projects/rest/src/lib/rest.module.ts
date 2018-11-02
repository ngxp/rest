import { NgModule } from '@angular/core';
import { EnableIfResourceDirective } from './enable-if-resource.directive';
import { HttpService } from './http.service';
import { IfResourceDirective } from './if-resource.directive';
import { ResourceFactory } from './resource-factory';
import { ToUriPipe } from './to-uri.pipe';

@NgModule({
    providers: [
        HttpService,
        ResourceFactory
    ],
    declarations: [
        IfResourceDirective,
        EnableIfResourceDirective,
        ToUriPipe
    ],
    exports: [
        IfResourceDirective,
        EnableIfResourceDirective,
        ToUriPipe
    ]
})
export class RestModule { }
