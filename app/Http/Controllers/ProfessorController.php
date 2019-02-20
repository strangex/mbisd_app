<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Professor ;
use Image ;
use Validator ;
use Storage ;

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;


class ProfessorController extends Controller
{
    public function __construct()
    {
        $this->middleware('jwt.auth', ['except' => ['getAll']]);
        $this->middleware('role', ['except' => ['getAll']]);
    }
    
     public function delete($id){
        Professor::destroy($id);
    }

    public function getAll(){
    	return Professor::All() ;
    }


    public function modify(Request $request){
        $professor= Professor::find($request->id) ;
        $credentials=$request->only('birth_date','first_name', 'grade', 'last_name','speciality','email','establishment') ;

        $validator=$this->validator($credentials) ;
        if($validator->fails()){    
             $errors=$validator->errors();
            return response()->json(compact('errors'),405) ; 
        } 

         $professor->birth_date=$request->birth_date ;
		 $professor->first_name=$request->first_name ;
		 $professor->last_name=$request->last_name ;
		 $professor->speciality=$request->speciality ;
		 $professor->establishment=$request->establishment ;
		 $professor->email=$request->email ;

         $professor->grade=$request->grade ;

          if($request->facebook!='undefined'){
                 $professor->facebook=$request->facebook ;
             }
          if($request->twitter!='undefined'){
                 $professor->twitter=$request->twitter ;
             }
          if($request->linkedin!='undefined'){
                 $professor->linkedin=$request->linkedin ;
          }

      
        if($request->noTag=='false'){
            Storage::disk('public')->delete("professor/".$professor->avatar) ;
            $name=$request->avatar->getClientOriginalName() ;

            $name=$request->avatar->getClientOriginalName() ;
	        $pfile = $request->file('avatar') ;
	        $path=Storage::disk('public')->putFile('professor', $pfile, 'public');
	        $resize = Image::make($pfile)->fit(300)->encode('jpg');
	        Storage::disk('local')->put($path, $resize->__toString(), 'public');
	       
	        $professor->avatar=basename($path) ;
        }


        $professor->save() ;
    }
     public function store(Request $request){
    	if($request->hasFile('avatar')){
    		$credentials=$request->only('birth_date','first_name', 'grade', 'last_name','speciality','email','establishment') ;

    		$validator=$this->validator($credentials) ;
 			if($validator->fails()){    
		             $errors=$validator->errors();
		             return response()->json(compact('errors'),405) ; 
		    } 

    		 $professor = new professor ;
	    	 $professor->birth_date=$request->birth_date ;
	    	 $professor->first_name=$request->first_name ;
	    	 $professor->last_name=$request->last_name ;
	    	 $professor->speciality=$request->speciality ;
	    	 $professor->establishment=$request->establishment ;
	    	 $professor->email=$request->email ;

             $professor->grade=$request->grade ;
             if($request->facebook!='undefined'){
                 $professor->facebook=$request->facebook ;
             }
             if($request->twitter!='undefined'){
                 $professor->twitter=$request->twitter ;
             }
            if($request->linkedin!='undefined'){
                 $professor->linkedin=$request->linkedin ;
             }
            
	    	$name=$request->avatar->getClientOriginalName() ;
	        $pfile = $request->file('avatar') ;
	        $path=Storage::disk('public')->putFile('professor', $pfile, 'public');
	        $resize = Image::make($pfile)->fit(300)->encode('jpg');
	        Storage::disk('local')->put($path, $resize->__toString(), 'public');
	       
	        $professor->avatar=basename($path) ;
	    	
	    	$professor->save() ;

	    	return response("achieved",200) ;
    	}
    	else{
 		 		$errors=collect(["avatar"=>"The professor profile image is missing!"]);
				return response()->json(compact('errors'),405) ; 
		}
    }
    protected function validator(array $data)
    {
        return Validator::make($data, [
            'first_name' =>'bail|required|min:3|max:20',
            'last_name' =>'bail|required|min:3|max:20',
            'email' =>'bail|required|email',
            'establishment' =>'bail|required|min:5|max:50',
            'speciality' =>'bail|required|min:5|max:50',
            'birth_date' => 'bail|required|date',
            'grade' => 'bail|required',
         
         ]) ;
    }
}
