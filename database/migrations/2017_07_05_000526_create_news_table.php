<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateNewsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
     public function up()
    {
         Schema::create('news', function (Blueprint $table) {
            $table->increments('id');
            $table->dateTime('start_date')->nullable() ;
            $table->dateTime('end_date')->nullable()  ;
            $table->string('title') ;
            $table->string('sub') ;
            $table->text('desc') ;
            $table->string('tag') ;
            $table->string('file')->nullable() ;
            $table->timestamps();
         });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('news');
    }

}
