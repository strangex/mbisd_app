<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateProfessorsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('professors', function (Blueprint $table) {
            $table->increments('id');
            $table->dateTime('birth_date');
            $table->string('first_name') ;
            $table->string('last_name') ;
            $table->string('speciality') ;
            $table->string('email') ;
            $table->string('establishment') ;

            $table->string('grade') ;

            $table->string('facebook')->nullable() ;
            $table->string('linkedin')->nullable() ;
            $table->string('twitter')->nullable() ;


            $table->string('avatar') ;
            $table->timestamps() ;
         });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('professors');
    }
}
