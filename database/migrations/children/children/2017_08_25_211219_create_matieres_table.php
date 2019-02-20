<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateMatieresTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
         Schema::create('matieres', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name') ;
            $table->string('code') ;
            $table->string('semester') ;

            $table->unsignedInteger('volume') ;
            $table->string('description') ;
            
            $table->unsignedInteger('prof_id');
            $table->foreign('prof_id')->references('id')->on('professors');

            $table->unsignedInteger('module_id');
            $table->foreign('module_id')->references('id')->on('modules');

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
        Schema::dropIfExists('matieres');
    }
}
