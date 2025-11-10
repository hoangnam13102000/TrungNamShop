<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FrontCameraSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('front_cameras')->insert([
            [
                'resolution' => '32 MP (wide)',
                'features' => 'HDR, Portrait mode, AI beauty',
                'aperture' => 'f/2.0',
                'video_capability' => '4K@30fps, 1080p@60fps',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'resolution' => '16 MP (ultrawide)',
                'features' => 'Wide angle, Panorama',
                'aperture' => 'f/2.4',
                'video_capability' => '1080p@30fps',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'resolution' => '12 MP (standard)',
                'features' => 'Face detection, Night selfie',
                'aperture' => 'f/2.2',
                'video_capability' => '1080p@60fps',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
