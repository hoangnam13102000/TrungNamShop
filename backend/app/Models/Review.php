<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Review extends Model
{

    use HasFactory, SoftDeletes;
    protected $guarded = [];


    // Relation with
    public function account()
    {
        return $this->belongsTo(Account::class);
    }

    // Relation with
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
