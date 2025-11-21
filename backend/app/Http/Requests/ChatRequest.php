<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ChatRequest extends FormRequest
{
    public function authorize()
    {
        // nếu muốn bắt buộc auth thì return auth()->check();
        return true;
    }

    public function rules()
    {
        return [
            'message' => 'required|string|max:5000',
            'session_id' => 'nullable|string|max:255',
            'history' => 'nullable|array',
            'history.*.role' => 'required_with:history|in:user,assistant,system',
            'history.*.content' => 'required_with:history|string',
            'save' => 'nullable|boolean', // nếu client muốn server lưu
        ];
    }
}
