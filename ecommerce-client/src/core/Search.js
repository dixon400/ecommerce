import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCategories, list } from './apiCore';
import Layout from './Layout';
import Card from './Card';

const Search = () => {
    const [data, setData] = useState({
        categories: [],
        category: "",
        search: "",
        results: [],
        searched: false
    });

    const { categories, category, search, results, searched} =data

    const loadCategories = () =>{
        getCategories().then(resp=>{
            if(resp.error){
                console.log(resp.error)
            } else {
                setData({...data, categories: resp})
            }
        })
    }

    useEffect(()=>{
        loadCategories();
    }, []);

    const searchData = () => {
        if(search){
            list({search: search || undefined, category: category}).then(
                resp=>{
                    console.log({resp})
                    if (resp.error) console.log(resp.error);
                    setData({...data, results: resp, searched: true})
                }
            )
        }
    }

    const searchSubmit = (e) => {
        e.preventDefault();
        searchData();
    };

    const searchedResult = (results = []) => {
        return (
            <div className='row'>
                {results.map((product, i)=> (<Card key={i} product={product}/>))}
            </div>
        )
    }

    const handleChange = (name) => event => {
        setData({...data, [name]: event.target.value, searched: false})
    };

    const searchForm = () => (
        <form onSubmit={searchSubmit}>
            <span className='input-group-text'>
                <div className="input-group input-group-lg">
                    <div className="input-group-prepend">
                        <select onChange={handleChange("category")} className="btn mr-2">
                            <option value="All">Pick Any Category</option>    
                            {categories.map((c,i)=>(
                                <option key={c.i} value={c._id}>{c.name}</option>
                            ))}
                        </select>    
                    </div>
                <input 
                type="text"
                className='form-control'
                onChange={handleChange('search')}
                placeholder="Search by Name"
            />      
                </div> 
                <div className="btn input-group-append" style={{border: "none"}}>
                    <button className='input-group-text'>Search</button>
                </div>   
            </span>  
        </form>
    );
        
    
    return (
        <div className='row'>
            <div className="container mb-3">{searchForm()}</div> 
            <div className="container-fluid mb-3">{searchedResult(results)}</div> 
            
        </div>
    )
}

export default Search;