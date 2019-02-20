<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class ContactMailable extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     *
     * @return void
     */
     protected $fname,$lname ;
    protected $sender, $number;
    protected $content;

    /**
     * Create a new message instance.
     *
     * @return void

     */
    public function __construct($fname, $lname, $sender, $number, $subject, $content)
    {
        $this->fname=$fname;    $this->lname=$lname;  $this->sender=$sender;   $this->number=$number; 
        $this->subject=$subject;    $this->content=$content;  
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
         $address = $this->sender;
        return $this->view('email.contactMail')
                    ->subject($this->subject)
                    ->from($address,ucfirst($this->lname).' '. ucfirst($this->fname))
                    ->with([
                        'fullName'=>ucfirst($this->lname).' '. ucfirst($this->fname) ,
                        'content'=>$this->content,
                        'number'=>$this->number
                        ]) ;
    }
}
