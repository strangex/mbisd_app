<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('index');
});

Route::get('/home', 'HomeController@index');
Route::post('/authenticate', 'AuthenticateController@authenticate');
Route::get('/authenticate', 'AuthenticateController@getAuthenticatedUser');

Route::post('/forgotten', 'AuthenticateController@resendCoordinates');
Route::post('/contact', 'ContactController@ship');

/****Candidates***/
Route::get('/everything', 'CandidatController@getEverything');
Route::post('/candidate', 'CandidatController@store');
Route::get('/candidate', 'CandidatController@getCandidates');
Route::get('/cne/{cne}', 'CandidatController@getCandidate');
Route::post('/cmail', 'CandidatController@contact');


Route::get('/fcandidate/{number}/{verified}/{bacType}/{bac2Type}/{bac3Type}/{bac3Option}', 'CandidatController@candidatesFiltredList');



Route::get('/lfcandidate/{number}/{tdate}', 'CandidatController@candidatesFullList');
Route::get('/candidateAv/{avatar}', 'CandidatController@getAvatar');
Route::post('/ucandidate', 'CandidatController@storeFile');
Route::post('/mcandidate', 'CandidatController@update');
Route::get('/score', 'CandidatController@computeScore');
Route::get('/zip/{number}', 'CandidatController@zipFiles');
Route::get('/uzip/{cne}', 'CandidatController@uzip');
Route::post('/verified', 'CandidatController@verified');
Route::get('/reinitialize', 'CandidatController@reinitialize');
Route::get('/regulate', 'CandidatController@regulate');

/*******Students******/
Route::get('/students', 'StudentController@getAll');

Route::get('student/{filename}', function ($filename)
{
    $contents = Storage::disk('local')->get("avatars/".$filename);
    return $contents;
});



/*********/
Route::get('/user/{id}', 'UserController@getUserInfos') ;


/***Gears****/
Route::get('/gear/score', 'GearController@settedScore');

Route::get('/gear', 'GearController@dateLimit');
Route::post('/gear', 'GearController@setDateLimit');
Route::post('/mgear', 'GearController@modifyDateLimit');
Route::delete('/gear', 'GearController@suppressDateLimit');

/***Passwords***/
Route::post('email', 'Auth\ForgotPasswordController@getResetToken');
Route::post('reset', 'Auth\ResetPasswordController@reset') ;

/*****News****/
Route::post('news', 'NewsController@store');
Route::post('mnews', 'NewsController@modify');
Route::get('news', 'NewsController@getAll') ;
Route::get('news/{id}', 'NewsController@get') ;
Route::delete('news/{id}', 'NewsController@delete') ;

/***Activities****/
Route::post('activity', 'ActivityController@store');
Route::delete('activity/{id}', 'ActivityController@delete');
Route::post('mactivity', 'ActivityController@update');
Route::get('activity', 'ActivityController@get');

/*****Professor******/
Route::post('professor', 'ProfessorController@store');
Route::post('mprofessor', 'ProfessorController@modify');
Route::get('professor', 'ProfessorController@getAll') ;
Route::delete('professor/{id}', 'ProfessorController@delete') ;

/**********/

Route::get('professor/{filename}', function ($filename)
{
    $contents = Storage::disk('public')->get("professor/".$filename);
    return $contents;
});


Route::get('tags/{filename}', function ($filename)
{
    $contents = Storage::disk('public')->get("tags/".$filename);
    return $contents;
});
Route::get('tags_files/{filename}', function ($filename)
{
    $contents = Storage::disk('public')->get("tags_files/".$filename);
    return $contents;
});
/*****Partenaire******/
Route::post('partenaire', 'PartenaireController@store');
Route::post('mpartenaire', 'PartenaireController@modify');
Route::get('partenaire', 'PartenaireController@getAll') ;
Route::delete('partenaire/{id}', 'PartenaireController@delete') ;

/**********/

Route::get('partenaire/{filename}', function ($filename)
{
    $contents = Storage::disk('public')->get("partenaire/".$filename);
    return $contents;
});



/*****Module******/
Route::post('module', 'ModuleController@store');
Route::post('mmodule', 'ModuleController@modify');
Route::get('module', 'ModuleController@getAll') ;
Route::delete('module/{id}', 'ModuleController@delete') ;
/**********/

/*****Matiere******/
Route::post('matiere', 'MatiereController@store');
Route::post('mmatiere', 'MatiereController@modify');
Route::get('matiere', 'MatiereController@getAll') ;
Route::delete('matiere/{id}', 'MatiereController@delete') ;
/**********/

/*****Statistics******/
Route::get('statistics', 'CandidatController@statistics') ;
Route::get('types', 'CandidatController@types') ;
Route::post('convert', 'CandidatController@convert') ;
/**********/

/***Database****/
Route::get('backup', 'BaseController@backup');


/***local****/
/*Route::get('local', function(){	
});*/