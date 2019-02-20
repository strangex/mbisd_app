<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\ResetsPasswords;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;


class ResetPasswordController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Password Reset Controller
    |--------------------------------------------------------------------------
    |
    | This controller is responsible for handling password reset requests
    | and uses a simple trait to include this behavior. You're free to
    | explore this trait and override any methods you wish to tweak.
    |
    */

    use ResetsPasswords;

    /**
     * Where to redirect users after resetting their password.
     *
     * @var string
     */
    protected $redirectTo = '/home';

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest');
    }
    public function reset(Request $request)
    {
         $messages = [
            'email.required' => 'Votre email est indispensable!',
            'email.email' => "Cette adresse n'est pas valide!!",
            'password.required' => 'Votre mot de passe est indispensable!',
            'password.confirmed' => 'Les mots de passes ne sont pas similaires!',
            'password.min' => "Le mot de passe doit contenir au moins 8 chiffres!!",
            'password.max' => "Le mot de passe doit contenir jusqu'à 30 caractères!!!",
            'token.required' => 'le token est indispensable!'
        ];

        $this->validate($request, $this->rules(), $messages);

        $response = $this->broker()->reset(
            $this->credentials($request), function ($user, $password) {
                $this->resetPassword($user, $password);
            }
        );

        if ($response == Password::PASSWORD_RESET) {
             return response("Password changed",200) ;
        }else{
            if($response== Password::INVALID_USER){
                $errors=collect(["iuser"=>"Utilisateur invalide!"]);
                return response()->json(compact('errors'),405) ;   
            }else{
                 if($response== Password::INVALID_PASSWORD){
                      $errors=collect(["ipass"=>"Mot de passe invalide!!"]);
                      return response()->json(compact('errors'),405) ;   
                 }else{
                      $errors=collect(["itoken"=>"Token Invalide!!"]);
                      return response()->json(compact('errors'),405) ;   
                 }
            }
        }

    }

}


