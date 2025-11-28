<?php

namespace App\Services;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;
use Exception;
use Illuminate\Support\Facades\Log;

class PayPalService
{
    protected string $clientId;
    protected string $secret;
    protected string $mode;
    protected Client $client;

    public function __construct()
    {
        $this->clientId = env('PAYPAL_CLIENT_ID') ?? '';
        $this->secret = env('PAYPAL_CLIENT_SECRET') ?? '';
        $this->mode  = env('PAYPAL_MODE', 'sandbox');

        if (!$this->clientId || !$this->secret) {
            throw new Exception('PayPal credentials are missing in .env');
        }

        $this->client = new Client([
            'base_uri' => $this->mode === 'sandbox'
                ? 'https://api-m.sandbox.paypal.com'
                : 'https://api-m.paypal.com',
            'timeout' => 15
        ]);
    }

    /** Get Access Token */
    private function token(): string
    {
        try {
            $res = $this->client->post('/v1/oauth2/token', [
                'auth' => [$this->clientId, $this->secret],
                'form_params' => ['grant_type' => 'client_credentials']
            ]);

            $data = json_decode($res->getBody(), true);
            return $data['access_token'] ?? throw new Exception('PayPal token not returned');
        } catch (RequestException $e) {
            Log::error('PayPal token error', ['message' => $e->getMessage(), 'response' => $e->getResponse()?->getBody()?->getContents()]);
            throw new Exception('Cannot get PayPal access token');
        }
    }

    /** Create PayPal Order */
    public function createOrder(float $amountVND, int $orderId, string $referenceId): array
    {
        $USD = $this->convertVND($amountVND);
        $token = $this->token();

        try {
            $response = $this->client->post('/v2/checkout/orders', [
                'headers' => [
                    'Authorization' => "Bearer $token",
                    'Content-Type' => 'application/json'
                ],
                'json' => [
                    'intent' => 'CAPTURE',
                    'purchase_units' => [[
                        'reference_id' => $referenceId, // Sử dụng referenceId từ controller
                        'amount' => [
                            'currency_code' => 'USD',
                            'value' => number_format($USD, 2, '.', '')
                        ]
                    ]],
                    'application_context' => [
                        // Đã sửa: Thêm [], true để tạo Absolute URL
                        'return_url' => route('paypal.success', [], true), 
                        'cancel_url' => route('paypal.cancel', [], true),
                        'shipping_preference' => "NO_SHIPPING",
                        'user_action' => "PAY_NOW"
                    ]
                ]
            ]);

            $data = json_decode($response->getBody(), true);

            if (!isset($data['id'])) {
                Log::error('PayPal create order failed', $data);
                throw new Exception($data['message'] ?? 'PayPal create order failed');
            }

            $approvalLink = null;
            if (isset($data['links']) && is_array($data['links'])) {
                foreach ($data['links'] as $link) {
                    if (($link['rel'] ?? '') === 'approve') {
                        $approvalLink = $link['href'] ?? null;
                        break;
                    }
                }
            }

            return [
                'id' => $data['id'],
                'status' => $data['status'],
                'approval_url' => $approvalLink
            ];

        } catch (RequestException $e) {
            $body = $e->getResponse()?->getBody()?->getContents();
            Log::error('PayPal create order exception', ['message' => $e->getMessage(), 'body' => $body]);
            throw new Exception('PayPal create order error');
        }
    }

    /** Capture PayPal Order */
    public function captureOrder(string $paypalOrderId): array
    {
        $token = $this->token();

        try {
            $response = $this->client->post("/v2/checkout/orders/$paypalOrderId/capture", [
                'headers' => ['Authorization' => "Bearer $token",
                'Content-Type' => 'application/json', ]
            ]);
            return json_decode($response->getBody(), true);
        } catch (RequestException $e) {
            $body = $e->getResponse()?->getBody()?->getContents();
            Log::error('PayPal capture order error', ['message' => $e->getMessage(), 'body' => $body]);
            throw new Exception('PayPal capture order failed');
        }
    }

    /** Convert VND → USD */
    private function convertVND(float $vnd): float
    {
        return round($vnd / 25000, 2);
    }
}