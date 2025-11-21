<?php

namespace App\Services;

use App\Models\Account;

class ChatbotContextBuilder
{
    /**
     * Build a system prompt string that includes account/customer/employee context
     *
     * @param Account|null $account
     * @return string
     */
    public static function buildSystemPrompt(?Account $account): string
    {
        $base = env('CHATBOT_SYSTEM_PROMPT', 'You are a helpful assistant.');

        if (!$account) {
            return $base . " (No user logged in). Only use public information.";
        }

        $accType = $account->accountType->name ?? 'Customer';
        $reward = $account->reward_points ?? 0;
        $status = $account->status ?? 'active';

        $ctx = "{$base}\nUser role: {$accType}. Reward points: {$reward}. Account status: {$status}.";

        if ($account->customer) {
            $c = $account->customer;
            $ctx .= "\nCustomer: name={$c->full_name}, email={$c->email}, address={$c->address}.";
        }

        if ($account->employee) {
            $e = $account->employee;
            $pos = $e->position->name ?? null;
            $store = $e->store->name ?? null;
            $ctx .= "\nEmployee: name={$e->full_name}, position={$pos}, store={$store}.";
        }

        $ctx .= "\nRules: Always be concise and helpful. If user asks about orders, call the server-side order APIs (do not invent). If you cannot answer, ask clarifying questions.";

        return $ctx;
    }
}
