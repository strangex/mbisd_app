<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Gear ;
use Hash ;
use Artisan ;

class GearController extends Controller
{
    public function __construct()
    {
        $this->middleware('jwt.auth', ['except' => ['dateLimit','base']]);
         $this->middleware('role', ['except' => ['dateLimit','base']]);
    }

    public function dateLimit(){
        $gears=Gear::all() ;
        foreach ($gears as $gear) {
                if (Hash::check('date_limit', $gear->key))
                { 
                    if ('still'==decrypt($gear->val))
                    {
                        $flag=collect(["setted"=>"unsetted"]);
                        return response()->json(compact('flag'),200) ;  
                       
                    }else{
                        $flag=collect(["setted"=>decrypt($gear->val)]);
                        return response()->json(compact('flag'),200) ;  
                    }
                  
                }
        }
        $gear=new Gear ;
        $gear->key=bcrypt("date_limit") ;
        $gear->val=encrypt("still") ;
        $gear->save() ;

        $flag=collect(["setted"=>"unsetted"]);
        return response()->json(compact('flag'),200) ;  
    }

    public function setDateLimit(Request $request){
        $gears=Gear::all() ;
        foreach ($gears as $gear) {
                if (Hash::check('date_limit', $gear->key))
                { 
                   $gear->val=encrypt($request->date_limit) ;
                   $gear->save() ;
                }
        }
    }

     public function suppressDateLimit(){
        $gears=Gear::all() ;
        foreach ($gears as $gear) {
                if (Hash::check('date_limit', $gear->key))
                { 
                   $gear->val=encrypt("still") ;
                   $gear->save() ;
                }
        }
    }
    public function modifyDateLimit(Request $request){
        $gears=Gear::all() ;
        foreach ($gears as $gear) {
                if (Hash::check('date_limit', $gear->key))
                { 
                   $gear->val=encrypt($request->ldate) ;
                   $gear->save() ;
                }
        }
    }

 
}
