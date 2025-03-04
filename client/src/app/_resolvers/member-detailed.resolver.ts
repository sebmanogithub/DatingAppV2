import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Member } from "../models/members";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { MembersService } from "../_services/members.service";

@Injectable({
    providedIn: 'root'
})

export class memberDetailedResolver implements Resolve<Member> {

    constructor(private memberService: MembersService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<Member> {
        const username = route.paramMap.get('username');
    
        if (username === null) {
            throw new Error('Username parameter is required');
        }
    
        return this.memberService.getMember(username);
    }

}
