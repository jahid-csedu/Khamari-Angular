import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LocationStrategy, HashLocationStrategy, PathLocationStrategy } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

import { AppComponent } from './app.component';

// Import containers
import { DefaultLayoutComponent } from './containers';

import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
import { LoginComponent } from './views/login/login.component';
import { RegisterComponent } from './views/register/register.component';

const APP_CONTAINERS = [
  DefaultLayoutComponent
];

import {
  AppAsideModule,
  AppBreadcrumbModule,
  AppHeaderModule,
  AppFooterModule,
  AppSidebarModule,
} from '@coreui/angular';

// Import routing module
import { AppRoutingModule } from './app.routing';

// Import 3rd party components
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ChartsModule } from 'ng2-charts';
//Firebase
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from '../environments/environment';
//Toaster
import { ToastrModule } from 'ngx-toastr';

import { ProductsComponent } from './views/products/products.component';
import { AddProductComponent } from './views/products/add-product/add-product.component';
import { ProductListComponent } from './views/products/product-list/product-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InventoryComponent } from './views/products/inventory/inventory.component';
import { OrderModule } from './views/order/order.module';
import { DataTablesModule } from 'angular-datatables';
import { UserComponent } from './views/user/user.component';
import { ProductService } from './shared/services/product.service';
import { InventoryService } from './shared/services/inventory.service';
import { UserService } from './shared/services/user.service';
import { EncryptionService } from './shared/services/encryption.service';
import { ModalModule } from 'ngx-bootstrap';
import { AuthGuard } from './shared/guards/auth.guard';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AppAsideModule,
    AppBreadcrumbModule.forRoot(),
    AppFooterModule,
    AppHeaderModule,
    AppSidebarModule,
    PerfectScrollbarModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    ChartsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(),
    OrderModule,
    DataTablesModule,
    ModalModule
  ],
  declarations: [
    AppComponent,
    ...APP_CONTAINERS,
    P404Component,
    P500Component,
    LoginComponent,
    RegisterComponent,
    ProductsComponent,
    AddProductComponent,
    ProductListComponent,
    InventoryComponent,
    UserComponent
  ],
  providers: [{
    provide: LocationStrategy,
    useClass: PathLocationStrategy
  },
  ProductService,
  InventoryService,
  UserService,
  EncryptionService,
  AuthGuard
],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
