<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Module extends Model
{
    protected $table = 'modules';

    public function matieres(){
    	return $this->hasMany('App\Matiere');
    }
    public function profs()
    {
        return $this->belongsTo('App\Professor','prof_id');
    }

    public function delete()    
    {
        DB::transaction(function() 
        {
            $this->matieres()->delete();
            parent::delete();
        });
    }
}
