import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import SignUp from './user/SignUp';
import SignIn from './user/SignIn';
import Home from './core/Home';
import Menu from './core/Menu';
import PrivateRoute from './auth/PrivateRoute';
import UserDashboard from './user/UserDashboard';
import AdminRoute from './auth/AdminRoute';
import AdminDashboard from './user/AdminDashboard';
import AddCategory from './admin/AddCategory';
import AddProduct from './admin/AddProduct';
import Shop from './core/Shop';

const Routes = () => {
    return(
        <BrowserRouter>
        <Menu />
        <Switch>
            <Route path='/' exact component={Home}/>

            <Route path="/shop" exact component={Shop} />

            <Route path='/signup' exact component={SignUp}/>

            <Route path='/login' exact component={SignIn}/>

            <PrivateRoute path='/user/dashboard' exact component={UserDashboard}/>

            <AdminRoute path='/admin/dashboard' exact component={AdminDashboard} />

            <AdminRoute path='/create/category' exact component={AddCategory} />

            <AdminRoute path='/create/product' exact component={AddProduct} />

        </Switch>
        </BrowserRouter>
    )
}

export default Routes