<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id(); // product id
            $table->unsignedBigInteger('brand_id'); // brand id
            $table->string('name'); // product name
            $table->text('description')->nullable(); // description
            $table->boolean('status')->default(true); // status (1 = active, 0 = inactive)
            $table->timestamps();
            $table->softDeletes();

            // foreign key (optional)
            $table->foreign('brand_id')->references('id')->on('brands')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
