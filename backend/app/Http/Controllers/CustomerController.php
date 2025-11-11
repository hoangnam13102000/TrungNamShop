<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Customer;
use Illuminate\Support\Facades\Storage;

class CustomerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Customer::with('account');

        // Lọc theo account_id nếu có
        if ($request->filled('account_id')) {
            $query->where('account_id', $request->account_id);
        }

        $customers = $query->get();

        $customers->transform(function ($c) {
            $c->avatar_url = $c->avatar ? Storage::url($c->avatar) : null;
            return $c;
        });

        return response()->json($customers);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'account_id'   => 'required|exists:accounts,id',
            'full_name'    => 'nullable|string|max:255',
            'address'      => 'nullable|string|max:255',
            'phone_number' => 'nullable|string|max:20',
            'email'        => 'nullable|email|max:255',
            'birth_date'   => 'nullable|date',
            'gender'       => 'nullable|in:male,female',
            'avatar'       => 'nullable|image|mimes:jpg,jpeg,png,webp|max:4096',
        ]);

        // Upload avatar nếu có
        if ($request->hasFile('avatar')) {
            $path = $request->file('avatar')->store('customers', 'public');
            $validated['avatar'] = $path;
        }

        $customer = Customer::create($validated);
        $customer->avatar_url = $customer->avatar ? Storage::url($customer->avatar) : null;

        return response()->json([
            'message' => 'Customer created successfully',
            'data' => $customer
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $customer = Customer::with('account')->findOrFail($id);
        $customer->avatar_url = $customer->avatar ? Storage::url($customer->avatar) : null;

        return response()->json($customer);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $customer = Customer::findOrFail($id);

        // Validate tất cả trường, avatar nullable
        $validated = $request->validate([
            'account_id'   => 'sometimes|exists:accounts,id',
            'full_name'    => 'nullable|string|max:255',
            'address'      => 'nullable|string|max:255',
            'phone_number' => 'nullable|string|max:20',
            'email'        => 'nullable|email|max:255',
            'birth_date'   => 'nullable|date',
            'gender'       => 'nullable|in:male,female',
            'avatar'       => 'nullable|image|mimes:jpg,jpeg,png,webp|max:4096',
        ]);

        // Nếu có avatar mới → xóa avatar cũ & upload mới
        if ($request->hasFile('avatar')) {
            if ($customer->avatar && Storage::disk('public')->exists($customer->avatar)) {
                Storage::disk('public')->delete($customer->avatar);
            }

            $path = $request->file('avatar')->store('customers', 'public');
            $validated['avatar'] = $path;
        }

        $customer->update($validated);

        $customer->avatar_url = $customer->avatar ? Storage::url($customer->avatar) : null;

        return response()->json([
            'message' => 'Customer updated successfully',
            'data' => $customer
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $customer = Customer::findOrFail($id);

        if ($customer->avatar && Storage::disk('public')->exists($customer->avatar)) {
            Storage::disk('public')->delete($customer->avatar);
        }

        $customer->delete();

        return response()->json(['message' => 'Customer deleted successfully']);
    }
}
