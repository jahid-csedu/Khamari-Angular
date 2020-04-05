import {Component, OnInit } from '@angular/core';
import { navItems } from '../../_nav';
import { Router } from '@angular/router';
import { UserService } from '../../shared/services/user.service';
import { INavData } from '@coreui/angular';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent implements OnInit{
  public sidebarMinimized = false;
  public navItems: INavData[];
  userName:string;
  userRole:string;

  constructor(private router:Router, private userService:UserService){}

  ngOnInit() {
    this.getUserName();

    //role wise menu
    this.userRole = sessionStorage.getItem('loggedInUserRole');
    if(this.userRole === 'admin') {
      this.navItems = [
        {
          name: 'Dashboard',
          url: '/dashboard',
          icon: 'icon-speedometer'
        },
        {
          title: true,
          name: 'Master'
        },
        {
          name: 'Users',
          url: '/users',
          icon: 'icon-user'
        },
        {
          name: 'Products',
          url: '/products',
          icon: 'icon-briefcase'
        },
        {
          name: 'Inventory',
          url: '/inventory',
          icon: 'icon-basket-loaded'
        },
        {
          title: true,
          name: 'Orders'
        },
        {
          name: 'New Order',
          url: '/orders/new-order',
          icon: 'icon-drop'
        },
        {
          name: 'Order List',
          url: '/orders/order-list',
          icon: 'icon-list'
        }
      ]
    }else if(this.userRole === 'moderator') {
      this.navItems = [
        {
          name: 'Dashboard',
          url: '/dashboard',
          icon: 'icon-speedometer'
        },
        {
          title: true,
          name: 'Master'
        },
        {
          name: 'Products',
          url: '/products',
          icon: 'icon-briefcase'
        },
        {
          name: 'Inventory',
          url: '/inventory',
          icon: 'icon-basket-loaded'
        },
        {
          title: true,
          name: 'Orders'
        },
        {
          name: 'New Order',
          url: '/orders/new-order',
          icon: 'icon-drop'
        },
        {
          name: 'Order List',
          url: '/orders/order-list',
          icon: 'icon-list'
        }
      ]
    }else if(this.userRole === 'editor') {
      this.navItems = [
        {
          name: 'Dashboard',
          url: '/dashboard',
          icon: 'icon-speedometer'
        },
        {
          title: true,
          name: 'Orders'
        },
        {
          name: 'New Order',
          url: '/orders/new-order',
          icon: 'icon-drop'
        },
        {
          name: 'Order List',
          url: '/orders/order-list',
          icon: 'icon-list'
        }
      ]
    }
  }

  toggleMinimize(e) {
    this.sidebarMinimized = e;
  }

  onLoggedOut() {
    sessionStorage.setItem('isLoggedIn', 'false');
    sessionStorage.removeItem('loggedInUser');
    sessionStorage.removeItem('loggedInUserRole');
    this.router.navigate(['/login']);
  }

  getUserName() {
    this.userService.getUserById(sessionStorage.getItem('loggedInUser')).subscribe(res => {
      this.userName = res.data().name;
    })
  }
}
