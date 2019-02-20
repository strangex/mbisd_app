<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\News ;
use Validator ;
use Storage ;

class NewsController extends Controller
{
   public function __construct()
    {
        $this->middleware('jwt.auth', ['except' => ['getAll','get']] );
        $this->middleware('role', ['except' => ['getAll','get']]);
    }

    public function delete($id){
        News::destroy($id);
    }

    public function store(Request $request){
    	if($request->hasFile('tag')){
    		$credentials=$request->only('title','sub','desc','start','end') ;
    		$validator=$this->validator($credentials) ;
 			if($validator->fails()){    
		             $errors=$validator->errors();
		             return response()->json(compact('errors'),405) ; 
		    } 

    		 $news = new News ;
	    	 $news->title=$request->title ;
	    	 $news->sub=$request->sub ;
	    	 $news->desc=$request->desc ;

	    	if($request->start && $request->end){
	    	 	$news->start_date=$request->start ;
	    	 	$news->end_date=$request->end ;
	    	}
            if($request->hasFile('file')){
                $name=$request->tag->getClientOriginalName() ;
                $pfile = $request->file('file') ;
                $path=Storage::disk('public')->putFile('tags_files', $pfile, 'public');
                $news->file=basename($path) ;
            }
	    	
	    	$name=$request->tag->getClientOriginalName() ;
	        $pfile = $request->file('tag') ;
	        $path=Storage::disk('public')->putFile('tags', $pfile, 'public');

	        $news->tag=basename($path) ;
	    	
	    	$news->save() ;
	    	return response("achieved",200) ;
    	}
    	else{
 		 		$errors=collect(["tag"=>"The tag image is missing!"]);
				return response()->json(compact('errors'),405) ; 
		}
    }
    protected function validator(array $data)
    {
        return Validator::make($data, [
            'title' =>'bail|required|min:5|max:20',
            'sub' => 'bail|required|min:5|max:30',
            'desc' => 'bail|required|min:10|max:400',
            'start' => 'bail|nullable|date',
            'end' => 'bail|nullable|date'

         ]) ;
    }

    public function getAll(){
    	return News::All() ;
    }
    public function get($id){
        $news= News::find($id) ;
        $contents = Storage::disk('public')->get("tags/".$news['tag']);
        return $contents ;
    }
    public function modify(Request $request){
        $news= News::find($request->id) ;
        $credentials=$request->only('title','sub','desc','start','end') ;
        $validator=$this->validator($credentials) ;
        if($validator->fails()){    
             $errors=$validator->errors();
            return response()->json(compact('errors'),405) ; 
        } 

        $news->title=$request->title ;
        $news->sub=$request->sub ;
        $news->desc=$request->desc ;
        if($request->start && $request->end){
                $news->start_date=$request->start ;
                $news->end_date=$request->end ;
        }
        $suppress=$request->suppress ;
        if($suppress=='true'){
              Storage::disk('public')->delete("tags_files/".$news->file) ;
              $news->file=null ;
        }
        if($request->noTag=='false'){
             Storage::disk('public')->delete("tags/".$news->tag) ;
             $name=$request->tag->getClientOriginalName() ;
             $pfile = $request->file('tag') ;
             $path=Storage::disk('public')->putFile('tags', $pfile, 'public');
             $news->tag=basename($path) ;
        }

        if($request->m=='true'){
            if($news->file!=null){
                 Storage::disk('public')->delete("tags_files/".$news->file) ;
            }
              $pfile = $request->file('file') ;
              $path=Storage::disk('public')->putFile('tags_files', $pfile, 'public');
              $news->file=basename($path) ;
        }

        $news->save() ;
    }
}
