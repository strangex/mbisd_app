<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\SendsPasswordResetEmails;

use Illuminate\Http\Request;
use App\User ;
use Validator ;
use Mail ;
use App\Mail\PasswordMailable ;
use Swift_SmtpTransport, Swift_Mailer;
use Config ;


class ForgotPasswordController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Password Reset Controller
    |--------------------------------------------------------------------------
    |
    | This controller is responsible for handling password reset emails and
    | includes a trait which assists in sending these notifications from
    | your application to your users. Feel free to explore this trait.
    |
    */

    use SendsPasswordResetEmails;

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest');
    }

    public function getResetToken(Request $request)
    {
        $email=$request->only('email') ;

        $validator=$this->emailValidator($email) ;
        if($validator->fails()){    
                 $errors=$validator->errors();
                 return response()->json(compact('errors'),405) ; 
        } 

        $user = User::where('email', $request->input('email'))->first();
        if(!$user){
              $errors=collect(["email"=>"Cette adresse email ne correspond à aucun candidat!"]);
                 return response()->json(compact('errors'),405) ;   
        }

        $token = app('auth.password.broker')->createToken($user);
        Config::set('mail.driver','mail') ;
        Mail::to($request->email)->send(new PasswordMailable($request->email,$token)) ;
                                
        if( count(Mail::failures()) > 0 ) {
                    $errors=collect(["mail"=>"Erreur dans la configuration du mail, si ce problème persiste veuillez nous contacter."]);
                return response()->json(compact('errors'),405) ; 
        }


        return response("Email has been sent",200) ;
        
        
           
    }

    protected function emailValidator(array $data)
    {
        $messages = [
         
            'email.required' => 'Votre email est indispensable!',
            'email.email' => "Cette adresse n'est pas valide!!"
        ];


        return Validator::make($data, [
            'email' => 'bail|required|email'
        ],$messages);
    
    }
}
