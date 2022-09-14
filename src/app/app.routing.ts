import { Route } from '@angular/router';
import { LayoutComponent } from 'app/layout/layout.component';
import { InitialDataResolver } from 'app/app.resolvers';

// @formatter:off
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const appRoutes: Route[] = [

    // Redirect empty path to '/home'
    {path: '', pathMatch : 'full', redirectTo: 'home'},
    { path: 'login', redirectTo: '/sign-in' },
    
    {path: 'signed-in-redirect', pathMatch : 'full', redirectTo: 'home'},

    // Auth routes for guests
    {
        path: '',
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            {path: 'confirmation-required', loadChildren: () => import('app/modules/auth/confirmation-required/confirmation-required.module').then(m => m.AuthConfirmationRequiredModule)},
            {path: 'forgot-password', loadChildren: () => import('app/modules/auth/forgot-password/forgot-password.module').then(m => m.AuthForgotPasswordModule)},
            {path: 'reset-password', loadChildren: () => import('app/modules/auth/reset-password/reset-password.module').then(m => m.AuthResetPasswordModule)},
            {path: 'sign-in', loadChildren: () => import('app/modules/auth/sign-in/sign-in.module').then(m => m.AuthSignInModule)},
            {path: 'sign-out', loadChildren: () => import('app/modules/auth/sign-out/sign-out.module').then(m => m.AuthSignOutModule)}
        ]
    },
    // modules routes
    {
        path       : '',
        component  : LayoutComponent,
        resolve    : {
            initialData: InitialDataResolver,
        },
        children   : [
            {path: 'home', loadChildren: () => import('app/modules/home/home.module').then(m => m.HomeModule)},
            {path: 'advanceSalary', loadChildren: () => import('app/modules/advance-salary/advance-salary.module').then(m => m.AdvanceSalaryModule)},
            {path: 'sites', loadChildren: () => import('app/modules/sites/sites.module').then(m => m.SitesModule)},
            {path: 'clients', loadChildren: () => import('app/modules/clients/clients.module').then(m => m.ClientsModule)},
            {path: 'foreignMission', loadChildren: () => import('app/modules/foreign-mission/foreign-mission.module').then(m => m.ForeignMissionModule)},
            {path: 'access-rights', loadChildren: () => import('app/modules/access-rights/access-rights.module').then(m => m.AccessRightsModule)},
            {path: 'settings', loadChildren: () => import('app/modules/settings/settings.module').then(m => m.SettingsModule)},
            {path: 'manageTraceabilityCodes', loadChildren: () => import('app/modules/manage-traceability-codes/manage-traceability-codes.module').then(m => m.ManageTraceabilityCodesModule)},
            {path: 'traceability', loadChildren: () => import('app/modules/traceability/traceability.module').then(m => m.TraceabilityModule)},
            {path: 'tonnage', loadChildren: () => import('app/modules/tonnage/tonnage.module').then(m => m.TonnageModule)},
            {path: 'activity', loadChildren: () => import('app/modules/activity/activity.module').then(m => m.ActivityModule)},
            {path: 'activityParameters', loadChildren: () => import('app/modules/activity-parameters/activity-parameters.module').then(m => m.ActivityParametersModule)},
            {path: 'recapActivity', loadChildren: () => import('app/modules/recap-activity/recap-activity.module').then(m => m.RecapActivityModule)},
            {path: 'absences', loadChildren: () => import('app/modules/activity-absence/activity-absence.module').then(m => m.ActivityAbsenceModule)},
            {path: 'followupSheet', loadChildren: () => import('app/modules/followup-sheet/followup-sheet.module').then(m => m.FollowupSheetModule)},
            {path: 'paymentStatistics', loadChildren: () => import('app/modules/activity-statistics/activity-statistics.module').then(m => m.ActivityStatisticsModule)},
            {path: 'missionOrder', loadChildren: () => import('app/modules/mission-order/mission-order.module').then(m => m.MissionOrderModule)},
            {path: 'webcms', loadChildren: () => import('app/modules/webcms/web-messages/web-messages.module').then(m => m.WebMessagesModule)},
            {path: 'website', loadChildren: () => import('app/modules/webcms/website/website.module').then(m => m.WebSiteModule)},
            {path: 'tickets', loadChildren: () => import('app/modules/ticket/ticket.module').then(m => m.TicketModule)},
            
            
        ]
    },
    { path: '**', redirectTo: '/home' },
];
