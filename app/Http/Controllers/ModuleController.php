<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Module ;
use Validator ;


class ModuleController extends Controller
{
     public function __construct()
    {
        $this->middleware('jwt.auth', ['except' => ['getAll']] );
         $this->middleware('role', ['except' => ['getAll']]);
    }

    public function delete($id){
        Module::destroy($id);
    }

    public function store(Request $request){
    		$credentials=$request->only('name','semester','description','code','volume',
    			'prof_id') ;
    		$validator=$this->validator($credentials,'','','') ;
 			if($validator->fails()){    
		             $errors=$validator->errors();
		             return response()->json(compact('errors'),405) ; 
		    } 
    		$module = new Module ;
	    	$module->name=$request->name ;
	    	$module->semester=$request->semester ;
	    	$module->description=$request->description ;
	    	$module->code=$request->code ;
	    	$module->volume=$request->volume ;
	    	$module->prof_id=$request->prof_id ;
	    	
	    	$module->save() ;
	    	return response("achieved",200) ;
    }
    protected function validator(array $data, $flag, $id)
    {
        if($flag=='modify'){
             return Validator::make($data, [
                'name' =>'bail|required|min:3|max:100|unique:modules,name,'.$jd.'',
                'code' => 'bail|required|min:3|max:11|unique:modules,code,'.$id.'',
                'description' => 'bail|required|min:10|max:50',
                'semester' => 'bail|required',
                'prof_id' => 'bail|required|Integer',
                'volume' => 'bail|Integer',
             ]) ;
        }else{
             return Validator::make($data, [
                'name' =>'bail|required|min:3|max:100|unique:modules',
                'code' => 'bail|required|min:3|max:11|unique:modules',
                'description' => 'bail|required|min:10|max:50',
                'semester' => 'bail|required',
                'prof_id' => 'bail|required|Integer',
                'volume' => 'bail|Integer',
             ]) ;
        }
       
    }

    public function getAll(){
        return Module::with('matieres')->with('profs')->get();
    }
  
    public function modify(Request $request){
        $module= Module::find($request->id) ;
        $credentials=$request->only('name','semester','description','code','volume',
                'prof_id') ;

        $validator=$this->validator($credentials,'modify',$request->id) ;
        if($validator->fails()){    
             $errors=$validator->errors();
            return response()->json(compact('errors'),405) ; 
        } 

            $module->name=$request->name ;
            $module->semester=$request->semester ;
            $module->description=$request->description ;
            $module->code=$request->code ;
            $module->volume=$request->volume ;
            $module->prof_id=$request->prof_id ;
            
            $module->save() ;
      
    }

}
