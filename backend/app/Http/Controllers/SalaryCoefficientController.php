<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\SalaryCoefficient;
class SalaryCoefficientController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $coefficients = SalaryCoefficient::all();
        return response()->json($coefficients);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'coefficient_name' => 'required|string|max:255',
            'coefficient_value' => 'required|numeric|min:0',
        ]);

        $coefficient = SalaryCoefficient::create($validated);

        return response()->json([
            'message' => 'Salary coefficient created successfully!',
            'data' => $coefficient
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
       $coefficient = SalaryCoefficient::find($id);

        if (!$coefficient) {
            return response()->json(['message' => 'Salary coefficient not found'], 404);
        }

        return response()->json($coefficient);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $coefficient = SalaryCoefficient::find($id);

        if (!$coefficient) {
            return response()->json(['message' => 'Salary coefficient not found'], 404);
        }

        $validated = $request->validate([
            'coefficient_name' => 'required|string|max:255',
            'coefficient_value' => 'required|numeric|min:0',
        ]);

        $coefficient->update($validated);

        return response()->json([
            'message' => 'Salary coefficient updated successfully!',
            'data' => $coefficient
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $coefficient = SalaryCoefficient::find($id);

        if (!$coefficient) {
            return response()->json(['message' => 'Salary coefficient not found'], 404);
        }

        $coefficient->delete();

        return response()->json(['message' => 'Salary coefficient deleted successfully!']);
    }
}
