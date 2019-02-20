<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class CandidatMailable extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    protected $username, $password ;
 

    /**
     * Create a new message instance.
     *
     * @return void

     */
    public function __construct($username, $password)
    {
        $this->username=$username;    $this->password=$password;
    }
   

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->view('email.candidatMail')
                    ->subject("Coordonées de la Candidature")
                    ->from("mbisd.2017@gmail.com","MBISD")
                    ->with([
                        'username'=>$this->username ,
                        'password'=>$this->password
                        ]) ;
    }
}
