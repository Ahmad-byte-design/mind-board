<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('strings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('paper1_id')->constrained('papers')->cascadeOnDelete();
            $table->foreignId('paper2_id')->constrained('papers')->cascadeOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('strings');
    }
};
