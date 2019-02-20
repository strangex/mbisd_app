<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Activity ;

class ActivityController extends Controller
{
    public function __construct()
    {
       $this->middleware('jwt.auth', ['except' => 'get']);
        $this->middleware('role', ['except' => ['get']]);
    }
    public function delete($id){
        Activity::destroy($id);
    }


    public function store(Request $request){
    	 $activity = new Activity ;

    	 $activity->id=$request->id ;
    	 $activity->text=$request->text ;


         $start = substr($request->start_date, 0, strpos($request->start_date, '('));
         $end = substr($request->end_date, 0, strpos($request->end_date, '('));
         $start = date('Y-m-d h:i:s', strtotime($start));
    	 $end = date('Y-m-d h:i:s', strtotime($end));

         $activity->start_date=$start ;
         $activity->end_date=$end ;

         $activity->save() ;

    }
    public function update(Request $request){
         $activity =Activity::find($request->id) ;

         $activity->id=$request->id ;
         $activity->text=$request->text ;


         $start = substr($request->start_date, 0, strpos($request->start_date, '('));
         $end = substr($request->end_date, 0, strpos($request->end_date, '('));
         $start = date('Y-m-d h:i:s', strtotime($start));
         $end = date('Y-m-d h:i:s', strtotime($end));

         $activity->start_date=$start ;
         $activity->end_date=$end ;

         $activity->save() ;

    }
    public function get(){
        return Activity::All() ;
    }
}
