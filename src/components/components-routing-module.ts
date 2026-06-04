import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { Applications } from './applications/applications';
import { ContactUs } from './contact-us/contact-us';
import { EnquireForm } from './enquire-form/enquire-form';
import { SiteMap } from './site-map/site-map';
import { AboutUs } from './about-us/about-us';
import { Products } from './products/products';
import { ProductCategory } from './product-category/product-category';
import { Home } from './home/home';
import { CanDeactivateGuard } from '../@core/guards/can-deactivate.guard';

const routes: Routes = [
  {
    path: '', component: Dashboard,
    children: [
      { path:'', component:Home},
      { path:'home', component:Home},
      { path: 'products', component: Products, canDeactivate:[CanDeactivateGuard] },
      { path: 'product-category', component: ProductCategory, canDeactivate:[CanDeactivateGuard] },
      { path: 'applications', component: Applications, canDeactivate:[CanDeactivateGuard] },
      { path: 'about-us', component: AboutUs, canDeactivate:[CanDeactivateGuard] },
      { path: 'contact-us', component: ContactUs },
      { path: 'enqure-form', component: EnquireForm },
      { path: 'site-map', component: SiteMap },
      { path:'**', component:Home}
    ]
  },

  { path: '**', component: Dashboard },
  { path: '', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComponentsRoutingModule { }
