    //   $candidate->save();
            
	        /****Email******/
	    /*    $mailer = Mail::getSwiftMailer();

			$transport = Swift_SmtpTransport::newInstance('smtp.gmail.com', 587,'tls') ;
            $transport_user=Config::get('mail.mbisd_username') ;
            $transport_pass=Config::get('mail.mbisd_password') ;
			$transport->setUsername($transport_user) ;
			$transport->setPassword($transport_pass);

			$gmailer = new Swift_Mailer($transport);

			Mail::setSwiftMailer($gmailer);


            Mail::to($request->email)->send(new CandidatMailable($request->cne,$password)) ;
        */