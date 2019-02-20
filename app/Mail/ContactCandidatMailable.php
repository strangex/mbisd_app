<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class ContactCandidatMailable extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public  $subject, $content;
    
    public function __construct($subject, $content)
    {
       $this->subject=$subject; $this->content=$content;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->view('email.contactCandidatMail')
                    ->subject($this->subject)
                    ->from("mbisd.2017@gmail.com","MBISD")
                    ->with([
                        'content'=>$this->content,
                        ]) ;
    }
}
