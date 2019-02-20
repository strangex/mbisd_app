<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\User ;

class UserController extends Controller
{
   public function __construct()
    {
       $this->middleware('jwt.auth',['except' => ['getUsers']]) ;
    }

    public function getUserInfos($id){
    	$userInf=User::find($id)->userType ;
    	return $userInf ;
    }



}
