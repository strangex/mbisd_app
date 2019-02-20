<?php

namespace App\Http\Controllers;


use Config ;

class junk extends Controller
{
    public function test(){
            $transport_user=config('mail.mbisd_username') ;
            $transport_pass=config('mail.mbisd_password') ;
            echo  $transport_user ;
  		
  	}

    
  
}

	if($request->hasFile('avatar')){
 		   $credentials=$request->only('first_name','last_name','cin','cne','email','address','country','city','gender','home_number','gsm','birth_date','bac_date','bac_type','bac_note','bac2_uni','bac2_type','bac2_estab','bac2_date','bac2_note','bac2_note1','bac2_note2',
 			 	'bac2_note3','bac2_note4','bac3_date','bac3_type','bac3_uni','bac3_estab','bac3_note1'
 			 	,'bac3_note2','bac3_note','bac2_option','bac3_option'
 			 	) ;

 			 $validator=$this->validator($credentials) ;
 			 if($validator->fails()){    
		             $errors=$validator->errors();
		             return response()->json(compact('errors'),405) ; 
		     } 

            /*******Unique Constraints*********/
           $candidates=Candidat::select('cin','cne')->get() ;
            foreach($candidates as $candidate){
                   if($candidate->cin==$request->cin) {
                        $errors=collect(["uniqueCin"=>"Ce CIN est déjâ pris!"]);
                        return response()->json(compact('errors'),405) ; 
                    }
                    else  if($candidate->cne==$request->cne) {
                         $errors=collect(["uniqueCne"=>"Ce CNE email est déjâ pris!"]);
                        return response()->json(compact('errors'),405) ; 
                    }
            }

            $users=User::select('email')->get() ;
            foreach($users as $user){
                    $user->email=decrypt($user->email) ;
                    if($user->email==$request->email) {
                        $errors=collect(["uniqueCin"=>"Cette adresse email est déjâ pris!"]);
                        return response()->json(compact('errors'),405) ; 
                    }
                  
            }


            /*******User********/
            $user=new User ;
            $user->username=$request->cne ;
            $password = $this->generateCode();
            while (User::where('password',$password)->count() > 0) {
                $password = $this->generateCode();
            }
            $user->password=bcrypt($password) ;
            $user->email=encrypt($request->email) ;
            $user->flag=encrypt('candidate') ;
            $user->save() ;

            /*******Candidate*********/
 			 $candidate = new Candidat ;

             $candidate->user_id=$user->id ;
 			 $candidate->first_name=encrypt($request->first_name) ;	$candidate->phone=encrypt($request->home_number) ;
 			 $candidate->last_name=encrypt($request->last_name) ;	$candidate->gsm=encrypt($request->gsm) ;
 			 $candidate->gender=$request->gender ;			$candidate->country=encrypt($request->country) ;
 			 $candidate->cin=encrypt($request->cin) ;	  $candidate->city=encrypt($request->city) ;
 			 $candidate->cne=encrypt($request->cne) ;	   $candidate->address=encrypt($request->address) ;
 			 $candidate->birth_date=$request->birth_date ;
 			
 			/**/
 		 	 $candidate->bac_date=$request->bac_date ; $candidate->bac_type=$request->bac_type ;
 			 $candidate->bac_note=$request->bac_note ;
 			 /**/
             $candidate->bac2_option=$request->bac2_option ;
 		 	  $candidate->bac2_note1=$request->bac2_note1 ;	$candidate->bac2_university=$request->bac2_uni ;
 			 $candidate->bac2_note2=$request->bac2_note2 ;	$candidate->bac2_type=$request->bac2_type ;
 			 $candidate->bac2_note3=$request->bac2_note3 ;	$candidate->bac2_establishment=$request->bac2_estab ;
 			 $candidate->bac2_note4=$request->bac2_note4 ;	$candidate->bac2_date=$request->bac2_date ;
 			 $candidate->bac2_note=$request->bac2_note ;
 			 /**/
            $candidate->bac3_option=$request->bac3_option ;
 		 	  $candidate->bac3_type=$request->bac3_type ;
 			 $candidate->bac3_note1=$request->bac3_note1 ;	$candidate->bac3_university=$request->bac3_uni ;
 			 $candidate->bac3_note2=$request->bac3_note2 ;	$candidate->bac3_date=$request->bac3_date ;
 			 $candidate->bac3_note=$request->bac3_note ;	$candidate->bac3_establishment=$request->bac3_estab ;
 			
 			 /****Avatar****/

		 	$name=$request->avatar->getClientOriginalName() ;
	        $pfile = $request->file('avatar') ;
	        $path=Storage::disk('local')->putFile('avatars', $request->avatar, 'private');
	        $resize = Image::make($pfile)->fit(300)->encode('jpg');
	        Storage::disk('local')->put($path, $resize->__toString(), 'private');
	        $candidate->avatar=basename($path) ;
	 		
            $candidate->save();











MAILGUN_DOMAIN=sandbox86af8556a7bf489eaff2eb5baa29999c.mailgun.org
MAILGUN_SECRET=key-e98e643a26688f6a203f54c00b6c3898
MAIL_DRIVER=mailgun

MAIL_HOST=smtp.mailgun.org
MAIL_PORT=587
MAIL_USERNAME=postmaster@sandbox86af8556a7bf489eaff2eb5baa29999c.mailgun.org
MAIL_PASSWORD=46e3967b1ddc1bfbb99dfc179f0e51a8
MAIL_ENCRYPTION=tls


MAILGUN_DOMAIN=sandbox86af8556a7bf489eaff2eb5baa29999c.mailgun.org
MAILGUN_SECRET=key-e98e643a26688f6a203f54c00b6c3898
MAIL_DRIVER=mailgun
MAIL_HOST=smtp.mailgun.org
MAIL_PORT=587
MAIL_USERNAME=postmaster@sandbox86af8556a7bf489eaff2eb5baa29999c.mailgun.org
MAIL_PASSWORD=46e3967b1ddc1bfbb99dfc179f0e51a8
MAIL_ENCRYPTION=tls