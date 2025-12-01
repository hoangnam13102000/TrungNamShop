<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class ContactController extends Controller
{
    public function sendEmail(Request $request)
    {
        // Validate dữ liệu
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'phone' => 'required|string',
            'subject' => 'required|string|max:255',
            'type' => 'required|string',
            'message' => 'required|string|min:10',
        ]);

        $data = $request->only('name', 'email', 'phone', 'subject', 'type', 'message');

        try {
            // Gửi email plain text
            Mail::raw(
                "Tên: $data[name]\nEmail: $data[email]\nSĐT: $data[phone]\nLoại: $data[type]\nNội dung:\n$data[message]",
                function ($message) use ($data) {
                    $message->to('hoangnam131020@gmail.com')        
                        ->subject("[$data[type]] $data[subject]")
                        ->from(config('mail.from.address'), config('mail.from.name')) // TechPhone
                        ->replyTo($data['email'], $data['name']); 
                }
            );


            return response()->json([
                'success' => true,
                'message' => 'Email đã được gửi thành công!'
            ]);
        } catch (\Exception $e) {
            Log::error('Lỗi gửi email: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Gửi thất bại: ' . $e->getMessage()
            ], 500);
        }
    }
}
