<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class PasswordMailable extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    protected $token, $email ;
    
    public function __construct($email, $token)
    {
        $this->email=$email ;    $this->token=$token ;  
    }


    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
         $token = $this->token;
         $email = $this->email;

        return $this->view('email.resetMail')
                    ->subject("Password Reset")
                    ->from("mbisd.2017@gmail.com","MBISD")
                    ->with([
                        'token'=>$token ,
                        ]) ;
    }
}
