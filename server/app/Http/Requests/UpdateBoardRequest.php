<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateBoardRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'papers' => ['array', 'min:1', 'required_without:strings'],
            'papers.*.id' => ['required', 'integer', Rule::exists('papers', 'id')],
            'papers.*.x' => ['required', 'integer'],
            'papers.*.y' => ['required', 'integer'],
            'strings' => ['array', 'min:1', 'required_without:papers'],
            'strings.*.paper1_id' => ['required', 'integer', Rule::exists('papers', 'id')],
            'strings.*.paper2_id' => ['required', 'integer', Rule::exists('papers', 'id')],
        ];
    }
}
