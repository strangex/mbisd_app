<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Matiere extends Model
{
    protected $table = 'matieres';

    public function modules()
    {
        return $this->belongsTo('App\Module','module_id');
    }
 

   
}
