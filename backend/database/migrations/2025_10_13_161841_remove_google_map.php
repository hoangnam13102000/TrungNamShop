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
         Schema::table('warehouses', function (Blueprint $table) {
            // Xoá cột google_map nếu có
            if (Schema::hasColumn('warehouses', 'google_map')) {
                $table->dropColumn('google_map');
            }

            $table->text('note')->nullable();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('warehouses', function (Blueprint $table) {
            $table->string('google_map')->nullable();
            $table->dropColumn('note');
            $table->dropSoftDeletes();
        });
    }
};
