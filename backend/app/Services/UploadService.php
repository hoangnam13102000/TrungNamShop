<?php

namespace App\Services;

use Illuminate\Support\Facades\Storage;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\Log;
class UploadService
{
    private Client $client;
    private string $supabaseUrl;
    private string $bucket;
    private string $apiKey;

    public function __construct()
    {
        $this->client = new Client();
        $this->supabaseUrl = rtrim(env('SUPABASE_URL'), '/');
        $this->bucket = env('SUPABASE_BUCKET');
        $this->apiKey = env('SUPABASE_SERVICE_ROLE');
    }

    /** Lưu file LOCAL */
    public function uploadLocal($file, $folder = 'products'): string
    {
        return $file->store($folder, 'public');
    }

    /** Xóa file LOCAL */
    public function deleteLocal(?string $path): void
    {
        if ($path && Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
        }
    }

    /** Upload file lên Supabase và trả về public URL */
    public function uploadSupabase($file, string $fileName): ?string
    {
        // Nếu đang chạy local, không upload Supabase
        if (app()->environment('local')) {
            return null;
        }

        $url = "{$this->supabaseUrl}/storage/v1/object/{$this->bucket}/{$fileName}";

        try {
            $response = $this->client->put($url, [
                'headers' => [
                    'Authorization' => "Bearer {$this->apiKey}",
                    'Content-Type' => $file->getMimeType(),
                    'x-upsert' => 'true',
                ],
                'body' => fopen($file->getRealPath(), 'r'),
                'timeout' => 30,
            ]);

            if ($response->getStatusCode() === 200) {
                return "{$this->supabaseUrl}/storage/v1/object/public/{$this->bucket}/{$fileName}";
            }
        } catch (\Exception $e) {
            Log::error("Supabase upload error: " . $e->getMessage());
        }

        return null;
    }

    /** Xóa file trên Supabase */
    public function deleteSupabase(?string $publicUrl): void
    {
        if (!$publicUrl || app()->environment('local')) return;

        $prefix = "{$this->supabaseUrl}/storage/v1/object/public/{$this->bucket}/";
        $filePath = str_replace($prefix, '', $publicUrl);
        $url = "{$this->supabaseUrl}/storage/v1/object/{$this->bucket}/{$filePath}";

        try {
            $this->client->delete($url, [
                'headers' => [
                    'Authorization' => "Bearer {$this->apiKey}",
                ],
            ]);
        } catch (\Exception $e) {
            Log::warning("Supabase delete error: " . $e->getMessage());
        }
    }
}
