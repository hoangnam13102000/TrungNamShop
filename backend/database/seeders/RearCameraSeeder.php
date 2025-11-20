<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RearCameraSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('rear_cameras')->insert([
            [
                'resolution' => '50 MP (wide), PDAF, OIS',
                'aperture' => 'f/1.8',
                'video_capability' => '4K@30fps, 1080p@60fps',
                'features' => 'HDR, panorama, night mode',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'resolution' => '12 MP (ultrawide), 120˚ FOV',
                'aperture' => 'f/2.2',
                'video_capability' => '1080p@30fps',
                'features' => 'Ultra-wide, distortion correction',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'resolution' => '8 MP (telephoto), 3x optical zoom',
                'aperture' => 'f/2.4',
                'video_capability' => '4K@30fps',
                'features' => 'Optical zoom, portrait mode',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'resolution' => '108 MP (wide), PDAF, OIS',
                'aperture' => 'f/1.7',
                'video_capability' => '8K@24fps, 4K@60fps',
                'features' => 'HDR, panorama, night mode, super slow-mo',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
