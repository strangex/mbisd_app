<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Candidat extends Model
{
    protected $table = 'candidates';

     protected $primaryKey="user_id" ;

    protected $hidden = [
        'user_id', 'remember_token'
    ];

    public function user()
    {
        return $this->hasOne('App\User');
    }

     public function getFirstNameAttribute($value)
    {
        return decrypt($value);
    }
      public function getGenderAttribute($value)
    {
        if($value==1)  return "Masculin" ;
        else return "Feminin" ;
    }   

     public function getLastNameAttribute($value)
    {
        return decrypt($value);
    }

     public function getCinAttribute($value)
    {
        return decrypt($value);
    }

     public function getCneAttribute($value)
    {
        return decrypt($value);
    }
     public function getAddressAttribute($value)
    {
        return decrypt($value);
    }
     public function getCountryAttribute($value)
    {
        return decrypt($value);
    }
    public function getCityAttribute($value)
    {
        return decrypt($value);
    }
    public function getGsmAttribute($value)
    {
        return decrypt($value);
    }
     public function getPhoneAttribute($value)
    {
        return decrypt($value);
    }

}
