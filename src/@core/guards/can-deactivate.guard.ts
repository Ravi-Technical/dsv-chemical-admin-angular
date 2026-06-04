import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanDeactivate, GuardResult, MaybeAsync, RouterStateSnapshot } from "@angular/router";
import { CanComponentDeactivate } from "../models/can-Deactivate-interface";
import { Observable } from "rxjs";

 @Injectable({
    providedIn:'root'
 })

 export class CanDeactivateGuard implements CanDeactivate<CanComponentDeactivate>{
         canDeactivate(component: CanComponentDeactivate, currentRoute: ActivatedRouteSnapshot, 
            currentState: RouterStateSnapshot, nextState: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
             return component.canDeactivate ? component.canDeactivate() : true;
         } 
 } 