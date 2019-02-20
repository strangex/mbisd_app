<?php

namespace App;

use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'username', 'email', 'password',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'username', 'email', 'password', 'remember_token',
    ];

    public function userType()
    {   
        if($this->flag=='candidate'){
          return $this->hasOne('App\Candidat') ;
        }
        else {
             return response()->json(['error' => 'user without any type'], 500);
        }
    }


    public function getFLagAttribute($value)
    {
        return decrypt($value);
    }


}
