<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Artisan ;

class BaseController extends Controller
{
    public function __construct()
    {
       $this->middleware('jwt.auth');
       
    }
    public function backup(){
    	  Artisan::call('db:backup');
    	  return response("database exported",200) ;
    }


}
