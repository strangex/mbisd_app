<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Student ;
use Illuminate\Support\Collection;

class StudentController extends Controller
{
	public function __construct()
    {
       $this->middleware('jwt.auth', ['except' => 'getAll']);
        $this->middleware('role', ['except' => ['getAll']]);
    }
    public function getAll(){
        $students = Student::all()->transform(function ($item, $key) {
        	$item['name']=ucfirst(strtolower($item['last_name'])).' '.ucfirst(strtolower($item['first_name'])) ;
		    return $item;
		})->groupBy("registration_year");
        return $students ;
    }

}