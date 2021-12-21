import React from "react";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { Link } from "react-router-dom";

const AdminDashboard =()=>{

    const { user: { _id, name, email,role}} = isAuthenticated();
    const adminLinks = () => {
        return (
            <div className="card">
                <h4 className="card-header">Admin Links</h4>
                <ul className="list-group">
                    <li className="list-group-item">
                        <Link className="nav-link" to="/create/category">
                            Create category
                        </Link>
                    </li>
                    <li className="list-group-item">
                        <Link className="nav-link" to="/create/product">
                            Create Product
                        </Link>
                    </li>
                </ul>
            </div>
        );
    };

    const adminInfo = () => {
        return (
            <div className="card mb-5">
            <h3 className="card-header"> USER INFO</h3>
                <ul className="list-group" >
                    <li className="list-group-item">{name}</li>
                    <li className="list-group-item">{email}</li>
                    <li className="list-group-item">{role === 1 ? 'Admin' : 'User'}</li>
                </ul>
            
        </div>
        )
    }

    const purchaseHistory = () => {
        return (
            <div className="card mb-5">
                 <h3 className="card-header"> PURCHASE HISTOY </h3>
                     <ul className="list-group">
                         <li className="list-group-item"></li>
                         <li className="list-group-item"></li>
                         <li className="list-group-item"></li>
                     </ul>
                 
             </div>
        )
    }

    return (
        <Layout title="Dashboard" description={new Date().getHours() >= 12 ? `Good Afternoon ${name}`: `Good Morning ${name}` } className="container">
           <div className="row">
               <div className="col-9">
                   {adminInfo()}
                   {purchaseHistory()}
               </div>
               <div className="col-3">
                   {adminLinks()}
               </div>
           </div>

             
        </Layout>
    )
}

export default AdminDashboard