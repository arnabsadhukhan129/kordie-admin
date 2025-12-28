import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RolelistComponent } from './rolelist/rolelist.component';
import { PermissionComponent } from './permission/permission.component';
import { AddroleComponent } from './addrole/addrole.component';
import { RestrictedComponent } from './restricted/restricted.component';

const routes: Routes = [
  // {
  //   path: '',
  //   component: AccessComponent,
  //   data: {
  //     title: 'Role Management'
  //   }
  // }      
  {
    path: 'rolelist',
    component: RolelistComponent,
    data: {
      title: 'Access Management',
    }
  },
  {
    path: 'addrole',
    component: AddroleComponent,
    data: {
      title: 'Add New Role',
    }
  },
  {
    path: 'permission',
    component: PermissionComponent,
    data: {
      title: 'Edit Role Access',
    }
  },
  {
    path: 'permission-denied',
    component: RestrictedComponent,
    data: {
      title: 'No Permission',
    }
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccessRoutingModule { }
