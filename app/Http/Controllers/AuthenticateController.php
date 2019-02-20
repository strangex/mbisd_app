<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Controllers\Controller;
use JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use Validator ;
use Mail ;
use App\Mail\CandidatMailable ;
use Swift_SmtpTransport, Swift_Mailer;

use App\User ;
use Config ;


class AuthenticateController extends Controller
{
    public function __construct()
    {
        $this->middleware('jwt.auth', ['except' => ['resendCoordinates','authenticate']]);
    }

    public function authenticate(Request $request)
    {
        $credentials = $request->only('username', 'password');
        $validator=$this->validator($credentials) ;
        if($validator->fails()){    
             $errors=$validator->errors();
             return response()->json(compact('errors'),405) ; 
        } 

        try {
            if (! $token = JWTAuth::attempt($credentials)) {
                return response()->json(['error' => 'invalid_credentials'], 401);
            }
        } catch (JWTException $e) {
            // something went wrong
            return response()->json(['error' => 'could_not_create_token'], 500);
        }
        // if no errors are encountered we can return a JWT
        return response()->json(compact('token'));
    }

    protected function validator(array $data)
    {
        return Validator::make($data, [
            'username' =>'bail|required|min:8|max:25',
            'password' => 'bail|required|min:8|max:30',
        ],[
            'username.required' => 'Votre username est indispensable!',
            'username.min' => "L'username doit contenir au moins 8 chiffres!!",
            'username.max' => "L'username doit contenir jusqu'à 25 chiffres!!!",
            'password.required' => 'Votre mot de passe est indispensable!',
            'password.min' => "Le mot de passe doit contenir au moins 8 chiffres!!",
            'password.max' => "Le mot de passe doit contenir jusqu'à 30 caractères!!!",

        ]);
    
    }

    public function getAuthenticatedUser()
    {
        try {

            if (! $user = JWTAuth::parseToken()->authenticate()) {
                return response()->json(['user_not_found'], 404);
            }

        } catch (Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {

            return response()->json(['token_expired'], $e->getStatusCode());

        } catch (Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {

            return response()->json(['token_invalid'], $e->getStatusCode());

        } catch (Tymon\JWTAuth\Exceptions\JWTException $e) {

            return response()->json(['token_absent'], $e->getStatusCode());

        }
        $user->flag=$user->flag ;
        // the token is valid and we have found the user via the sub claim
        return response()->json(compact('user'));
    }

    public function resendCoordinates(Request $request){
            $email=$request->only('email') ;

             $validator=$this->emailValidator($email) ;
             if($validator->fails()){    
                     $errors=$validator->errors();
                     return response()->json(compact('errors'),405) ; 
             } 

                $users=User::all() ;
                foreach($users as $user){
                        $user->email=decrypt($user->email) ;
                        if($user->email==$request->email) {
                            Config::set('mail.driver','mail') ;
                              Mail::to($request->email)->send(new CandidatMailable(decrypt($user->username),decrypt($user->password))) ;
                                
                            if( count(Mail::failures()) > 0 ) {
                                    $errors=collect(["mail"=>"Erreur dans la configuration du mail, si ce problème persiste veuillez nous contacter."]);
                                    return response()->json(compact('errors'),405) ; 
                            }
                            return response("Email has been sent",200) ;
                        }
                      
                }
            $errors=collect(["email"=>"Cette adresse email ne correspond à aucun candidat!"]);
            return response()->json(compact('errors'),405) ; 
    }

  
  

}
