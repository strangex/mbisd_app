<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Activity extends Model
{
    protected $table = 'activities';

     protected $hidden = [
        'created_at', 'updated_at'
      ] ;

     public function getStartDateAttribute($value)
    {
    	return date( "m-d-Y h:i", strtotime( $value )) ;
    }
      public function getEndDateAttribute($value)
    {
    	return date( "m-d-Y h:i", strtotime( $value )) ;
    }
}
