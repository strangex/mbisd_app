<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Partenaire ;
use Image ;
use Validator ;
use Storage ;

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;


class PartenaireController extends Controller
{
   public function __construct()
    {
        $this->middleware('jwt.auth', ['except' => ['getAll']]);
        $this->middleware('role', ['except' => ['getAll']]);
    }
    
     public function delete($id){
        Partenaire::destroy($id);
    }

    public function getAll(){
    	return Partenaire::All() ;
    }


    public function modify(Request $request){
        $partenaire= Partenaire::find($request->id) ;
        $credentials=$request->only('name') ;

        $validator=$this->validator($credentials) ;
        if($validator->fails()){    
             $errors=$validator->errors();
            return response()->json(compact('errors'),405) ; 
        } 
            $partenaire->name=$request->name ;

          if($request->link!='undefined'){
                 $partenaire->link=$request->link ;
             }
          if($request->country!='undefined'){
                 $partenaire->country=$request->country ;
             }
          if($request->city!='undefined'){
                 $partenaire->city=$request->city ;
          }

      
        if($request->noTag=='false'){
            Storage::disk('public')->delete("partenaire/".$partenaire->avatar) ;
            $name=$request->avatar->getClientOriginalName() ;

            $name=$request->avatar->getClientOriginalName() ;
	        $pfile = $request->file('avatar') ;
	        $path=Storage::disk('public')->putFile('partenaire', $pfile, 'public');
	        $resize = Image::make($pfile)->fit(300)->encode('jpg');
	        Storage::disk('local')->put($path, $resize->__toString(), 'public');
	       
	        $partenaire->avatar=basename($path) ;
        }


        $partenaire->save() ;
    }
     public function store(Request $request){
    	if($request->hasFile('avatar')){
    		$credentials=$request->only('name') ;

    		$validator=$this->validator($credentials) ;
 			if($validator->fails()){    
		             $errors=$validator->errors();
		             return response()->json(compact('errors'),405) ; 
		    } 

    		 $partenaire = new Partenaire ;
	    	 $partenaire->name=$request->name ;

             if($request->link!='null'){
                 $partenaire->link=$request->link ;
             }
             if($request->city!='null'){
                 $partenaire->city=$request->city ;
             }
            if($request->country!='null'){
                 $partenaire->country=$request->country ;
             }
            
	    	$name=$request->avatar->getClientOriginalName() ;
	        $pfile = $request->file('avatar') ;
	        $path=Storage::disk('public')->putFile('partenaire', $pfile, 'public');
	        $resize = Image::make($pfile)->fit(300)->encode('jpg');
	        Storage::disk('local')->put($path, $resize->__toString(), 'public');
	       
	        $partenaire->avatar=basename($path) ;
	    	
	    	$partenaire->save() ;

	    	return response("achieved",200) ;
    	}
    	else{
 		 		$errors=collect(["avatar"=>"L'image du partenaire est indispensable!"]);
				return response()->json(compact('errors'),405) ; 
		}
    }
    protected function validator(array $data)
    {
        return Validator::make($data, [
            'name' =>'bail|required|min:3|max:40',
         ]) ;
    }
}
