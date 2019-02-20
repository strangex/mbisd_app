<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateStudentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {

         Schema::create('students', function (Blueprint $table) {
            $table->unsignedInteger('user_id')->primary();
            $table->foreign('user_id')->references('id')->on('users');
            
            $table->string('avatar') ;
            $table->string('cin')->unique() ;
            $table->string('cne')->unique() ;
            $table->string('first_name') ;
            $table->string('last_name') ;
            $table->date('birth_date') ;
            $table->tinyInteger('gender') ;
            $table->string('gsm') ;
            $table->string('phone') ;
            $table->text('address') ;
            $table->string('city') ;
            $table->string('country') ;
            $table->string('infos')->nullable() ;

            $table->date('bac_date') ;
            $table->string('bac_type') ;
            $table->float('bac_note',4,2) ;

            $table->string('bac2_type') ;
            $table->string('bac2_university') ;
            $table->string('bac2_establishment') ;
            $table->date('bac2_date') ;
            $table->float('bac2_note1',4,2) ;
            $table->float('bac2_note2',4,2) ;
            $table->float('bac2_note3',4,2) ;
            $table->float('bac2_note4',4,2) ;
            $table->float('bac2_note',4,2) ;
            $table->string('bac2_option') ;

            $table->string('bac3_type') ;
            $table->string('bac3_university') ;
            $table->string('bac3_establishment') ;
            $table->date('bac3_date') ;
            $table->float('bac3_note1',4,2) ;
            $table->float('bac3_note2',4,2) ;
            $table->float('bac3_note',4,2) ;
            $table->string('bac3_option') ;

            $table->float('score');

            //promotion
            $table->tinyInteger('school_year')->default(1) ;//0:out, 1:first, 2:second
            $table->string('registration_year',4) ; 
            $table->string('attainment_year',4)->nullable() ; 


            $table->rememberToken();
            $table->timestamps();
        });


         /*Schema::create('students', function (Blueprint $table) {
            $table->increments('id');
            $table->int('candidate_id') ;
            $table->forign('candidate_id')->references('id')->on('candidates') ;

            $table->int('class_id') ;
            $table->foreign('class_id')->references('id')->on('classes') ;

            $table->rememberToken();
            $table->timestamps();
        });*/
    }
    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
          Schema::dropIfExists('students');
    }
}
