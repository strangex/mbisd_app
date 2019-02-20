<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    protected $table = 'students';
    protected $primaryKey="user_id" ;

    protected $hidden = [
        'user_id', 'remember_token'
    ];

    public function user()
    {
        return $this->hasOne('App\User');
    }
    /*******/
    public function getGenderAttribute($value)
    {
        if($value==1)  return "Masculin" ;
        else return "Feminin" ;
    }   
    public function setGenderAttribute($value)
    {
        if($value=="Masculin")  $this->attributes['gender']=1;
        else $this->attributes['gender']=0 ;
    }  
    /******/
    public function getFirstNameAttribute($value)
    {
        return decrypt($value);
    }
    public function setFirstNameAttribute($value)
    {
       $this->attributes['first_name']=encrypt($value);
    }
    /****/
	public function getLastNameAttribute($value)
    {
        return decrypt($value);
    }
    public function setLastNameAttribute($value)
    {
       $this->attributes['last_name']=encrypt($value);
    }

    /*******/
    public function getCinAttribute($value)
    {
        return decrypt($value);
    }
    public function setCinAttribute($value)
    {
         $this->attributes['cin']=encrypt($value);
    }
    /*****/
    public function getCneAttribute($value)
    {
        return decrypt($value);
    }
    public function setCneAttribute($value)
    {
        $this->attributes['cne']=encrypt($value);
    }
    /*****/
    public function getAddressAttribute($value)
    {
        return decrypt($value);
    }
    public function setAddressAttribute($value)
    {
        $this->attributes['address']=encrypt($value);
    }
    /****/
    public function getCountryAttribute($value)
    {
        return decrypt($value);
    }
    public function setCountryAttribute($value)
    {
        $this->attributes['country']=encrypt($value);
    }
    /******/
    public function getCityAttribute($value)
    {
        return decrypt($value);
    }
    public function setCityAttribute($value)
    {
        $this->attributes['city']=encrypt($value);
    }
    /******/
    public function getGsmAttribute($value)
    {
        return decrypt($value);
    }
    public function setGsmAttribute($value)
    {
       $this->attributes['gsm']=encrypt($value);
    }
    /******/
    public function getPhoneAttribute($value)
    {
        return decrypt($value);
    }
    public function setPhoneAttribute($value)
    {
        $this->attributes['phone']=encrypt($value);
    }

}
