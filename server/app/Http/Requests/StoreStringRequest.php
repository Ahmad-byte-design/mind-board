<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreStringRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'paper1_id' => ['required', 'integer', Rule::exists('papers', 'id')],
            'paper2_id' => ['required', 'integer', Rule::exists('papers', 'id'), 'different:paper1_id'],
        ];
    }
}
