<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Mail\ContactMailable ;
use Validator ;
use Mail ;
use Config ;

class ContactController extends Controller
{
    public function ship(Request $request)
    {
    	$validator=$this->validator($request->all()) ;
    	if($validator->fails()){    
            $errors=$validator->errors();
             return response()->json(compact('errors'),405) ; 
        }
        Config::set('mail.driver','mailgun');
        Mail::to("mbisd.2017@gmail.com")->send(new ContactMailable($request->fname,$request->lname, $request->sender, $request->number, $request->subject, $request->content)) ;
        return $request->sender ;
    }
    
    protected function validator(array $data)
    {
        $messages = [
            'fname.required' => '>Votre prénom est indispensable!',
            'fname.min' => 'Votre prénom doit inclure un minimum de 3 lettres!',
            'fname.max' => 'Votre prénom doit inclure un maximum de  25 lettres!',
            'fname.regex' => 'Votre prénom doit seulement inclure des lettres!',
            'lname.required' => 'Votre nom est indispensable!',
            'lname.min' => 'Votre nom doit inclure un minimum de 3 lettres!',
            'lname.max' => 'Votre nom doit inclure un maximum de  25 lettres!',
            'lname.regex' => 'Votre nom doit seulement inclure des lettres!',
            'sender.required' => 'Votre email est indispensable!',
            'sender.email' => "Cette adresse n'est pas valide!!",
            'subject.required' => 'Le sujet est indispensable!',
            'subject.min' => 'Le sujet doit inclure un minimum de 3 lettres!!',
            'subject.max' => 'Le sujet doit inclure un maximum de 40 lettres!',
            'content.required' => 'Le contenu est indispensable!',
            'content.min' => 'Le contenu doit inclure un minimum de 40 caractères!',
            'content.max' => 'Le contenu doit inclure un maximum de 200 caractères!',

        ];
        return Validator::make($data, [
            'fname' =>"bail|required|min:3|max:25|regex:'^[A-Za-z\']*$'",
            'lname' =>"bail|required|min:3|max:25|regex:'^[A-Za-z\']*$'",
            'sender'=>'bail|required|email',
            'number'=>'bail|required|numeric',
            'subject'=>"bail|required|min:3|max:40",
            'content'=>"bail|required|min:40|max:200"
        ],$messages);
    
    }
}
