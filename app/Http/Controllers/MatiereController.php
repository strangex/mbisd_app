<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Matiere ;
use Validator ;

class MatiereController extends Controller
{
      public function __construct()
    {
        $this->middleware('jwt.auth', ['except' => ['getAll']] );
         $this->middleware('role', ['except' => ['getAll']]);
    }

    public function delete($id){
        Matiere::destroy($id);
    }

    public function store(Request $request){
    		$credentials=$request->only('name','semester','description','code','volume',
    			'module_id') ;
    		$validator=$this->validator($credentials,'','') ;
 			if($validator->fails()){    
		             $errors=$validator->errors();
		             return response()->json(compact('errors'),405) ; 
		    } 
    		$matiere = new Matiere ;
	    	$matiere->name=$request->name ;
	    	$matiere->semester=$request->semester ;
	    	$matiere->description=$request->description ;
	    	$matiere->code=$request->code ;
	    	$matiere->volume=$request->volume ;
	    	$matiere->module_id=$request->module_id ;
	    	
	    	$matiere->save() ;
	    	return response("achieved",200) ;
    }
    protected function validator(array $data, $flag, $id)
    {
         if($flag=='modify'){
             return Validator::make($data, [
                'name' =>'bail|required|min:3|max:100|unique:matieres,name,'.$jd.'',
                'code' => 'bail|required|min:3|max:11|unique:matieres,code,'.$id.'',
                'description' => 'bail|required|min:10|max:50',
                'semester' => 'bail|required',
                 'module_id' => 'bail|required|Integer',
                'volume' => 'bail|Integer',
             ]) ;
        }else{
             return Validator::make($data, [
                'name' =>'bail|required|min:3|max:100|unique:matieres',
                'code' => 'bail|required|min:3|max:11|unique:matieres',
                'description' => 'bail|required|min:10|max:50',
                'semester' => 'bail|required',
                'module_id' => 'bail|required|Integer',
                'volume' => 'bail|Integer',
             ]) ;
        }
        
    }

    public function getAll(){
        return Matiere::with('modules')->get();
    }

    public function Matiere(Request $request){
        $matiere= Matiere::find($request->id) ;
        $credentials=$request->only('name','semester','description','code','volume',
              'module_id') ;
        $validator=$this->validator($credentials,'modify',$request->id) ;
        
        if($validator->fails()){    
             $errors=$validator->errors();
            return response()->json(compact('errors'),405) ; 
        } 

            $matiere->name=$request->name ;
            $matiere->semester=$request->semester ;
            $matiere->description=$request->description ;
            $matiere->code=$request->code ;
            $matiere->volume=$request->volume ;
            $matiere->module_id=$request->module_id ;
            

        $matiere->save() ;
    }
}
