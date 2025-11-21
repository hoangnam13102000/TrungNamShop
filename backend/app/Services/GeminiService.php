<?php
namespace App\Services;

use Illuminate\Support\Facades\Http;
use RuntimeException;

class GeminiService
{
    protected string $apiKey;
    protected string $base;
    protected string $model;

    public function __construct()
    {
        $this->apiKey = env('GEMINI_API_KEY');
        $this->base = env('GEMINI_BASE_URL', 'https://generativelanguage.googleapis.com/v1beta');
        $this->model = env('GEMINI_MODEL', 'gemini-2.5-flash');

        if (empty($this->apiKey)) {
            throw new RuntimeException('GEMINI_API_KEY is not set.');
        }
    }

    /**
     * Call Gemini API endpoint: /v1beta/models/{model}:generateContent
     *
     * @param array $messages array ['role' => 'user'|'assistant', 'content' => '...']
     * @return string 
     * @throws RuntimeException
     */
    public function chat(array $messages): string
    {
        // 1. Use Query Parameter 'key' to authenticate API Key
        $url = "{$this->base}/models/{$this->model}:generateContent?key={$this->apiKey}";

        // 2. CONVERTING MESSAGES TO GEMINI'S 'contents' STRUCTURE
        // Role: 'assistant' -> 'model', 'user' -> 'user'
        // Structure: contents: [ { role: '...', parts: [ { text: '...' } ] } ]
        $contents = array_map(function ($m) {
            $role = ($m['role'] === 'assistant') ? 'model' : 'user';
            
            return [
                'role' => $role, 
                'parts' => [
                    ['text' => $m['content']]
                ]
            ];
        }, $messages);

        $body = [
            'contents' => $contents
        ];

        // 3. Call API (Don't need Header Authorization: Bearer for API Key)
        $resp = Http::acceptJson()
                   ->post($url, $body);

        if (!$resp->successful()) {
            $status = $resp->status();
            $error = $resp->json('error'); 
            $message = $error['message'] ?? $resp->body();
            
            throw new RuntimeException("Gemini API error: (Status {$status}) - " . $message);
        }

        $json = $resp->json();

        // 4. EXTRACTING FEEDBACK ACCORDING TO GEMINI STANDARD STRUCTURE
        // candidates[0].content.parts[0].text
        $reply = $json['candidates'][0]['content']['parts'][0]['text'] ?? '';

        if (empty($reply)) {
             if (isset($json['candidates'][0]['finishReason']) && $json['candidates'][0]['finishReason'] === 'SAFETY') {
                 return "Xin lỗi, câu trả lời đã bị hệ thống an toàn của AI chặn.";
             }
             return "Xin lỗi, AI không trả lời được.";
        }

        return $reply;
    }
}