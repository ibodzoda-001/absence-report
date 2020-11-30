import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {AuthGuardService} from './login/auth-guard.service';
import {GroupComponent} from './group/group.component';
import {HeadmenComponent} from './headmen/headmen.component';
import {ReportsComponent} from './reports/reports.component';
import {AbsentComponent} from './absent/absent.component';

// , canActivate: [AuthGuardService]
const routes: Routes = [
  {path: 'login', component: LoginComponent, canActivate: [AuthGuardService]},
  {path: 'group', component: GroupComponent, canActivate: [AuthGuardService]},
  {path: 'headmen', component: HeadmenComponent, canActivate: [AuthGuardService]},
  {path: 'reports', component: ReportsComponent, canActivate: [AuthGuardService]},
  {path: 'absent', component: AbsentComponent, canActivate: [AuthGuardService]}
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
