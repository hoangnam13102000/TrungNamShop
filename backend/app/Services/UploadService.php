<?php

namespace App\Services;

use Illuminate\Support\Facades\Storage;
use GuzzleHttp\Client;

class UploadService
{
    private $client;
    private $supabaseUrl;
    private $bucket;
    private $apiKey;

    public function __construct()
    {
        $this->client = new Client();
        $this->supabaseUrl = rtrim(env('SUPABASE_URL'), '/');
        $this->bucket = env('SUPABASE_BUCKET');
        $this->apiKey = env('SUPABASE_SERVICE_ROLE');
    }

    /** Lưu file LOCAL */
    public function uploadLocal($file, $folder = 'products')
    {
        return $file->store($folder, 'public');
    }

    /** Xóa file LOCAL */
    public function deleteLocal($path)
    {
        if ($path && Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
        }
    }

    /** Upload file lên Supabase (trả về URL) */
    public function uploadSupabase($file, $fileName)
    {
        $url = "{$this->supabaseUrl}/storage/v1/object/{$this->bucket}/{$fileName}";

        $response = $this->client->put($url, [
            'headers' => [
                'Authorization' => "Bearer {$this->apiKey}",
                'Content-Type' => $file->getMimeType(),
                'x-upsert' => 'true'
            ],
            'body' => fopen($file->getRealPath(), 'r')
        ]);

        if ($response->getStatusCode() === 200) {
            return "{$this->supabaseUrl}/storage/v1/object/public/{$this->bucket}/{$fileName}";
        }

        return null;
    }

    /** Xóa file trên Supabase */
    public function deleteSupabase($publicUrl)
    {
        if (!$publicUrl) return;

        $prefix = "{$this->supabaseUrl}/storage/v1/object/public/{$this->bucket}/";
        $filePath = str_replace($prefix, '', $publicUrl);

        $url = "{$this->supabaseUrl}/storage/v1/object/{$this->bucket}/{$filePath}";

        try {
            $this->client->delete($url, [
                'headers' => [
                    'Authorization' => "Bearer {$this->apiKey}"
                ]
            ]);
        } catch (\Exception $e) {
            // bỏ qua lỗi
        }
    }
}
