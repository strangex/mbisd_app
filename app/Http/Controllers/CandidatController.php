<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Candidat ; use App\Student ; 
use Storage ;
use Image ;
use Mail ;
use App\Mail\CandidatMailable ;
use App\Mail\ContactCandidatMailable ;
use Swift_SmtpTransport, Swift_Mailer;
use Validator ;
use Excel ;
use Keygen;
use App\User ;
use Config ;
use App\Gear ;
use Hash ;
use Carbon\Carbon ;
use Zipper ;
use File ;


class CandidatController extends Controller
{
    public function __construct()
    {
       $this->middleware('jwt.auth', ['except' => ['store','getEverything']]);
       $this->middleware('role', ['except' => ['store','getEverything','update','getAvatar','storeFile']]);
       
    }
    public function candidatesFiltredList($number,$verified, $bacType,$bac2Type,$bac3Type,$bac3Option){
           if($verified=='false'){
                  $candidates = Candidat::select(
                    "first_name", "last_name", "cin", "cne", "birth_date", 
                    "gender", "gsm", "phone", "address", "city","country", 

                    "bac_date","bac_note","bac_type", 

                    "bac2_date","bac2_note", "bac2_note1", "bac2_note2", "bac2_note3", "bac2_note4",
                    "bac2_university",  "bac2_type", "bac2_establishment",  "bac2_option",

                    "bac3_date","bac3_note", "bac3_note1", "bac3_note2", 
                    "bac3_university",  "bac3_type", "bac3_establishment", \DB::raw("LOWER(bac3_option) as bac3_option"),
                    
                    "score", "created_at")
                ->orderBy('score', 'desc')
                ->take($number)
                ->get() ;
            }else{
                $candidates = Candidat::select(
                    "first_name", "last_name", "cin", "cne", "birth_date", 
                    "gender", "gsm", "phone", "address", "city","country", 

                    "bac_date","bac_note","bac_type", 

                    "bac2_date","bac2_note", "bac2_note1", "bac2_note2", "bac2_note3", "bac2_note4",
                    "bac2_university",  "bac2_type", "bac2_establishment",  "bac2_option",

                    "bac3_date","bac3_note", "bac3_note1", "bac3_note2", 
                    "bac3_university",  "bac3_type", "bac3_establishment", \DB::raw("LOWER(bac3_option) as bac3_option"),
                    
                    "score", "created_at")
                ->where('verified',1)
                ->orderBy('score', 'desc')
                  ->take($number)
                ->get() ;
            }
            if($bacType!='null'){
                $bacType=collect(explode(",",$bacType)) ;
                $candidates=$candidates->whereIn('bac_type',$bacType) ;
            }
            if($bac2Type!='null'){
                $bac2Type=collect(explode(",",$bac2Type)) ;
                $candidates=$candidates->whereIn('bac2_type',$bac2Type) ;
            }
            if($bac3Type!='null'){
                $bac3Type=collect(explode(",",$bac3Type)) ;
                $candidates=$candidates->whereIn('bac3_type',$bac3Type) ;
            }   
            
            if($bac3Option!='null'){
                $bac3Option=collect(explode(",",strtolower($bac3Option))) ;
                $candidates=$candidates->whereIn('bac3_option',$bac3Option) ;
            }   
      
        Excel::create('Candidates List', function($excel) use ($candidates) {
            // Set the title
            $excel->setTitle('Accepted Candidates List');
            $excel->setCreator('MBISD')
                  ->setCompany('MBISD');

            $excel->setDescription('The list of all candidates.');

            $excel->sheet('list', function($sheet) use ($candidates) {
                $sheet->fromArray($candidates);
            }) ;
        })->export('xlsx');
    }


    public function regulate(){
        $candidates = Candidat::all() ;
        foreach ($candidates as $candidate) {
             $candidate->score=($candidate->score*50)/(21.5) ;
             $candidate->save() ;
        }
        return Candidat::all() ;
    }

    public function verified(Request $request){
        $selection=$request->selection ;
        $set=collect(explode(",",$request->cneSet)) ;
        if($selection=='false'){
            $candidates = Candidat::all() ;
            foreach ($candidates as $candidate) {
                    if($set->contains($candidate->cne)){
                        $candidate->verified=1 ;
                        $candidate->save() ;
                    }
            }
            return response('candidates verified',200) ;
        }else{
            $candidates = Candidat::all() ;
            foreach ($candidates as $candidate) {
                    if($set->contains($candidate->cne)){

                        $student = new Student ;
                        $student->registration_year=$request->year ;
                        $student->user_id=$candidate->user_id ;
                        $student->avatar=$candidate->avatar ; $student->infos=$candidate->infos ;
                        $student->cin=$candidate->cin ; $student->cne=$candidate->cne ;
                        $student->first_name=$candidate->first_name ; $student->last_name=$candidate->last_name ;
                        $student->birth_date=$candidate->birth_date ;
                        $student->gender=$candidate->gender ;
                        $student->gsm=$candidate->gsm ; $student->phone=$candidate->phone ;
                        $student->address=$candidate->address ; $student->city=$candidate->city ; $student->country=$candidate->country ;
                        $student->bac_date=$candidate->bac_date ; $student->bac_type=$candidate->bac_type ; $student->bac_note=$candidate->bac_note ;
                        $student->bac2_type=$candidate->bac2_type ;
                        
                        $student->bac2_university=$candidate->bac2_university ; $student->bac2_establishment=$candidate->bac2_establishment ; $student->bac2_date=$candidate->bac2_date ; $student->bac2_note1=$candidate->bac2_note1 ; $student->bac2_note2=$candidate->bac2_note2 ; $student->bac2_note3=$candidate->bac2_note3 ; $student->bac2_note4=$candidate->bac2_note4 ; $student->bac2_note=$candidate->bac2_note ; $student->bac2_option=$candidate->bac2_option ;

                        $student->bac3_university=$candidate->bac3_university ; $student->bac3_establishment=$candidate->bac3_establishment ; $student->bac3_date=$candidate->bac3_date ; $student->bac3_note1=$candidate->bac3_note1 ; $student->bac3_note2=$candidate->bac3_note2 ; $student->bac3_note=$candidate->bac3_note ; $student->bac3_option=$candidate->bac3_option ; $student->bac3_type=$candidate->bac3_type ;

                        $student->score=$candidate->score ; 
                        $student->save() ;
                        $candidate->student=1 ;
                        $candidate->save() ;
                    }
            }
            return response('students registred',200) ;
        }
    }




    public function reinitialize(){
        Candidat::where('verified', 1)
          ->update(['verified' => 0]);
        return response('candidates reinitialized',200) ;
    }


    public function contact(Request $request){

        $credentials=$request->only('subject','content','email') ;
        $validator=$this->evalidator($credentials) ;
        if($validator->fails()){    
                 $errors=$validator->errors();
                 return response()->json(compact('errors'),405) ; 
        } 
        Config::set('mail.driver','mail') ;
        Mail::to($request->email)->send(new ContactCandidatMailable($request->subject, $request->content)) ;
        if( count(Mail::failures()) > 0 ) {
            $errors=collect(["mail"=>"Erreur d'envoi!!"]);
            return response()->json(compact('errors'),405) ; 
        }
        return response("email sent",200) ;
    }

    protected function evalidator(array $data)
    {
         $messages = [
            'subject.required' => '>Le sujet est indispensable!',
            'subject.min' => 'Le sujet doit inclure un minimum de 3 caractères!',
            'subject.max' => 'Le sujet doit inclure un maximum de  40 caractères!',
            'content.required' => '>Le contenu est indispensable!',
            'content.min' => 'Le contenu doit inclure un minimum de 40 caractères!',
            'content.max' => 'Le contenu doit inclure un maximum de  1000 caractères!',
            'cne.numeric' => 'Votre cne doit seulement inclure des chiffres!',
            'email.required' => "l'email est indispensable!",
            'email.email' => "Cette adresse n'est pas valide!!"
        ];
        return Validator::make($data, [
            'subject' =>'bail|required|min:3|max:40',
            'content' => 'bail|required|min:40|max:1000',
            'email' => 'bail|required|email'
        ],$messages);  
    }

    public function types(){
        $types=collect();
        $bac3_options=Candidat::select(\DB::raw("bac3_option as name"),\DB::raw("bac3_type as type"))->distinct()->get() ;

        $bac3_labels=Candidat::select(\DB::raw("bac3_type as name"))->distinct()->get() ;
        $bac2_labels=Candidat::select(\DB::raw("bac2_type as name"))->distinct()->get() ;
        $bac_labels=Candidat::select(\DB::raw("bac_type as name"))->distinct()->get() ;

        $types->put("bac3_option",$bac3_options) ;
        $types->put("bac3_type",$bac3_labels) ;
        $types->put("bac2_type",$bac2_labels) ;
        $types->put("bac_type",$bac_labels) ;

        return $types ;
    }
    public function convert(Request $request){
        $fields=collect(explode(",",$request->fields)) ;
        $candidates=Candidat::all() ;
        foreach ($candidates as $candidate) {
            if($request->state=='one'){
                if($fields->contains($candidate->bac_type)){
                    $candidate->bac_type=$request->label ;
                }
            
            }else{
               if($request->state=='two'){
                     if($fields->contains($candidate->bac2_type)){
                          $candidate->bac2_type=$request->label ;
                     }
               }else{
                if($request->state=='three'){
                     if($fields->contains($candidate->bac3_type)){
                            $candidate->bac3_type=$request->label ;
                    }
                }
                }
            }
            $candidate->save() ;
            
        }
        return response("conversion achieved",200) ;
    }

    public function statistics(){
        $types=collect();
        $series=['Masculin','Féminin'] ;

        $bac3_type_m=Candidat::select([\DB::raw('bac3_type as label'), \DB::raw('count(*) as value')])->groupBy('bac3_type')->where("gender",1)->get() ;
        $bac2_type_m=Candidat::select([\DB::raw('bac2_type as label'), \DB::raw('count(*) as value')])->groupBy('bac2_type')->where("gender",1)->get() ;
        $bac_type_m=Candidat::select([\DB::raw('bac_type as label'), \DB::raw('count(*) as value')])->groupBy('bac_type')->where("gender",1)->get() ;

        $bac3_type_f=Candidat::select([\DB::raw('bac3_type as label'), \DB::raw('count(*) as value')])->groupBy('bac3_type')->where("gender",0)->get() ;
        $bac2_type_f=Candidat::select([\DB::raw('bac2_type as label'), \DB::raw('count(*) as value')])->groupBy('bac2_type')->where("gender",0)->get() ;
        $bac_type_f=Candidat::select([\DB::raw('bac_type as label'), \DB::raw('count(*) as value')])->groupBy('bac_type')->where("gender",0)->get() ;
        
        $bac3_labels=Candidat::select("bac3_type")->distinct()->get() ;
        $bac2_labels=Candidat::select("bac2_type")->distinct()->get() ;
        $bac_labels=Candidat::select("bac_type")->distinct()->get() ;

        $bac3_labels=$bac3_labels->pluck("bac3_type") ;
        $bac2_labels=$bac2_labels->pluck("bac2_type") ;
        $bac_labels=$bac_labels->pluck("bac_type") ;

        /********bac3-data*******/
        $bac3_data_m=[] ;
        $bac3_data_f=[] ;
        $i=0 ;
        foreach($bac3_labels as $bac3){
            $val= $bac3_type_m->where('label',$bac3)->pluck("value")->get(0) ;
            if($val==null){
                $val=0 ;
            }
            $bac3_data_m[$i]=$val ;
            $val= $bac3_type_f->where('label',$bac3)->pluck("value")->get(0) ;
            if($val==null){
                $val=0 ;
            }
            $bac3_data_f[$i]=$val ;

            $i=$i+1 ;
        } 
        /********bac2-data*******/
        $bac2_data_m=[] ;
        $bac2_data_f=[] ;
        $i=0 ;
        foreach($bac2_labels as $bac2){
            $val= $bac2_type_m->where('label',$bac2)->pluck("value")->get(0) ;
            if($val==null){
                $val=0 ;
            }
            $bac2_data_m[$i]=$val ;
            $val= $bac2_type_f->where('label',$bac2)->pluck("value")->get(0) ;
            if($val==null){
                $val=0 ;
            }
            $bac2_data_f[$i]=$val ;

            $i=$i+1 ;
        }
         /********bac-data*******/
        $bac_data_m=[] ;
        $bac_data_f=[] ;
        $i=0 ;
        foreach($bac_labels as $bac){
            $val= $bac_type_m->where('label',$bac)->pluck("value")->get(0) ;
            if($val==null){
                $val=0 ;
            }
            $bac_data_m[$i]=$val ;
            $val= $bac_type_f->where('label',$bac)->pluck("value")->get(0) ;
            if($val==null){
                $val=0 ;
            }
            $bac_data_f[$i]=$val ;
            $i=$i+1 ;
        }

        
        $bac3_type=Candidat::select([\DB::raw('bac3_type as label'), \DB::raw('count(*) as value')])->groupBy('bac3_type')->get() ;

        $bac2_type=Candidat::select([\DB::raw('bac2_type as label'), \DB::raw('count(*) as value')])->groupBy('bac2_type')->get() ;

        $bac_type=Candidat::select([\DB::raw('bac_type as label'), \DB::raw('count(*) as value')])->groupBy('bac_type')->get() ;

        /*******/
        $bac3_gender=collect() ;
        $bac3_gender->put("m",$bac3_data_m) ;
        $bac3_gender->put("f",$bac3_data_f) ;
        $bac3_gender->put("labels",$bac3_labels) ;
        /*******/
        $bac2_gender=collect() ;
        $bac2_gender->put("m",$bac2_data_m) ;
        $bac2_gender->put("f",$bac2_data_f) ;
        $bac2_gender->put("labels",$bac2_labels) ;

        /*******/
        $bac_gender=collect() ;
        $bac_gender->put("m",$bac_data_m) ;
        $bac_gender->put("f",$bac_data_f) ;
        $bac_gender->put("labels",$bac_labels) ;


        $gdata=collect() ;
        $gdata->put("bac3G",$bac3_gender) ;
        $gdata->put("bac2G",$bac2_gender) ;
        $gdata->put("bacG",$bac_gender) ;

        $gdata->put("series",$series) ;

        $ndata=collect() ;
        
        $ndata->put("bac3_type",$bac3_type) ;
        $ndata->put("bac2_type",$bac2_type) ;
        $ndata->put("bac_type",$bac_type) ;

        $data=collect() ;
        $data->put("ndata",$ndata) ;
        $data->put("gdata",$gdata) ;

        return $data ;       
    }

    public function getEverything(){
           $candidate=Candidat::select("*")
                            ->where('cin','BB114455')
                            ->get();

           return $candidate ;
    }


    public function zipFiles($number){
        $candidates=Candidat::select("*")
                            ->whereNotNull("infos")
                            ->orderBy('score', 'desc')
                            ->take($number)
                            ->get();
        if(File::isDirectory(storage_path("app/public/tmp"))){
               File::deleteDirectory(storage_path("app/public/tmp"));
        } 
        File::makeDirectory(storage_path("app/public/tmp"));

        foreach ($candidates as $candidate) {
            $file=storage_path("app/private/infos/".$candidate->infos) ;
            if(File::exists($file)){
                $type=File::extension($file) ;
                File::copy($file, storage_path("app/public/tmp/".$candidate->first_name."_".$candidate->last_name.".".$type)) ;

            }     
         }

        if(File::exists(storage_path("app/public/tmp.zip"))){
           File::delete(storage_path("app/public/tmp.zip")) ;
        }  

        Zipper::make(storage_path("app/public/tmp.zip"))->add(storage_path("app/public/tmp/"))->close();

        File::deleteDirectory(storage_path("app/public/tmp"));
        
        return response()->download(storage_path("app/public/tmp.zip"));
    }

     public function uzip($cne){
        $candidates=Candidat::all() ;
        
        if(File::isDirectory(storage_path("app/public/tmp"))){
               File::deleteDirectory(storage_path("app/public/tmp"));
        } 
        File::makeDirectory(storage_path("app/public/tmp"));

        $flag=0 ;
        foreach ($candidates as $candidate) {
            if($candidate->cne==$cne){
                $file=storage_path("app/private/infos/".$candidate->infos) ;
                if(File::exists($file)){
                    $type=File::extension($file) ;
                    File::copy($file, storage_path("app/public/tmp/".$candidate->first_name."_".$candidate->last_name.".".$type)) ;
                    $flag=1 ;
                }else{
                    $errors=collect(["file"=>"Fichier de Candidature introuvable!!"]);
                    return response()->json(compact('errors'),405) ; 
                }   
            }
        }

        if(File::exists(storage_path("app/public/tmp.zip"))){
           File::delete(storage_path("app/public/tmp.zip")) ;
        }  
        if($flag==1){
            Zipper::make(storage_path("app/public/tmp.zip"))->add(storage_path("app/public/tmp/"))->close();
            File::deleteDirectory(storage_path("app/public/tmp"));
            return response()->download(storage_path("app/public/tmp.zip"));

        }
        File::deleteDirectory(storage_path("app/public/tmp"));
        $errors=collect(["user"=>"CNE non Valide!!"]);
        return response()->json(compact('errors'),405) ; 

    }

    public function computeScore(){
        $candidates=Candidat::all() ;
        foreach ($candidates as $candidate) {
            $tmp=0 ;
            //bac 
            if($candidate->bac_note<12){
                $tmp=$tmp+0 ;
            }else{
                if($candidate->bac_note<14){
                    $tmp=$tmp+1 ;
                }else{
                    if($candidate->bac_note<16){
                        $tmp=$tmp+2 ;
                    }else{
                            $tmp=$tmp+4 ;
                    }
                }
            }
            //bac2
            if($candidate->bac2_note<12){
                $tmp=$tmp+0 ;
            }else{
                if($candidate->bac2_note<14){
                    $tmp=$tmp+1 ;
                }else{
                    if($candidate->bac2_note<16){
                        $tmp=$tmp+2 ;
                    }else{
                            $tmp=$tmp+4 ;
                    }
                }
            }
            
            if($candidate->bac2_type=="DEUG"){
                $tmp=$tmp+3 ;
            }else{
                if($candidate->bac2_type=="DEUST"){
                    $tmp=$tmp+2 ;
                }else{                                 
                        $tmp=$tmp+1 ;
                }
            }

            //bac3
            if($candidate->bac3_note<12){
                $tmp=$tmp+0 ;
            }else{
                if($candidate->bac3_note<14){
                    $tmp=$tmp+1 ;
                }else{
                    if($candidate->bac3_note<16){
                        $tmp=$tmp+2 ;
                    }else{
                            $tmp=$tmp+4 ;
                    }
                }
            }
            
            if($candidate->bac3_type=="Licence Fondamentale"){
                $tmp=$tmp+3 ;
            }else{
                if($candidate->bac3_type=="Licence des Sciences et Techniques"){
                    $tmp=$tmp+2 ;
                }else{
                    $tmp=$tmp+0 ;
                }
            }


            if($candidate->bac3_university=="Université Hassan I"){
                $tmp=$tmp+0.5 ;
            }else{
                 if($candidate->bac3_university=="Université Abdelmalek Essaadi"){
                      $tmp=$tmp+1 ;
                 }else{
                      $tmp=$tmp+1.5 ;
                 }
            }


            $age=Carbon::parse($candidate->birth_date)->diffInYears(Carbon::now());
            if($age==21){
                $tmp=$tmp+2 ;
            }else{
                 if($age==22){
                      $tmp=$tmp+1 ;
                 }else{
                      $tmp=$tmp+0 ;
                 }
            }

            $candidate->score=$tmp ;
            $candidate->save() ;
         }

         return response("achieved",200) ;
    }
    public function update(Request $request){
       $candidate = Candidat::find($request->user_id);
       if($request->fname){
            $candidate->first_name=encrypt($request->fname) ;
        }
         if($request->lname){
            $candidate->last_name=encrypt($request->lname) ;
        }
         if($request->cne){
            $candidate->cne=encrypt($request->cne) ;
        }
         if($request->cin){
            $candidate->cin=encrypt($request->cin) ;
        }
         if($request->bacNote){
            $candidate->bac_note=$request->bacNote ;
        }
          if($request->bac2Note){
            $candidate->bac2_note=$request->bac2Note;
        }
          if($request->bac3Note){
            $candidate->bac3_note=$request->bac3Note;
        }
        if($request->bac2Note1){
            $candidate->bac2_note1=$request->bac2Note1 ;
        }
         if($request->bac2Note2){
            $candidate->bac2_note2=$request->bac2Note2 ;
        }
         if($request->bac2Note3){
            $candidate->bac2_note3=$request->bac2Note3 ;
        }
         if($request->bac2Note4){
            $candidate->bac2_note4=$request->bac2Note4 ;
        }
        if($request->bac3Note1){
            $candidate->bac3_note1=$request->bac3Note1 ;
        }
          if($request->bac3Note2){
            $candidate->bac3_note2=$request->bac3Note2 ;
        }
         if($request->bdate){
            $candidate->birth_date=$request->bdate ;
        }
        if($request->bacDate){
            $candidate->bac_date=$request->bacDate ;
        }
        if($request->bac2Date){
            $candidate->bac2_date=$request->bac2Date ;
        }
        if($request->bac3Date){
            $candidate->bac3_date=$request->bac3Date ;
        }
         if($request->adresse){
            $candidate->address=encrypt($request->adresse) ;
        }
        if($request->bac2Option){
            $candidate->bac2_option=$request->bac2Option ;
        }
        if($request->bac3Option){
            $candidate->bac3_option=$request->bac3Option ;
        }
        if($request->bacType){
            $candidate->bac_type=$request->bacType ;
        }
        if($request->bac2Type){
            $candidate->bac2_type=$request->bac2Type ;
        }
         if($request->bac3Type){
            $candidate->bac3_type=$request->bac3Type ;
        }
        
        if($request->bac2Uni){
            $candidate->bac2_university=$request->bac2Uni ;
        }
        if($request->bac2Estab){
            $candidate->bac2_establishment=$request->bac2Estab ;
        }
         if($request->bac3Uni){
            $candidate->bac3_university=$request->bac3Uni ;
        }
        if($request->bac3Estab){
            $candidate->bac3_establishment=$request->bac3Estab ;
        }
        if($request->phone){
            $candidate->phone=encrypt($request->phone) ;
        }
        if($request->gsm){
            $candidate->gsm=encrypt($request->gsm) ;
        }
        if($request->city){
            $candidate->city=encrypt($request->city) ;
        }
        if($request->country){
            $candidate->country=encrypt($request->country) ;
        }
        if($request->sex=='0' || $request->sex=='1'){
             $candidate->gender=$request->sex ; 
        }
        if($request->hasFile('avatar')){
            Storage::disk('local')->delete("avatars/".$candidate->avatar) ;

            $name=$request->avatar->getClientOriginalName() ;
            $pfile = $request->file('avatar') ;
            $path=Storage::disk('local')->putFile('avatars', $request->avatar, 'private');
            $resize = Image::make($pfile)->fit(300)->encode('jpg');
            Storage::disk('local')->put($path, $resize->__toString(), 'private');
            $candidate->avatar=basename($path) ;
        }

        $candidate->save() ;

        $userInf=User::find($request->user_id)->userType ;
        return $userInf ;
    }
    public function storeFile(Request $request){
        if($request->hasFile('file')){
            $candidate = Candidat::find($request->userId) ;
           
            if($candidate->infos!=null){
                Storage::disk('local')->delete("infos/".$candidate->infos) ;
            }
            
            $path=Storage::disk('local')->putFile('infos', $request->file, 'private');
            
            $candidate->infos=basename($path) ;
            $candidate->save() ;

            $userInf=User::find($request->userId)->userType ;
            return $userInf ;

        }
        else{
                $errors=collect(["file"=>"File Hasn't Been Uploaded!"]);
                return response()->json(compact('errors'),405) ; 
        }
    }

 	public function getCandidates(){
        $candidates = Candidat::all();
        return $candidates ;
    }


    public function getAvatar($avatar){
        $contents = Storage::disk('local')->get("avatars/".$avatar);
        return $contents;
    }


    public function candidatesList($number,$flag,$score){
        if($flag=='true'){
            if($score=='true'){
                  $candidates = Candidat::select("first_name", "last_name" ,"cin","cne","score")
                                ->whereNotNull("infos")
                                ->orderBy('score', 'desc')
                                ->take($number)
                                ->get();
            }else{
                $candidates = Candidat::select("first_name", "last_name" ,"cin","cne")
                                ->whereNotNull("infos")
                                ->orderBy('score', 'desc')
                                ->take($number)
                                ->get();
            }
          
            $format='pdf' ;
        }else{
             if($score=='true'){
                 $candidates = Candidat::select(
                    "first_name", "last_name" ,"cin","cne","birth_date", 
                    "gender", "gsm", "phone", "address", "city","country", 

                    "bac_date","bac_note","bac_type", 

                    "bac2_date","bac2_note", "bac2_note1", "bac2_note2", "bac2_note3", "bac2_note4",
                    "bac2_university",  "bac2_type", "bac2_establishment",  "bac2_option",

                    "bac3_date","bac3_note", "bac3_note1", "bac3_note2", 
                    "bac3_university",  "bac3_type", "bac3_establishment", "bac3_option",

                    "score")
                    ->whereNotNull("infos")
                    ->orderBy('score', 'desc')
                    ->take($number)
                    ->get();
            }else{
                    $candidates = Candidat::select(
                            "first_name", "last_name" ,"cin","cne","birth_date", 
                            "gender", "gsm", "phone", "address", "city","country", 

                            "bac_date","bac_note","bac_type", 

                            "bac2_date","bac2_note", "bac2_note1", "bac2_note2", "bac2_note3", "bac2_note4",
                            "bac2_university",  "bac2_type", "bac2_establishment",  "bac2_option",

                            "bac3_date","bac3_note", "bac3_note1", "bac3_note2", 
                            "bac3_university",  "bac3_type", "bac3_establishment"
                        )
                        ->whereNotNull("infos")
                        ->orderBy('score', 'desc')
                        ->take($number)
                        ->get();
            }
       
             $format='xlsx' ;
        }

        Excel::create('Candidates List', function($excel) use ($candidates,$format) {
            // Set the title
            $excel->setTitle('Accepted Candidates List');

            // Chain the setters
            $excel->setCreator('MBISD')
                  ->setCompany('MBISD');

            // Call them separately
            $excel->setDescription('The list of selected candidates which will go through the evaluation.');

            $excel->sheet('list', function($sheet) use ( $candidates,$format) {

                $sheet->fromArray($candidates);
                if($format=='pdf'){
                      $sheet->row(1, array(
                      'Prénom', 'Nom','CIN' ,'CNE'
                        ));
                    
                        $sheet->row(1, function($row) {
                             $row->setBackground('#74dec2');
                             $row->setFontWeight('bold');
                        });
                       $sheet->setWidth(array(
                            'A'     =>  15,
                            'B'     =>  15,
                            'C' =>20,
                            'D' =>20
                        ));
                }
              
            });

        })->export($format);
    }

      public function candidatesFullList($number, $tdate){
            
            if($tdate=='true'){
                  $candidates = Candidat::select(
                    "first_name", "last_name", "cin", "cne", "birth_date", 
                    "gender", "gsm", "phone", "address", "city","country", 

                    "bac_date","bac_note","bac_type", 

                    "bac2_date","bac2_note", "bac2_note1", "bac2_note2", "bac2_note3", "bac2_note4",
                    "bac2_university",  "bac2_type", "bac2_establishment",  "bac2_option",

                    "bac3_date","bac3_note", "bac3_note1", "bac3_note2", 
                    "bac3_university",  "bac3_type", "bac3_establishment", "bac3_option",
                    
                    "score", "created_at")
                ->take($number)
                ->orderBy("created_at",'asc')
                ->get();
            }else{
                $candidates = Candidat::select(
                    "first_name", "last_name", "cin", "cne", "birth_date", 
                    "gender", "gsm", "phone", "address", "city","country", 

                    "bac_date","bac_note","bac_type", 

                    "bac2_date","bac2_note", "bac2_note1", "bac2_note2", "bac2_note3", "bac2_note4",
                    "bac2_university",  "bac2_type", "bac2_establishment",  "bac2_option",

                    "bac3_date","bac3_note", "bac3_note1", "bac3_note2", 
                    "bac3_university",  "bac3_type", "bac3_establishment", "bac3_option",
                    
                    "score", "created_at")
                ->take($number)
                ->orderBy("score",'desc')
                ->get();
            }

        Excel::create('Candidates List', function($excel) use ($candidates) {
            // Set the title
            $excel->setTitle('Accepted Candidates List');
            $excel->setCreator('MBISD')
                  ->setCompany('MBISD');

            $excel->setDescription('The list of all candidates.');

            $excel->sheet('list', function($sheet) use ($candidates) {
                $sheet->fromArray($candidates);
            }) ;
        })->export('xlsx');
    }
    
 	public function store(Request $request){
 		
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
            $candidates=Candidat::all() ;
            foreach ($candidates as $value) {
               if($request->input('cin')==$value->cin){
                    $errors=collect(["uniqueCin"=>"Ce CIN est déjâ pris!"]);
                    return response()->json(compact('errors'),405) ; 
               }
            }     
            
            $cne=User::where('username', $request->input('cne'))->first();
            if($cne){
                    $errors=collect(["uniqueCne"=>"Ce CNE est déjâ pris!"]);
                    return response()->json(compact('errors'),405) ; 
            }

        
            $user = User::where('email', $request->input('email'))->first();
            if($user){
                 $errors=collect(["uniqueEmail"=>"Cette adresse email est déjâ prise!"]);
                 return response()->json(compact('errors'),405) ; 
            }


            /*******User********/
            $user=new User ;
            $user->username=$request->cne ;
            $password = $this->generateCode();
            while (User::where('password',$password)->count() > 0) {
                $password = $this->generateCode();
            }
            $user->password=bcrypt($password) ;
            $user->email=$request->email ;
            $user->flag=encrypt('candidate') ;
           // $user->save() ;

            /*******Candidate*********/
 			 $candidate = new Candidat ;

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
	 		
            if(!$user->save()){
                $errors=collect(["user"=>"Problème d'enregistrement des données utilisateurs, si ce problème persiste veuillez nous contacter."]);
                return response()->json(compact('errors'),405) ; 
            }else{
                 $candidate->user_id=$user->id ;
                 if(!$candidate->save()){
                    User::destroy($user->id) ;
                    $errors=collect(["user"=>"Problème d'enregistrement des données de utilisateurs, si ce problème persiste veuillez nous contacter."]);
                    return response()->json(compact('errors'),405) ; 
                  }else{
                     /****Email******/
                        Config::set('mail.driver','mail') ;
                        Mail::to($request->email)->send(new CandidatMailable($request->cne,$password)) ;
                        if( count(Mail::failures()) > 0 ) {
                            Candidat::destroy($candidate->id) ;
                            User::destroy($user->id) ;
                            $errors=collect(["mail"=>"Erreur dans la configuration du mail, si ce problème persiste veuillez nous contacter."]);
                            return response()->json(compact('errors'),405) ; 
                        }
                  }

            }
            return response('sended',200) ; 
     
 		 }
 		 else{
 		 		$errors=collect(["avatar"=>"Veuillez ajouter votre image de profil!"]);
				return response()->json(compact('errors'),405) ; 
		 }
  		
  	}


      protected function generateCode()
    {
        return Keygen::bytes()->generate(
            function($key) {
                // Generate a random numeric key
                $random = Keygen::numeric()->generate();

                // Manipulate the random bytes with the numeric key
                return substr(md5($key . $random . strrev($key)), mt_rand(0,8), 20);
            },
            function($key) {
                // Add a (-) after every fourth character in the key
                return join('_', str_split($key, 4));
            },
            'strtoupper'
        );
    }

  	protected function validator(array $data)
    {
         $messages = [
            'first_name.required' => '>Votre prénom est indispensable!',
            'first_name.min' => 'Votre prénom doit inclure un minimum de 3 lettres!',
            'first_name.max' => 'Votre prénom doit inclure un maximum de  25 lettres!',
            'first_name.alpha' => 'Votre nom doit seulement inclure des lettres!',
            'last_name.required' => 'Votre nom est indispensable!',
            'last_name.min' => 'Votre nom doit inclure un minimum de 3 lettres!',
            'last_name.max' => 'Votre nom doit inclure un maximum de  25 lettres!',
            'last_name.alpha' => 'Votre nom doit seulement inclure des lettres!',
            'cin.required' => 'Votre cin est indispensable!',
            'cin.min' => 'Votre cin doit avoir une longueur minimale de 4 caractères!',
            'cin.max' => 'Votre cin doit avoir une longueur maximale de 20 caractères!',
            'cin.regex' => 'Votre cin doit seulement inclure des lettres ou des chiffres!',
            'cne.required' => 'Votre cne est indispensable!',
            'cne.min' => 'Votre cne doit avoir une longueur exacte de 10 caractères!',
            'cne.max' => 'Votre cne doit avoir une longueur exacte de 10 caractères!',
            'cne.numeric' => 'Votre cne doit seulement inclure des chiffres!',
            'email.required' => 'Votre email est indispensable!',
            'email.email' => "Cette adresse n'est pas valide!!",
            'address.required' => 'Votre address est indispensable!',
            'address.min' => 'Votre address doit avoir une longueur minimale de 10 caractères!',
            'address.max' => 'Votre cin doit avoir une longueur maximale de 50 caractères!',
            'bac2_option.required' => "L'option est indispensable!",
            'bac2_option.min' => "L'option doit avoir une longueur minimale de 5 caractères!",
            'bac2_option.max' => "L'option doit avoir une longueur maximale de 50 caractères!",
            'bac3_option.required' => "L'option est indispensable!",
            'bac3_option.min' => "L'option doit avoir une longueur minimale de 5 caractères!",
            'bac3_option.max' => "L'option doit avoir une longueur maximale de 50 caractères!",

            'bac_note.required' => "La note est indispensable!",
            'bac_note.min' => "La note doit être supérieure ou égale à 10!",
            'bac_note.max' => "La note doit être inférieure ou égale à 20!",
            'bac_note.numeric' => "Ce champ est numérique!",
            'bac2_note.required' =>  "La note est indispensable!",
            'bac2_note.min' => "La note doit être supérieure ou égale à 10!",
            'bac2_note.max' => "La note doit être inférieure ou égale à 20!",
            'bac2_note.numeric' => "Ce champ est numérique!",
            'bac2_note1.required' =>  "La note est indispensable!",
            'bac2_note1.min' => "La note doit être supérieure ou égale à 10!",
            'bac2_note1.max' => "La note doit être inférieure ou égale à 20!",
            'bac2_note1.numeric' => "Ce champ est numérique!",
            'bac2_note2.required' =>  "La note est indispensable!",
            'bac2_note2.min' => "La note doit être supérieure ou égale à 10!",
            'bac2_note2.max' => "La note doit être inférieure ou égale à 20!",
            'bac2_note2.numeric' => "Ce champ est numérique!",
            'bac2_note3.required' =>  "La note est indispensable!",
            'bac2_note3.min' => "La note doit être supérieure ou égale à 10!",
            'bac2_note3.max' => "La note doit être inférieure ou égale à 20!",
            'bac2_note3.numeric' => "Ce champ est numérique!",
            'bac2_note4.required' =>  "La note est indispensable!",
            'bac2_note4.min' => "La note doit être supérieure ou égale à 10!",
            'bac2_note4.max' => "La note doit être inférieure ou égale à 20!",
            'bac2_note4.numeric' => "Ce champ est numérique!",
            'bac3_note.required' =>  "La note est indispensable!",
            'bac3_note.min' => "La note doit être supérieure ou égale à 10!",
            'bac3_note.max' => "La note doit être inférieure ou égale à 20!",
            'bac3_note.numeric' => "Ce champ est numérique!",
            'bac3_note1.required' =>  "La note est indispensable!",
            'bac3_note1.min' => "La note doit être supérieure ou égale à 10!",
            'bac3_note1.max' => "La note doit être inférieure ou égale à 20!",
            'bac3_note1.numeric' => "Ce champ est numérique!",
            'bac3_note2.required' =>  "La note est indispensable!",
            'bac3_note2.min' => "La note doit être supérieure ou égale à 10!",
            'bac3_note2.max' => "La note doit être inférieure ou égale à 20!",
            'bac3_note2.numeric' => "Ce champ est numérique!",
            

            'birth_date.required' => 'La date de naissance est indispensable!',
            'birth_date.date' => 'Ce champ est une date!',

            'bac_date.required' => 'La date du bac est indispensable!',
            'bac_date.date' =>  'Ce champ est une date!',

            'bac2_date.required' => 'La date du bac+2 indispensable!',
            'bac2_date.date' => 'Ce champ est une date!',

            'bac3_date.required' => 'La date du bac+3 est indispensable!',
            'bac3_date.date' =>  'Ce champ est une date!',

            'country.required' => 'Votre pays est indispensable!',
            'city.required' => 'Votre ville est indispensable!',
            'gender.required' => 'Votre sexe est indispensable!',
            'gsm.required' => 'Votre GSM est indispensable!',
            'home_number.required' => 'Votre FIX est indispensable!',
            'bac_type.required' => 'Le type est indispensable!',
            'home_number.required' => 'Votre email est indispensable!',
            'bac2_type.required' => 'Le type est indispensable!',
            'bac2_uni.required' => "L'université est indispensable!",
            'bac2_estab.required' =>  "L'établissement est indispensable!",
            'bac3_type.required' => 'Le type est indispensable!',
            'bac3_uni.required' => "L'université est indispensable!",
            'bac3_estab.required' => "L'établissement est indispensable!",

        ];


        return Validator::make($data, [
            'first_name' =>'bail|required|min:3|max:25|alpha',
            'last_name' => 'bail|required|min:3|max:25|alpha',
            'cin' => "bail|required|min:4|max:20|regex:'^[A-Za-z0-9]*$'",
            'cne' => 'bail|required|min:10|max:10',
            'email' => 'bail|required|email',
            'address' => 'bail|required|min:10|max:50',
            'country' => 'bail|required',
            'city' => 'bail|required',
            'gender' => 'bail|required',
            'gsm'=>'bail|required',
            'home_number'=>'bail|required',
            'birth_date'=>'bail|required|date',
            'bac_date'=>'bail|required|date',
            'bac_type'=>'bail|required',
            'bac_note'=>'bail|required|min:10|max:20|numeric',
            'bac2_uni'=>'bail|required',
            'bac2_type'=>'bail|required',
            'bac2_estab'=>'bail|required',
            'bac2_date'=>'bail|required|date',
            'bac2_note'=>'bail|required|min:10|max:20|numeric',
            'bac2_note1'=>'bail|required|min:10|max:20|numeric',
            'bac2_note2'=>'bail|required|min:10|max:20|numeric',
            'bac2_note3'=>'bail|required|min:10|max:20|numeric',
            'bac2_note4'=>'bail|required|min:10|max:20|numeric',
            'bac3_date'=>'bail|required|date',
            'bac3_type'=>'bail|required',
            'bac3_uni'=>'bail|required',
            'bac3_estab'=>'bail|required',
            'bac3_note1'=>'bail|required|min:10|max:20|numeric',
            'bac3_note2'=>'bail|required|min:10|max:20|numeric',
            'bac3_note'=>'bail|required|min:10|max:20|numeric',
            'bac2_option'=>'bail|required|min:5|max:50',
            'bac3_option'=>'bail|required|min:5|max:50'

        ],$messages);
    
    }

    public function getCandidate($cne){
    
        $candidates = Candidat::all()->each(function($row)
        {
            $row->makeVisible(['user_id']);
        });
        foreach ($candidates as $candidate) {
            if($candidate->cne==$cne){
                $id=$candidate->user_id ;
                $user=collect(User::find($id)->makeVisible('email')) ;
                $candidate=collect($candidate) ;
                return $candidate->union($user) ;

            }
        }
        $errors=collect(["user"=>"CNE non valide!!"]);
        return response()->json(compact('errors'),405) ; 
    }
  
}
