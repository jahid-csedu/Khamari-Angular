import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Import Containers
import { DefaultLayoutComponent } from './containers';

import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
import { LoginComponent } from './views/login/login.component';
import { ProductsComponent } from './views/products/products.component';
import { InventoryComponent } from './views/products/inventory/inventory.component';
import { UserComponent } from './views/user/user.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { AuthorizationGuard } from './shared/guards/authorization.guard';
import { PasswordChangeComponent } from './views/password-change/password-change.component';
import { InvoiceComponent } from './views/invoice/invoice.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: '404',
    component: P404Component,
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    component: P500Component,
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login Page'
    }
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthorizationGuard],
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'users',
        component: UserComponent,
        data: {
          title: 'Users',
          allowedRoles: ['admin']
        }
      },
      {
        path: 'products',
        component: ProductsComponent,
        data: {
          title: 'Products',
          allowedRoles: ['admin', 'moderator']
        }
      },
      {
        path: 'inventory',
        component: InventoryComponent,
        data: {
          title: 'Inventory',
          allowedRoles: ['admin', 'moderator']
        }
      },
      {
        path: 'password_change',
        component: PasswordChangeComponent,
        data: {
          title: 'Change Password'
        }
      },
      {
        path: 'invoice',
        component: InvoiceComponent,
        data: {
          title: 'Invoice'
        }
      },
      {
        path: 'orders',
        loadChildren: () => import('./views/order/order.module').then(m => m.OrderModule)
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./views/dashboard/dashboard.module').then(m => m.DashboardModule)
      }
    ]
  },
  { path: '**', component: P404Component }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
